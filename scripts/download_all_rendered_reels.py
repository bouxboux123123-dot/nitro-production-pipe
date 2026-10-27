import io
import json
import zipfile
import urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

import os
TOKEN = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN", "")
RUN_ID = "40424861442"
DEST_ROOT = Path("F:/creator-berry-renders")

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

opener = urllib.request.build_opener(NoRedirect)

# 1. Fetch artifacts list
url = f"https://api.github.com/repos/bouxboux123123-dot/nitro-production-pipe/actions/runs/{RUN_ID}/artifacts"
req = urllib.request.Request(url, headers={"Authorization": f"Bearer {TOKEN}", "User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode())

artifacts = data.get("artifacts", [])
print(f"Total ready artifacts to download: {len(artifacts)}")

def download_artifact(a):
    name = a["name"]
    art_id = a["id"]
    parts = name.split("-")
    page_dir = f"{parts[2]}-{parts[3]}"
    idea_dir = f"{parts[4]}-{parts[5]}"
    script_dir = f"{parts[6]}-{parts[7]}"
    target_dir = DEST_ROOT / page_dir / idea_dir / script_dir
    target_dir.mkdir(parents=True, exist_ok=True)
    target_mp4 = target_dir / "final-reel.mp4"

    # Get redirect location
    dl_url = f"https://api.github.com/repos/bouxboux123123-dot/nitro-production-pipe/actions/artifacts/{art_id}/zip"
    dl_req = urllib.request.Request(dl_url, headers={"Authorization": f"Bearer {TOKEN}", "User-Agent": "Mozilla/5.0"})
    try:
        opener.open(dl_req)
        loc = None
    except urllib.error.HTTPError as e:
        loc = e.headers.get("Location")

    if not loc:
        print(f"  [ERROR] No redirect location for {name}")
        return False

    print(f"  [STARTING] {name} ({a['size_in_bytes'] / (1024*1024):.1f} MB)...")
    with urllib.request.urlopen(loc) as resp:
        zip_bytes = resp.read()

    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
        for z_name in z.namelist():
            data = z.read(z_name)
            with open(target_mp4, "wb") as f:
                f.write(data)
            print(f"  [SUCCESS] {name} -> {target_mp4} ({len(data)} bytes)")
    return True

with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(download_artifact, artifacts))

print("All downloads finished. Success count:", sum(results), "/", len(artifacts))
