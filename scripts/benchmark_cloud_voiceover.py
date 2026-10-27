import os
import sys
import time
import json
import subprocess
from pathlib import Path
import soundfile as sf
import numpy as np
from scipy.signal import resample
from kokoro_onnx import Kokoro
from faster_whisper import WhisperModel

VOICE_PRIMARY = "am_adam"
VOICE_SECONDARY = "am_michael"
BLEND_RATIO = 0.40
SPEED = 1.10

def benchmark_step(name, fn):
    t0 = time.time()
    res = fn()
    dur = round(time.time() - t0, 3)
    print(f"[TIMING] {name}: {dur}s")
    return res, dur

def run_voiceover_benchmark(script_file: Path, out_dir: Path, model_dir: Path):
    out_dir.mkdir(parents=True, exist_ok=True)
    model_dir.mkdir(parents=True, exist_ok=True)
    
    timings = {}
    
    # Step 1: Download Kokoro Model & Voices if not present
    model_path = model_dir / "kokoro-v1.0.onnx"
    voices_path = model_dir / "voices-v1.0.bin"
    
    def download_models():
        if not model_path.exists():
            print("Downloading kokoro-v1.0.onnx (325 MB)...")
            url = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx"
            subprocess.run(["curl", "-L", "-o", str(model_path), url], check=True)
        if not voices_path.exists():
            print("Downloading voices-v1.0.bin (28 MB)...")
            url = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin"
            subprocess.run(["curl", "-L", "-o", str(voices_path), url], check=True)
        return True

    _, timings["1_download_kokoro_models"] = benchmark_step("1. Download Kokoro-82M ONNX Models", download_models)

    # Step 2: Load Kokoro Runtime
    def load_kokoro():
        return Kokoro(str(model_path), str(voices_path))
    kokoro, timings["2_load_kokoro_runtime"] = benchmark_step("2. Load Kokoro ONNX Runtime", load_kokoro)

    # Step 3: Synthesize Speech
    text = script_file.read_text(encoding="utf-8").strip()
    print(f"\nScript text ({len(text.split())} words):\n{text}\n")
    
    def synthesize():
        v_adam = kokoro.get_voice_style(VOICE_PRIMARY)
        v_michael = kokoro.get_voice_style(VOICE_SECONDARY)
        blended_style = (1.0 - BLEND_RATIO) * v_adam + BLEND_RATIO * v_michael
        samples, sr = kokoro.create(text=text, voice=blended_style, speed=SPEED, lang="en-us")
        return samples, sr
    (samples, sample_rate), timings["3_synthesize_audio"] = benchmark_step("3. Kokoro TTS Audio Synthesis", synthesize)
    
    audio_duration = round(len(samples) / sample_rate, 3)
    print(f"Generated raw audio: {audio_duration} seconds at {sample_rate} Hz")

    # Step 4: Resample to 16 kHz & Convert to MP3
    wav_path = out_dir / "dialogue-kokoro.wav"
    mp3_path = out_dir / "full-dialogue.mp3"
    
    def export_audio():
        sf.write(str(wav_path), samples, sample_rate)
        subprocess.run([
            "ffmpeg", "-y", "-i", str(wav_path),
            "-codec:a", "libmp3lame", "-qscale:a", "2",
            str(mp3_path)
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    _, timings["4_encode_mp3"] = benchmark_step("4. FFmpeg MP3 Encoding", export_audio)

    # Step 5: Load Faster-Whisper & Force-Align
    def run_whisper():
        whisper_model = WhisperModel("tiny.en", device="cpu", compute_type="int8")
        num_target_samples = int(len(samples) * (16000 / sample_rate))
        audio_16k = resample(samples, num_target_samples).astype(np.float32)
        segments, _ = whisper_model.transcribe(audio_16k, word_timestamps=True, language="en")
        whisper_words = []
        for segment in segments:
            for w in segment.words:
                whisper_words.append({
                    "word": w.word.strip(),
                    "start": round(w.start, 3),
                    "end": round(w.end, 3)
                })
        return whisper_words
    words, timings["5_whisper_alignment"] = benchmark_step("5. Faster-Whisper 16kHz Alignment", run_whisper)
    print(f"Aligned {len(words)} words across {audio_duration} seconds.")

    # Save audio-manifest.json
    manifest = {
        "text": text,
        "duration": audio_duration,
        "sample_rate": sample_rate,
        "words": words,
        "timings_benchmark": timings,
        "total_voiceover_pipeline_time_seconds": round(sum(timings.values()), 3)
    }
    manifest_path = out_dir / "audio-manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"Saved manifest to: {manifest_path}")

    print("\n" + "="*50)
    print("BENCHMARK SUMMARY (VOICEOVER ONLY):")
    for k, v in timings.items():
        print(f"  * {k}: {v}s")
    print(f"  * TOTAL TIME: {manifest['total_voiceover_pipeline_time_seconds']}s")
    print("="*50 + "\n")

if __name__ == "__main__":
    script_path = Path("scripts/batch/page-01/idea-01/script-01/script.txt")
    out_directory = Path("flick-output/benchmark-test/page-01/idea-01/script-01")
    model_directory = Path("models/kokoro")
    run_voiceover_benchmark(script_path, out_directory, model_directory)
