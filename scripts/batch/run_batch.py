import os
import sys
import json
import shutil
import argparse
import subprocess
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(__file__).parent.parent.parent
BATCH_DIR = ROOT_DIR / "scripts" / "batch"
MANIFEST_JSON = BATCH_DIR / "video-manifest.json"
F_DRIVE_TARGET = Path("F:/creator-berry-renders")

sys.path.append(str(ROOT_DIR / "scripts"))
from generate_kokoro_audio import generate_audio

def run_batch(batch_num: int, dry_run: bool = False, local_render: bool = False):
    if not MANIFEST_JSON.exists():
        print("Manifest not found! Run build_manifest.py first.")
        return

    with open(MANIFEST_JSON, encoding="utf-8") as f:
        manifest = json.load(f)

    # 100 batches of 10 items
    start_idx = (batch_num - 1) * 10
    end_idx = batch_num * 10
    batch_items = manifest[start_idx:end_idx]

    if not batch_items:
        print(f"No items found for batch {batch_num}!")
        return

    print(f"\n==================================================")
    print(f"🎬 Starting Production Batch {batch_num} (Videos {start_idx + 1} to {end_idx})")
    print(f"Target F: drive destination: {F_DRIVE_TARGET}")
    print(f"==================================================\n")

    for i, item in enumerate(batch_items, start=1):
        vid_id = item["id"]
        out_dir = ROOT_DIR / item["output_folder"]
        out_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"\n[{i}/10] Processing Video #{vid_id}: {item['page_slug']} - {item['idea_slug']} - {item['script_slug']}")
        print(f"Hook: {item['hook']}")
        
        item["status"] = "in_production"
        with open(MANIFEST_JSON, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2)

        # 1. Generate Voiceover + Word Alignment (Kokoro-82M + Faster-Whisper)
        if not dry_run:
            print("Generating voiceover & word timestamps...")
            generate_audio(item["script_text"], out_dir, remotion_sync=True)
        else:
            print("[Dry-run] Skipped audio generation.")

        # 2. Render or trigger Cloud Render
        if not dry_run:
            if local_render:
                print("Local render requested (npx remotion render with concurrency 20)...")
                subprocess.run(
                    ["npx", "remotion", "render", "src/index.tsx", "PythonStackReel", 
                     str(out_dir / "final-reel.mp4"), "--concurrency=20"],
                    cwd=str(ROOT_DIR / "flick-output" / "remotion"),
                    shell=True,
                    check=True
                )
            else:
                # Cloud render via git push
                print("Staging assets and committing for GitHub Actions cloud render (concurrency=20)...")
                subprocess.run(["git", "add", "flick-output/remotion/"], cwd=str(ROOT_DIR), check=True)
                commit_msg = f"batch {batch_num}: {item['page_slug']}/{item['idea_slug']}/{item['script_slug']}"
                subprocess.run(["git", "commit", "-m", commit_msg], cwd=str(ROOT_DIR))
                commit_hash = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT_DIR), text=True).strip()
                print(f"Pushing to GitHub (origin main, commit {commit_hash[:7]})...")
                subprocess.run(["git", "push", "origin", "main"], cwd=str(ROOT_DIR), check=True)

                # Fetch artifact
                print(f"Waiting for cloud render artifact (commit {commit_hash[:7]})...")
                subprocess.run(["python", "scripts/download_earshot_run.py", commit_hash[:7]], cwd=str(ROOT_DIR), check=True)
                
                # Move downloaded artifact to permanent folder
                downloaded_file = ROOT_DIR / "flick-output" / "final-reel.mp4"
                if downloaded_file.exists():
                    shutil.copy2(str(downloaded_file), str(out_dir / "final-reel.mp4"))
                    print(f"Saved final reel to: {out_dir / 'final-reel.mp4'}")

        item["status"] = "completed"
        item["rendered_at"] = datetime.now().isoformat()

    # 3. Batch complete: Push all 10 videos to F: drive immediately!
    print(f"\n==================================================")
    print(f"🚀 Batch {batch_num} complete! Transferring all 10 videos to F: drive...")
    print(f"==================================================")
    
    F_DRIVE_TARGET.mkdir(parents=True, exist_ok=True)
    for item in batch_items:
        src_folder = ROOT_DIR / item["output_folder"]
        dest_folder = F_DRIVE_TARGET / item["page_slug"] / item["idea_slug"] / item["script_slug"]
        dest_folder.mkdir(parents=True, exist_ok=True)
        
        # Copy audio, manifest, and mp4 if exists
        for file_name in ["full-dialogue.mp3", "audio-manifest.json", "final-reel.mp4"]:
            src_file = src_folder / file_name
            if src_file.exists():
                shutil.copy2(str(src_file), str(dest_folder / file_name))
        
        item["pushed_to_f"] = True
        print(f"✅ Pushed to F: disk -> {dest_folder}")

    with open(MANIFEST_JSON, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    # Update progress.md
    from check_progress import update_progress
    update_progress()
    print(f"\nBatch {batch_num} production & transfer to F: disk completed successfully!\n")

def main():
    parser = argparse.ArgumentParser(description="Run Batch Video Production")
    parser.add_argument("--batch", type=int, default=1, help="Batch number (1-100)")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without heavy renders")
    parser.add_argument("--local", action="store_true", help="Render locally with concurrency 20 instead of cloud")
    args = parser.parse_args()

    run_batch(args.batch, dry_run=args.dry_run, local_render=args.local)

if __name__ == "__main__":
    main()
