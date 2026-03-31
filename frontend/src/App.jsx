import { useState, useCallback, useRef, useEffect } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const CONFIDENCE_COLORS = {
    high: "#00ff88",
    medium: "#ffcc00",
    low: "#ff6644",
};

const CHANGE_ICONS = {
    "new vehicle": "🚗",
    vehicle: "🚗",
    aircraft: "✈️",
    airplane: "✈️",
    construction: "🏗️",
    demolition: "💥",
    "no change": "✅",
    building: "🏢",
    equipment: "⚙️",
    terrain: "🌍",
    flood: "🌊",
    fire: "🔥",
    default: "🛰️",
};

function getChangeIcon(type = "") {
    const t = type.toLowerCase();
    for (const [key, icon] of Object.entries(CHANGE_ICONS)) {
        if (t.includes(key)) return icon;
    }
    return CHANGE_ICONS.default;
}

function ImageDropzone({ label, image, onImage, timeLabel }) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef();

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                const url = URL.createObjectURL(file);
                onImage({ file, url });
            }
        },
        [onImage]
    );

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            onImage({ file, url });
        }
    };

    return (
        <div
            className={`dropzone ${dragging ? "dragging" : ""} ${image ? "has-image" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !image && inputRef.current?.click()}
        >
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} hidden />
            {image ? (
                <div className="image-preview">
                    <img src={image.url} alt={label} />
                    <div className="image-overlay">
                        <span className="time-badge">{timeLabel}</span>
                        <button
                            className="remove-btn"
                            onClick={(e) => { e.stopPropagation(); onImage(null); }}
                        >
                            ✕
                        </button>
                    </div>
                    <div className="image-name">{image.file.name}</div>
                </div>
            ) : (
                <div className="dropzone-empty">
                    <div className="dropzone-icon">
                        <svg viewBox="0 0 48 48" fill="none">
                            <rect x="4" y="4" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                            <path d="M24 16v16M16 24h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="dropzone-label">{label}</div>
                    <div className="dropzone-hint">Drop or click to upload</div>
                    <div className="time-label-badge">{timeLabel}</div>
                </div>
            )}
        </div>
    );
}

function ModelSelector({ models, selected, onSelect, loading }) {
    if (loading) return <div className="models-loading">Fetching models...</div>;

    return (
        <div className="model-grid">
            {["groq", "ollama"].map((provider) => (
                <div key={provider} className="provider-group">
                    <div className="provider-label">
                        <span className={`provider-dot ${provider}`} />
                        {provider === "groq" ? "Groq Cloud" : "Ollama Local"}
                    </div>
                    {(models[provider] || []).map((m) => {
                        const unavailable =
                            provider === "groq" ? !m.available : m.installed === false;
                        return (
                            <button
                                key={m.id}
                                className={`model-btn ${selected?.id === m.id ? "active" : ""} ${unavailable ? "unavailable" : ""}`}
                                onClick={() => !unavailable && onSelect(m)}
                                title={unavailable ? "Not available / not installed" : m.description}
                            >
                                <span className="model-name">{m.name}</span>
                                <span className="model-meta">
                                    {m.context} ctx
                                    {unavailable && <span className="model-tag">unavailable</span>}
                                    {provider === "ollama" && m.installed && <span className="model-tag installed">installed</span>}
                                </span>
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

function ResultPanel({ result, modelId, provider, rawResponse }) {
    const [showRaw, setShowRaw] = useState(false);
    if (!result) return null;

    const conf = result.confidence || "low";
    const changed = result.change_detected;
    const icon = getChangeIcon(result.change_type);

    return (
        <div className={`result-panel ${changed ? "changed" : "no-change"}`}>
            <div className="result-header">
                <div className="result-icon">{icon}</div>
                <div className="result-verdict">
                    <div className="verdict-label">
                        {changed === null ? "PARSE ERROR" : changed ? "CHANGE DETECTED" : "NO CHANGE"}
                    </div>
                    <div className="verdict-type">{result.change_type}</div>
                </div>
                <div className="confidence-badge" style={{ color: CONFIDENCE_COLORS[conf] }}>
                    <div className="conf-label">Confidence</div>
                    <div className="conf-value">{conf?.toUpperCase()}</div>
                </div>
            </div>

            <div className="result-body">
                <div className="result-section">
                    <div className="section-title">Summary</div>
                    <p>{result.summary}</p>
                </div>
                {result.location_in_image && result.location_in_image !== "unknown" && (
                    <div className="result-section">
                        <div className="section-title">Location in Image</div>
                        <p className="location-text">📍 {result.location_in_image}</p>
                    </div>
                )}
                {result.details && (
                    <div className="result-section">
                        <div className="section-title">Additional Details</div>
                        <p>{result.details}</p>
                    </div>
                )}
            </div>

            <div className="result-footer">
                <span className="model-used">Model: {modelId} via {provider}</span>
                <button className="raw-toggle" onClick={() => setShowRaw(!showRaw)}>
                    {showRaw ? "Hide" : "Show"} Raw Response
                </button>
            </div>
            {showRaw && (
                <pre className="raw-response">{rawResponse}</pre>
            )}
        </div>
    );
}

export default function App() {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [models, setModels] = useState({});
    const [modelsLoading, setModelsLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [customPrompt, setCustomPrompt] = useState("");
    const [health, setHealth] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [pairs, setPairs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    
    // iSpy Integration State
    const [ispyConnected, setIspyConnected] = useState(false);
    const [ispyConnecting, setIspyConnecting] = useState(false);
    const [ispyInstances, setIspyInstances] = useState([]);
    const [brokerUrl, setBrokerUrl] = useState("ws://localhost:3000"); 
    const [ispyGroup, setIspyGroup] = useState("");
    const [ispyError, setIspyError] = useState(null);
    const [isFetchingIspy, setIsFetchingIspy] = useState(false);


    const loadModels = async () => {
        setModelsLoading(true);
        try {
            const [modelsRes, healthRes, pairsRes] = await Promise.all([
                fetch(`${API_BASE}/models`),
                fetch(`${API_BASE}/health`),
                fetch(`${API_BASE}/pairs`),
            ]);
            setModels(await modelsRes.json());
            setHealth(await healthRes.json());
            const pairsData = await pairsRes.json();
            setPairs(pairsData.pairs || []);
            setModelsLoaded(true);

            if (pairsData.pairs?.length > 0) {
                setCurrentIndex(0);
                loadPair(0, pairsData.pairs);
            }
        } catch {
            setError("Could not connect to backend. Make sure the Python server is running on port 8000.");
        } finally {
            setModelsLoading(false);
        }
    };

    const loadPair = (index, pairsList = pairs) => {
        const filename = pairsList[index];
        if (!filename) return;

        setImage1({
            url: `${API_BASE}/image/A/${filename}`,
            file: { name: filename },
            isRemote: true
        });
        setImage2({
            url: `${API_BASE}/image/B/${filename}`,
            file: { name: filename },
            isRemote: true
        });
        setResult(null);
    };

    const nextPair = () => {
        if (currentIndex < pairs.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            loadPair(newIndex);
        }
    };

    const prevPair = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            loadPair(newIndex);
        }
    };

    const connectISpy = async () => {
        if (!window.iSpy) {
            setIspyError("iSpy Remote Interface library not found.");
            return;
        }
        setIspyConnecting(true);
        setIspyError(null);
        try {
            const remote = window.iSpy.RemoteInterface;
            await remote.connect(brokerUrl, 'FALLBACK', { pollingFrequency: 4000, group: ispyGroup });
            setIspyConnected(true);
            
            // Listen for instance updates
            remote.onStatus((status) => {
                setIspyInstances((prev) => {
                    const exists = prev.find(p => p.instanceID === status.instanceID);
                    if (exists) return prev.map(p => p.instanceID === status.instanceID ? status : p);
                    return [...prev, status];
                });
            });

            remote.onDisconnection((payload) => {
                setIspyInstances((prev) => prev.filter(p => p.instanceID !== payload.instanceID));
            });

            // Request instances
            remote.requestStatus();
        } catch (e) {
            setIspyError(e.message || "Failed to connect to iSpy");
        } finally {
            setIspyConnecting(false);
        }
    };

    const fetchFromISpy = async () => {
        if (!window.iSpy || ispyInstances.length < 2) {
             setIspyError("Need at least 2 iSpy instances connected.");
             return;
        }
        setIsFetchingIspy(true);
        try {
            const remote = window.iSpy.RemoteInterface;
            // Sort instances by date to guess Before (older) and After (newer)
            const sorted = [...ispyInstances].sort((a,b) => (a.imageDate || 0) - (b.imageDate || 0));
            const instance1 = sorted[0];
            const instance2 = sorted[1];

            const img1Payload = await remote.requestViewportImage({ instanceID: instance1.instanceID });
            const img2Payload = await remote.requestViewportImage({ instanceID: instance2.instanceID });

            const fetchFile = async (url, name) => {
                const res = await fetch(url);
                const blob = await res.blob();
                return new File([blob], name, { type: blob.type || 'image/jpeg' });
            };

            const f1 = await fetchFile(img1Payload.url, `ispy_${instance1.instanceID}.jpg`);
            const f2 = await fetchFile(img2Payload.url, `ispy_${instance2.instanceID}.jpg`);

            setImage1({
                url: URL.createObjectURL(f1),
                file: f1,
                isRemote: false
            });
            setImage2({
                url: URL.createObjectURL(f2),
                file: f2,
                isRemote: false
            });
            setIspyError(null);
        } catch (e) {
            setIspyError(e.message || "Failed to fetch images from iSpy.");
        } finally {
            setIsFetchingIspy(false);
        }
    };

    useEffect(() => {
        loadModels();
    }, []);

    const analyze = async () => {
        if (!image1 || !image2 || !selectedModel) return;
        setAnalyzing(true);
        setResult(null);
        setError(null);

        const fd = new FormData();
        if (image1.isRemote && image2.isRemote) {
            fd.append("filename1", image1.file.name);
            fd.append("filename2", image2.file.name);
        } else {
            fd.append("image1", image1.file);
            fd.append("image2", image2.file);
        }
        fd.append("model_id", selectedModel.id);
        fd.append("provider", selectedModel.provider);
        if (customPrompt.trim()) fd.append("custom_prompt", customPrompt.trim());


        try {
            const res = await fetch(`${API_BASE}/analyze`, { method: "POST", body: fd });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Analysis failed");
            }
            const data = await res.json();
            setResult({ ...data.result, _raw: data.raw_response, _model: data.model_id, _provider: data.provider });
        } catch (e) {
            setError(e.message);
        } finally {
            setAnalyzing(false);
        }
    };

    const canAnalyze = image1 && image2 && selectedModel && !analyzing;

    return (
        <div className="app">
            <div className="scanline" />
            <header className="header">
                <div className="header-left">
                    <div className="logo">
                        <div className="logo-icon">
                            <svg viewBox="0 0 32 32" fill="none">
                                <circle cx="16" cy="16" r="12" stroke="#00d4ff" strokeWidth="1.5" />
                                <circle cx="16" cy="16" r="6" stroke="#00d4ff" strokeWidth="1" />
                                <circle cx="16" cy="16" r="2" fill="#00d4ff" />
                                <line x1="4" y1="16" x2="12" y2="16" stroke="#00d4ff" strokeWidth="1" />
                                <line x1="20" y1="16" x2="28" y2="16" stroke="#00d4ff" strokeWidth="1" />
                                <line x1="16" y1="4" x2="16" y2="12" stroke="#00d4ff" strokeWidth="1" />
                                <line x1="16" y1="20" x2="16" y2="28" stroke="#00d4ff" strokeWidth="1" />
                                <rect x="24" y="4" width="4" height="4" stroke="#ff4466" strokeWidth="1" />
                                <rect x="4" y="24" width="4" height="4" stroke="#00ff88" strokeWidth="1" />
                            </svg>
                        </div>
                        <span>SATCHANGE</span>
                    </div>
                    <div className="subtitle">Multimodal Satellite Change Detection</div>
                </div>
                <div className="header-right">
                    {health && (
                        <div className="health-indicators">
                            <span className={`health-dot ${health.groq ? "ok" : "off"}`}>GROQ</span>
                            <span className={`health-dot ${health.ollama ? "ok" : "off"}`}>OLLAMA</span>
                        </div>
                    )}
                </div>
            </header>

            <main className="main">
                <div className="grid-layout">

                    {/* LEFT: Upload + Controls */}
                    <section className="panel upload-panel">
                        <div className="panel-title">
                            <span className="panel-num">01</span> Image Source (iSpy Default)
                        </div>

                        <div className="ispy-panel">
                            {ispyError && <div className="error-box" style={{marginBottom: '1rem', fontSize: '0.85rem'}}>{ispyError}</div>}
                            
                            {!ispyConnected ? (
                                <div className="ispy-connect-form">
                                    <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
                                        <input 
                                            type="text" 
                                            value={brokerUrl} 
                                            onChange={(e) => setBrokerUrl(e.target.value)} 
                                            className="prompt-input" 
                                            style={{flex: 2, height: '36px', marginBottom: 0}}
                                            placeholder="ws://broker-url" 
                                        />
                                        <input 
                                            type="text" 
                                            value={ispyGroup} 
                                            onChange={(e) => setIspyGroup(e.target.value)} 
                                            className="prompt-input" 
                                            style={{flex: 1, height: '36px', marginBottom: 0}}
                                            placeholder="Group (opt)" 
                                        />
                                    </div>
                                    <button 
                                        className={`analyze-btn ${ispyConnecting ? "loading" : ""}`} 
                                        onClick={connectISpy}
                                        disabled={ispyConnecting}
                                        style={{height: '36px', fontSize: '0.9rem'}}
                                    >
                                        {ispyConnecting ? "Connecting..." : "Connect to iSpy Broker"}
                                    </button>
                                </div>
                            ) : (
                                <div className="ispy-connected-view">
                                    <div className="ispy-status">
                                        <span className="status-dot ok"></span>
                                        Connected to iSpy. {ispyInstances.length} instances found.
                                    </div>
                                    <button 
                                        className={`analyze-btn ${isFetchingIspy ? "loading" : ""}`} 
                                        onClick={fetchFromISpy}
                                        disabled={isFetchingIspy || ispyInstances.length < 2}
                                        style={{height: '36px', fontSize: '0.9rem', marginTop: '0.5rem'}}
                                    >
                                        {isFetchingIspy ? "Fetching..." : "Fetch Before/After from iSpy"}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="panel-title" style={{marginTop: '1.5rem'}}>
                            <span className="panel-num">01a</span> Manual Selection
                            {pairs.length > 0 && (
                                <div className="pair-range">
                                    {currentIndex + 1} / {pairs.length}
                                </div>
                            )}
                        </div>

                        {pairs.length > 0 && (
                            <div className="pair-nav">
                                <button className="nav-btn" onClick={prevPair} disabled={currentIndex === 0}>
                                    ← Previous
                                </button>
                                <div className="current-filename">{pairs[currentIndex]}</div>
                                <button className="nav-btn" onClick={nextPair} disabled={currentIndex === pairs.length - 1}>
                                    Next →
                                </button>
                            </div>
                        )}

                        <div className="dropzones">
                            <ImageDropzone
                                label="Before Image"
                                timeLabel="T1 — BEFORE"
                                image={image1}
                                onImage={setImage1}
                            />
                            <div className="arrow-between">
                                <svg viewBox="0 0 32 24" fill="none">
                                    <path d="M0 12h28M20 4l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <ImageDropzone
                                label="After Image"
                                timeLabel="T2 — AFTER"
                                image={image2}
                                onImage={setImage2}
                            />
                        </div>

                        <div className="panel-title" style={{ marginTop: "2rem" }}>
                            <span className="panel-num">02</span> Custom Prompt (optional)
                        </div>
                        <textarea
                            className="prompt-input"
                            placeholder="e.g. Focus on vehicles and aircraft. Look for new military equipment..."
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            rows={3}
                        />
                    </section>

                    {/* MIDDLE: Model Selection */}
                    <section className="panel model-panel">
                        <div className="panel-title">
                            <span className="panel-num">03</span> Select Model
                            {!modelsLoaded && (
                                <button className="load-models-btn" onClick={loadModels} disabled={modelsLoading}>
                                    {modelsLoading ? "Loading..." : "Connect Backend"}
                                </button>
                            )}
                        </div>
                        {modelsLoaded ? (
                            <ModelSelector
                                models={models}
                                selected={selectedModel}
                                onSelect={setSelectedModel}
                                loading={modelsLoading}
                            />
                        ) : (
                            <div className="models-placeholder">
                                <div className="placeholder-icon">⚡</div>
                                <p>Click "Connect Backend" to load available models from your local server.</p>
                                <div className="dataset-info">
                                    <div className="dataset-title">Recommended Datasets</div>
                                    {[
                                        { name: "LEVIR-CD", desc: "Building change detection, 637 image pairs", link: "https://justchenhao.github.io/LEVIR/" },
                                        { name: "S2Looking", desc: "5000 bitemporal rural satellite pairs", link: "https://github.com/S2Looking/Dataset" },
                                        { name: "OSCD", desc: "Onera Satellite CD, 24 city pairs (Sentinel-2)", link: "https://rcdaudt.github.io/oscd/" },
                                        { name: "DSIFN", desc: "6 Chinese cities, bi-temporal high-res", link: "https://github.com/GeoZcx/A-deeply-supervised-image-fusion-network-for-change-detection-in-remote-sensing-images" },
                                        { name: "Planet NICFI Basemaps", desc: "Free 5m/px tropical imagery, monthly", link: "https://www.planet.com/nicfi/" },
                                        { name: "Sentinel-2 (EO Browser)", desc: "Free 10m multi-spectral, global coverage", link: "https://apps.sentinel-hub.com/eo-browser/" },
                                    ].map((d) => (
                                        <a key={d.name} href={d.link} target="_blank" rel="noreferrer" className="dataset-item">
                                            <span className="dataset-name">{d.name}</span>
                                            <span className="dataset-desc">{d.desc}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* RIGHT: Results */}
                    <section className="panel result-section-panel">
                        <div className="panel-title">
                            <span className="panel-num">04</span> Analysis Result
                        </div>

                        <button
                            className={`analyze-btn ${analyzing ? "loading" : ""} ${!canAnalyze ? "disabled" : ""}`}
                            onClick={analyze}
                            disabled={!canAnalyze}
                        >
                            {analyzing ? (
                                <>
                                    <span className="spinner" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <span className="btn-icon">🛰️</span>
                                    Run Change Detection
                                </>
                            )}
                        </button>

                        {!canAnalyze && !analyzing && (
                            <div className="requirements">
                                {!image1 && <span className="req">Upload BEFORE image</span>}
                                {!image2 && <span className="req">Upload AFTER image</span>}
                                {!selectedModel && <span className="req">Select a model</span>}
                            </div>
                        )}

                        {error && (
                            <div className="error-box">
                                <span className="error-icon">⚠</span> {error}
                            </div>
                        )}

                        {result && (
                            <ResultPanel
                                result={result}
                                modelId={result._model}
                                provider={result._provider}
                                rawResponse={result._raw}
                            />
                        )}

                        {!result && !error && !analyzing && (
                            <div className="result-placeholder">
                                <div className="placeholder-grid">
                                    {[...Array(9)].map((_, i) => (
                                        <div key={i} className={`ph-cell ${i === 4 ? "center" : ""}`} />
                                    ))}
                                </div>
                                <p>Upload two images and select a model to detect changes</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <footer className="footer">
                <span>SATCHANGE v1.0</span>
                <span className="sep">·</span>
                <span>Groq: Llama 4 Scout</span>
                <span className="sep">·</span>
                <span>Ollama: Qwen2.5VL, Llama3.2-Vision, LLaVA, MiniCPM-V + more</span>
            </footer>
        </div>
    );
}