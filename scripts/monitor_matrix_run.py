import os
import urllib.request
import json
import time
from datetime import datetime

RUN_ID = "40441282291"
REPO = "bouxboux123123-dot/nitro-production-pipe"
TOKEN = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN", "")

def check_status():
    url = f"https://api.github.com/repos/{REPO}/actions/runs/{RUN_ID}/jobs?per_page=30"
    headers = {"User-Agent": "Mozilla/5.0"}
    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
    except Exception as e:
        print(f"Error connecting to GitHub API: {e}")
        return

    jobs = data.get("jobs", [])
    total = len(jobs)
    in_progress = [j for j in jobs if j.get("status") == "in_progress"]
    completed = [j for j in jobs if j.get("status") == "completed"]
    queued = [j for j in jobs if j.get("status") == "queued"]
    failed = [j for j in completed if j.get("conclusion") == "failure"]
    success = [j for j in completed if j.get("conclusion") == "success"]

    print("=" * 70)
    print(f"LIVE TELEMETRY: 20 PARALLEL RUNNERS (Run #{RUN_ID})")
    print(f"   Status: {len(in_progress)} RUNNING | {len(completed)} COMPLETED ({len(success)} passed, {len(failed)} failed) | {len(queued)} QUEUED")
    print("=" * 70)

    for j in sorted(jobs, key=lambda x: x.get("name", "")):
        name = j.get("name")
        status = j.get("status").upper()
        conclusion = j.get("conclusion")
        
        # Check current active step
        active_step = "initializing"
        for s in j.get("steps", []):
            if s.get("status") == "in_progress":
                active_step = f"IN_PROGRESS: {s.get('name')}"
                break
            elif s.get("status") == "completed":
                active_step = f"DONE: {s.get('name')}"

        # Time elapsed
        started_at = j.get("started_at")
        elapsed_str = ""
        if started_at:
            try:
                st = datetime.fromisoformat(started_at.replace("Z", "+00:00"))
                el = int((datetime.now(st.tzinfo) - st).total_seconds())
                elapsed_str = f"({el//60}m {el%60}s)"
            except Exception:
                pass

        tag = "[RUNNING]" if status == "IN_PROGRESS" else ("[OK]" if conclusion == "success" else "[FAIL]")
        print(f" {tag:<10} {name:<32} {elapsed_str}")
        for s in j.get("steps", []):
            s_stat = s.get("status")
            s_conc = s.get("conclusion")
            if s_stat == "in_progress" or s_conc == "failure":
                print(f"       -> {s.get('name')}: {s_stat} ({s_conc})")

    print("=" * 70)

if __name__ == "__main__":
    check_status()
