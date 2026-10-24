import numpy as np
import scipy.io.wavfile as wav
from pathlib import Path

sounds_dir = Path("flick-output/remotion/public/sounds")
sounds_dir.mkdir(parents=True, exist_ok=True)
sr = 44100

def write_wav(filename, data):
    norm = np.clip(data, -1.0, 1.0)
    wav.write(str(sounds_dir / filename), sr, (norm * 32767).astype(np.int16))
    print(f"Generated Earshot SFX: {filename}")

# 1. sub_drop (45Hz deep sub-bass drop with fast exponential decay, 0.4s)
dur = 0.4
t = np.linspace(0, dur, int(sr * dur), endpoint=False)
freq = np.linspace(65, 32, len(t))
sub = np.sin(2 * np.pi * freq * t) * np.exp(-t * 8.5)
write_wav("sub_drop.wav", sub * 0.95)

# 2. glitch (digital bitcrush stutter burst, 0.25s)
dur = 0.25
t = np.linspace(0, dur, int(sr * dur), endpoint=False)
noise = np.random.uniform(-1, 1, len(t))
stutter = (np.sin(2 * np.pi * 38 * t) > 0).astype(float)
burst = noise * stutter * np.exp(-t * 9)
# Bitcrush
burst = np.round(burst * 7) / 7
write_wav("glitch.wav", burst * 0.75)

# 3. whoosh_fast (sharp air displacement whoosh, 0.3s)
dur = 0.3
t = np.linspace(0, dur, int(sr * dur), endpoint=False)
noise = np.random.randn(len(t))
# Bandpass sweep
env = np.sin(np.pi * (t / dur)) ** 2
# Add modulated tone
mod = np.sin(2 * np.pi * np.linspace(250, 750, len(t)) * t) * 0.2
whoosh = (noise * 0.8 + mod) * env
write_wav("whoosh_fast.wav", whoosh * 0.7)

# 4. thump_whoosh (deep weighted whoosh, 0.35s)
dur = 0.35
t = np.linspace(0, dur, int(sr * dur), endpoint=False)
env = np.sin(np.pi * (t / dur)) ** 1.8
low_sine = np.sin(2 * np.pi * np.linspace(110, 48, len(t)) * t) * 0.7
noise = np.random.randn(len(t)) * 0.3
thump = (low_sine + noise) * env
write_wav("thump_whoosh.wav", thump * 0.85)

# 5. hover_tick (dry, ultra-crisp tick for depth counter, 0.04s)
dur = 0.04
t = np.linspace(0, dur, int(sr * dur), endpoint=False)
tick = np.random.randn(len(t)) * np.exp(-t * 220)
# High-pass filter click
tick = tick * np.sin(2 * np.pi * 2400 * t)
write_wav("hover_tick.wav", tick * 0.8)

# 6. keypress (mechanical keyboard switch tap, 0.06s)
dur = 0.06
t = np.linspace(0, dur, int(sr * dur), endpoint=False)
transient = np.random.randn(len(t)) * np.exp(-t * 140)
body = np.sin(2 * np.pi * 420 * t) * np.exp(-t * 80) * 0.4
keypress = transient + body
write_wav("keypress.wav", keypress * 0.7)

# 7. toggle (crisp mechanical latch toggle, 0.09s)
dur = 0.09
t = np.linspace(0, dur, int(sr * dur), endpoint=False)
# Dual click (switch contact)
c1 = np.random.randn(len(t)) * np.exp(-t * 180)
offset_t = np.maximum(0, t - 0.025)
c2 = np.random.randn(len(t)) * np.exp(-offset_t * 160) * 0.85
toggle = c1 + c2
write_wav("toggle.wav", toggle * 0.75)

# 8. shutter (mechanical dual-click camera shutter snap for Polaroid, 0.12s)
dur = 0.12
t = np.linspace(0, dur, int(sr * dur), endpoint=False)
s1 = np.random.randn(len(t)) * np.exp(-t * 150)
t2 = np.maximum(0, t - 0.045)
s2 = (np.random.randn(len(t)) * 0.9 + np.sin(2 * np.pi * 950 * t) * 0.4) * np.exp(-t2 * 120)
shutter = s1 + s2
write_wav("shutter.wav", shutter * 0.8)

# 9. pop (crisp non-tonal bubble/tag pop, 0.08s)
dur = 0.08
t = np.linspace(0, dur, int(sr * dur), endpoint=False)
f_sweep = np.linspace(1200, 280, len(t))
pop = np.sin(2 * np.pi * f_sweep * t) * np.exp(-t * 70)
noise_p = np.random.randn(len(t)) * np.exp(-t * 120) * 0.3
write_wav("pop.wav", (pop + noise_p) * 0.8)

# 10. impact (dry heavy mechanical slam, 0.5s)
dur = 0.5
t = np.linspace(0, dur, int(sr * dur), endpoint=False)
punch = np.sin(2 * np.pi * np.linspace(140, 40, len(t)) * t) * np.exp(-t * 14)
noise_hit = np.random.randn(len(t)) * np.exp(-t * 35) * 0.5
impact = punch + noise_hit
write_wav("impact.wav", impact * 0.95)

# 11. swish (short high-frequency whoosh, 0.22s)
dur = 0.22
t = np.linspace(0, dur, int(sr * dur), endpoint=False)
env = np.sin(np.pi * (t / dur)) ** 2
swish = np.random.randn(len(t)) * np.sin(2 * np.pi * np.linspace(800, 1900, len(t)) * t) * env
write_wav("swish.wav", swish * 0.65)

print("All Earshot SFX files successfully created.")
