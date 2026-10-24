import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
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
  // CAMERA SHAKE (2D) & TIGHTENED FLASH
  // -------------------------------------------------------------
  const isCrashing = t >= 14.2 && t <= 16.5;
  const shakeX = isCrashing ? Math.sin(frame * 1.9) * 24 * (1 - (t - 14.2) / 2.3) : 0;
  const shakeY = isCrashing ? Math.cos(frame * 2.3) * 18 * (1 - (t - 14.2) / 2.3) : 0;

  // Punchy 2-frame flash capped at 0.45 opacity (non-blinding)
  const crashFlash = interpolate(t, [14.26, 14.29, 14.36], [0, 0.45, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // V2: CHROMATIC ABERRATION
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
  const dividerHeight = interpolate(t, [18.8, 19.3], [0, 650], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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

  // V13: POLAROID CHAPTER STICKERS (Shifted down to top: 86px to prevent header overlap)
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

      {/* 2-FRAME CONTROLLED FLASH ON CRASH (Non-blinding) */}
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

      {/* V13: POLAROID CHAPTER STICKER (Positioned safely at top: 86px) */}
      {polaroidInfo && (
        <div
          style={{
            position: 'absolute',
            top: 86,
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
              paddingTop: 90,
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

            {/* V12 A/B Split Screen Layout (Expanded to 650px) */}
            <div
              style={{
                width: 980,
                height: 650,
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
                  padding: '28px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  background: 'rgba(20, 20, 30, 0.88)',
                  filter: 'grayscale(0.65)',
                  borderRight: '2px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f38ba8', fontWeight: 900, fontSize: 20 }}>
                  <span>🛑 BEFORE</span>
                  <span style={{ fontSize: 13, background: 'rgba(243,139,168,0.25)', padding: '3px 10px', borderRadius: 8 }}>CRASHES</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 20, lineHeight: 1.6, color: '#a6adc8' }}>
                  <div style={{ color: '#f38ba8', fontWeight: 800 }}>def recurse(node):</div>
                  <div style={{ paddingLeft: 22 }}>if not node: return</div>
                  <div style={{ paddingLeft: 22, color: '#f38ba8' }}>recurse(node.next)</div>
                </div>
                <div style={{ marginTop: 'auto', background: 'rgba(243,139,168,0.18)', border: '1.5px solid #f38ba8', borderRadius: 12, padding: '12px 16px', fontSize: 15, color: '#f38ba8', fontWeight: 800 }}>
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
                  padding: '28px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  background: 'rgba(17, 25, 22, 0.95)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a6e3a1', fontWeight: 900, fontSize: 20 }}>
                  <span>✅ AFTER</span>
                  <span style={{ fontSize: 13, background: 'rgba(166,227,161,0.25)', padding: '3px 10px', borderRadius: 8 }}>HEAP O(1)</span>
                </div>

                <div style={{ fontFamily: 'monospace', fontSize: 20, lineHeight: 1.6, color: '#cdd6f4' }}>
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
                  <div style={{ paddingLeft: 22, color: '#fab387' }}>
                    {getTypedChars(3, 20.2)}
                    {t >= 20.2 && t < 20.7 && cursorBlink && ' █'}
                  </div>
                  <div style={{ paddingLeft: 22, color: '#a6e3a1' }}>
                    {getTypedChars(4, 20.6)}
                    {t >= 20.6 && cursorBlink && ' █'}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', background: 'rgba(166,227,161,0.18)', border: '1.5px solid #a6e3a1', borderRadius: 12, padding: '12px 16px', fontSize: 15, color: '#a6e3a1', fontWeight: 800 }}>
                  🚀 Unlimited memory in heap
                </div>
              </div>
            </div>

            {/* Benefit Badge */}
            <div
              style={{
                background: 'rgba(24, 24, 37, 0.92)',
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

      {/* ---------------- LAYER 2: V10 SUBTITLES WITH EXPLICIT WORD MARGIN ---------------- */}
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
                  marginRight: 16, // Explicit margin to prevent mashed words!
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

      {/* ---------------- LAYER 3: EARSHOT SFX (ALL WRAPPED IN <Sequence>) ---------------- */}
      {/* Primary Voiceover Narration */}
      <Audio src={staticFile('full-dialogue.mp3')} />

      {/* Hook: Glitch & Thump Opener at 0.0s */}
      <Sequence from={f(0.0)} durationInFrames={f(0.35)}>
        <Audio src={staticFile('sounds/thump_whoosh.wav')} volume={0.8} />
      </Sequence>
      <Sequence from={f(0.0)} durationInFrames={f(0.25)}>
        <Audio src={staticFile('sounds/glitch.wav')} volume={0.65} />
      </Sequence>

      {/* Hook: RecursionError Impact Drop at 2.6s */}
      <Sequence from={f(2.6)} durationInFrames={f(0.5)}>
        <Audio src={staticFile('sounds/impact.wav')} volume={0.85} />
      </Sequence>
      <Sequence from={f(2.6)} durationInFrames={f(0.4)}>
        <Audio src={staticFile('sounds/sub_drop.wav')} volume={0.7} />
      </Sequence>

      {/* Hook: Subtext Swish at 4.4s */}
      <Sequence from={f(4.4)} durationInFrames={f(0.25)}>
        <Audio src={staticFile('sounds/swish.wav')} volume={0.5} />
      </Sequence>

      {/* Act 1: Polaroid Shutter & Fast Whoosh at 5.8s */}
      <Sequence from={f(5.8)} durationInFrames={f(0.2)}>
        <Audio src={staticFile('sounds/shutter.wav')} volume={0.7} />
      </Sequence>
      <Sequence from={f(5.8)} durationInFrames={f(0.3)}>
        <Audio src={staticFile('sounds/whoosh_fast.wav')} volume={0.6} />
      </Sequence>

      {/* Act 1: Hairline 3D Stack Lifting Ticks */}
      <Sequence from={f(6.3)} durationInFrames={f(0.08)}>
        <Audio src={staticFile('sounds/hover_tick.wav')} volume={0.5} />
      </Sequence>
      <Sequence from={f(6.7)} durationInFrames={f(0.08)}>
        <Audio src={staticFile('sounds/hover_tick.wav')} volume={0.5} />
      </Sequence>
      <Sequence from={f(7.0)} durationInFrames={f(0.08)}>
        <Audio src={staticFile('sounds/hover_tick.wav')} volume={0.5} />
      </Sequence>

      {/* Act 1: Tooltip Badges (Pops) at 7.2s, 9.2s, 10.6s */}
      <Sequence from={f(7.2)} durationInFrames={f(0.1)}>
        <Audio src={staticFile('sounds/pop.wav')} volume={0.75} />
      </Sequence>
      <Sequence from={f(9.2)} durationInFrames={f(0.1)}>
        <Audio src={staticFile('sounds/pop.wav')} volume={0.75} />
      </Sequence>
      <Sequence from={f(10.6)} durationInFrames={f(0.1)}>
        <Audio src={staticFile('sounds/pop.wav')} volume={0.75} />
      </Sequence>

      {/* Act 1: Takeaway Pill Toggle at 11.5s */}
      <Sequence from={f(11.5)} durationInFrames={f(0.12)}>
        <Audio src={staticFile('sounds/toggle.wav')} volume={0.65} />
      </Sequence>

      {/* Act 1: Collapse Exit Whoosh at 12.2s */}
      <Sequence from={f(12.2)} durationInFrames={f(0.3)}>
        <Audio src={staticFile('sounds/whoosh_fast.wav')} volume={0.55} />
      </Sequence>

      {/* Act 2: Polaroid Shutter & Thump Whoosh Entry at 12.5s */}
      <Sequence from={f(12.5)} durationInFrames={f(0.2)}>
        <Audio src={staticFile('sounds/shutter.wav')} volume={0.7} />
      </Sequence>
      <Sequence from={f(12.5)} durationInFrames={f(0.35)}>
        <Audio src={staticFile('sounds/thump_whoosh.wav')} volume={0.75} />
      </Sequence>

      {/* Act 2: Accelerating Depth Counter Ticks (12.6s - 14.1s) */}
      <Sequence from={f(12.7)} durationInFrames={f(0.06)}>
        <Audio src={staticFile('sounds/hover_tick.wav')} volume={0.4} />
      </Sequence>
      <Sequence from={f(13.1)} durationInFrames={f(0.06)}>
        <Audio src={staticFile('sounds/hover_tick.wav')} volume={0.45} />
      </Sequence>
      <Sequence from={f(13.4)} durationInFrames={f(0.06)}>
        <Audio src={staticFile('sounds/hover_tick.wav')} volume={0.5} />
      </Sequence>
      <Sequence from={f(13.7)} durationInFrames={f(0.06)}>
        <Audio src={staticFile('sounds/hover_tick.wav')} volume={0.55} />
      </Sequence>
      <Sequence from={f(13.9)} durationInFrames={f(0.06)}>
        <Audio src={staticFile('sounds/hover_tick.wav')} volume={0.6} />
      </Sequence>
      <Sequence from={f(14.05)} durationInFrames={f(0.06)}>
        <Audio src={staticFile('sounds/hover_tick.wav')} volume={0.65} />
      </Sequence>

      {/* Act 2: FATAL CRASH MOMENT at 14.2s (Impact + Sub Drop + Glitch) */}
      <Sequence from={f(14.2)} durationInFrames={f(0.6)}>
        <Audio src={staticFile('sounds/impact.wav')} volume={1.0} />
      </Sequence>
      <Sequence from={f(14.2)} durationInFrames={f(0.5)}>
        <Audio src={staticFile('sounds/sub_drop.wav')} volume={0.95} />
      </Sequence>
      <Sequence from={f(14.2)} durationInFrames={f(0.3)}>
        <Audio src={staticFile('sounds/glitch.wav')} volume={0.75} />
      </Sequence>

      {/* Act 2: Error Modal Pop at 14.3s */}
      <Sequence from={f(14.35)} durationInFrames={f(0.12)}>
        <Audio src={staticFile('sounds/pop.wav')} volume={0.7} />
      </Sequence>

      {/* Act 2: Exit Whoosh at 18.5s */}
      <Sequence from={f(18.5)} durationInFrames={f(0.3)}>
        <Audio src={staticFile('sounds/whoosh_fast.wav')} volume={0.6} />
      </Sequence>

      {/* Act 3: Polaroid Shutter & Swish Divider at 18.8s */}
      <Sequence from={f(18.8)} durationInFrames={f(0.2)}>
        <Audio src={staticFile('sounds/shutter.wav')} volume={0.7} />
      </Sequence>
      <Sequence from={f(18.8)} durationInFrames={f(0.25)}>
        <Audio src={staticFile('sounds/swish.wav')} volume={0.6} />
      </Sequence>

      {/* Act 3: Keypress Taps on Code Lines */}
      <Sequence from={f(19.0)} durationInFrames={f(0.08)}>
        <Audio src={staticFile('sounds/keypress.wav')} volume={0.6} />
      </Sequence>
      <Sequence from={f(19.4)} durationInFrames={f(0.08)}>
        <Audio src={staticFile('sounds/keypress.wav')} volume={0.6} />
      </Sequence>
      <Sequence from={f(19.8)} durationInFrames={f(0.08)}>
        <Audio src={staticFile('sounds/keypress.wav')} volume={0.6} />
      </Sequence>
      <Sequence from={f(20.2)} durationInFrames={f(0.08)}>
        <Audio src={staticFile('sounds/keypress.wav')} volume={0.6} />
      </Sequence>
      <Sequence from={f(20.6)} durationInFrames={f(0.08)}>
        <Audio src={staticFile('sounds/keypress.wav')} volume={0.6} />
      </Sequence>

      {/* Act 3: Benefit Latch Toggle at 22.5s */}
      <Sequence from={f(22.5)} durationInFrames={f(0.12)}>
        <Audio src={staticFile('sounds/toggle.wav')} volume={0.7} />
      </Sequence>

      {/* Act 3: Exit Whoosh at 23.7s */}
      <Sequence from={f(23.7)} durationInFrames={f(0.3)}>
        <Audio src={staticFile('sounds/whoosh_fast.wav')} volume={0.6} />
      </Sequence>

      {/* Act 4: Polaroid Shutter & Victory Thump at 24.0s */}
      <Sequence from={f(24.0)} durationInFrames={f(0.2)}>
        <Audio src={staticFile('sounds/shutter.wav')} volume={0.7} />
      </Sequence>
      <Sequence from={f(24.0)} durationInFrames={f(0.35)}>
        <Audio src={staticFile('sounds/thump_whoosh.wav')} volume={0.8} />
      </Sequence>

      {/* Act 4: 5x Faster Headline Impact at 24.2s */}
      <Sequence from={f(24.2)} durationInFrames={f(0.5)}>
        <Audio src={staticFile('sounds/impact.wav')} volume={0.9} />
      </Sequence>
      <Sequence from={f(24.2)} durationInFrames={f(0.4)}>
        <Audio src={staticFile('sounds/sub_drop.wav')} volume={0.85} />
      </Sequence>

      {/* Act 4: Metric Box Taps at 26.0s, 26.15s, 26.3s */}
      <Sequence from={f(26.0)} durationInFrames={f(0.08)}>
        <Audio src={staticFile('sounds/keypress.wav')} volume={0.55} />
      </Sequence>
      <Sequence from={f(26.15)} durationInFrames={f(0.08)}>
        <Audio src={staticFile('sounds/keypress.wav')} volume={0.55} />
      </Sequence>
      <Sequence from={f(26.3)} durationInFrames={f(0.08)}>
        <Audio src={staticFile('sounds/keypress.wav')} volume={0.55} />
      </Sequence>

      {/* Act 4: Deque Bar 100% Toggle at 26.8s */}
      <Sequence from={f(26.8)} durationInFrames={f(0.12)}>
        <Audio src={staticFile('sounds/toggle.wav')} volume={0.75} />
      </Sequence>

      {/* Act 4: Golden Rule Pill Toggle at 27.5s */}
      <Sequence from={f(27.5)} durationInFrames={f(0.15)}>
        <Audio src={staticFile('sounds/toggle.wav')} volume={0.75} />
      </Sequence>
    </AbsoluteFill>
  );
};
