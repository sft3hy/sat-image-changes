from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import base64
import httpx
import json
import os
from typing import Optional
from enum import Enum

app = FastAPI(title="SatChange API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
DATA_BASE_PATH = os.getenv("DATA_BASE_PATH", "/app/data")


class ModelProvider(str, Enum):
    GROQ = "groq"
    OLLAMA = "ollama"


GROQ_VISION_MODELS = [
    {
        "id": "meta-llama/llama-4-scout-17b-16e-instruct",
        "name": "Llama 4 Scout (17Bx16E)",
        "description": "Fast multimodal, 460+ t/s",
        "provider": "groq",
        "context": "128K",
    }
]

OLLAMA_VISION_MODELS = [
    {
        "id": "llama3.2-vision:11b",
        "name": "Llama 3.2 Vision 11B",
        "description": "Meta's vision model, 11B params",
        "provider": "ollama",
        "context": "128K",
    },
    {
        "id": "qwen3.5:4b",
        "name": "Qwen3.5 4B",
        "description": "Latest Qwen multimodal model",
        "provider": "ollama",
        "context": "256K",
    },
    {
        "id": "qwen3.5:9b",
        "name": "Qwen3.5 9B",
        "description": "Latest Qwen multimodal model",
        "provider": "ollama",
        "context": "256K",
    },
    {
        "id": "minicpm-v:8b",
        "name": "MiniCPM-V 8B",
        "description": "Efficient multimodal LLM",
        "provider": "ollama",
        "context": "32K",
    },
    {
        "id": "llava:7b",
        "name": "LLaVA 7B",
        "description": "Classic vision-language model",
        "provider": "ollama",
        "context": "4K",
    },
    {
        "id": "granite3.2-vision:2b",
        "name": "Granite 3.2 Vision 2B",
        "description": "IBM compact vision model",
        "provider": "ollama",
        "context": "4K",
    },
    {
        "id": "moondream:1.8b",
        "name": "Moondream 1.8B",
        "description": "Tiny edge-optimized VLM",
        "provider": "ollama",
        "context": "4K",
    },
]

CHANGE_DETECTION_SYSTEM_PROMPT = """You are an expert satellite and aerial imagery analyst specializing in change detection.
Your task is to analyze two images of the SAME geographic location taken at DIFFERENT times.

You must determine:
1. Whether any significant change has occurred between the two images
2. What type of change it is (new vehicle/aircraft, construction, destruction, cleared area, new equipment, etc.)
3. Your confidence level (low/medium/high)
4. Precise location description of where the change occurred in the image

IMPORTANT: Focus on detecting ANY change — you don't need to perfectly identify what changed, just that something changed.
Common changes to look for: new or missing vehicles/aircraft, construction or demolition, new structures, changed terrain, new equipment.

Respond in valid JSON only, with this exact structure:
{
  "change_detected": true or false,
  "confidence": "low" | "medium" | "high",
  "change_type": "brief category like 'new vehicle', 'construction', 'no change', etc.",
  "summary": "2-3 sentence description of what changed or why no change was detected",
  "location_in_image": "description of where in the image the change is, e.g. 'upper left quadrant', 'center', 'near the runway'",
  "details": "additional observations about the imagery quality, other notable features"
}"""


def encode_image(image_bytes: bytes) -> str:
    return base64.b64encode(image_bytes).decode("utf-8")


def get_image_media_type(filename: str) -> str:
    ext = filename.lower().split(".")[-1]
    media_types = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif",
        "webp": "image/webp",
    }
    return media_types.get(ext, "image/jpeg")


@app.get("/models")
async def list_models():
    """Return available models for both Groq and Ollama."""
    ollama_available = []
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            r = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if r.status_code == 200:
                installed = {m["name"] for m in r.json().get("models", [])}
                for m in OLLAMA_VISION_MODELS:
                    m_copy = m.copy()
                    m_copy["installed"] = any(
                        m["id"].split(":")[0] in tag for tag in installed
                    )
                    ollama_available.append(m_copy)
            else:
                ollama_available = [
                    {**m, "installed": False} for m in OLLAMA_VISION_MODELS
                ]
    except Exception:
        ollama_available = [{**m, "installed": False} for m in OLLAMA_VISION_MODELS]

    groq_models = [{**m, "available": bool(GROQ_API_KEY)} for m in GROQ_VISION_MODELS]

    return {"groq": groq_models, "ollama": ollama_available}


@app.get("/health")
async def health():
    groq_ok = bool(GROQ_API_KEY)
    ollama_ok = False
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            r = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            ollama_ok = r.status_code == 200
    except Exception:
        pass
    return {"groq": groq_ok, "ollama": ollama_ok}


@app.get("/pairs")
async def list_pairs():
    """List matching filenames in A and B directories."""
    dir_a = os.path.join(DATA_BASE_PATH, "A")
    dir_b = os.path.join(DATA_BASE_PATH, "B")

    if not os.path.exists(dir_a) or not os.path.exists(dir_b):
        return {"pairs": []}

    files_a = set(os.listdir(dir_a))
    files_b = set(os.listdir(dir_b))

    # Filter for image files only
    valid_exts = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    common = sorted(
        [
            f
            for f in files_a.intersection(files_b)
            if os.path.splitext(f)[1].lower() in valid_exts
        ]
    )

    return {"pairs": common}


