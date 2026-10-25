import io
import json
import subprocess
from pathlib import Path
import numpy as np
import soundfile as sf
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, Response, JSONResponse
from pydantic import BaseModel
from kokoro_onnx import Kokoro
from faster_whisper import WhisperModel

ROOT_DIR = Path(__file__).parent.parent
MODEL_PATH = ROOT_DIR / "models" / "kokoro" / "kokoro-v1.0.onnx"
VOICES_PATH = ROOT_DIR / "models" / "kokoro" / "voices-v1.0.bin"

OUTPUT_DIR = ROOT_DIR / "flick-output"
REMOTION_PUBLIC = OUTPUT_DIR / "remotion" / "public"
REMOTION_DATA = OUTPUT_DIR / "remotion" / "src" / "data"

REMOTION_PUBLIC.mkdir(parents=True, exist_ok=True)
REMOTION_DATA.mkdir(parents=True, exist_ok=True)

print("Initializing Kokoro-82M model...")
kokoro = Kokoro(str(MODEL_PATH), str(VOICES_PATH))

print("Initializing Whisper aligner...")
whisper = WhisperModel("tiny.en", device="cpu", compute_type="int8")

app = FastAPI(title="Kokoro Voice Studio Dashboard")

VOICE_OPTIONS = [
    {"id": "am_adam", "name": "Adam (Deep, Authoritative Tech)", "gender": "Male"},
    {"id": "am_michael", "name": "Michael (Conversational, Podcast)", "gender": "Male"},
    {"id": "am_eric", "name": "Eric (Crisp, Punchy Tutorial)", "gender": "Male"},
    {"id": "af_bella", "name": "Bella (Warm, Smooth, Natural)", "gender": "Female"},
    {"id": "af_sarah", "name": "Sarah (Articulate, Professional)", "gender": "Female"},
    {"id": "am_fenrir", "name": "Fenrir (Resonant, Cinematic)", "gender": "Male"},
    {"id": "am_onyx", "name": "Onyx (Deep Bass, Commercial)", "gender": "Male"},
    {"id": "af_heart", "name": "Heart (Soft, Expressive)", "gender": "Female"},
    {"id": "bm_george", "name": "George (British Authoritative)", "gender": "Male"},
    {"id": "bm_lewis", "name": "Lewis (British Casual)", "gender": "Male"}
]

class SynthesizeRequest(BaseModel):
    text: str
    primary_voice: str = "am_adam"
    secondary_voice: str = "am_michael"
    blend_ratio: float = 0.40  # 60% Adam / 40% Michael
    speed: float = 1.10
    deploy_to_reel: bool = False

