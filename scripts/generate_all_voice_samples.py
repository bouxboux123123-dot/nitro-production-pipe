import subprocess
from pathlib import Path
import soundfile as sf
from kokoro_onnx import Kokoro

TEXT = (
    "Your Python app just crashed. RecursionError. Here is why. "
    "Every recursive call pushes a heavy stack frame in memory."
)

VOICES = [
    ("am_adam", "Deep, authoritative tech narrator"),
    ("am_michael", "Conversational, podcast creator"),
    ("am_eric", "Fast, punchy tutorial style"),
    ("af_bella", "Warm, smooth, engaging female"),
    ("af_sarah", "Articulate, professional female")
]

ROOT_DIR = Path(__file__).parent.parent
MODEL_PATH = ROOT_DIR / "models" / "kokoro" / "kokoro-v1.0.onnx"
VOICES_PATH = ROOT_DIR / "models" / "kokoro" / "voices-v1.0.bin"

ARTIFACT_DIR = Path(r"C:\Users\PC\.gemini\antigravity\brain\f86efcc6-d521-4f78-9e2d-50ffcac2fc92")
TEMP_DIR = ROOT_DIR / "flick-output" / "temp_samples"
TEMP_DIR.mkdir(parents=True, exist_ok=True)

def main():
    print(f"Loading Kokoro ONNX model...")
    kokoro = Kokoro(str(MODEL_PATH), str(VOICES_PATH))
    
    for voice_id, desc in VOICES:
        print(f"Generating sample for {voice_id} ({desc})...")
        samples, sample_rate = kokoro.create(
            text=TEXT,
            voice=voice_id,
            speed=1.05,
            lang="en-us"
        )
        
        wav_path = TEMP_DIR / f"{voice_id}.wav"
        sf.write(str(wav_path), samples, sample_rate)
        
        mp3_artifact = ARTIFACT_DIR / f"sample_{voice_id}.mp3"
        ffmpeg_cmd = [
            "ffmpeg", "-y", "-i", str(wav_path),
            "-codec:a", "libmp3lame", "-qscale:a", "2",
            str(mp3_artifact)
        ]
        subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"Saved: {mp3_artifact.name}")

if __name__ == "__main__":
    main()
