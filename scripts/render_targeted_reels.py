#!/usr/bin/env python3
"""
Render Targeted Reels that encountered edge-case manifest timings
"""

import os
import shutil
import subprocess
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
FLICK_OUTPUT = ROOT_DIR / "flick-output"
REMOTION_DIR = FLICK_OUTPUT / "remotion"
OUT_DIR = REMOTION_DIR / "out" / "targeted"
OUT_DIR.mkdir(parents=True, exist_ok=True)

TARGET_REELS = [
    {"page": "page-09", "idea": "idea-09", "script": "script-01", "bg": "backgrounds/bg_04.mp4"},
    {"page": "page-09", "idea": "idea-09", "script": "script-02", "bg": "backgrounds/bg_05.mp4"},
    {"page": "page-09", "idea": "idea-17", "script": "script-05", "bg": "backgrounds/bg_07.mp4"},
]

def main():
    print("=" * 70)
    print("🎬 RENDERING TARGETED REELS (3 REELS)")
    print("=" * 70)

    for r in TARGET_REELS:
        slug = f"{r['page']}-{r['idea']}-{r['script']}"
        reel_dir = FLICK_OUTPUT / r["page"] / r["idea"] / r["script"]
        manifest_src = reel_dir / "audio-manifest.json"
        mp3_src = reel_dir / "full-dialogue.mp3"
        output_file = OUT_DIR / f"{slug}.mp4"

        print(f"\n[RENDERING] {slug} using {r['bg']}...")
        shutil.copy2(manifest_src, REMOTION_DIR / "src" / "data" / "audio-manifest.json")
        shutil.copy2(manifest_src, REMOTION_DIR / "public" / "audio-manifest.json")
        shutil.copy2(mp3_src, REMOTION_DIR / "public" / "full-dialogue.mp3")

        cmd = [
            "npx", "remotion", "render",
            "src/index.tsx",
            "PythonStackReel",
            str(output_file),
            "--concurrency=100%",
            f"--props={{\"backgroundVideo\": \"{r['bg']}\"}}",
            "--log=verbose"
        ]
        t0 = time.time()
        subprocess.run(cmd, cwd=str(REMOTION_DIR), check=True)
        print(f"✅ Rendered in {time.time() - t0:.1f}s | Size: {output_file.stat().st_size / (1024*1024):.1f} MB")

    print("\n🎉 ALL 3 TARGETED REELS SUCCESSFULLY RENDERED!")

if __name__ == "__main__":
    main()
