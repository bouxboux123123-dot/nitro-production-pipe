import os
import sys
import time
import json
import argparse
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

def download_models_if_needed(model_dir: Path):
    model_dir.mkdir(parents=True, exist_ok=True)
    model_path = model_dir / "kokoro-v1.0.onnx"
    voices_path = model_dir / "voices-v1.0.bin"

    if not model_path.exists():
        print("Downloading kokoro-v1.0.onnx (325 MB)...")
        url = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx"
        subprocess.run(["curl", "-L", "-o", str(model_path), url], check=True)

    if not voices_path.exists():
        print("Downloading voices-v1.0.bin (28 MB)...")
        url = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin"
        subprocess.run(["curl", "-L", "-o", str(voices_path), url], check=True)

    return model_path, voices_path

def process_batch(page_slug: str, chunk: int, model_dir: Path, manifest_path: Path, output_root: Path):
    print("=" * 60)
    print(f"🚀 STARTING BATCH VOICEOVER RUNNER: {page_slug} [Chunk {chunk}/2]")
    print("=" * 60)

    # 1. Download & Initialize Models
    t0_setup = time.time()
    model_path, voices_path = download_models_if_needed(model_dir)

    print("Loading Kokoro ONNX session into memory...")
    kokoro = Kokoro(str(model_path), str(voices_path))
    v_adam = kokoro.get_voice_style(VOICE_PRIMARY)
    v_michael = kokoro.get_voice_style(VOICE_SECONDARY)
    blended_style = (1.0 - BLEND_RATIO) * v_adam + BLEND_RATIO * v_michael

    print("Loading Faster-Whisper (tiny.en) session into memory...")
    whisper_model = WhisperModel("tiny.en", device="cpu", compute_type="int8")

    setup_duration = round(time.time() - t0_setup, 2)
    print(f"✅ Setup & Model Initialization complete in {setup_duration}s\n")

    # 2. Filter target scripts from video manifest
    with open(manifest_path, "r", encoding="utf-8") as f:
        all_manifest = json.load(f)

    idea_range = range(1, 11) if chunk == 1 else range(11, 21)
    target_items = [
        item for item in all_manifest
        if item.get("page_slug") == page_slug and item.get("idea_index") in idea_range
    ]

    total_items = len(target_items)
    print(f"Found {total_items} target scripts to synthesize for {page_slug} (ideas {min(idea_range)}-{max(idea_range)}).")

    if total_items == 0:
        print("No items matched criteria. Exiting.")
        return

    # 3. Process each video in the batch
    start_batch_time = time.time()
    item_durations = []

    for idx, item in enumerate(target_items, start=1):
        idea_slug = item["idea_slug"]
        script_slug = item["script_slug"]
        out_dir = output_root / page_slug / idea_slug / script_slug
        out_dir.mkdir(parents=True, exist_ok=True)

        mp3_path = out_dir / "full-dialogue.mp3"
        audio_manifest_path = out_dir / "audio-manifest.json"

        # Read latest script text
        script_file = Path("scripts/batch") / page_slug / idea_slug / script_slug / "script.txt"
        if script_file.exists():
            text = script_file.read_text(encoding="utf-8").strip()
        else:
            text = item.get("script_text", "").strip()

        t_item_start = time.time()

        # Step A: Synthesize Audio
        samples, sample_rate = kokoro.create(text=text, voice=blended_style, speed=SPEED, lang="en-us")
        audio_duration = round(len(samples) / sample_rate, 3)

        # Step B: Encode MP3
        temp_wav = out_dir / "temp_dialogue.wav"
        sf.write(str(temp_wav), samples, sample_rate)
        subprocess.run([
            "ffmpeg", "-y", "-i", str(temp_wav),
            "-codec:a", "libmp3lame", "-qscale:a", "2",
            str(mp3_path)
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if temp_wav.exists():
            temp_wav.unlink()

        # Step C: Whisper Word Alignment
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

        # Step D: Save Audio Manifest
        manifest_data = {
            "page": page_slug,
            "idea": item.get("idea", ""),
            "text": text,
            "duration": audio_duration,
            "sample_rate": sample_rate,
            "words": whisper_words,
            "visuals": item.get("visuals", {})
        }
        with open(audio_manifest_path, "w", encoding="utf-8") as f:
            json.dump(manifest_data, f, indent=2)

        item_time = round(time.time() - t_item_start, 2)
        item_durations.append(item_time)

        # Calculate progress & ETA
        elapsed = time.time() - start_batch_time
        avg_time = elapsed / idx
        remaining_items = total_items - idx
        eta_sec = remaining_items * avg_time
        eta_min = round(eta_sec / 60, 1)

        print(f"[{idx:02d}/{total_items:02d}] {page_slug}/{idea_slug}/{script_slug} | {audio_duration}s audio in {item_time}s (Avg: {avg_time:.1f}s, ETA: {eta_min}m)")

    total_batch_time = round(time.time() - start_batch_time, 2)
    avg_per_script = round(sum(item_durations) / len(item_durations), 2)

    print("\n" + "=" * 60)
    print(f"🎉 BATCH COMPLETE: {page_slug} [Chunk {chunk}/2]")
    print(f"  • Scripts Synthesized: {total_items}")
    print(f"  • Total Batch Time: {total_batch_time}s ({round(total_batch_time/60, 2)} minutes)")
    print(f"  • Average Per Video: {avg_per_script}s")
    print("=" * 60 + "\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch Kokoro Voiceover Runner for GitHub Actions")
    parser.add_argument("--page", type=str, required=True, help="Page slug (e.g. page-01 to page-10)")
    parser.add_argument("--chunk", type=int, required=True, choices=[1, 2], help="1 for ideas 1-10, 2 for ideas 11-20")
    parser.add_argument("--models-dir", type=str, default="models/kokoro", help="Path to Kokoro ONNX model directory")
    parser.add_argument("--manifest", type=str, default="scripts/batch/video-manifest.json", help="Path to video-manifest.json")
    parser.add_argument("--output-dir", type=str, default="flick-output", help="Root flick-output directory")

    args = parser.parse_args()
    process_batch(
        page_slug=args.page,
        chunk=args.chunk,
        model_dir=Path(args.models_dir),
        manifest_path=Path(args.manifest),
        output_root=Path(args.output_dir)
    )