@app.get("/", response_class=HTMLResponse)
def index():
    return """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Kokoro Voice Studio Dashboard</title>
  <style>
    :root {
      --bg: #0f1117;
      --card: #181b24;
      --accent: #ff0055;
      --accent-gradient: linear-gradient(135deg, #ff0055, #7928ca);
      --text: #ffffff;
      --text-muted: #8e95a5;
      --border: #262b38;
    }
    body {
      margin: 0;
      padding: 30px;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 36px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }
    h1 {
      margin-top: 0;
      font-size: 28px;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      font-size: 12px;
      background: #232936;
      color: #00d26a;
      border: 1px solid #00d26a44;
      padding: 4px 10px;
      border-radius: 20px;
      -webkit-text-fill-color: #00d26a;
    }
    label {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      display: block;
    }
    textarea {
      width: 100%;
      box-sizing: border-box;
      height: 120px;
      background: #0d0f14;
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text);
      font-size: 15px;
      padding: 14px;
      line-height: 1.5;
      resize: vertical;
      margin-bottom: 24px;
    }
    textarea:focus {
      outline: none;
      border-color: #ff0055;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    select, input[type="range"] {
      width: 100%;
      box-sizing: border-box;
      background: #0d0f14;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      padding: 10px;
      font-size: 14px;
    }
    .slider-box {
      margin-bottom: 24px;
      background: #12151c;
      padding: 16px;
      border-radius: 10px;
      border: 1px solid var(--border);
    }
    .slider-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .btn-row {
      display: flex;
      gap: 16px;
      margin-top: 10px;
    }
    button {
      flex: 1;
      padding: 14px 24px;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: var(--accent-gradient);
      color: white;
    }
    .btn-primary:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: #252b38;
      color: white;
    }
    .btn-secondary:hover {
      background: #2e3545;
    }
    #player-box {
      margin-top: 28px;
      display: none;
      background: #11141c;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid var(--border);
    }
    audio {
      width: 100%;
      margin-top: 10px;
    }
    #status {
      margin-top: 12px;
      font-size: 14px;
      color: #00d26a;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>
      Kokoro Voice Studio
      <span class="badge">● Local 82M CPU Engine</span>
    </h1>
    <p style="color: var(--text-muted); margin-bottom: 24px; font-size: 14px;">
      Synthesize, blend, and personalize your creator voiceover with zero cloud delay.
    </p>

    <label>Dialogue / Narration Script</label>
    <textarea id="scriptText">Your Python app just crashed. RecursionError. Here is why. Every recursive call pushes a heavy stack frame in memory with local variables and bytecode pointers. Hit one thousand frames, and Python halts everything to protect the OS. The fix? Swap recursion for an iterative collections deque. It runs in heap memory, zero frame overhead, and executes five times faster.</textarea>

    <div class="grid">
      <div>
        <label>Primary Voice (Base)</label>
        <select id="primaryVoice">
          <option value="am_adam" selected>am_adam - Deep Tech Narrator (Male)</option>
          <option value="am_michael">am_michael - Podcast Creator (Male)</option>
          <option value="am_eric">am_eric - Crisp Tutorial Style (Male)</option>
          <option value="af_bella">af_bella - Warm & Natural (Female)</option>
          <option value="af_sarah">af_sarah - Articulate & Pro (Female)</option>
          <option value="am_fenrir">am_fenrir - Cinematic Narrator (Male)</option>
          <option value="am_onyx">am_onyx - Deep Commercial Bass (Male)</option>
          <option value="af_heart">af_heart - Expressive Storyteller (Female)</option>
          <option value="bm_george">bm_george - Authoritative British (Male)</option>
          <option value="bm_lewis">bm_lewis - Casual British (Male)</option>
        </select>
      </div>

      <div>
        <label>Secondary Voice (For Blending)</label>
        <select id="secondaryVoice">
          <option value="am_michael" selected>am_michael - Podcast Creator (Male)</option>
          <option value="am_adam">am_adam - Deep Tech Narrator (Male)</option>
          <option value="am_eric">am_eric - Crisp Tutorial Style (Male)</option>
          <option value="af_bella">af_bella - Warm & Natural (Female)</option>
          <option value="af_sarah">af_sarah - Articulate & Pro (Female)</option>
        </select>
      </div>
    </div>

    <div class="slider-box">
      <div class="slider-header">
        <label style="margin:0;">Voice Blend Ratio</label>
        <span id="blendVal" style="color: var(--accent); font-weight: bold;">60% Primary / 40% Secondary</span>
      </div>
      <input type="range" id="blendRatio" min="0" max="1" step="0.05" value="0.4" oninput="updateBlendLabel()">
      <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--text-muted); margin-top:4px;">
        <span>Pure Primary</span>
        <span>50/50 Hybrid</span>
        <span>Pure Secondary</span>
      </div>
    </div>

    <div class="slider-box">
      <div class="slider-header">
        <label style="margin:0;">Speaking Speed / Cadence</label>
        <span id="speedVal" style="color: var(--accent); font-weight: bold;">1.10x</span>
      </div>
      <input type="range" id="speed" min="0.8" max="1.4" step="0.05" value="1.10" oninput="document.getElementById('speedVal').innerText = this.value + 'x'">
    </div>

    <div class="btn-row">
      <button class="btn-secondary" onclick="generate(false)">🔊 Generate & Preview</button>
      <button class="btn-primary" onclick="generate(true)">🎬 Save & Deploy to Video Reel</button>
    </div>

    <div id="player-box">
      <label id="playerLabel">Synthesized Audio</label>
      <audio id="audioPlayer" controls></audio>
      <div id="status"></div>
    </div>
  </div>

  <script>
    function updateBlendLabel() {
      const v = parseFloat(document.getElementById('blendRatio').value);
      const p1 = Math.round((1 - v) * 100);
      const p2 = Math.round(v * 100);
      document.getElementById('blendVal').innerText = `${p1}% Primary / ${p2}% Secondary`;
    }

    async function generate(deploy) {
      const status = document.getElementById('status');
      const box = document.getElementById('player-box');
      const player = document.getElementById('audioPlayer');
      box.style.display = 'block';
      status.style.color = '#8e95a5';
      status.innerText = deploy ? 'Synthesizing voice & aligning Whisper timestamps...' : 'Synthesizing audio preview...';

      const payload = {
        text: document.getElementById('scriptText').value,
        primary_voice: document.getElementById('primaryVoice').value,
        secondary_voice: document.getElementById('secondaryVoice').value,
        blend_ratio: parseFloat(document.getElementById('blendRatio').value),
        speed: parseFloat(document.getElementById('speed').value),
        deploy_to_reel: deploy
      };

      try {
        const res = await fetch('/api/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        player.src = data.audio_url + '?t=' + Date.now();
        player.play();

        if (deploy) {
          status.style.color = '#00d26a';
          status.innerText = `✅ Deployed! Duration: ${data.duration}s (${data.words_count} words aligned into Remotion reel).`;
        } else {
          status.style.color = '#00d26a';
          status.innerText = `Generated in ${data.generation_time}s! (${data.duration}s audio)`;
        }
      } catch (err) {
        status.style.color = '#ff4444';
        status.innerText = 'Error: ' + err.message;
      }
    }
  </script>
</body>
</html>
    """

