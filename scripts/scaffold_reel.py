import os
import sys
import json
import asyncio
import subprocess
import edge_tts

VOICE = "en-US-ChristopherNeural"

async def generate_speech_for_frame(text, voice, out_wav):
    mp3_tmp = out_wav.replace(".wav", ".mp3")
    comm = edge_tts.Communicate(text, voice, rate="+15%", boundary="WordBoundary")
    words = []
    with open(mp3_tmp, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "id": f"w{len(words)}",
                    "text": chunk["text"],
                    "start": round(chunk["offset"] / 1e7, 3),
                    "end": round((chunk["offset"] + chunk["duration"]) / 1e7, 3)
                })
    
    subprocess.run(["ffmpeg", "-y", "-i", mp3_tmp, "-ar", "48000", "-ac", "2", out_wav],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if os.path.exists(mp3_tmp):
        os.remove(mp3_tmp)
        
    res = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "default=noprint_wrappers=1:nokey=1", out_wav],
                         capture_output=True, text=True, check=True)
    dur = round(float(res.stdout.strip()), 3)
    return dur, words

print("Scaffold tool ready for automated mass reel generation.")
