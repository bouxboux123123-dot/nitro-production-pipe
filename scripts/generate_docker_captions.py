import json
import html
from pathlib import Path

META_FILE = Path("videos/docker-container-layers/audio_meta.json")
OUTPUT_FILE = Path("videos/docker-container-layers/compositions/captions.html")

KEYWORDS = {
    "DOCKER", "BUILDS", "INSTANT", "IMMUTABLE", "LAYER", "ARCHITECTURE",
    "DOCKERFILE", "SNAPSHOT", "TARBALL", "SHA-256", "HASH", "CACHE", "REBUILDING",
    "FILESYSTEM", "OVERLAY2", "LOWERDIR", "UNIFIED", "CONTAINER", "UPPERDIR",
    "READ-WRITE", "READ-ONLY", "COPY-ON-WRITE", "ISOLATION", "MEGABYTE"
}

def clean_word(w):
    return "".join(c for c in w if c.isalnum() or c in "-").upper()

def is_keyword(w):
    cleaned = clean_word(w)
    return any(k in cleaned for k in KEYWORDS)

def build_captions():
    with open(META_FILE, "r", encoding="utf-8") as f:
        meta = json.load(f)

    all_words = []
    for sc in meta["scenes"]:
        offset = sc["start_offset"]
        for w in sc["words"]:
            all_words.append({
                "word": w["word"],
                "start": round(offset + w["start"], 3),
                "end": round(offset + w["end"], 3),
                "is_keyword": is_keyword(w["word"])
            })

    # Group into punchy 3-4 word groups
    groups = []
    curr_group = []
    for w in all_words:
        curr_group.append(w)
        # break condition: group has 3-4 words or pause > 0.4s or punctuation
        has_punct = any(p in w["word"] for p in [".", "?", "!", ","])
        if len(curr_group) >= 3 or (len(curr_group) >= 2 and has_punct):
            groups.append(curr_group)
            curr_group = []
    if curr_group:
        groups.append(curr_group)

    # Build HTML
    groups_html = []
    gsap_lines = []

    for g_idx, group in enumerate(groups):
        g_start = group[0]["start"]
        g_end = group[-1]["end"] + 0.1
        g_id = f"cg-{g_idx}"

        words_spans = []
        for w_idx, w in enumerate(group):
            w_id = f"cw-{g_idx}-{w_idx}"
            kw_class = " keyword" if w["is_keyword"] else ""
            escaped = html.escape(w["word"].upper())
            words_spans.append(f'<span id="{w_id}" class="cap-word{kw_class}">{escaped}</span>')

        spans_str = " ".join(words_spans)
        groups_html.append(f'<div id="{g_id}" class="cap-group">{spans_str}</div>')

        # GSAP show group
        gsap_lines.append(f'tl.set("#{g_id}", {{ opacity: 1, scale: 1 }}, {g_start});')

        # GSAP word tracking
        for w_idx, w in enumerate(group):
            w_id = f"cw-{g_idx}-{w_idx}"
            w_start = w["start"]
            w_end = w["end"]
            gsap_lines.append(f'tl.to("#{w_id}", {{ color: "#00E5FF", textShadow: "0 0 16px rgba(0,229,255,0.9)", scale: 1.08, duration: 0.08, overwrite: "auto" }}, {w_start});')
            if w_idx < len(group) - 1:
                next_start = group[w_idx + 1]["start"]
                orig_color = "#00E5FF" if w["is_keyword"] else "#FFFFFF"
                orig_shadow = "0 0 12px rgba(0,229,255,0.6)" if w["is_keyword"] else "0 3px 12px rgba(0,0,0,0.9)"
                gsap_lines.append(f'tl.to("#{w_id}", {{ color: "{orig_color}", textShadow: "{orig_shadow}", scale: 1.0, duration: 0.08, overwrite: "auto" }}, {next_start});')

        # GSAP hide group
        gsap_lines.append(f'tl.set("#{g_id}", {{ opacity: 0, scale: 0.96 }}, {g_end});')

    html_content = f'''<template id="captions-template">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>

<style>
  @font-face {{
    font-family: 'Inter';
    src: url('assets/fonts/Inter-700.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: block;
  }}

  #captions-root {{
    position: absolute;
    inset: 0;
    width: 1080px;
    height: 1920px;
    pointer-events: none;
    display: flex;
    justify-content: center;
  }}

  .caption-stage {{
    position: absolute;
    top: 1300px;
    width: 960px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }}

  .cap-group {{
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px 18px;
    opacity: 0;
    text-align: center;
    transform-origin: center center;
  }}

  .cap-word {{
    display: inline-block;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-weight: 900;
    font-size: 56px;
    line-height: 1.15;
    letter-spacing: 0.03em;
    color: #FFFFFF;
    text-shadow: 0 4px 18px rgba(0, 0, 0, 0.95), 0 2px 6px rgba(0, 0, 0, 0.9);
    padding: 4px 10px;
    border-radius: 8px;
    background: rgba(10, 15, 25, 0.65);
  }}

  .cap-word.keyword {{
    color: #00E5FF;
    text-shadow: 0 0 16px rgba(0, 229, 255, 0.7), 0 3px 12px rgba(0, 0, 0, 0.9);
  }}
</style>

<div id="captions-root" data-composition-id="captions" data-width="1080" data-height="1920">
  <div class="caption-stage">
    {''.join(groups_html)}
  </div>
</div>

<script>
  window.__timelines = window.__timelines || {{}};
  const tl = gsap.timeline({{ paused: true }});
  window.__timelines["captions"] = tl;

  {''.join(gsap_lines)}
</script>
</template>
'''
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Generated captions with {len(groups)} kinetic groups at {OUTPUT_FILE}")

if __name__ == "__main__":
    build_captions()
