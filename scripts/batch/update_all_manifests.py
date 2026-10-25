import json
from pathlib import Path
from generate_visual_metadata import create_visual_metadata

ROOT_DIR = Path(__file__).parent.parent.parent
MANIFEST_JSON = Path(__file__).parent / "video-manifest.json"

def main():
    print(f"Updating all 1,000 video records with dynamic visual metadata...")
    with open(MANIFEST_JSON, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    for item in manifest:
        visuals = create_visual_metadata(item["page"], item["idea"], item["hook"])
        item["visuals"] = visuals

        # If audio manifest exists on disk, update it too
        out_manifest_path = ROOT_DIR / item["output_folder"] / "audio-manifest.json"
        if out_manifest_path.exists():
            try:
                data = json.loads(out_manifest_path.read_text(encoding="utf-8"))
                data["visuals"] = visuals
                out_manifest_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
            except Exception as e:
                print(f"Failed updating {out_manifest_path}: {e}")

    with open(MANIFEST_JSON, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"Successfully updated all {len(manifest)} manifest records with dynamic visual metadata!")

if __name__ == "__main__":
    main()
