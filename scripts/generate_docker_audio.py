import asyncio
import json
import os
import subprocess
from pathlib import Path
import edge_tts

VOICE = "en-US-ChristopherNeural"
OUTPUT_DIR = Path("videos/docker-container-layers")
AUDIO_DIR = OUTPUT_DIR / "assets" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

SCENES = [
    {
        "id": "01-hook-dockerfile",
        "voice_file": "voice-01.wav",
        "text": "Why do Docker builds feel instant and barely take up disk space? The secret is Docker's immutable layer architecture. Every single line in your Dockerfile creates an isolated, read-only snapshot."
    },
    {
        "id": "02-immutable-layers",
        "voice_file": "voice-02.wav",
        "text": "Under the hood, each instruction produces a compressed tarball tagged with a unique SHA-256 hash. If your source files haven't changed, Docker skips rebuilding entirely, delivering an instant cache hit."
    },
    {
        "id": "03-overlay-unionfs",
        "voice_file": "voice-03.wav",
        "text": "To combine these independent layers into a functional filesystem, Docker uses the Overlay2 storage driver. Overlay2 stacks all read-only layers together as LowerDir, presenting them as a single unified tree."
    },
    {
        "id": "04-container-mount",
        "voice_file": "voice-04.wav",
        "text": "When you launch a container, Docker mounts a razor-thin, read-write layer on top called UpperDir. If a process modifies a file, Docker never touches the image. It copies the file up using Copy-on-Write."
    },
    {
        "id": "05-summary-recap",
        "voice_file": "voice-05.wav",
        "text": "This means dozens of running containers can share the exact same base image without duplicating a single megabyte. Fast builds, zero wasted storage, and bulletproof isolation."
    }
]

async def generate_scene(scene, idx):
    mp3_path = AUDIO_DIR / f"temp_{idx}.mp3"
    wav_path = AUDIO_DIR / scene["voice_file"]
    
    communicate = edge_tts.Communicate(scene["text"], VOICE, boundary="WordBoundary")
    words = []
    
    with open(mp3_path, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "word": chunk["text"],
                    "start": chunk["offset"] / 10_000_000,
                    "end": (chunk["offset"] + chunk["duration"]) / 10_000_000
                })
                
    cmd = [
        "ffmpeg", "-y",
        "-i", str(mp3_path),
        "-ar", "48000",
        "-ac", "2",
        str(wav_path)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if mp3_path.exists():
        mp3_path.unlink()
        
    probe_cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(wav_path)
    ]
    duration_str = subprocess.check_output(probe_cmd).decode().strip()
    duration = float(duration_str)
    
    return {
        "id": scene["id"],
        "voice_file": f"assets/audio/{scene['voice_file']}",
        "duration": round(duration, 3),
        "text": scene["text"],
        "words": words
    }

async def main():
    results = []
    total_time = 0.0
    for idx, sc in enumerate(SCENES):
        print(f"Generating audio for scene {idx+1}/{len(SCENES)}: {sc['id']}...")
        meta = await generate_scene(sc, idx)
        meta["start_offset"] = round(total_time, 3)
        total_time += meta["duration"]
        results.append(meta)
        print(f"Scene {idx+1} duration: {meta['duration']}s (total so far: {total_time:.2f}s)")
        
    out_meta = {
        "total_duration": round(total_time, 3),
        "scenes": results
    }
    with open(OUTPUT_DIR / "audio_meta.json", "w", encoding="utf-8") as f:
        json.dump(out_meta, f, indent=2)
    print(f"\nAll scenes complete! Total duration: {total_time:.3f}s. Saved to audio_meta.json.")

if __name__ == "__main__":
    asyncio.run(main())
