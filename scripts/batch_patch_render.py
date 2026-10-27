#!/usr/bin/env python3
"""
Batch Patch Render Engine for Video 1 (112 Reels)
Distributes 112 reels across 20 parallel GitHub Actions runners.
Runners 1-12 render 6 reels each.
Runners 13-20 render 5 reels each.
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
FLICK_OUTPUT = ROOT_DIR / "flick-output"
REMOTION_DIR = FLICK_OUTPUT / "remotion"
JSON_LIST_PATH = ROOT_DIR / "reels_using_video_1.json"

def get_runner_slice(reels, runner_id, total_runners=20):
    n = len(reels)
    base = n // total_runners
    rem = n % total_runners
    if runner_id <= rem:
        start = (runner_id - 1) * (base + 1)
        end = start + base + 1
    else:
        start = rem * (base + 1) + (runner_id - 1 - rem) * base
        end = start + base
    return reels[start:end]

def render_patch_slice(runner_id: int, total_runners: int = 20):
    if not JSON_LIST_PATH.exists():
        print(f"❌ Error: {JSON_LIST_PATH} not found!")
        sys.exit(1)

    with open(JSON_LIST_PATH, "r", encoding="utf-8") as f:
        all_reels = json.load(f)

    assigned_reels = get_runner_slice(all_reels, runner_id, total_runners)
    runner_padded = f"{runner_id:02d}"

    print("=" * 80)
    print(f"🚀 PATCH CLOUD RUNNER #{runner_padded} INITIALIZED")
    print(f"   Assigned Patch Slice: {len(assigned_reels)} reels")
    print(f"   First Reel: {assigned_reels[0]['rel_path']}")
    print(f"   Last Reel:  {assigned_reels[-1]['rel_path']}")
    print("=" * 80, flush=True)

    out_dir = REMOTION_DIR / "out" / f"patch-runner-{runner_padded}"
    out_dir.mkdir(parents=True, exist_ok=True)

    successful = 0
    failed = 0
    total_time_start = time.time()

    bg_path = "backgrounds/bg_01.mp4"

    for i, reel in enumerate(assigned_reels, 1):
        global_idx = reel["global_index"]
        reel_path = FLICK_OUTPUT / reel["page"] / reel["idea"] / reel["script"]
        manifest_src = reel_path / "audio-manifest.json"
        mp3_src = reel_path / "full-dialogue.mp3"
        output_file = out_dir / f"{reel['slug']}.mp4"

        print(f"\n[{i}/{len(assigned_reels)}] (Global #{global_idx}) Rendering: {reel['rel_path']}")
        print(f"       Background: {bg_path} (Silent) | Output: {output_file.name}")

        if not manifest_src.exists() or not mp3_src.exists():
            print(f"❌ Missing assets for {reel['rel_path']}")
            failed += 1
            continue

        # Stage assets into Remotion data & public
        shutil.copy2(manifest_src, REMOTION_DIR / "src" / "data" / "audio-manifest.json")
        shutil.copy2(manifest_src, REMOTION_DIR / "public" / "audio-manifest.json")
        shutil.copy2(mp3_src, REMOTION_DIR / "public" / "full-dialogue.mp3")

        t_start = time.time()
        cmd = [
            "npx", "remotion", "render",
            "src/index.tsx",
            "PythonStackReel",
            str(output_file),
            "--concurrency=100%",
            f"--props={{\"backgroundVideo\": \"{bg_path}\"}}",
            "--log=verbose"
        ]

        try:
            res = subprocess.run(cmd, cwd=str(REMOTION_DIR), capture_output=True, text=True, check=True)
            elapsed = time.time() - t_start
            file_size_mb = output_file.stat().st_size / (1024 * 1024) if output_file.exists() else 0
            print(f"✅ Finished in {elapsed:.1f}s | Size: {file_size_mb:.1f} MB")
            successful += 1
        except subprocess.CalledProcessError as err:
            elapsed = time.time() - t_start
            print(f"❌ Render failed after {elapsed:.1f}s: {err}")
            if err.stderr:
                print("   Stderr:", err.stderr[-500:])
            failed += 1

    total_elapsed = time.time() - total_time_start
    print("\n" + "=" * 80)
    print(f"🏁 PATCH RUNNER #{runner_padded} BATCH COMPLETE")
    print(f"   Success: {successful}/{len(assigned_reels)} | Failed: {failed}")
    print(f"   Total Duration: {total_elapsed / 60:.1f} minutes")
    print(f"   Output Directory: {out_dir}")
    print("=" * 80, flush=True)

    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch Patch Render Engine")
    parser.add_argument("--runner-id", type=int, required=True, help="Runner ID (1-20)")
    parser.add_argument("--total-runners", type=int, default=20, help="Total number of parallel runners")
    args = parser.parse_args()

    render_patch_slice(args.runner_id, args.total_runners)
