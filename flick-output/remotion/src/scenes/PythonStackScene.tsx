import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Video,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { Stack } from '@lucasmarkes/hairline/react';
import manifestData from '../data/audio-manifest.json';

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

// 50 deterministic particles for crash burst
const CRASH_PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  angle: (i / 50) * Math.PI * 2 + ((i * 17) % 7) * 0.1,
  magnitude: 180 + ((i * 37) % 520),
  color: ['#f38ba8', '#f9e2af', '#ffffff', '#ff5555', '#fab387'][i % 5],
  size: 4 + (i % 4) * 3,
  delay: (i % 6) * 0.015,
}));

export const PythonStackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps; // current playback time in seconds
  const f = (sec: number) => Math.round(sec * fps);

  const words = useMemo(() => manifestData.words as WordTimestamp[], []);

  // Subtitle active word
  const activeWordIndex = words.findIndex((w) => t >= w.start && t <= w.end);
  const activeWord = activeWordIndex !== -1 ? words[activeWordIndex] : null;

  // Active word cluster (3 words around active)
  const visiblePhrase = useMemo(() => {
    if (activeWordIndex === -1) {
      const pastIdx = words.findIndex((w) => w.start > t);
      const targetIdx = pastIdx > 0 ? pastIdx - 1 : pastIdx === 0 ? 0 : words.length - 1;
      const start = Math.max(0, targetIdx - 1);
      const end = Math.min(words.length, targetIdx + 2);
      return words.slice(start, end);
    }
    const start = Math.max(0, activeWordIndex - 1);
    const end = Math.min(words.length, activeWordIndex + 2);
    return words.slice(start, end);
  }, [activeWordIndex, words, t]);

  const KEYWORDS = [
    'CRASHED',
    'RECURSIONERROR',
    'STACK',
    'FRAME',
    'FRAMES',
    'MEMORY',
    'DEQUE',
    'HEAP',
    'FASTER',
    'OVERHEAD',
    'PROTECT',
    'HALTS',
  ];

  // -------------------------------------------------------------
  // V7: TOP-OF-SCREEN PROGRESS BAR (0px -> 1080px across 30.0s)
  // -------------------------------------------------------------
  const topProgressWidth = interpolate(t, [0, 30.0], [0, 1080], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // -------------------------------------------------------------
  // V11: CHAPTER MARKER PILLS (Top-Left HUD)
  // -------------------------------------------------------------
  const currentChapter = useMemo(() => {
    if (t < 5.8) return { label: '⚡ HOOK', color: '#ffffff', bg: 'rgba(255,255,255,0.15)' };
    if (t < 12.5) return { label: '🔷 CALL STACK', color: '#74c7ec', bg: 'rgba(116,199,236,0.18)' };
    if (t < 18.8) return { label: '🛑 THE CRASH', color: '#f38ba8', bg: 'rgba(243,139,168,0.22)' };
    if (t < 24.0) return { label: '🚀 THE FIX', color: '#a6e3a1', bg: 'rgba(166,227,161,0.2)' };
    return { label: '⚡ VICTORY', color: '#00e5ff', bg: 'rgba(0,229,255,0.2)' };
  }, [t]);

  // -------------------------------------------------------------
  // BACKGROUND GRADING & VIGNETTE
  // -------------------------------------------------------------
  const bgHue = interpolate(t, [0, 5.8, 12.5, 18.8, 24.0], [0, 200, 350, 155, 195], {
    extrapolateRight: 'clamp',
  });
  const bgSaturate = interpolate(t, [12.5, 14.5, 18.5, 24.0], [1.0, 1.85, 1.15, 1.25], {
    extrapolateRight: 'clamp',
  });
  const bgBlur = interpolate(t, [25.5, 28.5], [0, 8], { extrapolateRight: 'clamp' });

  // -------------------------------------------------------------
  // CAMERA SHAKE (2D) & 1-FRAME FLASH
  // -------------------------------------------------------------
  const isCrashing = t >= 14.2 && t <= 16.5;
  const shakeX = isCrashing ? Math.sin(frame * 1.9) * 24 * (1 - (t - 14.2) / 2.3) : 0;
  const shakeY = isCrashing ? Math.cos(frame * 2.3) * 18 * (1 - (t - 14.2) / 2.3) : 0;

  const crashFlash = interpolate(t, [14.26, 14.30, 14.50], [0, 0.95, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // V2: CHROMATIC ABERRATION (Drop-shadow color split on crash)
  const aberration = interpolate(t, [14.26, 14.35, 16.5], [0, 10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // V5: GLITCH TEXT OFFSET
  const glitchX = (frame % 5 < 2) ? 7 : (frame % 11 < 3) ? -5 : 0;

  // -------------------------------------------------------------
  // V8: 3D PERSPECTIVE TILT
  // -------------------------------------------------------------
  const act1Tilt = interpolate(t, [5.8, 6.3], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act2Tilt = interpolate(t, [12.5, 13.0], [-14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act3Tilt = interpolate(t, [18.8, 19.3], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // -------------------------------------------------------------
  // HOOK ANIMATIONS (0.0s - 5.8s)
  // -------------------------------------------------------------
  const hookLine1Spring = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const hookLine2Spring = spring({ frame: frame - f(2.6), fps, config: { damping: 10, stiffness: 180 } });
  const hookLine3Spring = spring({ frame: frame - f(4.4), fps, config: { damping: 14, stiffness: 120 } });
  const hookExitY = interpolate(t, [5.4, 5.8], [0, -1400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hookOpacity = interpolate(t, [5.4, 5.8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // -------------------------------------------------------------
  // ACT 1: HAIRLINE HERO (5.8s - 12.5s)
  // -------------------------------------------------------------
  const act1Entry = spring({ frame: frame - f(5.8), fps, config: { damping: 14, stiffness: 120 } });
  const act1ExitOpacity = interpolate(t, [12.2, 12.5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act1ExitScale = interpolate(t, [12.2, 12.5], [1, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const hairlineIntensity = interpolate(t, [5.8, 8.5, 12.0], [0.35, 0.75, 1.0], { extrapolateRight: 'clamp' });
  const tag1Pop = spring({ frame: frame - f(7.2), fps, config: { damping: 12 } });
  const tag2Pop = spring({ frame: frame - f(9.2), fps, config: { damping: 12 } });
  const tag3Pop = spring({ frame: frame - f(10.6), fps, config: { damping: 12 } });

  // -------------------------------------------------------------
  // ACT 2: 1000-FRAME CRASH (12.5s - 18.8s)
  // -------------------------------------------------------------
  const act2Entry = spring({ frame: frame - f(12.5), fps, config: { damping: 14, stiffness: 130 } });
  const act2ExitX = interpolate(t, [18.4, 18.8], [0, -1300], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const rawCounter = interpolate(t, [12.6, 14.2], [1, 1000], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (x) => Math.pow(x, 3.8),
  });
  const counterVal = Math.min(1000, Math.round(rawCounter));
  const depthBarWidth = (counterVal / 1000) * 100;

  const errorSlam = spring({
    frame: frame - f(14.3),
    fps,
    config: { damping: 8, stiffness: 240 },
  });

  // V9: SYMBOL REACTION BURSTS
  const burstCrashScale = spring({ frame: frame - f(14.28), fps, config: { damping: 6, stiffness: 280 } });
  const burstCrashOpacity = interpolate(t, [14.28, 14.45, 14.95], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const burstRocketScale = spring({ frame: frame - f(24.0), fps, config: { damping: 7, stiffness: 260 } });
  const burstRocketOpacity = interpolate(t, [24.0, 24.25, 24.8], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // -------------------------------------------------------------
  // ACT 3: V12 A/B SPLIT SCREEN (18.8s - 24.0s)
  // -------------------------------------------------------------
  const act3Entry = spring({ frame: frame - f(18.8), fps, config: { damping: 13, stiffness: 140 } });
  const act3ExitX = interpolate(t, [23.6, 24.0], [0, -1300], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dividerHeight = interpolate(t, [18.8, 19.3], [0, 680], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // V6: Letter-by-letter code typing
  const codeLines = [
    'from collections import deque',
    'stack = deque([root])',
    'while stack:',
    '  node = stack.pop() # O(1)',
    '  stack.extend(node.next)',
  ];

  const getTypedChars = (lineIdx: number, startSec: number) => {
    const chars = Math.round(interpolate(t, [startSec, startSec + 0.45], [0, codeLines[lineIdx].length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }));
    return codeLines[lineIdx].slice(0, chars);
  };

  const cursorBlink = Math.sin(frame * 0.45) > 0;

  // -------------------------------------------------------------
  // ACT 4: 5X BENCHMARK PAYOFF (24.0s - 30.0s)
  // -------------------------------------------------------------
  const act4Entry = spring({ frame: frame - f(24.0), fps, config: { damping: 14, stiffness: 130 } });
  const speedupVal = interpolate(t, [24.2, 26.5], [1.0, 5.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }).toFixed(1);

  const recursionBarFill = interpolate(t, [24.5, 25.8], [0, 22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dequeBarFill = interpolate(t, [24.5, 26.8], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });

  // V13: POLAROID CHAPTER STICKERS (at act boundaries)
  const polaroidInfo = useMemo(() => {
    if (t >= 5.8 && t < 6.8) return { num: 'ACT 01', title: 'Call Stack Allocation', time: '05.8s' };
    if (t >= 12.5 && t < 13.5) return { num: 'ACT 02', title: 'Fatal Limit 1,000', time: '12.5s' };
    if (t >= 18.8 && t < 19.8) return { num: 'ACT 03', title: 'Collections Deque', time: '18.8s' };
    if (t >= 24.0 && t < 25.0) return { num: 'ACT 04', title: '5.0x Benchmark Victory', time: '24.0s' };
    return null;
  }, [t]);

  const polaroidSlide = polaroidInfo
    ? spring({
        frame:
          t < 6.8 ? frame - f(5.8) :
          t < 13.5 ? frame - f(12.5) :
          t < 19.8 ? frame - f(18.8) :
          frame - f(24.0),
        fps,
        config: { damping: 15, stiffness: 180 },
      })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#07080e', overflow: 'hidden' }}>
      {/* ---------------- LAYER 0: Background Video + Color Grading ---------------- */}
      <div
        style={{
          position: 'absolute',
          inset: -30,
          zIndex: 0,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
          filter: `hue-rotate(${bgHue}deg) saturate(${bgSaturate}) blur(${bgBlur}px)`,
        }}
      >
        <Video
          src={staticFile('minecraft_bg.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Dynamic Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              t >= 12.5 && t < 18.8
                ? 'radial-gradient(circle at center, rgba(243, 139, 168, 0.25) 0%, rgba(10, 5, 10, 0.88) 100%)'
                : 'radial-gradient(circle at center, rgba(0, 0, 0, 0.2) 0%, rgba(7, 8, 14, 0.85) 100%)',
          }}
        />
      </div>

      {/* V3: CRT SCAN-LINE OVERLAY (Act 2 Crash) */}
      {t >= 12.4 && t < 18.8 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            pointerEvents: 'none',
            opacity: 0.55,
            background:
              'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0, 0, 0, 0.45) 3px, rgba(0, 0, 0, 0.45) 5px)',
          }}
        />
      )}

      {/* 1-FRAME WHITE FLASH ON CRASH */}
      {crashFlash > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            backgroundColor: '#ffffff',
            opacity: crashFlash,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* V1: 50 PARTICLE BURST (Crash at t=14.28s) */}
      {t >= 14.28 && t < 15.2 && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 60, pointerEvents: 'none' }}>
          {CRASH_PARTICLES.map((p, idx) => {
            const elapsed = t - 14.28 - p.delay;
            if (elapsed < 0) return null;
            const progress = Math.min(1, elapsed / 0.75);
            const dist = p.magnitude * (1 - Math.pow(1 - progress, 3));
            const pOpacity = 1 - progress;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: 540 + Math.cos(p.angle) * dist,
                  top: 380 + Math.sin(p.angle) * dist,
                  width: p.size,
                  height: p.size,
                  borderRadius: '50%',
                  background: p.color,
                  opacity: pOpacity,
                  boxShadow: `0 0 12px ${p.color}`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* V9: SYMBOL REACTION BURSTS */}
      {burstCrashOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 360,
            left: '50%',
            transform: `translateX(-50%) scale(${burstCrashScale * 2.4})`,
            opacity: burstCrashOpacity,
            fontSize: 90,
            zIndex: 70,
            pointerEvents: 'none',
            textShadow: '0 0 40px rgba(243,139,168,0.9)',
          }}
        >
          💥
        </div>
      )}
      {burstRocketOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 340,
            left: '50%',
            transform: `translateX(-50%) scale(${burstRocketScale * 2.2})`,
            opacity: burstRocketOpacity,
            fontSize: 85,
            zIndex: 70,
            pointerEvents: 'none',
            textShadow: '0 0 40px rgba(0,229,255,0.9)',
          }}
        >
          🚀
        </div>
      )}

      {/* V7: TOP-OF-SCREEN PROGRESS BAR */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: topProgressWidth,
          height: 6,
          background: 'linear-gradient(90deg, #74c7ec 0%, #00e5ff 50%, #a6e3a1 100%)',
          zIndex: 80,
          boxShadow: '0 0 12px rgba(0, 229, 255, 0.8)',
        }}
      />

      {/* V11: CHAPTER MARKER PILL (Top-Left HUD) */}
      <div
        style={{
          position: 'absolute',
          top: 26,
          left: 40,
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: currentChapter.bg,
          border: `2px solid ${currentChapter.color}`,
          borderRadius: 40,
          padding: '8px 22px',
          boxShadow: `0 0 20px ${currentChapter.color}40`,
        }}
      >
        <span
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 16,
            fontWeight: 900,
            color: currentChapter.color,
            letterSpacing: '0.08em',
          }}
        >
          {currentChapter.label}
        </span>
      </div>

      {/* V13: POLAROID CHAPTER STICKER (Slides in on act boundary) */}
      {polaroidInfo && (
        <div
          style={{
            position: 'absolute',
            top: 26,
            right: 40,
            transform: `translateX(${(1 - polaroidSlide) * 350}px) rotate(3deg)`,
            background: '#faf6ee',
            border: '3px solid #111',
            borderRadius: 14,
            padding: '10px 18px',
            boxShadow: '0 14px 35px rgba(0,0,0,0.7)',
            zIndex: 85,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 900, color: '#e11d48' }}>
            {polaroidInfo.num} · {polaroidInfo.time}
          </div>
          <div style={{ fontFamily: 'system-ui', fontSize: 16, fontWeight: 900, color: '#0f172a' }}>
            {polaroidInfo.title}
          </div>
        </div>
      )}

      {/* ---------------- LAYER 1: CONTENT WITH V2/V8 WRAPPER ---------------- */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          perspective: 2400,
          filter:
            aberration > 0
              ? `drop-shadow(${aberration}px 0 0 rgba(243,139,168,0.85)) drop-shadow(${-aberration}px 0 0 rgba(0,229,255,0.85))`
              : 'none',
        }}
      >
        {/* ===================== HOOK: 0.0s - 5.8s ===================== */}
        {t < 6.0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 50px',
              gap: 28,
              transform: `translateY(${hookExitY}px)`,
              opacity: hookOpacity,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                transform: `scale(${hookLine1Spring})`,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.35)',
                borderRadius: 50,
                padding: '12px 34px',
                fontFamily: 'system-ui',
                fontSize: 24,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.12em',
              }}
            >
              ⚠️ PYTHON INTERNALS
            </div>

            {/* V5: Glitch Text Headline */}
            <div
              style={{
                transform: `scale(${hookLine1Spring})`,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: 78,
                fontWeight: 900,
                lineHeight: 1.1,
                color: '#ffffff',
                position: 'relative',
              }}
            >
              Your Python App <br />
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: glitchX,
                    top: 0,
                    color: '#f38ba8',
                    opacity: 0.7,
                    textShadow: '0 0 30px rgba(243, 139, 168, 0.9)',
                  }}
                >
                  JUST CRASHED.
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: -glitchX,
                    top: 0,
                    color: '#00e5ff',
                    opacity: 0.6,
                  }}
                >
                  JUST CRASHED.
                </span>
                <span style={{ color: '#f38ba8', position: 'relative', textShadow: '0 0 35px rgba(243, 139, 168, 0.8)' }}>
                  JUST CRASHED.
                </span>
              </div>
            </div>

            {/* V5: Glitch Error Tag */}
            {t >= 2.6 && (
              <div
                style={{
                  transform: `scale(${hookLine2Spring})`,
                  background: 'rgba(243, 139, 168, 0.25)',
                  border: '3px solid #f38ba8',
                  borderRadius: 20,
                  padding: '16px 38px',
                  fontFamily: 'monospace',
                  fontSize: 50,
                  fontWeight: 900,
                  color: '#ffffff',
                  boxShadow: '0 0 45px rgba(243, 139, 168, 0.7)',
                  position: 'relative',
                }}
              >
                <span style={{ position: 'absolute', left: 38 + glitchX, color: '#00e5ff', opacity: 0.5 }}>
                  💥 RecursionError
                </span>
                <span style={{ position: 'relative' }}>💥 RecursionError</span>
              </div>
            )}

            {t >= 4.4 && (
              <div
                style={{
                  transform: `scale(${hookLine3Spring})`,
                  fontFamily: 'system-ui',
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#74c7ec',
                  textShadow: '0 4px 20px rgba(0,0,0,0.9)',
                }}
              >
                Here is exactly why — and the 5× faster fix.
              </div>
            )}
          </div>
        )}

        {/* ===================== ACT 1: HAIRLINE HERO (5.8s - 12.5s) ===================== */}
        {t >= 5.6 && t < 12.8 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 110,
              opacity: act1ExitOpacity,
              transform: `scale(${act1Entry * act1ExitScale}) rotateY(${act1Tilt}deg)`,
            }}
          >
            <div
              style={{
                background: 'rgba(116, 199, 236, 0.18)',
                border: '2px solid #74c7ec',
                borderRadius: 30,
                padding: '10px 30px',
                fontFamily: 'system-ui',
                fontSize: 22,
                fontWeight: 900,
                color: '#89dceb',
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}
            >
              CPYTHON CALL STACK ALLOCATION
            </div>

            <div
              style={{
                fontFamily: 'system-ui',
                fontSize: 46,
                fontWeight: 900,
                color: '#ffffff',
                textAlign: 'center',
                textShadow: '0 4px 20px rgba(0,0,0,0.9)',
                marginBottom: 16,
              }}
            >
              Every Call Pushes a Frame
            </div>

            {/* Massive Hairline 3D Stack */}
            <div style={{ width: 1000, height: 640, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 720, height: 600 }}>
                <Stack theme="dark" intensity={hairlineIntensity} play={true} style={{ width: '100%', height: '100%' }} />
              </div>

              {/* Tooltip Tags */}
              {t >= 7.2 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 70,
                    right: 40,
                    transform: `scale(${Math.max(0, tag1Pop)})`,
                    background: 'rgba(24, 24, 37, 0.95)',
                    border: '2px solid #74c7ec',
                    borderRadius: 16,
                    padding: '14px 24px',
                    fontFamily: 'monospace',
                    fontSize: 22,
                    fontWeight: 900,
                    color: '#89dceb',
                    boxShadow: '0 0 25px rgba(116, 199, 236, 0.4)',
                  }}
                >
                  📦 locals: &#123; n: 42 &#125;
                </div>
              )}

              {t >= 9.2 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 240,
                    left: 30,
                    transform: `scale(${Math.max(0, tag2Pop)})`,
                    background: 'rgba(24, 24, 37, 0.95)',
                    border: '2px solid #f9e2af',
                    borderRadius: 16,
                    padding: '14px 24px',
                    fontFamily: 'monospace',
                    fontSize: 22,
                    fontWeight: 900,
                    color: '#f9e2af',
                    boxShadow: '0 0 25px rgba(249, 226, 175, 0.4)',
                  }}
                >
                  📍 bytecode_ip: 0x7F4A
                </div>
              )}

              {t >= 10.6 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 60,
                    right: 50,
                    transform: `scale(${Math.max(0, tag3Pop)})`,
                    background: 'rgba(24, 24, 37, 0.95)',
                    border: '2px solid #cba6f7',
                    borderRadius: 16,
                    padding: '14px 24px',
                    fontFamily: 'monospace',
                    fontSize: 22,
                    fontWeight: 900,
                    color: '#cba6f7',
                    boxShadow: '0 0 25px rgba(203, 166, 247, 0.4)',
                  }}
                >
                  📚 eval_stack: [arg0]
                </div>
              )}
            </div>

            {/* Takeaway Pill */}
            <div
              style={{
                background: 'rgba(24, 24, 37, 0.92)',
                border: '2px solid rgba(116, 199, 236, 0.4)',
                borderRadius: 20,
                padding: '16px 36px',
                fontFamily: 'system-ui',
                fontSize: 24,
                fontWeight: 800,
                color: '#ffffff',
                boxShadow: '0 12px 30px rgba(0,0,0,0.8)',
              }}
            >
              ⚡ Each frame allocates <span style={{ color: '#00e5ff' }}>heavy CPython struct memory</span>
            </div>
          </div>
        )}

        {/* ===================== ACT 2: 1000-FRAME CRASH (12.5s - 18.8s) ===================== */}
        {t >= 12.3 && t < 19.0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 110,
              transform: `translateX(${act2ExitX}px) scale(${act2Entry}) rotateY(${act2Tilt}deg)`,
            }}
          >
            <div
              style={{
                background: 'rgba(243, 139, 168, 0.2)',
                border: '2px solid #f38ba8',
                borderRadius: 30,
                padding: '10px 30px',
                fontFamily: 'system-ui',
                fontSize: 22,
                fontWeight: 900,
                color: '#f38ba8',
                letterSpacing: '0.08em',
                marginBottom: 14,
              }}
            >
              CALL STACK EXHAUSTION
            </div>

            {/* V4: Odometer Slot Machine Counter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'monospace',
                fontSize: 120,
                fontWeight: 900,
                lineHeight: 1.0,
                color: counterVal >= 1000 ? '#f38ba8' : '#ffffff',
                textShadow: counterVal >= 1000 ? '0 0 50px rgba(243, 139, 168, 0.95)' : '0 8px 30px rgba(0,0,0,0.95)',
                marginBottom: 10,
              }}
            >
              {counterVal}
              <span style={{ fontSize: 44, color: 'rgba(255,255,255,0.6)', marginLeft: 12 }}>/ 1000</span>
            </div>

            {/* Full Width Countdown Progress Bar */}
            <div
              style={{
                width: 960,
                height: 24,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid rgba(243, 139, 168, 0.4)',
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: `${depthBarWidth}%`,
                  height: '100%',
                  background:
                    counterVal >= 1000 ? '#f38ba8' : 'linear-gradient(90deg, #f9e2af 0%, #f38ba8 100%)',
                  boxShadow: '0 0 20px rgba(243, 139, 168, 0.8)',
                }}
              />
            </div>

            {/* Code Snippet Card */}
            <div
              style={{
                width: 960,
                background: 'rgba(17, 17, 27, 0.96)',
                border: '2px solid rgba(243, 139, 168, 0.4)',
                borderRadius: 22,
                padding: '24px 32px',
                fontFamily: 'monospace',
                fontSize: 26,
                lineHeight: 1.6,
                color: '#cdd6f4',
                boxShadow: '0 16px 40px rgba(0,0,0,0.9)',
                marginBottom: 20,
              }}
            >
              <div style={{ color: '#f38ba8', fontWeight: 900 }}>def recurse_tree(node):</div>
              <div style={{ paddingLeft: 36, color: '#89b4fa' }}># Allocates frame #{counterVal}...</div>
              <div style={{ paddingLeft: 36, color: counterVal >= 1000 ? '#f38ba8' : '#fab387', fontWeight: 800 }}>
                return recurse_tree(node.next)
              </div>
            </div>

            {/* Fatal Error Modal Slam */}
            {t >= 14.3 && (
              <div
                style={{
                  width: 960,
                  transform: `scale(${Math.max(0, errorSlam)})`,
                  background: 'rgba(243, 139, 168, 0.22)',
                  border: '3px solid #f38ba8',
                  borderRadius: 22,
                  padding: '24px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  boxShadow: '0 0 50px rgba(243, 139, 168, 0.65)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#f38ba8', fontWeight: 900, fontSize: 26 }}>
                  <span>💥</span>
                  <span>FATAL STACK EXHAUSTION</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 22, color: '#ffffff', fontWeight: 800 }}>
                  RecursionError: maximum recursion depth exceeded
                </div>
                <div style={{ fontFamily: 'system-ui', fontSize: 18, color: '#f9e2af', fontWeight: 600 }}>
                  Python enforces a hard 1,000 call limit to prevent OS stack segmentation faults.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== ACT 3: V12 A/B SPLIT SCREEN (18.8s - 24.0s) ===================== */}
        {t >= 18.6 && t < 24.2 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 100,
              transform: `translateX(${act3ExitX}px) scale(${act3Entry}) rotateY(${act3Tilt}deg)`,
            }}
          >
            <div
              style={{
                background: 'rgba(166, 227, 161, 0.2)',
                border: '2px solid #a6e3a1',
                borderRadius: 30,
                padding: '10px 30px',
                fontFamily: 'system-ui',
                fontSize: 22,
                fontWeight: 900,
                color: '#a6e3a1',
                letterSpacing: '0.08em',
                marginBottom: 16,
              }}
            >
              THE ITERATIVE SOLUTION
            </div>

            {/* V12 A/B Split Screen Layout */}
            <div
              style={{
                width: 980,
                height: 520,
                display: 'flex',
                position: 'relative',
                background: 'rgba(17, 17, 27, 0.94)',
                border: '2px solid rgba(166, 227, 161, 0.4)',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 16px 45px rgba(0,0,0,0.9)',
                marginBottom: 20,
              }}
            >
              {/* Left Side: BEFORE (Old Recursion) */}
              <div
                style={{
                  flex: 1,
                  padding: '24px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  background: 'rgba(20, 20, 30, 0.85)',
                  filter: 'grayscale(0.65)',
                  borderRight: '2px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f38ba8', fontWeight: 900, fontSize: 18 }}>
                  <span>🛑 BEFORE</span>
                  <span style={{ fontSize: 13, background: 'rgba(243,139,168,0.2)', padding: '2px 8px', borderRadius: 6 }}>CRASHES</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 19, lineHeight: 1.5, color: '#a6adc8' }}>
                  <div style={{ color: '#f38ba8' }}>def recurse(node):</div>
                  <div style={{ paddingLeft: 20 }}>if not node: return</div>
                  <div style={{ paddingLeft: 20, color: '#f38ba8' }}>recurse(node.next)</div>
                </div>
                <div style={{ marginTop: 'auto', background: 'rgba(243,139,168,0.15)', border: '1px solid #f38ba8', borderRadius: 10, padding: '8px 12px', fontSize: 14, color: '#f38ba8', fontWeight: 700 }}>
                  ⚠️ Exhausts 1,000 stack frames
                </div>
              </div>

              {/* Vertical Animated Divider */}
              <div
                style={{
                  width: 3,
                  height: dividerHeight,
                  background: 'linear-gradient(to bottom, #00e5ff, #a6e3a1)',
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 15px #00e5ff',
                }}
              />

              {/* Right Side: AFTER (Collections Deque) with V6 typing */}
              <div
                style={{
                  flex: 1,
                  padding: '24px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  background: 'rgba(17, 25, 22, 0.95)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a6e3a1', fontWeight: 900, fontSize: 18 }}>
                  <span>✅ AFTER</span>
                  <span style={{ fontSize: 13, background: 'rgba(166,227,161,0.2)', padding: '2px 8px', borderRadius: 6 }}>HEAP O(1)</span>
                </div>

                <div style={{ fontFamily: 'monospace', fontSize: 19, lineHeight: 1.5, color: '#cdd6f4' }}>
                  <div style={{ color: '#a6e3a1', fontWeight: 800 }}>
                    {getTypedChars(0, 19.0)}
                    {t >= 19.0 && t < 19.5 && cursorBlink && ' █'}
                  </div>
                  <div style={{ color: '#89dceb', marginTop: 4 }}>
                    {getTypedChars(1, 19.4)}
                    {t >= 19.4 && t < 19.9 && cursorBlink && ' █'}
                  </div>
                  <div style={{ color: '#cdd6f4', marginTop: 4 }}>
                    {getTypedChars(2, 19.8)}
                    {t >= 19.8 && t < 20.3 && cursorBlink && ' █'}
                  </div>
                  <div style={{ paddingLeft: 20, color: '#fab387' }}>
                    {getTypedChars(3, 20.2)}
                    {t >= 20.2 && t < 20.7 && cursorBlink && ' █'}
                  </div>
                  <div style={{ paddingLeft: 20, color: '#a6e3a1' }}>
                    {getTypedChars(4, 20.6)}
                    {t >= 20.6 && cursorBlink && ' █'}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', background: 'rgba(166,227,161,0.15)', border: '1px solid #a6e3a1', borderRadius: 10, padding: '8px 12px', fontSize: 14, color: '#a6e3a1', fontWeight: 700 }}>
                  🚀 Unlimited memory in heap
                </div>
              </div>
            </div>

            {/* Benefit Badge */}
            <div
              style={{
                background: 'rgba(24, 24, 37, 0.9)',
                border: '2px solid rgba(166, 227, 161, 0.4)',
                borderRadius: 20,
                padding: '14px 34px',
                fontFamily: 'system-ui',
                fontSize: 22,
                fontWeight: 800,
                color: '#ffffff',
              }}
            >
              🚀 Heap memory scales to millions — <span style={{ color: '#00e5ff' }}>Zero Stack Limit!</span>
            </div>
          </div>
        )}

        {/* ===================== ACT 4: 5X BENCHMARK PAYOFF (24.0s - 30.0s) ===================== */}
        {t >= 23.8 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 100,
              transform: `scale(${act4Entry})`,
            }}
          >
            <div
              style={{
                background: 'rgba(0, 229, 255, 0.2)',
                border: '2px solid #00e5ff',
                borderRadius: 30,
                padding: '10px 32px',
                fontFamily: 'system-ui',
                fontSize: 22,
                fontWeight: 900,
                color: '#00e5ff',
                letterSpacing: '0.08em',
                marginBottom: 14,
              }}
            >
              BENCHMARK VICTORY
            </div>

            {/* Giant Stat Counter */}
            <div
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: 130,
                fontWeight: 900,
                color: '#00e5ff',
                lineHeight: 1.0,
                textShadow: '0 0 50px rgba(0, 229, 255, 0.85), 0 8px 30px rgba(0,0,0,0.95)',
                marginBottom: 14,
              }}
            >
              {speedupVal}× FASTER
            </div>

            {/* Bar Chart Race */}
            <div
              style={{
                width: 960,
                background: 'rgba(17, 17, 27, 0.96)',
                border: '2px solid rgba(0, 229, 255, 0.4)',
                borderRadius: 24,
                padding: '24px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                boxShadow: '0 16px 45px rgba(0,0,0,0.9)',
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'system-ui', fontSize: 18, fontWeight: 800, color: '#f38ba8' }}>
                  <span>Standard Recursion</span>
                  <span>Crash at 1,000 frames (RecursionError)</span>
                </div>
                <div style={{ height: 38, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ width: `${recursionBarFill}%`, height: '100%', background: '#f38ba8', borderRadius: 12 }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'system-ui', fontSize: 18, fontWeight: 800, color: '#a6e3a1' }}>
                  <span>Iterative Deque (Heap)</span>
                  <span>100,000+ items (0.02s · 100% Success)</span>
                </div>
                <div style={{ height: 38, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ width: `${dequeBarFill}%`, height: '100%', background: 'linear-gradient(90deg, #a6e3a1 0%, #00e5ff 100%)', borderRadius: 12 }} />
                </div>
              </div>
            </div>

            {/* Metric Trio */}
            <div style={{ display: 'flex', gap: 16, width: 960, marginBottom: 20 }}>
              <div style={{ flex: 1, background: 'rgba(17, 17, 27, 0.9)', border: '2px solid rgba(0, 229, 255, 0.4)', borderRadius: 20, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontFamily: 'system-ui', color: '#89b4fa', fontWeight: 800 }}>EXECUTION</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: '#00e5ff', marginTop: 4 }}>5× SPEED</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(17, 17, 27, 0.9)', border: '2px solid rgba(166, 227, 161, 0.4)', borderRadius: 20, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontFamily: 'system-ui', color: '#a6e3a1', fontWeight: 800 }}>STACK FRAMES</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: '#a6e3a1', marginTop: 4 }}>ZERO</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(17, 17, 27, 0.9)', border: '2px solid rgba(249, 226, 175, 0.4)', borderRadius: 20, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontFamily: 'system-ui', color: '#f9e2af', fontWeight: 800 }}>CRASH RISK</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: '#f9e2af', marginTop: 4 }}>0%</div>
              </div>
            </div>

            {/* Golden Rule Pill */}
            <div
              style={{
                width: 960,
                background: '#ffffff',
                borderRadius: 20,
                padding: '16px 28px',
                fontFamily: 'system-ui',
                fontSize: 22,
                fontWeight: 900,
                color: '#07080e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 12px 35px rgba(0, 229, 255, 0.4)',
              }}
            >
              <span>💡 Golden Rule: <strong>Never recurse deep trees in Python.</strong></span>
              <span style={{ color: '#0284c7', textTransform: 'uppercase' }}>USE DEQUE</span>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- LAYER 2: V10 WORD KARAOKE SUBTITLES WITH GLOW RIPPLE ---------------- */}
      <div
        style={{
          position: 'absolute',
          bottom: 160,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 40,
          pointerEvents: 'none',
          padding: '0 40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px 20px',
            maxWidth: 1000,
          }}
        >
          {visiblePhrase.map((w, idx) => {
            const isCurrent = activeWord && activeWord.word === w.word && activeWord.start === w.start;
            const cleanUpper = w.word.toUpperCase().replace(/[^A-Z]/g, '');
            const isHighlight = KEYWORDS.some((k) => cleanUpper.includes(k));

            return (
              <span
                key={`${w.word}-${w.start}-${idx}`}
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 900,
                  fontSize: isCurrent ? 56 : 48,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: isHighlight
                    ? '#00e5ff'
                    : isCurrent
                    ? '#ffffff'
                    : 'rgba(255, 255, 255, 0.65)',
                  textShadow: isHighlight
                    ? '0 0 28px rgba(0, 229, 255, 0.95), 0 4px 12px rgba(0,0,0,0.95)'
                    : '0 4px 16px rgba(0, 0, 0, 0.95)',
                  transform: isCurrent ? 'scale(1.12)' : 'scale(1.0)',
                  transition: 'transform 0.06s ease-out',
                  display: 'inline-block',
                  position: 'relative',
                }}
              >
                {/* V10: Active Word Glow Ripple */}
                {isCurrent && (
                  <span
                    style={{
                      position: 'absolute',
                      inset: -8,
                      borderRadius: 16,
                      background: 'rgba(0, 229, 255, 0.15)',
                      boxShadow: '0 0 30px rgba(0, 229, 255, 0.4)',
                      zIndex: -1,
                    }}
                  />
                )}
                {w.word}
              </span>
            );
          })}
        </div>
      </div>

      {/* ---------------- LAYER 3: FRAME-PRECISE SFX AUDIO NODES ---------------- */}
      {/* Primary Voiceover */}
      <Audio src={staticFile('full-dialogue.mp3')} />

      {/* S1: energy.MP3 (Hook headline slam at 0.0s) */}
      {t < 0.8 && (
        <Audio src={staticFile('sounds/energy.MP3')} volume={0.65} />
      )}

      {/* S2: Impact.mp3 (RecursionError tag drop at 2.6s) */}
      {t >= 2.6 && t < 4.7 && (
        <Audio src={staticFile('sounds/Impact.mp3')} volume={0.55} />
      )}

      {/* Subtext transition at 4.4s */}
      {t >= 4.4 && t < 4.9 && (
        <Audio src={staticFile('sounds/transitions.mp3')} volume={0.28} />
      )}

      {/* S11: Zoomin-OR-out.mp3 (Act 1 badge & title entry at 5.8s) */}
      {t >= 5.8 && t < 6.5 && (
        <Audio src={staticFile('sounds/Zoomin-OR-out.mp3')} volume={0.4} />
      )}

      {/* S3: Pop.mp3 x 3 (Act 1 Tooltip Badges) */}
      {t >= 7.2 && t < 8.3 && (
        <Audio src={staticFile('sounds/Pop.mp3')} volume={0.55} />
      )}
      {t >= 9.2 && t < 10.3 && (
        <Audio src={staticFile('sounds/Pop.mp3')} volume={0.55} />
      )}
      {t >= 10.6 && t < 11.7 && (
        <Audio src={staticFile('sounds/Pop.mp3')} volume={0.55} />
      )}

      {/* S8: snap.wav (Act 1 Takeaway pill at 11.5s) */}
      {t >= 11.5 && t < 12.0 && (
        <Audio src={staticFile('sounds/snap.wav')} volume={0.45} />
      )}

      {/* S11: Act 1 collapse exit whoosh at 12.2s */}
      {t >= 12.2 && t < 12.8 && (
        <Audio src={staticFile('sounds/Zoomin-OR-out.mp3')} volume={0.35} />
      )}

      {/* S6: Popups.mp3 (Act 2 badge entry at 12.5s) */}
      {t >= 12.5 && t < 13.5 && (
        <Audio src={staticFile('sounds/Popups.mp3')} volume={0.35} />
      )}

      {/* S4: tick_riser.wav (Accelerating geiger-counter ticks under counter: 12.6s - 14.2s) */}
      {t >= 12.6 && t < 14.3 && (
        <Audio src={staticFile('sounds/tick_riser.wav')} volume={0.35} />
      )}

      {/* S5: Impact.mp3 @ 0.85 (CRASH MOMENT at 14.2s) */}
      {t >= 14.2 && t < 16.3 && (
        <Audio src={staticFile('sounds/Impact.mp3')} volume={0.85} />
      )}

      {/* S6: Popups.mp3 (Fatal Error modal slam at 14.3s) */}
      {t >= 14.3 && t < 15.3 && (
        <Audio src={staticFile('sounds/Popups.mp3')} volume={0.55} />
      )}

      {/* S11: Act 2 exit whoosh at 18.5s */}
      {t >= 18.5 && t < 19.1 && (
        <Audio src={staticFile('sounds/Zoomin-OR-out.mp3')} volume={0.4} />
      )}

      {/* S11: Act 3 entry transition at 18.8s */}
      {t >= 18.8 && t < 19.4 && (
        <Audio src={staticFile('sounds/transitions.mp3')} volume={0.38} />
      )}

      {/* S7: Click.mp3 x 5 (Deque Code Lines typing in Act 3) */}
      {t >= 19.0 && t < 19.38 && (
        <Audio src={staticFile('sounds/Click.mp3')} volume={0.32} />
      )}
      {t >= 19.4 && t < 19.78 && (
        <Audio src={staticFile('sounds/Click.mp3')} volume={0.32} />
      )}
      {t >= 19.8 && t < 20.18 && (
        <Audio src={staticFile('sounds/Click.mp3')} volume={0.32} />
      )}
      {t >= 20.2 && t < 20.58 && (
        <Audio src={staticFile('sounds/Click.mp3')} volume={0.32} />
      )}
      {t >= 20.6 && t < 20.98 && (
        <Audio src={staticFile('sounds/Click.mp3')} volume={0.32} />
      )}

      {/* S8: snap.wav (Benefit badge latch at 22.5s) */}
      {t >= 22.5 && t < 23.0 && (
        <Audio src={staticFile('sounds/snap.wav')} volume={0.5} />
      )}

      {/* S11: Act 3 exit whoosh at 23.7s */}
      {t >= 23.7 && t < 24.3 && (
        <Audio src={staticFile('sounds/Zoomin-OR-out.mp3')} volume={0.38} />
      )}

      {/* S1: energy.MP3 (Act 4 Victory slam at 24.0s) */}
      {t >= 24.0 && t < 24.8 && (
        <Audio src={staticFile('sounds/energy.MP3')} volume={0.6} />
      )}

      {/* S9: metal_hit.wav (5x FASTER counter impact at 24.2s) */}
      {t >= 24.2 && t < 25.0 && (
        <Audio src={staticFile('sounds/metal_hit.wav')} volume={0.65} />
      )}

      {/* S7: Click.mp3 x 3 (Metric Boxes at 26.0s, 26.15s, 26.3s) */}
      {t >= 26.0 && t < 26.15 && (
        <Audio src={staticFile('sounds/Click.mp3')} volume={0.35} />
      )}
      {t >= 26.15 && t < 26.3 && (
        <Audio src={staticFile('sounds/Click.mp3')} volume={0.35} />
      )}
      {t >= 26.3 && t < 26.6 && (
        <Audio src={staticFile('sounds/Click.mp3')} volume={0.35} />
      )}

      {/* S8: snap.wav (Deque bar hits 100% at 26.8s) */}
      {t >= 26.8 && t < 27.3 && (
        <Audio src={staticFile('sounds/snap.wav')} volume={0.6} />
      )}

      {/* S10: system_ping.wav (Golden Rule pill reveal at 27.5s) */}
      {t >= 27.5 && t < 28.3 && (
        <Audio src={staticFile('sounds/system_ping.wav')} volume={0.5} />
      )}
    </AbsoluteFill>
  );
};
