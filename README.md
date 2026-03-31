# 🛰️ SatChange — Multimodal Satellite Change Detection

Evaluate how well modern multimodal LLMs detect changes between satellite/aerial image pairs (new vehicles, destroyed equipment, construction, etc.).

---

## Architecture

```
satchange/
├── backend/          # FastAPI Python server
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/         # React + Vite
    ├── src/
    │   ├── App.jsx
    │   └── App.css
    └── package.json
```

---

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy and edit env
cp .env.example .env
# Set GROQ_API_KEY=gsk_...

uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## Models

### Groq Cloud (API Key Required)
Get a free key at https://console.groq.com

| Model | Params | Speed | Notes |
|-------|--------|-------|-------|
| `meta-llama/llama-4-scout-17b-16e-instruct` | 17Bx16E (109B total) | 460+ t/s | Fast, excellent for quick analysis |

Both support up to 5 images per request, base64 up to 4MB per image.

### Ollama Local (Self-Hosted, <12B)

Install Ollama: https://ollama.com/download

```bash
# Best for satellite/change detection
ollama pull llama3.2-vision:11b   # Meta, strong general vision
ollama pull qwen2.5vl:7b          # Alibaba, very capable
ollama pull qwen3-vl:8b           # Latest Qwen VL

# Smaller/faster options
ollama pull minicpm-v:8b          # Efficient multimodal
ollama pull llava:7b              # Classic, widely tested
ollama pull granite3.2-vision:2b  # IBM, document-focused
ollama pull moondream:1.8b        # Tiny edge model
```

---

## Satellite/Aerial Datasets for Change Detection

### Best for this project (bi-temporal image pairs):

| Dataset | Resolution | Type | Size | URL |
|---------|-----------|------|------|-----|
| **LEVIR-CD** | 0.5m | Building change | 637 pairs | https://justchenhao.github.io/LEVIR/ |
| **S2Looking** | ~1m | Building/rural change | 5000 pairs | https://github.com/S2Looking/Dataset |
| **OSCD** (Onera) | 10m (Sentinel-2) | Urban change | 24 city pairs | https://rcdaudt.github.io/oscd/ |
| **DSIFN** | HR optical | 6 Chinese cities | 3940 pairs | https://github.com/GeoZcx/A-deeply-supervised-image-fusion-network-for-change-detection-in-remote-sensing-images |
| **CDD** (Change Detection Dataset) | 0.03–1m | Various seasons | 16000 pairs | https://drive.google.com/file/d/1GX656JqqoWabZQR_6zBTs6Nl97HRQLhI/ |
| **WHU-CD** | 0.075m | Buildings (NZ) | 1 large pair | http://study.rsgis.whu.edu.cn/pages/download/ |

### Free Satellite Imagery Sources (to build your own pairs):

| Source | Resolution | Notes |
|--------|-----------|-------|
| **Planet NICFI Basemaps** | 5m | Free for non-commercial, tropical, monthly |
| **Sentinel-2 (EO Browser)** | 10m | Free, global, ~5 day revisit |
| **Google Earth Engine** | Varies | Free for research, programmatic access |
| **Maxar Open Data** | 30cm | Free after disasters |
| **OpenAerialMap** | Varies | Open licensed UAV/aerial imagery |

### Bonus — Vehicle/Aircraft Specific:
- **DOTA** (aerial object detection): https://captain-whu.github.io/DOTA/
- **xView** (satellite object detection): http://xviewdataset.org/
- **HRSC2016** (ship detection in SAR)

---

## How It Works

1. Upload two images of the same location (T1 = before, T2 = after)
2. Select a model (Groq cloud or local Ollama)
3. Optionally add a custom prompt to focus analysis
4. The model receives both images with a system prompt instructing it to act as a satellite imagery analyst
5. It returns structured JSON with: change detected (bool), confidence, change type, summary, location in image

### System Prompt Strategy
The prompt instructs the model to focus on **detecting** change, not necessarily identifying it perfectly. This is the key research question: can multimodal LLMs reliably flag that *something* changed, even if they can't perfectly categorize it?

---

## Environment Variables

```env
GROQ_API_KEY=gsk_...          # Get from console.groq.com
OLLAMA_BASE_URL=http://localhost:11434   # Default Ollama address
```

---

## Tips for Best Results

- **Image size**: Keep under 4MB for Groq base64 uploads
- **Alignment**: Pre-aligned image pairs work better (same viewpoint, similar resolution)
- **Contrast**: High-resolution imagery (≤1m/px) gives much better results than coarse imagery
- **Prompt**: Adding context helps — e.g., "This is an airbase, look for new or missing aircraft"
- **Model choice**: Llama 4 Scout is fastest; Qwen2.5VL 7B is strong locally; Llama 3.2 Vision 11B is excellent if your hardware allows