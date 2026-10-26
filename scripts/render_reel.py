#!/usr/bin/env python3
"""
Automated Reel Production & Remotion Dispatcher
Guarantees every video rendered across the pipeline inherits:
1. Kinetic Hook: Word-by-word typewriter pop (8.5 wps) + micro-click SFX + neon cyan strike.
2. Monotonic forced-alignment subtitles with high-contrast cyan highlight.
3. Act Sequence isolation (local frame resets).
4. Full mobile-first high-contrast 960x760 primitives with progressive staggering.
"""

import os
import sys
import shutil
import argparse
import subprocess
from pathlib import Path

# Project paths
ROOT_DIR = Path(__file__).resolve().parent.parent
REMOTION_DIR = ROOT_DIR / "flick-output" / "remotion"
PUBLIC_DIR = REMOTION_DIR / "public"
DATA_DIR = REMOTION_DIR / "src" / "data"

def render_single_reel(script_dir: Path, output_filename: str = "final-reel.mp4", concurrency: int = 8) -> bool:
    script_dir = Path(script_dir).resolve()
    if not script_dir.exists():
        print(f"[ERROR] Script directory not found: {script_dir}")
        return False

    manifest_file = script_dir / "audio-manifest.json"
    audio_file = script_dir / "full-dialogue.mp3"

    if not manifest_file.exists():
        print(f"[ERROR] Manifest missing: {manifest_file}")
        return False
    if not audio_file.exists():
        print(f"[ERROR] Audio missing: {audio_file}")
        return False

    out_mp4 = script_dir / output_filename

    print(f"\n=======================================================")
    print(f"🎬 PRODUCING REEL: {script_dir.relative_to(ROOT_DIR)}")
    print(f"=======================================================")

    # 1. Sync assets into Remotion build directory
    shutil.copy2(manifest_file, PUBLIC_DIR / "audio-manifest.json")
    shutil.copy2(manifest_file, DATA_DIR / "audio-manifest.json")
    shutil.copy2(audio_file, PUBLIC_DIR / "full-dialogue.mp3")
    print(f"[SYNC] Audio & Manifest linked to Remotion build context.")

    # 2. Render via Remotion CLI
    cmd = [
        "npx.cmd" if sys.platform == "win32" else "npx",
        "remotion", "render",
        "src/index.tsx",
        "PythonStackReel",
        str(out_mp4),
        f"--concurrency={concurrency}"
    ]

    print(f"[RENDER] Executing Remotion render (concurrency={concurrency})...")
    try:
        proc = subprocess.run(cmd, cwd=str(REMOTION_DIR), check=True)
        if out_mp4.exists() and out_mp4.stat().st_size > 1_000_000:
            size_mb = round(out_mp4.stat().st_size / (1024 * 1024), 2)
            print(f"[SUCCESS] Reel produced successfully: {out_mp4.name} ({size_mb} MB)\n")
            return True
        else:
            print(f"[ERROR] Render completed but output file invalid.")
            return False
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Remotion render failed with exit code {e.returncode}")
        return False

def render_batch(page_dir: Path, concurrency: int = 8):
    page_dir = Path(page_dir).resolve()
    script_dirs = sorted(list(page_dir.glob("idea-*/script-*")))
    print(f"Found {len(script_dirs)} scripts in {page_dir.name}")
    
    success_count = 0
    for s_dir in script_dirs:
        ok = render_single_reel(s_dir, concurrency=concurrency)
        if ok:
            success_count += 1
            
    print(f"\n=======================================================")
    print(f"🏁 BATCH COMPLETE: {success_count}/{len(script_dirs)} reels rendered.")
    print(f"=======================================================\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Universal Production Reel Renderer")
    parser.add_argument("--target", type=str, help="Target script directory (e.g. flick-output/page-01/idea-01/script-01)")
    parser.add_argument("--page", type=str, help="Target page directory (e.g. flick-output/page-01)")
    parser.add_argument("--concurrency", type=int, default=8, help="Remotion render concurrency (default: 8)")
    parser.add_argument("--out", type=str, default="final-reel.mp4", help="Output filename")

    args = parser.parse_args()

    if args.target:
        render_single_reel(Path(args.target), output_filename=args.out, concurrency=args.concurrency)
    elif args.page:
        render_batch(Path(args.page), concurrency=args.concurrency)
    else:
        print("Please provide --target <script_dir> or --page <page_dir>.")
        sys.exit(1)
