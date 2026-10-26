import os
import sys
import time
import json
import urllib.request
from pathlib import Path

# Force UTF-8 stdout on Windows console
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

REPO_OWNER = "bouxboux123123-dot"
REPO_NAME = "nitro-production-pipe"
DEST_DIR = Path("F:/reels/page-01/idea-01")
RELEASE_URL = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/releases/tags/batch-run-5reels"

def ensure_dest():
    DEST_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[AGENT] Destination active on F: drive -> {DEST_DIR.resolve()}")

def check_and_download_reels(downloaded_set):
    req = urllib.request.Request(RELEASE_URL, headers={"User-Agent": "Antigravity-Agent"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            assets = data.get("assets", [])
            for asset in assets:
                name = asset["name"]
                d_url = asset["browser_download_url"]
                size_mb = round(asset["size"] / (1024 * 1024), 2)
                
                if name not in downloaded_set:
                    dest_file = DEST_DIR / name
                    print(f"\n🚀 [DETECTED NEW REEL FROM CLOUD]: {name} ({size_mb} MB)")
                    print(f"📥 Streaming download directly to F: drive -> {dest_file}...")
                    
                    # Direct stream download
                    urllib.request.urlretrieve(d_url, dest_file)
                    
                    if dest_file.exists() and dest_file.stat().st_size > 1_000_000:
                        print(f"✅ [SUCCESSFULLY SAVED TO F: DRIVE]: {dest_file.name} ({round(dest_file.stat().st_size / (1024*1024), 2)} MB)")
                        downloaded_set.add(name)
                    else:
                        print(f"⚠️ [WARN]: Incomplete download for {name}")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print("[AGENT] Release tag not yet published by GitHub runner. Waiting...")
        else:
            print(f"[AGENT] HTTP error: {e}")
    except Exception as e:
        print(f"[AGENT] Polling error: {e}")

def main():
    print("==========================================================")
    print("🤖 DISPATCH & AUTO-DOWNLOAD AGENT (DIRECT TO F: DRIVE)")
    print(f"Repository: https://github.com/{REPO_OWNER}/{REPO_NAME}")
    print(f"Local Storage: {DEST_DIR.resolve()}")
    print("==========================================================")
    
    ensure_dest()
    downloaded = set()
    
    start_time = time.time()
    while len(downloaded) < 5:
        check_and_download_reels(downloaded)
        elapsed = round(time.time() - start_time)
        print(f"[STATUS] Downloaded {len(downloaded)}/5 reels. (Elapsed: {elapsed}s). Polling again in 12s...", end="\r")
        time.sleep(12)
        
    print("\n\n🎉 ALL 5 REELS COMPLETED AND STORED DIRECTLY IN F:\\ DRIVE!")

if __name__ == "__main__":
    main()