@app.get("/image/{folder}/{filename}")
async def get_image(folder: str, filename: str):
    """Serve an image from subfolder A or B."""
    if folder not in ["A", "B"]:
        raise HTTPException(status_code=400, detail="Invalid folder")

    path = os.path.normpath(os.path.join(DATA_BASE_PATH, folder, filename))

    # Security check to prevent traversing outside the data directory
    if not path.startswith(os.path.abspath(DATA_BASE_PATH)):
        raise HTTPException(status_code=403, detail="Forbidden")

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(path)


async def analyze_with_groq(
    model_id: str,
    image1_b64: str,
    image2_b64: str,
    media_type1: str,
    media_type2: str,
    custom_prompt: Optional[str] = None,
) -> dict:
    if not GROQ_API_KEY:
        raise HTTPException(status_code=400, detail="GROQ_API_KEY not configured")

    user_text = custom_prompt or (
        "Compare these two satellite images of the same location taken at different times. "
        "Image 1 is BEFORE, Image 2 is AFTER. Detect any changes."
    )

    payload = {
        "model": model_id,
        "messages": [
            {"role": "system", "content": CHANGE_DETECTION_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "IMAGE 1 (BEFORE):"},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{media_type1};base64,{image1_b64}"},
                    },
                    {"type": "text", "text": "IMAGE 2 (AFTER):"},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{media_type2};base64,{image2_b64}"},
                    },
                    {"type": "text", "text": user_text},
                ],
            },
        ],
        "max_tokens": 1024,
        "temperature": 0.1,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        if r.status_code != 200:
            raise HTTPException(
                status_code=r.status_code,
                detail=f"Groq API error: {r.text}",
            )
        data = r.json()
        content = data["choices"][0]["message"]["content"]
        usage = data.get("usage", {})
        return {"raw": content, "usage": usage}


async def analyze_with_ollama(
    model_id: str,
    image1_b64: str,
    image2_b64: str,
    custom_prompt: Optional[str] = None,
) -> dict:
    user_text = custom_prompt or (
        "Compare these two satellite images of the same location taken at different times. "
        "Image 1 is BEFORE, Image 2 is AFTER. Detect any changes. "
        "Respond in JSON only."
    )

    full_prompt = f"{CHANGE_DETECTION_SYSTEM_PROMPT}\n\n{user_text}"

    payload = {
        "model": model_id,
        "prompt": full_prompt,
        "images": [image1_b64, image2_b64],
        "stream": False,
        "options": {"temperature": 0.1},
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        r = await client.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=payload,
        )
        if r.status_code != 200:
            raise HTTPException(
                status_code=r.status_code,
                detail=f"Ollama error: {r.text}",
            )
        data = r.json()
        return {"raw": data.get("response", ""), "usage": {}}


def parse_model_response(raw: str) -> dict:
    """Extract JSON from model response, handling markdown fences."""
    text = raw.strip()
    # Strip markdown code fences
    for fence in ["```json", "```"]:
        if fence in text:
            text = text.split(fence)[-2] if fence == "```" else text.split(fence)[1]
            text = text.split("```")[0]
            break

    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        # Fallback: return raw as summary
        return {
            "change_detected": None,
            "confidence": "low",
            "change_type": "parse_error",
            "summary": raw[:500],
            "location_in_image": "unknown",
            "details": "Model did not return valid JSON",
        }


@app.post("/analyze")
async def analyze_images(
    image1: Optional[UploadFile] = File(None),
    image2: Optional[UploadFile] = File(None),
    filename1: Optional[str] = Form(None),
    filename2: Optional[str] = Form(None),
    model_id: str = Form(...),
    provider: str = Form(...),
    custom_prompt: Optional[str] = Form(None),
):
    """Analyze two satellite images for change detection."""
    # Priority 1: Use files if uploaded
    if image1 and image2:
        img1_bytes = await image1.read()
        img2_bytes = await image2.read()
        fname1 = image1.filename or "image1.jpg"
        fname2 = image2.filename or "image2.jpg"
    # Priority 2: Use filenames if provided
    elif filename1 and filename2:
        path1 = os.path.join(DATA_BASE_PATH, "A", filename1)
        path2 = os.path.join(DATA_BASE_PATH, "B", filename2)

        if not os.path.exists(path1) or not os.path.exists(path2):
            raise HTTPException(status_code=404, detail="Local images not found")

        with open(path1, "rb") as f:
            img1_bytes = f.read()
        with open(path2, "rb") as f:
            img2_bytes = f.read()
        fname1 = filename1
        fname2 = filename2
    else:
        raise HTTPException(
            status_code=400, detail="Must provide either uploaded files or filenames"
        )

    if len(img1_bytes) > 20 * 1024 * 1024 or len(img2_bytes) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Images must be under 20MB each")

    img1_b64 = encode_image(img1_bytes)
    img2_b64 = encode_image(img2_bytes)
    mt1 = get_image_media_type(fname1)
    mt2 = get_image_media_type(fname2)

    if provider == "groq":
        result = await analyze_with_groq(
            model_id, img1_b64, img2_b64, mt1, mt2, custom_prompt
        )
    elif provider == "ollama":
        result = await analyze_with_ollama(model_id, img1_b64, img2_b64, custom_prompt)
    else:
        raise HTTPException(status_code=400, detail="Invalid provider")

    parsed = parse_model_response(result["raw"])

    return {
        "model_id": model_id,
        "provider": provider,
        "result": parsed,
        "raw_response": result["raw"],
        "usage": result.get("usage", {}),
    }
