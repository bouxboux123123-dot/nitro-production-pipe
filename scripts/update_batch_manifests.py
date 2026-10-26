import json
from pathlib import Path

base_dir = Path("flick-output/page-01/idea-01")

for i in range(1, 6):
    manifest_path = base_dir / f"script-0{i}" / "audio-manifest.json"
    with open(manifest_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    words = data["words"]
    
    def find_idx(target, start=0):
        for idx in range(start, len(words)):
            w = words[idx]["word"].lower().strip(".,!?:;\"'")
            if w == target.lower():
                return idx
        return -1

    most_idx = find_idx("most")
    t_hook = round(words[most_idx - 1]["end"], 2) if most_idx > 0 else 4.3
    
    manual_idx = find_idx("manually", most_idx)
    t_act1 = round(words[manual_idx]["end"], 2) if manual_idx > 0 else 8.0
    
    focus_idx = find_idx("focus", manual_idx)
    t_act2 = round(words[focus_idx]["end"], 2) if focus_idx > 0 else 12.6
    
    instead_idx = find_idx("instead", focus_idx)
    t_act3 = round(words[instead_idx]["end"], 2) if instead_idx > 0 else 23.5
    
    # Ensure visuals block exists and has exact timings
    if "visuals" not in data or not data["visuals"]:
        data["visuals"] = {}
    
    data["visuals"]["timings"] = {
        "hook": t_hook,
        "act1": t_act1,
        "act2": t_act2,
        "act3": t_act3
    }
    
    # Standardize visuals props to match the perfected video-01 archetype
    if "act1" in data["visuals"] and "props" not in data["visuals"]["act1"]:
        data["visuals"]["act1"]["props"] = {
            "clientName": "Apex Peak Ventures",
            "contractTier": "$4,500/mo Retainer • 24H SOP Active"
        }
    if "act2" in data["visuals"] and "props" not in data["visuals"]["act2"]:
        data["visuals"]["act2"]["props"] = {
            "clientBrand": "Apex Peak Ventures"
        }
    if "act3" in data["visuals"] and "props" not in data["visuals"]["act3"]:
        data["visuals"]["act3"]["props"] = {
            "clientName": "Apex Peak Ventures",
            "contractValue": "$4,500/mo Retainer",
            "channelName": "client-apex-peak"
        }
    if "act4" in data["visuals"]:
        data["visuals"]["act4"]["props"] = {
            "compositeScore": 98,
            "clientName": "Apex Peak Ventures",
            "clientTier": "Full SLA Onboarding Victory"
        }

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        
    print(f"Updated script-0{i}: t_hook={t_hook}s, t_act1={t_act1}s, t_act2={t_act2}s, t_act3={t_act3}s")
