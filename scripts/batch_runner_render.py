#!/usr/bin/env python3
"""
Batch Runner Render Engine for GitHub Actions Parallel Matrix
Executes an assigned slice of 50 reels per runner.
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

def get_all_1000_reels():
    reels = []
    for p in range(1, 11):
        page_str = f"page-{p:02d}"
        for i in range(1, 21):
            idea_str = f"idea-{i:02d}"
            for s in range(1, 6):
                script_str = f"script-{s:02d}"
                reels.append({
                    "page": page_str,
                    "idea": idea_str,
                    "script": script_str,
                    "rel_path": f"{page_str}/{idea_str}/{script_str}",
                    "slug": f"{page_str}-{idea_str}-{script_str}",
                })
    return reels

def render_slice(runner_id: int, total_runners: int = 20):
    all_reels = get_all_1000_reels()
    total_reels = len(all_reels)
    reels_per_runner = total_reels // total_runners
    
    start_idx = (runner_id - 1) * reels_per_runner
    end_idx = runner_id * reels_per_runner
    assigned_reels = all_reels[start_idx:end_idx]
    
    print("=" * 80)
    print(f"🚀 CLOUD RUNNER #{runner_id:02d} INITIALIZED")
    print(f"   Assigned Slice: Index {start_idx} to {end_idx} ({len(assigned_reels)} reels)")
    print(f"   Range: {assigned_reels[0]['rel_path']} -> {assigned_reels[-1]['rel_path']}")
    print("=" * 80, flush=True)

    out_dir = REMOTION_DIR / "out" / f"runner-{runner_id:02d}"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    successful = 0
    failed = 0
    total_time_start = time.time()
    
    for i, reel in enumerate(assigned_reels, 1):
        global_reel_num = start_idx + i
        reel_path = FLICK_OUTPUT / reel["page"] / reel["idea"] / reel["script"]
        manifest_src = reel_path / "audio-manifest.json"
        mp3_src = reel_path / "full-dialogue.mp3"
        
        # Rotating background video 1 to 9
        bg_num = ((global_reel_num - 1) % 9) + 1
        bg_path = f"backgrounds/bg_0{bg_num}.mp4"
        
        output_file = out_dir / f"{reel['slug']}.mp4"
        
        print(f"\n[{i}/{len(assigned_reels)}] (Global #{global_reel_num}) Rendering: {reel['rel_path']}")
        print(f"       Background: {bg_path} | Target: {output_file.name}")
        
        if not manifest_src.exists() or not mp3_src.exists():
            print(f"❌ Missing assets for {reel['rel_path']}")
            failed += 1
            continue
            
        # Stage assets into Remotion data & public
        shutil.copy2(manifest_src, REMOTION_DIR / "src" / "data" / "audio-manifest.json")
        shutil.copy2(manifest_src, REMOTION_DIR / "public" / "audio-manifest.json")
        shutil.copy2(mp3_src, REMOTION_DIR / "public" / "full-dialogue.mp3")
        
        # Render with Remotion
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
    print(f"🏁 RUNNER #{runner_id:02d} BATCH COMPLETE")
    print(f"   Success: {successful}/{len(assigned_reels)} | Failed: {failed}")
    print(f"   Total Duration: {total_elapsed / 60:.1f} minutes")
    print(f"   Output Directory: {out_dir}")
    print("=" * 80, flush=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch Runner Render Engine")
    parser.add_argument("--runner-id", type=int, required=True, help="Runner ID (1-20)")
    parser.add_argument("--total-runners", type=int, default=20, help="Total number of parallel runners")
    args = parser.parse_args()
    
    render_slice(args.runner_id, args.total_runners)
