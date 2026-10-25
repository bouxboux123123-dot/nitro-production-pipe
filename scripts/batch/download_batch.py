import os
import sys
import json
import zipfile
import io
import shutil
import subprocess
import requests
from pathlib import Path
from datetime import datetime

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

sys.path.append(str(ROOT_DIR / "scripts" / "batch"))
from check_progress import update_progress

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

def download_batch(run_id: int):
    headers = get_github_headers()
    print(f"Fetching artifacts for GitHub Actions Run #{run_id}...")
    
    r_art = requests.get(f"https://api.github.com/repos/{REPO}/actions/runs/{run_id}/artifacts", headers=headers)
    artifacts = r_art.json().get("artifacts", [])
    print(f"Found {len(artifacts)} video artifacts to download.")

    if not CURRENT_BATCH_JSON.exists():
        print("current_batch.json not found!")
        return
    with open(CURRENT_BATCH_JSON, encoding="utf-8") as f:
        targets = json.load(f)

    if not MANIFEST_JSON.exists():
        print("video-manifest.json not found!")
        return
    with open(MANIFEST_JSON, encoding="utf-8") as f:
        manifest = json.load(f)

    F_DRIVE_TARGET.mkdir(parents=True, exist_ok=True)
    downloaded_count = 0

    for art in artifacts:
        art_name = art["name"]
        print(f"\nDownloading: {art_name} ({art['size_in_bytes'] / (1024*1024):.2f} MB)...")
        r_dl = requests.get(art["archive_download_url"], headers=headers, allow_redirects=True)
        z = zipfile.ZipFile(io.BytesIO(r_dl.content))
        
        # Match target
        matching_targets = [t for t in targets if art_name.startswith(t["slug"])]
        if matching_targets:
            t = matching_targets[0]
            local_dest_dir = ROOT_DIR / t["path"]
            local_dest_dir.mkdir(parents=True, exist_ok=True)
            local_dest = local_dest_dir / "final-reel.mp4"
            
            f_dest_dir = F_DRIVE_TARGET / t["page_slug"] / t["idea_slug"] / t["script_slug"]
            f_dest_dir.mkdir(parents=True, exist_ok=True)
            f_dest = f_dest_dir / "final-reel.mp4"
            
            for fname in z.namelist():
                content = z.read(fname)
                with open(local_dest, "wb") as f_out:
                    f_out.write(content)
                with open(f_dest, "wb") as f_out:
                    f_out.write(content)
            
            # Mirror audio and manifest to F:
            local_mp3 = local_dest_dir / "full-dialogue.mp3"
            local_manifest = local_dest_dir / "audio-manifest.json"
            if local_mp3.exists():
                shutil.copy2(str(local_mp3), str(f_dest_dir / "full-dialogue.mp3"))
            if local_manifest.exists():
                shutil.copy2(str(local_manifest), str(f_dest_dir / "audio-manifest.json"))
            
            # Update master manifest entry
            for m in manifest:
                if m["id"] == t["id"]:
                    m["status"] = "completed"
                    m["rendered_at"] = datetime.now().isoformat()
                    m["pushed_to_f"] = True
                    break

            print(f"✅ Video #{t['id']} saved locally -> {local_dest}")
            print(f"🚀 Video #{t['id']} pushed to F: -> {f_dest}")
            downloaded_count += 1

    with open(MANIFEST_JSON, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    update_progress()
    print(f"\n🎉 Successfully downloaded and mirrored all {downloaded_count} videos of Batch 1 to F: disk!")

if __name__ == "__main__":
    run_id = int(sys.argv[1]) if len(sys.argv) > 1 else 40223614741
    download_batch(run_id)
