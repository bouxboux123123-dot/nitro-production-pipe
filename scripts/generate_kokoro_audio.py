import json
import subprocess
import argparse
from pathlib import Path
import soundfile as sf
import numpy as np
from kokoro_onnx import Kokoro
from faster_whisper import WhisperModel

# Default Production 30s Python Stack Reel script
DEFAULT_TEXT = (
    "Your Python app just crashed. RecursionError. Here is why. "
    "Every recursive call pushes a heavy stack frame in memory with local variables and bytecode pointers. "
    "Hit one thousand frames, and Python halts everything to protect the OS. "
    "The fix? Swap recursion for an iterative collections deque. "
    "It runs in heap memory, zero frame overhead, and executes five times faster."
)

# Standardized Production Voice Formula: 60% am_adam + 40% am_michael @ 1.1x speed
VOICE_PRIMARY = "am_adam"
VOICE_SECONDARY = "am_michael"
BLEND_RATIO = 0.40  # 0.40 secondary = 60% Adam / 40% Michael
SPEED = 1.10        # 1.1x speed for energetic creator pacing

ROOT_DIR = Path(__file__).parent.parent
MODEL_PATH = ROOT_DIR / "models" / "kokoro" / "kokoro-v1.0.onnx"
VOICES_PATH = ROOT_DIR / "models" / "kokoro" / "voices-v1.0.bin"

def generate_audio(text: str, out_dir: Path, remotion_sync: bool = True, visuals: dict = None):
    out_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Loading Kokoro-82M ONNX model from: {MODEL_PATH}")
    kokoro = Kokoro(str(MODEL_PATH), str(VOICES_PATH))
    
    # Compute the blended voice vector
    v_adam = kokoro.get_voice_style(VOICE_PRIMARY)
    v_michael = kokoro.get_voice_style(VOICE_SECONDARY)
    blended_style = (1.0 - BLEND_RATIO) * v_adam + BLEND_RATIO * v_michael
    
    print(f"Synthesizing speech: 60% {VOICE_PRIMARY} + 40% {VOICE_SECONDARY} at {SPEED}x speed...")
    samples, sample_rate = kokoro.create(
        text=text,
        voice=blended_style,
        speed=SPEED,
        lang="en-us"
    )
    
    # Save temporary uncompressed WAV
    wav_path = out_dir / "dialogue-kokoro.wav"
    sf.write(str(wav_path), samples, sample_rate)
    
    # Convert to MP3
    mp3_path = out_dir / "full-dialogue.mp3"
    ffmpeg_cmd = [
        "ffmpeg", "-y", "-i", str(wav_path),
        "-codec:a", "libmp3lame", "-qscale:a", "2",
        str(mp3_path)
    ]
    subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Probe duration
    probe_cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(mp3_path)
    ]
    duration = float(subprocess.check_output(probe_cmd).decode().strip())
    print(f"Generated {mp3_path.name}: {duration:.3f}s")
    
    # Word-level timestamps using faster-whisper
    print("Aligning word-level timestamps with Faster-Whisper...")
    whisper = WhisperModel("tiny.en", device="cpu", compute_type="int8")
    whisper_audio, _ = sf.read(str(wav_path), dtype="float32")
    if len(whisper_audio.shape) > 1:
        whisper_audio = whisper_audio.mean(axis=1)
        
    segments, info = whisper.transcribe(whisper_audio, word_timestamps=True)
    
    words = []
    for segment in segments:
        if segment.words:
            for w in segment.words:
                cleaned_word = w.word.strip().replace('"', '').replace('.', '').replace(',', '').replace('?', '')
                if cleaned_word:
                    words.append({
                        "word": cleaned_word,
                        "start": round(w.start, 3),
                        "end": round(w.end, 3)
                    })
                    
    print(f"Aligned {len(words)} words across {duration:.3f} seconds.")
    
    # Clean up temp wav
    if wav_path.exists():
        try:
            wav_path.unlink()
        except Exception:
            pass
            
    manifest_data = {
        "duration": duration,
        "sample_rate": sample_rate,
        "voice": f"kokoro-82M:{VOICE_PRIMARY}*0.60+{VOICE_SECONDARY}*0.40",
        "speed": SPEED,
        "text": text,
        "words": words
    }
    if visuals:
        manifest_data["visuals"] = visuals
    
    manifest_path = out_dir / "audio-manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2)
    print(f"Saved audio manifest to: {manifest_path}")

    # Remotion public & data sync if requested
    if remotion_sync:
        remotion_pub = ROOT_DIR / "flick-output" / "remotion" / "public" / "full-dialogue.mp3"
        remotion_dat = ROOT_DIR / "flick-output" / "remotion" / "src" / "data" / "audio-manifest.json"
        remotion_pub.parent.mkdir(parents=True, exist_ok=True)
        remotion_dat.parent.mkdir(parents=True, exist_ok=True)
        import shutil
        shutil.copy2(str(mp3_path), str(remotion_pub))
        shutil.copy2(str(manifest_path), str(remotion_dat))
        print(f"Synced audio assets to Remotion staging.")

    return manifest_data

def main():
    parser = argparse.ArgumentParser(description="Kokoro-82M TTS + Faster-Whisper Aligner")
    parser.add_argument("--text", type=str, default=DEFAULT_TEXT, help="Text to speak or path to .txt file")
    parser.add_argument("--outdir", type=str, default="", help="Output directory")
    parser.add_argument("--no-sync", action="store_true", help="Don't copy to remotion staging")
    args = parser.parse_args()

    text = args.text
    text_path = Path(text)
    if text_path.exists() and text_path.is_file():
        text = text_path.read_text(encoding="utf-8").strip()

    if args.outdir:
        out_dir = Path(args.outdir)
    else:
        out_dir = ROOT_DIR / "flick-output" / "remotion" / "public"

    generate_audio(text, out_dir, remotion_sync=not args.no_sync)

if __name__ == "__main__":
    main()
