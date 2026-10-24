import asyncio
import json
import subprocess
from pathlib import Path
import edge_tts

VOICE = "en-US-ChristopherNeural"  # Deep, clear, authoritative technical single narrator

TEXT = (
    "Your Python app just crashed. RecursionError. Here is why. "
    "Every recursive call pushes a heavy stack frame in memory with local variables and bytecode pointers. "
    "Hit one thousand frames, and Python halts everything to protect the OS. "
    "The fix? Swap recursion for an iterative collections deque. "
    "It runs in heap memory, zero frame overhead, and executes five times faster."
)

OUTPUT_DIR = Path("flick-output")
REMOTION_PUBLIC = OUTPUT_DIR / "remotion" / "public"
REMOTION_DATA = OUTPUT_DIR / "remotion" / "src" / "data"

REMOTION_PUBLIC.mkdir(parents=True, exist_ok=True)
REMOTION_DATA.mkdir(parents=True, exist_ok=True)

async def main():
    mp3_path = REMOTION_PUBLIC / "full-dialogue.mp3"
    
    print("Generating 30s single-narrator voiceover with word-level timestamps...")
    communicate = edge_tts.Communicate(TEXT, VOICE, rate="+3%", boundary="WordBoundary")
    words = []
    
    with open(mp3_path, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "word": chunk["text"],
                    "start": round(chunk["offset"] / 10_000_000, 3),
                    "end": round((chunk["offset"] + chunk["duration"]) / 10_000_000, 3)
                })

    probe_cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(mp3_path)
    ]
    duration_str = subprocess.check_output(probe_cmd).decode().strip()
    duration = float(duration_str)
    print(f"Generated full-dialogue.mp3: {duration:.3f}s, {len(words)} words.")

    manifest = {
        "topic": "python-stack-frame",
        "combinedAudio": "full-dialogue.mp3",
        "duration": round(duration, 3),
        "voice": VOICE,
        "text": TEXT,
        "words": words
    }

    with open(OUTPUT_DIR / "audio-manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    with open(REMOTION_PUBLIC / "audio-manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    with open(REMOTION_DATA / "audio-manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print("Saved 30s audio-manifest.json successfully.")

if __name__ == "__main__":
    asyncio.run(main())
