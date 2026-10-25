import requests
import subprocess
import zipfile
import io
import time
import sys
from pathlib import Path

REPO = "bouxboux123123-dot/nitro-production-pipe"

proc = subprocess.run(
    ["git", "credential", "fill"],
    input="protocol=https\nhost=github.com\n",
    capture_output=True,
    text=True,
    check=True
)
token = [l.split("=", 1)[1].strip() for l in proc.stdout.splitlines() if l.startswith("password=")][0]

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/vnd.github+json",
    "User-Agent": "Python"
}

target_commit = sys.argv[1].strip() if len(sys.argv) > 1 else None

print(f"Waiting for workflow run (Target commit: {target_commit or 'latest'})...")
latest_run = None
for _ in range(20):
    runs_resp = requests.get(f"https://api.github.com/repos/{REPO}/actions/runs?per_page=5", headers=headers)
    runs = runs_resp.json().get("workflow_runs", [])
    if runs:
        if target_commit:
            matching = [r for r in runs if r.get("head_commit", {}).get("id", "").startswith(target_commit)]
            if matching:
                latest_run = matching[0]
                break
        else:
            latest_run = runs[0]
            break
    time.sleep(3)

if not latest_run:
    print(f"Could not find workflow run for commit {target_commit}!")
    sys.exit(1)

RUN_ID = latest_run["id"]
print(f"Monitoring Latest Cloud Render (Run ID: {RUN_ID}, Commit: {latest_run.get('head_commit', {}).get('id', '')[:7]})...")

while True:
    r = requests.get(f"https://api.github.com/repos/{REPO}/actions/runs/{RUN_ID}", headers=headers)
    data = r.json()
    status = data.get("status")
    conclusion = data.get("conclusion")
    print(f"Status: {status}, Conclusion: {conclusion}")
    if status == "completed":
        if conclusion != "success":
            print(f"Run failed with conclusion: {conclusion}")
            sys.exit(1)
        break
    time.sleep(15)

print("Cloud render succeeded! Downloading artifact...")
r_art = requests.get(f"https://api.github.com/repos/{REPO}/actions/runs/{RUN_ID}/artifacts", headers=headers)
artifacts = r_art.json().get("artifacts", [])
if not artifacts:
    print("No artifacts found!")
    sys.exit(1)

art = artifacts[0]
print(f"Downloading artifact {art['name']} ({art['size_in_bytes']} bytes)...")
r_dl = requests.get(art["archive_download_url"], headers=headers, allow_redirects=True)

out_dir = Path("flick-output")
out_dir.mkdir(parents=True, exist_ok=True)
scenes_dir = out_dir / "scenes" / "python-stack-frame"
scenes_dir.mkdir(parents=True, exist_ok=True)

z = zipfile.ZipFile(io.BytesIO(r_dl.content))
for name in z.namelist():
    print(f"Extracted from cloud: {name}")
    content = z.read(name)
    with open(out_dir / "final-reel.mp4", "wb") as f:
        f.write(content)
    with open(scenes_dir / "python-stack-reel.mp4", "wb") as f:
        f.write(content)

print("Earshot final reel successfully downloaded to flick-output/final-reel.mp4!")
