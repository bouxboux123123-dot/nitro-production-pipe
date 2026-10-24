import subprocess
import urllib.request
import json
import time
import zipfile
import io
import sys
from pathlib import Path

RUN_ID = 40105252146
REPO = "bouxboux123123-dot/nitro-production-pipe"

def get_token():
    proc = subprocess.run(
        ["git", "credential", "fill"],
        input="protocol=https\nhost=github.com\n",
        capture_output=True,
        text=True,
        check=True
    )
    for line in proc.stdout.splitlines():
        if line.startswith("password="):
            return line.split("=", 1)[1].strip()
    return None

token = get_token()
if not token:
    print("Could not retrieve GitHub token from git credential helper.")
    sys.exit(1)

headers = {
    "User-Agent": "Python",
    "Authorization": f"Bearer {token}",
    "Accept": "application/vnd.github+json"
}

print(f"Monitoring GitHub Actions Run {RUN_ID} in the cloud...")

while True:
    url = f"https://api.github.com/repos/{REPO}/actions/runs/{RUN_ID}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        run_data = json.loads(resp.read().decode())
    
    status = run_data["status"]
    conclusion = run_data.get("conclusion")
    print(f"Status: {status}, Conclusion: {conclusion}")
    
    if status == "completed":
        if conclusion != "success":
            print(f"Run failed with conclusion: {conclusion}")
            sys.exit(1)
        break
    time.sleep(12)

print("Cloud render completed successfully! Fetching artifacts...")
artifacts_url = f"https://api.github.com/repos/{REPO}/actions/runs/{RUN_ID}/artifacts"
req = urllib.request.Request(artifacts_url, headers=headers)
with urllib.request.urlopen(req) as resp:
    art_data = json.loads(resp.read().decode())

artifacts = art_data.get("artifacts", [])
if not artifacts:
    print("No artifacts found!")
    sys.exit(1)

artifact = artifacts[0]
download_url = artifact["archive_download_url"]
print(f"Downloading artifact {artifact['name']} ({artifact['size_in_bytes']} bytes)...")

dl_req = urllib.request.Request(download_url, headers=headers)
with urllib.request.urlopen(dl_req) as resp:
    zip_bytes = resp.read()

output_dir = Path("flick-output")
scenes_dir = output_dir / "scenes" / "python-stack-frame"
scenes_dir.mkdir(parents=True, exist_ok=True)

with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
    for filename in z.namelist():
        print(f"Extracted: {filename}")
        data = z.read(filename)
        dest = output_dir / "final-reel.mp4"
        with open(dest, "wb") as f:
            f.write(data)
        dest2 = scenes_dir / "python-stack-reel.mp4"
        with open(dest2, "wb") as f:
            f.write(data)

print(f"Successfully saved final reel to: {output_dir / 'final-reel.mp4'}")
