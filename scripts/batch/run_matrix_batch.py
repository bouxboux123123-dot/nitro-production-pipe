import os
import sys
import json
import time
import zipfile
import io
import shutil
import argparse
import subprocess
import requests
from pathlib import Path
from datetime import datetime

# UTF-8 fix for Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = Path(__file__).parent.parent.parent
BATCH_DIR = ROOT_DIR / "scripts" / "batch"
MANIFEST_JSON = BATCH_DIR / "video-manifest.json"
CURRENT_BATCH_JSON = BATCH_DIR / "current_batch.json"
F_DRIVE_TARGET = Path("F:/creator-berry-renders")
REPO = "bouxboux123123-dot/nitro-production-pipe"

sys.path.append(str(ROOT_DIR / "scripts"))
sys.path.append(str(ROOT_DIR / "scripts" / "batch"))
from generate_kokoro_audio import generate_audio
from check_progress import update_progress
from generate_visual_metadata import create_visual_metadata

def get_github_headers():
    proc = subprocess.run(
        ["git", "credential", "fill"],
        input="protocol=https\nhost=github.com\n",
        capture_output=True,
        text=True,
        check=True
    )
    token = [l.split("=", 1)[1].strip() for l in proc.stdout.splitlines() if l.startswith("password=")][0]
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "Python"
    }