@app.post("/api/synthesize")
def synthesize(req: SynthesizeRequest):
    import time
    t0 = time.time()
    
    # Calculate voice style vector (pure or blended)
    v1 = kokoro.get_voice_style(req.primary_voice)
    if req.blend_ratio > 0:
        v2 = kokoro.get_voice_style(req.secondary_voice)
        voice_style = (1.0 - req.blend_ratio) * v1 + req.blend_ratio * v2
    else:
        voice_style = v1
        
    samples, sample_rate = kokoro.create(
        text=req.text,
        voice=voice_style,
        speed=req.speed,
        lang="en-us"
    )
    gen_time = round(time.time() - t0, 2)
    duration = round(len(samples) / sample_rate, 3)
    
    # Save preview WAV
    preview_wav = REMOTION_PUBLIC / "preview.wav"
    sf.write(str(preview_wav), samples, sample_rate)
    
    words_count = 0
    if req.deploy_to_reel:
        # Save as full-dialogue.mp3 for Remotion
        mp3_path = REMOTION_PUBLIC / "full-dialogue.mp3"
        ffmpeg_cmd = [
            "ffmpeg", "-y", "-i", str(preview_wav),
            "-codec:a", "libmp3lame", "-qscale:a", "2",
            str(mp3_path)
        ]
        subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # Whisper word alignment
        whisper_audio, _ = sf.read(str(preview_wav), dtype="float32")
        if len(whisper_audio.shape) > 1:
            whisper_audio = whisper_audio.mean(axis=1)
        segments, _ = whisper.transcribe(whisper_audio, word_timestamps=True)
        
        words = []
        for segment in segments:
            if segment.words:
                for w in segment.words:
                    clean = w.word.strip().replace('"', '').replace('.', '').replace(',', '').replace('?', '')
                    if clean:
                        words.append({
                            "word": clean,
                            "start": round(w.start, 3),
                            "end": round(w.end, 3)
                        })
        words_count = len(words)
        
        manifest_data = {
            "duration": duration,
            "sample_rate": sample_rate,
            "voice": f"{req.primary_voice}+{req.secondary_voice}:{req.blend_ratio}",
            "speed": req.speed,
            "text": req.text,
            "words": words
        }
        with open(REMOTION_DATA / "audio-manifest.json", "w", encoding="utf-8") as f:
            json.dump(manifest_data, f, indent=2)

    return {
        "duration": duration,
        "generation_time": gen_time,
        "audio_url": "/api/preview_audio",
        "words_count": words_count
    }

@app.get("/api/preview_audio")
def get_preview_audio():
    preview_wav = REMOTION_PUBLIC / "preview.wav"
    if not preview_wav.exists():
        raise HTTPException(status_code=404, detail="No preview generated yet")
    with open(preview_wav, "rb") as f:
        return Response(content=f.read(), media_type="audio/wav")

if __name__ == "__main__":
    print("Launching Kokoro Voice Studio Dashboard at http://localhost:5050")
    uvicorn.run(app, host="127.0.0.1", port=5050)
