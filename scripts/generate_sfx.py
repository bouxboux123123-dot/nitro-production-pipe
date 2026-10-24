import numpy as np
import scipy.io.wavfile as wav
from pathlib import Path

sounds_dir = Path("flick-output/remotion/public/sounds")
sounds_dir.mkdir(parents=True, exist_ok=True)
sr = 44100

# SFX-A: Accelerating click train (2.5s, click rate 2Hz -> 40Hz)
dur_a = 2.5
t_a = np.linspace(0, dur_a, int(sr * dur_a), endpoint=False)
rate_a = np.interp(t_a, [0, dur_a], [2, 45])
phase_a = np.cumsum(rate_a / sr)
clicks = (phase_a % 1.0 < 0.005).astype(np.float32) * 0.75
# Add a slight highpass/decay to clicks to make them crisp
wav.write(str(sounds_dir / "tick_riser.wav"), sr, (clicks * 32767).astype(np.int16))

# SFX-B: Dry snap / mechanical latch (0.2s white noise burst with exponential decay)
dur_b = 0.2
t_b = np.linspace(0, dur_b, int(sr * dur_b), endpoint=False)
noise = np.random.randn(len(t_b)).astype(np.float32)
env_b = np.exp(-t_b * 75)
snap = noise * env_b * 0.85
wav.write(str(sounds_dir / "snap.wav"), sr, (snap * 32767).astype(np.int16))

# SFX-C: Metallic mechanical hit (0.6s 120Hz sinusoid with fast exponential decay)
dur_c = 0.6
t_c = np.linspace(0, dur_c, int(sr * dur_c), endpoint=False)
tone_c = (np.sin(2 * np.pi * 120 * t_c) + 0.35 * np.sin(2 * np.pi * 240 * t_c)).astype(np.float32)
env_c = np.exp(-t_c * 20)
metal_hit = tone_c * env_c * 0.9
wav.write(str(sounds_dir / "metal_hit.wav"), sr, (metal_hit * 32767).astype(np.int16))

# SFX-D: Single-tone dry system ping (880Hz single tone, 0.4s)
dur_d = 0.4
t_d = np.linspace(0, dur_d, int(sr * dur_d), endpoint=False)
tone_d = np.sin(2 * np.pi * 880 * t_d).astype(np.float32)
env_d = np.exp(-t_d * 12) * (1 - np.exp(-t_d * 300))
ping = tone_d * env_d * 0.75
wav.write(str(sounds_dir / "system_ping.wav"), sr, (ping * 32767).astype(np.int16))

print("Successfully generated all 4 SFX files:")
print("- tick_riser.wav")
print("- snap.wav")
print("- metal_hit.wav")
print("- system_ping.wav")
