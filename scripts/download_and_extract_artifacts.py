import os
import sys
import io
import json
import zipfile
import subprocess
import urllib.request
from pathlib import Path

TARGET_DIR = Path("F:/creator-berry-renders")
REPO = "bouxboux123123-dot/nitro-production-pipe"
RUN_IDS = ["40350161717", "40353544869"]

def get_github_token():
    proc = subprocess.Popen(
        ["git", "credential", "fill"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    out, _ = proc.communicate("protocol=https\nhost=github.com\n\n")
    for line in out.splitlines():
        if line.startswith("password="):
            return line.split("=", 1)[1].strip()
    return None

class NoAuthRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        new_req = super().redirect_request(req, fp, code, msg, headers, newurl)
        if new_req and "blob.core.windows.net" in newurl:
            if "Authorization" in new_req.headers:
                del new_req.headers["Authorization"]
        return new_req

def download_and_extract_all():
    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    token = get_github_token()
    if not token:
        print("ERROR: Could not retrieve GitHub credentials from git-credential-manager.")
        return

    opener = urllib.request.build_opener(NoAuthRedirectHandler)

    print("=" * 65)
    print(f"DOWNLOADING & UNPACKING ALL ARTIFACTS DIRECTLY TO {TARGET_DIR}")
    print("=" * 65)

    downloaded_artifacts = set()

    for run_id in RUN_IDS:
        url = f"https://api.github.com/repos/{REPO}/actions/runs/{run_id}/artifacts?per_page=100"
        req = urllib.request.Request(
            url,
            headers={"Authorization": f"token {token}", "User-Agent": "Mozilla/5.0"}
        )
        try:
            with opener.open(req) as resp:
                data = json.loads(resp.read().decode())
        except Exception as e:
            print(f"Failed to fetch artifacts for run {run_id}: {e}")
            continue

        artifacts = data.get("artifacts", [])
        print(f"\nProcessing Run #{run_id} ({len(artifacts)} artifacts)...")

        for a in artifacts:
            name = a.get("name")
            if name in downloaded_artifacts:
                continue
            downloaded_artifacts.add(name)

            dl_url = a.get("archive_download_url")
            size_mb = round(a.get("size_in_bytes", 0) / (1024 * 1024), 2)
            print(f"  -> Downloading {name} ({size_mb} MB)...", end=" ", flush=True)

            dl_req = urllib.request.Request(
                dl_url,
                headers={"Authorization": f"token {token}", "User-Agent": "Mozilla/5.0"}
            )
            try:
                # Parse page_slug: voiceovers-page-06-chunk-2 -> page-06
                parts = name.split("-")
                if len(parts) >= 3 and parts[0] == "voiceovers":
                    page_slug = f"{parts[1]}-{parts[2]}"
                else:
                    page_slug = "misc"

                extract_dest = TARGET_DIR / page_slug
                extract_dest.mkdir(parents=True, exist_ok=True)

                with opener.open(dl_req) as dl_resp:
                    zip_bytes = io.BytesIO(dl_resp.read())
                    with zipfile.ZipFile(zip_bytes) as z:
                        z.extractall(extract_dest)
                    print(f"[{page_slug} EXTRACTED OK]")
            except Exception as e:
                print(f"[FAILED: {e}]")

    # Also copy local page-02 chunk 1 if completed
    local_p02 = Path("flick-output/page-02")
    if local_p02.exists():
        print(f"\nSyncing local page-02 renders to {TARGET_DIR}...")
        for p in local_p02.rglob("*"):
            if p.is_file():
                rel = p.relative_to(Path("flick-output"))
                dest = TARGET_DIR / rel
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(p.read_bytes())
        print("[LOCAL SYNC OK]")

    # Count total audio files on F:\
    total_mp3 = list(TARGET_DIR.rglob("full-dialogue.mp3"))
    total_manifests = list(TARGET_DIR.rglob("audio-manifest.json"))
    print("\n" + "=" * 65)
    print(f"TOTAL COMPLETED ON DRIVE F:\\")
    print(f"  * Audio files (full-dialogue.mp3): {len(total_mp3)} / 1,000")
    print(f"  * Timing manifests (audio-manifest.json): {len(total_manifests)} / 1,000")
    print("=" * 65 + "\n")

if __name__ == "__main__":
    download_and_extract_all()