def run_matrix_batch(batch_num: int, batch_size: int = 10):
    if not MANIFEST_JSON.exists():
        print("Manifest not found! Run build_manifest.py first.")
        return

    with open(MANIFEST_JSON, encoding="utf-8") as f:
        manifest = json.load(f)

    start_idx = (batch_num - 1) * batch_size
    end_idx = start_idx + batch_size
    batch_items = manifest[start_idx:end_idx]

    if not batch_items:
        print(f"No items found for batch {batch_num}!")
        return

    print(f"\n==================================================")
    print(f"🎬 PARALLEL MATRIX RENDER: Batch {batch_num} ({len(batch_items)} videos)")
    print(f"Range: Videos #{start_idx + 1} to #{end_idx}")
    print(f"Concurrency: Up to 20 Parallel GitHub Cloud Runners")
    print(f"Target F: drive destination: {F_DRIVE_TARGET}")
    print(f"==================================================\n")

    # Step 1: Generate voiceover and timestamps for all pending items in this batch
    targets = []
    for i, item in enumerate(batch_items, start=1):
        vid_id = item["id"]
        out_dir = ROOT_DIR / item["output_folder"]
        out_dir.mkdir(parents=True, exist_ok=True)
        slug = f"v{vid_id:04d}-{item['page_slug']}-{item['idea_slug']}-{item['script_slug']}"
        
        mp3_path = out_dir / "full-dialogue.mp3"
        manifest_path = out_dir / "audio-manifest.json"

        visuals = create_visual_metadata(item["page"], item["idea"], item["hook"])

        # Check if voiceover already generated
        if not mp3_path.exists() or not manifest_path.exists():
            print(f"[{i}/{len(batch_items)}] Generating audio & visual metadata for Video #{vid_id}...")
            generate_audio(item["script_text"], out_dir, remotion_sync=False, visuals=visuals)
        else:
            try:
                manifest_data = json.loads(manifest_path.read_text(encoding="utf-8"))
                manifest_data["visuals"] = visuals
                manifest_path.write_text(json.dumps(manifest_data, indent=2), encoding="utf-8")
                print(f"[{i}/{len(batch_items)}] Updated visual metadata for Video #{vid_id}.")
            except Exception:
                generate_audio(item["script_text"], out_dir, remotion_sync=False, visuals=visuals)

        targets.append({
            "id": vid_id,
            "slug": slug,
            "path": item["output_folder"],
            "page_slug": item["page_slug"],
            "idea_slug": item["idea_slug"],
            "script_slug": item["script_slug"]
        })

    # Step 2: Write current_batch.json
    with open(CURRENT_BATCH_JSON, "w", encoding="utf-8") as f:
        json.dump(targets, f, indent=2)
    print(f"\nWrote parallel target matrix ({len(targets)} videos) to {CURRENT_BATCH_JSON}")

    # Step 3: Git add, commit, and push
    print("\nStaging audio assets, Remotion scenes, and batch matrix...")
    subprocess.run(["git", "add", "flick-output/", "scripts/batch/", ".github/workflows/"], cwd=str(ROOT_DIR), check=True)
    commit_msg = f"batch-matrix {batch_num}: launch {len(targets)} parallel cloud renders"
    subprocess.run(["git", "commit", "-m", commit_msg], cwd=str(ROOT_DIR))
    commit_hash = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT_DIR), text=True).strip()
    
    print(f"Pushing to GitHub (origin main, commit {commit_hash[:7]})...")
    subprocess.run(["git", "push", "origin", "main"], cwd=str(ROOT_DIR), check=True)

    # Step 4: Monitor the parallel matrix workflow run
    headers = get_github_headers()
    print(f"\nWaiting for GitHub Actions Parallel Matrix workflow run...")
    latest_run = None
    for _ in range(25):
        r = requests.get(f"https://api.github.com/repos/{REPO}/actions/runs?per_page=5", headers=headers)
        runs = r.json().get("workflow_runs", [])
        matching = [run for run in runs if run.get("head_commit", {}).get("id", "").startswith(commit_hash[:7]) and run.get("name") == "Remotion Batch Matrix Render"]
        if matching:
            latest_run = matching[0]
            break
        time.sleep(3)

    if not latest_run:
        # Fallback to latest matrix workflow
        matching = [run for run in runs if run.get("name") == "Remotion Batch Matrix Render"]
        if matching:
            latest_run = matching[0]

    if not latest_run:
        print("Could not locate Remotion Batch Matrix Render workflow run!")
        return

    run_id = latest_run["id"]
    print(f"Monitoring Parallel Cloud Render (Run ID: {run_id}, URL: {latest_run.get('html_url')})...")

    start_time = time.time()
    while True:
        r = requests.get(f"https://api.github.com/repos/{REPO}/actions/runs/{run_id}", headers=headers)
        data = r.json()
        status = data.get("status")
        conclusion = data.get("conclusion")
        elapsed = int(time.time() - start_time)
        print(f"[{elapsed}s] Status: {status}, Conclusion: {conclusion}")
        
        if status == "completed":
            if conclusion != "success":
                print(f"Workflow ended with conclusion: {conclusion}")
            break
        time.sleep(15)

    # Step 5: Download all artifacts
    print(f"\nDownloading rendered video artifacts from GitHub Actions...")
    r_art = requests.get(f"https://api.github.com/repos/{REPO}/actions/runs/{run_id}/artifacts", headers=headers)
    artifacts = r_art.json().get("artifacts", [])
    print(f"Found {len(artifacts)} uploaded artifacts.")

    F_DRIVE_TARGET.mkdir(parents=True, exist_ok=True)
    
    for art in artifacts:
        art_name = art["name"]
        print(f"Downloading artifact: {art_name} ({art['size_in_bytes']} bytes)...")
        r_dl = requests.get(art["archive_download_url"], headers=headers, allow_redirects=True)
        z = zipfile.ZipFile(io.BytesIO(r_dl.content))
        
        # Match target by slug prefix
        matching_targets = [t for t in targets if art_name.startswith(t["slug"])]
        if matching_targets:
            t = matching_targets[0]
            local_dest = ROOT_DIR / t["path"] / "final-reel.mp4"
            f_dest_dir = F_DRIVE_TARGET / t["page_slug"] / t["idea_slug"] / t["script_slug"]
            f_dest_dir.mkdir(parents=True, exist_ok=True)
            f_dest = f_dest_dir / "final-reel.mp4"
            
            for fname in z.namelist():
                content = z.read(fname)
                with open(local_dest, "wb") as f_out:
                    f_out.write(content)
                with open(f_dest, "wb") as f_out:
                    f_out.write(content)
            
            # Also mirror audio and manifest to F:
            shutil.copy2(str(ROOT_DIR / t["path"] / "full-dialogue.mp3"), str(f_dest_dir / "full-dialogue.mp3"))
            shutil.copy2(str(ROOT_DIR / t["path"] / "audio-manifest.json"), str(f_dest_dir / "audio-manifest.json"))
            
            # Update manifest
            for m in manifest:
                if m["id"] == t["id"]:
                    m["status"] = "completed"
                    m["rendered_at"] = datetime.now().isoformat()
                    m["pushed_to_f"] = True
                    break

            print(f"✅ Video #{t['id']} downloaded & pushed to F: -> {f_dest}")

    with open(MANIFEST_JSON, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    update_progress()
    print(f"\n🎉 Batch {batch_num} Parallel Matrix Render & F: disk transfer complete!\n")

def main():
    parser = argparse.ArgumentParser(description="Run Parallel Matrix Batch Production")
    parser.add_argument("--batch", type=int, default=1, help="Batch number (1-100)")
    parser.add_argument("--size", type=int, default=10, help="Batch size (e.g. 10 or 20 videos)")
    args = parser.parse_args()

    run_matrix_batch(args.batch, batch_size=args.size)

if __name__ == "__main__":
    main()
