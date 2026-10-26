import sys
import json
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR))

from scripts.generate_kokoro_audio import generate_audio

base_dir = Path("flick-output/page-01/idea-01")

for i in range(2, 6):
    sdir = base_dir / f"script-0{i}"
    mpath = sdir / "audio-manifest.json"
    with open(mpath, "r", encoding="utf-8") as f:
        existing = json.load(f)
    
    text = existing["text"]
    visuals = existing.get("visuals", {})
    print(f"\n--- Generating Speech for script-0{i} ---")
    generate_audio(text, sdir, remotion_sync=False, visuals=visuals)
    print(f"script-0{i} complete.")
