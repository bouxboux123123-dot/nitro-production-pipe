import json
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(__file__).parent.parent.parent
BATCH_DIR = ROOT_DIR / "scripts" / "batch"
MANIFEST_JSON = BATCH_DIR / "video-manifest.json"
PROGRESS_MD = BATCH_DIR / "progress.md"

def update_progress():
    if not MANIFEST_JSON.exists():
        print("video-manifest.json not found!")
        return

    with open(MANIFEST_JSON, encoding="utf-8") as f:
        manifest = json.load(f)

    total = len(manifest)
    completed = sum(1 for m in manifest if m.get("status") == "completed")
    pending = sum(1 for m in manifest if m.get("status") == "pending")
    in_prod = sum(1 for m in manifest if m.get("status") == "in_production")
    pushed_f = sum(1 for m in manifest if m.get("pushed_to_f"))

    print(f"=== Batch Video Progress ===")
    print(f"Total Videos: {total}")
    print(f"Completed:    {completed} ({(completed/total)*100:.1f}%)")
    print(f"In Prod:      {in_prod}")
    print(f"Pending:      {pending}")
    print(f"Pushed to F:  {pushed_f}")

    # Generate Markdown table
    lines = [
        "# 🎬 1,000-Video Batch Production Progress",
        f"**Last Updated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        f"- **Total Videos**: {total}",
        f"- **Completed Videos**: {completed} / {total} ({(completed/total)*100:.1f}%)",
        f"- **Pushed to F: Disk**: {pushed_f} videos (`F:\\creator-berry-renders`)",
        f"- **Concurrency Setting**: 20 (Cloud GitHub Actions Render)",
        "",
        "## Batch Status Overview (10 Videos / Batch)",
        "",
        "| Batch | Page | Script Idx | Videos Done | Status | Pushed to F: | Completed At |",
        "|---|---|---|---|---|---|---|"
    ]

    # Group into 100 batches of 10
    for b in range(1, 101):
        batch_items = [m for m in manifest if m.get("batch_id") == b]
        if not batch_items:
            # Fallback index mapping if batch_id not explicitly set
            start_idx = (b - 1) * 10
            end_idx = b * 10
            batch_items = manifest[start_idx:end_idx]

        b_done = sum(1 for m in batch_items if m.get("status") == "completed")
        b_f = sum(1 for m in batch_items if m.get("pushed_to_f"))
        page_name = batch_items[0].get("page_slug", f"P{(b-1)%10+1:02d}")
        s_idx = batch_items[0].get("script_slug", f"S{(b-1)//10+1:02d}")

        if b_done == 10:
            status = "✅ Done"
        elif b_done > 0:
            status = "🔄 In Progress"
        else:
            status = "⏳ Pending"

        f_status = "✅ Pushed" if b_f == 10 else ("🔄 Partial" if b_f > 0 else "—")
        completed_at = batch_items[-1].get("rendered_at") or "—"

        lines.append(f"| {b} | {page_name} | {s_idx} | {b_done}/10 | {status} | {f_status} | {completed_at} |")

    PROGRESS_MD.write_text("\n".join(lines), encoding="utf-8")
    print(f"Updated {PROGRESS_MD}")

if __name__ == "__main__":
    update_progress()
