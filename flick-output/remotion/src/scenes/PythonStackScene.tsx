import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { Stack } from '@lucasmarkes/hairline/react';
import * as Primitives from '../components/primitives';
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

export interface PythonStackSceneProps {
  manifest?: any;
  audioFile?: string;
  backgroundVideo?: string;
}

export const PythonStackScene: React.FC<PythonStackSceneProps> = ({
  manifest,
  audioFile = 'full-dialogue.mp3',
  backgroundVideo = 'backgrounds/bg_01.mp4',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps; // current playback time in seconds
  const f = (sec: number) => Math.round(sec * fps);

  const activeManifest = manifest || manifestData;
  const words = useMemo(() => (activeManifest?.words || []) as WordTimestamp[], [activeManifest]);
  const v = useMemo(() => (activeManifest as any)?.visuals || null, [activeManifest]);
  const hookLine1Text = v?.hook?.line1 || 'The biggest bottleneck for scaling an agency is slow client onboarding.';
  const hookWords = useMemo(() => hookLine1Text.split(' '), [hookLine1Text]);

  const Act1Primitive = useMemo(() => {
    const pName = v?.act1?.primitive;
    return pName && (Primitives as any)[pName] ? (Primitives as any)[pName] : null;
  }, [v]);

  const Act2Primitive = useMemo(() => {
    const pName = v?.act2?.primitive;
    return pName && (Primitives as any)[pName] ? (Primitives as any)[pName] : null;
  }, [v]);

  const Act3Primitive = useMemo(() => {
    const pName = v?.act3?.primitive;
    return pName && (Primitives as any)[pName] ? (Primitives as any)[pName] : null;
  }, [v]);

  const Act4Primitive = useMemo(() => {
    const pName = v?.act4?.primitive;
    return pName && (Primitives as any)[pName] ? (Primitives as any)[pName] : null;
  }, [v]);

  // Subtitle active word: active until the next word begins (smooth Submagic style)
  const activeWordIndex = words.findIndex((w, i) => {
    const nextStart = i + 1 < words.length ? words[i + 1].start : w.end + 0.3;
    return t >= w.start && t < nextStart;
  });
  const activeWord = activeWordIndex !== -1 ? words[activeWordIndex] : null;

  // Sentence-aware phrase chunking (keeps subtitles strictly within sentence boundaries)
  const phraseChunks = useMemo(() => {
    const chunks: WordTimestamp[][] = [];
    if (!words || words.length === 0) return chunks;

    // 1. Group words by sentence based on terminal punctuation
    let currentSentence: WordTimestamp[] = [];
    const sentences: WordTimestamp[][] = [];
    for (const w of words) {
      currentSentence.push(w);
      if (/[.!?]$/.test((w.word || '').trim())) {
        sentences.push(currentSentence);
        currentSentence = [];
      }
    }
    if (currentSentence.length > 0) {
      sentences.push(currentSentence);
    }

    // 2. Chunk each sentence independently (max 3 words per chunk)
    const CHUNK_SIZE = 3;
    for (const sent of sentences) {
      for (let i = 0; i < sent.length; i += CHUNK_SIZE) {
        chunks.push(sent.slice(i, i + CHUNK_SIZE));
      }
    }
    return chunks;
  }, [words]);

  const currentChunk = useMemo(() => {
    if (!phraseChunks.length) return [];
    if (activeWord) {
      const match = phraseChunks.find((c) => c.some((w) => w.start === activeWord.start));
      if (match) return match;
    }
    const nextIdx = words.findIndex((w) => w.start > t);
    if (nextIdx > 0) {
      const prevWord = words[nextIdx - 1];
      const match = phraseChunks.find((c) => c.some((w) => w.start === prevWord.start));
      if (match) return match;
    }
    if (nextIdx === 0) return phraseChunks[0];
    return phraseChunks[phraseChunks.length - 1] || [];
  }, [phraseChunks, words, activeWord, t]);

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

  // Dynamic sentence boundaries synchronized to speech
  const sentenceEndTimes = useMemo(() => {
    if (!words || words.length === 0) return [];
    const ends: number[] = [];
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const wordText = (w.word || '').trim();
      const hasPunctuation = /[.!?]$/.test(wordText);
      if (hasPunctuation) {
        // Place transition at the pause midpoint between this sentence end and next sentence start
        const nextStart = i + 1 < words.length ? words[i + 1].start : w.end + 0.4;
        const transitionTime = (w.end + nextStart) / 2;
        ends.push(transitionTime);
      }
    }
    return ends;
  }, [words]);

  const totalDuration = activeManifest?.duration || 30.0;
  const t_hook = v?.timings?.hook ?? sentenceEndTimes[0] ?? (totalDuration * 0.20);
  const t_act1 = Math.max(t_hook + 0.5, v?.timings?.act1 ?? sentenceEndTimes[1] ?? (totalDuration * 0.45));
  const t_act2 = Math.max(t_act1 + 0.5, v?.timings?.act2 ?? sentenceEndTimes[2] ?? (totalDuration * 0.70));
  // Guarantee Act 4 displays cleanly before the video completes
  const rawAct3 = sentenceEndTimes[3] ?? (totalDuration * 0.88);
  const maxAct3 = Math.max(t_act2 + 2.4, totalDuration - 2.8);
  const t_act3 = Math.max(t_act2 + 0.5, v?.timings?.act3 ?? Math.min(rawAct3, maxAct3));

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
    if (t < t_hook) return { label: v?.hook?.chapter || '⚡ HOOK', color: '#ffffff', bg: 'rgba(255,255,255,0.15)' };
    if (t < t_act1) return { label: v?.act1?.chapter || '🔷 THE BOTTLENECK', color: '#74c7ec', bg: 'rgba(116,199,236,0.18)' };
    if (t < t_act2) return { label: v?.act2?.chapter || '🛑 THE CRISIS', color: '#f38ba8', bg: 'rgba(243,139,168,0.22)' };
    if (t < t_act3) return { label: v?.act3?.chapter || '🚀 THE FIX', color: '#a6e3a1', bg: 'rgba(166,227,161,0.2)' };
    return { label: v?.act4?.chapter || '⚡ VICTORY', color: '#00e5ff', bg: 'rgba(0,229,255,0.2)' };
  }, [t, v, t_hook, t_act1, t_act2, t_act3]);

  const act1Duration = Math.max(2.0, t_act1 - t_hook);
  const act2Duration = Math.max(2.0, t_act2 - t_act1);
  const act3Duration = Math.max(2.0, t_act3 - t_act2);
  const crashTime = t_act1 + act2Duration * 0.5;

  // -------------------------------------------------------------
  // CAMERA SHAKE (2D) & TIGHTENED FLASH
  // -------------------------------------------------------------
  const isCrashing = t >= crashTime && t <= crashTime + 1.5;
  const shakeX = isCrashing ? Math.sin(frame * 1.9) * 24 * (1 - (t - crashTime) / 1.5) : 0;
  const shakeY = isCrashing ? Math.cos(frame * 2.3) * 18 * (1 - (t - crashTime) / 1.5) : 0;

  // Punchy 2-frame flash capped at 0.45 opacity (non-blinding)
  const crashFlash = interpolate(t, [crashTime, crashTime + 0.03, crashTime + 0.10], [0, 0.45, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // V2: CHROMATIC ABERRATION
  const aberration = interpolate(t, [crashTime, crashTime + 0.09, crashTime + 1.5], [0, 10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // V5: GLITCH TEXT OFFSET
  const glitchX = (frame % 5 < 2) ? 7 : (frame % 11 < 3) ? -5 : 0;

  // -------------------------------------------------------------
  // V8: 3D PERSPECTIVE TILT
  // -------------------------------------------------------------
  const act1Tilt = interpolate(t, [t_hook, t_hook + 0.5], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act2Tilt = interpolate(t, [t_act1, t_act1 + 0.5], [-14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act3Tilt = interpolate(t, [t_act2, t_act2 + 0.5], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // -------------------------------------------------------------
  // HOOK ANIMATIONS (0.0s - t_hook)
  // -------------------------------------------------------------
  const hookBadgeSpring = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  const line2StartFrame = Math.max(15, f(t_hook * 0.45));
  const hookLine2Spring = spring({ frame: frame - line2StartFrame, fps, config: { damping: 12, stiffness: 220 } });
  const hookExitY = interpolate(t, [t_hook - 0.4, t_hook], [0, -1400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hookOpacity = interpolate(t, [t_hook - 0.4, t_hook], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // -------------------------------------------------------------
  // ACT 1: HAIRLINE HERO (t_hook - t_act1)
  // -------------------------------------------------------------
  const act1Entry = spring({ frame: frame - f(t_hook), fps, config: { damping: 14, stiffness: 120 } });
  const act1ExitOpacity = interpolate(t, [t_act1 - 0.15, t_act1 + 0.15], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act1ExitScale = interpolate(t, [t_act1 - 0.15, t_act1 + 0.15], [1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const act1Mid = (t_hook + t_act1) / 2;
  const hairlineIntensity = interpolate(t, [t_hook, act1Mid, t_act1], [0.35, 0.75, 1.0], { extrapolateRight: 'clamp' });
  const tag1Pop = spring({ frame: frame - f(t_hook + (t_act1 - t_hook) * 0.25), fps, config: { damping: 12 } });
  const tag2Pop = spring({ frame: frame - f(t_hook + (t_act1 - t_hook) * 0.50), fps, config: { damping: 12 } });
  const tag3Pop = spring({ frame: frame - f(t_hook + (t_act1 - t_hook) * 0.75), fps, config: { damping: 12 } });

  // -------------------------------------------------------------
  // ACT 2: 1000-FRAME CRASH (t_act1 - t_act2)
  // -------------------------------------------------------------
  const act2Entry = spring({ frame: frame - f(t_act1), fps, config: { damping: 14, stiffness: 130 } });
  const act2ExitOpacity = interpolate(t, [t_act2 - 0.15, t_act2 + 0.15], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act2ExitX = interpolate(t, [t_act2 - 0.15, t_act2 + 0.15], [0, -350], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const rawCounter = interpolate(t, [t_act1 + 0.1, crashTime], [1, 1000], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (x) => Math.pow(x, 3.8),
  });
  const counterVal = Math.min(1000, Math.round(rawCounter));
  const depthBarWidth = (counterVal / 1000) * 100;

  const errorSlam = spring({
    frame: frame - f(crashTime + 0.05),
    fps,
    config: { damping: 8, stiffness: 240 },
  });

  // V9: SYMBOL REACTION BURSTS
  const burstCrashScale = spring({ frame: frame - f(crashTime + 0.05), fps, config: { damping: 6, stiffness: 280 } });
  const burstCrashOpacity = interpolate(t, [crashTime + 0.05, crashTime + 0.25, crashTime + 0.75], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const burstRocketScale = spring({ frame: frame - f(t_act3), fps, config: { damping: 7, stiffness: 260 } });
  const burstRocketOpacity = interpolate(t, [t_act3, t_act3 + 0.25, t_act3 + 0.8], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // -------------------------------------------------------------
  // ACT 3: V12 A/B SPLIT SCREEN (t_act2 - t_act3)
  // -------------------------------------------------------------
  const act3Entry = spring({ frame: frame - f(t_act2), fps, config: { damping: 13, stiffness: 140 } });
  const act3ExitOpacity = interpolate(t, [t_act3 - 0.15, t_act3 + 0.15], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act3ExitX = interpolate(t, [t_act3 - 0.15, t_act3 + 0.15], [0, -350], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dividerHeight = interpolate(t, [t_act2, t_act2 + 0.5], [0, 650], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // V6: Letter-by-letter code typing
  const codeLines: string[] = useMemo(() => {
    if (v?.act3?.after_lines && Array.isArray(v.act3.after_lines) && v.act3.after_lines.length > 0) {
      return v.act3.after_lines as string[];
    }
    return [
      'from collections import deque',
      'stack = deque([root])',
      'while stack:',
      '  node = stack.pop() # O(1)',
      '  stack.extend(node.next)',
    ];
  }, [v]);

  const getTypedChars = (lineIdx: number, startSec: number) => {
    const line = codeLines[lineIdx] || '';
    const chars = Math.round(interpolate(t, [startSec, startSec + 0.45], [0, line.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }));
    return line.slice(0, chars);
  };

  const cursorBlink = Math.sin(frame * 0.45) > 0;

  // -------------------------------------------------------------
  // ACT 4: 5X BENCHMARK PAYOFF (t_act3 - 30.0s)
  // -------------------------------------------------------------
  const act4Entry = spring({ frame: frame - f(t_act3), fps, config: { damping: 14, stiffness: 130 } });
  const speedupVal = interpolate(t, [t_act3 + 0.2, t_act3 + 2.5], [1.0, 5.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }).toFixed(1);

  const recursionBarFill = interpolate(t, [t_act3 + 0.5, t_act3 + 1.8], [0, 22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dequeBarFill = interpolate(t, [t_act3 + 0.5, t_act3 + 2.8], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });

  // V13: POLAROID CHAPTER STICKERS (Only displayed if explicitly provided in metadata)
  const polaroidInfo = useMemo(() => {
    if (t >= 5.8 && t < 6.8 && v?.act1?.polaroid_title) return { num: 'ACT 01', title: v.act1.polaroid_title, time: '05.8s' };
    if (t >= 12.5 && t < 13.5 && v?.act2?.polaroid_title) return { num: 'ACT 02', title: v.act2.polaroid_title, time: '12.5s' };
    if (t >= 18.8 && t < 19.8 && v?.act3?.polaroid_title) return { num: 'ACT 03', title: v.act3.polaroid_title, time: '18.8s' };
    if (t >= 24.0 && t < 25.0 && v?.act4?.polaroid_title) return { num: 'ACT 04', title: v.act4.polaroid_title, time: '24.0s' };
    return null;
  }, [t, v]);

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
        }}
      >
        <OffthreadVideo
          src={staticFile(backgroundVideo)}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Crisp Edge Vignette: 100% natural, sharp, high-res gameplay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at center, transparent 45%, rgba(7, 8, 14, 0.35) 100%)',
          }}
        />
      </div>

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

      {/* V1: 50 PARTICLE BURST (Crash at crashTime) */}
      {t >= crashTime && t < crashTime + 0.9 && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 60, pointerEvents: 'none' }}>
          {CRASH_PARTICLES.map((p, idx) => {
            const elapsed = t - crashTime - p.delay;
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



      {/* Top progress bar and Chapter pill removed per user instruction for ultra-clean HUD (Production Build) */}

      {/* V13: POLAROID CHAPTER STICKER (Positioned safely at top: 32px, right: 36px) */}
      {polaroidInfo && (
        <div
          style={{
            position: 'absolute',
            top: 32,
            right: 36,
            transform: `translateX(${(1 - polaroidSlide) * 350}px) rotate(3deg)`,
            background: '#faf6ee',
            border: '3px solid #111',
            borderRadius: 14,
            padding: '8px 16px',
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
          <div style={{ fontFamily: 'system-ui', fontSize: 15, fontWeight: 900, color: '#0f172a' }}>
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
        {/* ===================== HOOK: 0.0s - t_hook ===================== */}
        {t < t_hook && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 50px',
              paddingBottom: 110,
              gap: 26,
              transform: `translateY(${hookExitY}px)`,
              opacity: hookOpacity,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                transform: `scale(${hookBadgeSpring})`,
                background: 'rgba(255, 255, 255, 0.12)',
                border: '2px solid rgba(255, 255, 255, 0.45)',
                borderRadius: 50,
                padding: '12px 36px',
                fontFamily: 'system-ui',
                fontSize: 24,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.12em',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.25)',
              }}
            >
              {v?.hook?.badge || '⚡ AGENCY SYSTEMS'}
            </div>

            {/* High-Impact Headline: Whisper-Synchronized Kinetic Word-by-Word Reveal */}
            <div
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: 62,
                fontWeight: 900,
                lineHeight: 1.25,
                color: '#ffffff',
                maxWidth: 960,
                padding: '0 20px',
                textAlign: 'center',
                textShadow: '0 4px 30px rgba(0,0,0,0.95)',
              }}
            >
              {hookWords.map((word, i) => {
                const w = words[i];
                const wordStartFrame = w ? f(w.start) : Math.round(2 + i * 3.5);
                const isRevealed = frame >= wordStartFrame;
                const isCurrent = w
                  ? (t >= w.start && t < (i + 1 < words.length ? words[i + 1].start : w.end + 0.25))
                  : (isRevealed && (frame - wordStartFrame) < 4);
                const wordAge = frame - wordStartFrame;
                const popScale = isCurrent
                  ? interpolate(wordAge, [0, 2, 4], [1.16, 1.05, 1.0], {
                      extrapolateRight: 'clamp',
                    })
                  : 1.0;

                return (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      opacity: isRevealed ? 1 : 0,
                      transform: `scale(${popScale})`,
                      transformOrigin: 'bottom center',
                      color: isCurrent ? '#00e5ff' : '#ffffff',
                      textShadow: isCurrent
                        ? '0 0 20px rgba(0, 229, 255, 0.8), 0 4px 30px rgba(0,0,0,0.95)'
                        : '0 4px 30px rgba(0,0,0,0.95)',
                      marginRight: i < hookWords.length - 1 ? '0.45em' : 0,
                    }}
                  >
                    {word}
                  </span>
                );
              })}

              {v?.hook?.line2 && (
                <div
                  style={{
                    marginTop: 22,
                    opacity: frame >= line2StartFrame ? 1 : 0,
                    transform: `scale(${hookLine2Spring})`,
                    color: '#00e5ff',
                    fontSize: 46,
                    fontWeight: 900,
                    textShadow: '0 0 35px rgba(0, 229, 255, 0.85)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {v.hook.line2}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== ACT 1: HERO (t_hook - t_act1) ===================== */}
        {t >= t_hook && t < t_act1 + 0.15 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 110,
              opacity: act1ExitOpacity,
              transform: `scale(${act1Entry * act1ExitScale}) rotateY(${act1Tilt}deg)`,
            }}
          >
            {Act1Primitive ? (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Sequence from={f(t_hook)} durationInFrames={f(t_act1 - t_hook)} layout="none">
                  <Act1Primitive {...(v?.act1?.props || {})} />
                </Sequence>
              </div>
            ) : (
              <>
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
              {v?.act1?.badge || 'CPYTHON CALL STACK ALLOCATION'}
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
              {v?.act1?.title || 'Every Call Pushes a Frame'}
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
                  {v?.act1?.tag1 || '📦 locals: { n: 42 }'}
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
                  {v?.act1?.tag2 || '📍 bytecode_ip: 0x7F4A'}
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
                  {v?.act1?.tag3 || '📚 eval_stack: [arg0]'}
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
              {v?.act1?.takeaway ? (
                <span>{v.act1.takeaway}</span>
              ) : (
                <span>⚡ Each frame allocates <span style={{ color: '#00e5ff' }}>heavy CPython struct memory</span></span>
              )}
            </div>
              </>
            )}
          </div>
        )}

        {/* ===================== ACT 2: 1000-FRAME CRASH (t_act1 - t_act2) ===================== */}
        {t >= t_act1 && t < t_act2 + 0.15 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 110,
              opacity: act2ExitOpacity,
              transform: `translateX(${act2ExitX}px) scale(${act2Entry}) rotateY(${act2Tilt}deg)`,
            }}
          >
            {Act2Primitive ? (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Sequence from={f(t_act1)} durationInFrames={f(t_act2 - t_act1)} layout="none">
                  <Act2Primitive {...(v?.act2?.props || {})} />
                </Sequence>
              </div>
            ) : (
              <>
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
              {v?.act2?.badge || 'CALL STACK EXHAUSTION'}
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
              <span style={{ fontSize: 44, color: 'rgba(255,255,255,0.6)', marginLeft: 12 }}>{v?.act2?.counter_unit || '/ 1000'}</span>
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
              <div style={{ color: '#f38ba8', fontWeight: 900 }}>{v?.act2?.code_line1 || 'def recurse_tree(node):'}</div>
              <div style={{ paddingLeft: 36, color: '#89b4fa' }}>{v?.act2?.code_line2 ? `${v.act2.code_line2} #${counterVal}...` : `# Allocates frame #${counterVal}...`}</div>
              <div style={{ paddingLeft: 36, color: counterVal >= 1000 ? '#f38ba8' : '#fab387', fontWeight: 800 }}>
                {v?.act2?.code_line3 || 'return recurse_tree(node.next)'}
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
                  <span>{v?.act2?.error_title || 'FATAL STACK EXHAUSTION'}</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 22, color: '#ffffff', fontWeight: 800 }}>
                  {v?.act2?.error_sub || 'RecursionError: maximum recursion depth exceeded'}
                </div>
                <div style={{ fontFamily: 'system-ui', fontSize: 18, color: '#f9e2af', fontWeight: 600 }}>
                  {v?.act2?.error_desc || 'Python enforces a hard 1,000 call limit to prevent OS stack segmentation faults.'}
                </div>
              </div>
            )}
              </>
            )}
          </div>
        )}

        {/* ===================== ACT 3: V12 A/B SPLIT SCREEN (t_act2 - t_act3) ===================== */}
        {t >= t_act2 && t < t_act3 + 0.15 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 110,
              opacity: act3ExitOpacity,
              transform: `translateX(${act3ExitX}px) scale(${act3Entry}) rotateY(${act3Tilt}deg)`,
            }}
          >
            {Act3Primitive ? (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Sequence from={f(t_act2)} durationInFrames={f(t_act3 - t_act2)} layout="none">
                  <Act3Primitive {...(v?.act3?.props || {})} />
                </Sequence>
              </div>
            ) : (
              <>
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
              {v?.act3?.badge || 'THE ITERATIVE SOLUTION'}
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
                  <span>{v?.act3?.before_title || '🛑 BEFORE'}</span>
                  <span style={{ fontSize: 13, background: 'rgba(243,139,168,0.25)', padding: '3px 10px', borderRadius: 8 }}>{v?.act3?.before_tag || 'CRASHES'}</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 20, lineHeight: 1.6, color: '#a6adc8' }}>
                  {(v?.act3?.before_lines || ['def recurse(node):', '  if not node: return', '  recurse(node.next)']).map((line: string, idx: number) => (
                    <div key={idx} style={{ color: idx === 0 || idx === 2 ? '#f38ba8' : '#a6adc8', paddingLeft: idx > 0 ? 22 : 0 }}>
                      {line}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 'auto', background: 'rgba(243,139,168,0.18)', border: '1.5px solid #f38ba8', borderRadius: 12, padding: '12px 16px', fontSize: 15, color: '#f38ba8', fontWeight: 800 }}>
                  {v?.act3?.before_footer || '⚠️ Exhausts 1,000 stack frames'}
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
                  <span>{v?.act3?.after_title || '✅ AFTER'}</span>
                  <span style={{ fontSize: 13, background: 'rgba(166,227,161,0.25)', padding: '3px 10px', borderRadius: 8 }}>{v?.act3?.after_tag || 'HEAP O(1)'}</span>
                </div>

                <div style={{ fontFamily: 'monospace', fontSize: 20, lineHeight: 1.6, color: '#cdd6f4' }}>
                  {codeLines.map((line: string, idx: number) => {
                    const startT = 19.0 + idx * 0.4;
                    const endT = startT + 0.5;
                    const isLast = idx === codeLines.length - 1;
                    return (
                      <div key={idx} style={{ color: idx === 0 || isLast ? '#a6e3a1' : idx === 1 ? '#89dceb' : '#cdd6f4', marginTop: idx > 0 ? 4 : 0, paddingLeft: idx >= 3 ? 22 : 0 }}>
                        {getTypedChars(idx, startT)}
                        {t >= startT && t < endT && cursorBlink && ' █'}
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: 'auto', background: 'rgba(166,227,161,0.18)', border: '1.5px solid #a6e3a1', borderRadius: 12, padding: '12px 16px', fontSize: 15, color: '#a6e3a1', fontWeight: 800 }}>
                  {v?.act3?.after_footer || '🚀 Unlimited memory in heap'}
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
              {v?.act3?.benefit ? (
                <span>{v.act3.benefit}</span>
              ) : (
                <span>🚀 Heap memory scales to millions — <span style={{ color: '#00e5ff' }}>Zero Stack Limit!</span></span>
              )}
            </div>
              </>
            )}
          </div>
        )}

        {/* ===================== ACT 4: 5X BENCHMARK PAYOFF (t_act3 - 30.0s) ===================== */}
        {t >= t_act3 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 110,
              transform: `scale(${act4Entry})`,
            }}
          >
            {Act4Primitive ? (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Sequence from={f(t_act3)} durationInFrames={f(totalDuration - t_act3)} layout="none">
                  <Act4Primitive {...(v?.act4?.props || {})} />
                </Sequence>
              </div>
            ) : (
              <>
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
              {v?.act4?.badge || 'BENCHMARK VICTORY'}
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
              {v?.act4?.speedup_val || speedupVal}× {v?.act4?.speedup_label || 'FASTER'}
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
                  <span>{v?.act4?.bar2_label || 'Standard Recursion'}</span>
                  <span>{v?.act4?.bar2_desc || 'Crash at 1,000 frames (RecursionError)'}</span>
                </div>
                <div style={{ height: 38, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ width: `${recursionBarFill}%`, height: '100%', background: '#f38ba8', borderRadius: 12 }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'system-ui', fontSize: 18, fontWeight: 800, color: '#a6e3a1' }}>
                  <span>{v?.act4?.bar1_label || 'Iterative Deque (Heap)'}</span>
                  <span>{v?.act4?.bar1_desc || '100,000+ items (0.02s · 100% Success)'}</span>
                </div>
                <div style={{ height: 38, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ width: `${dequeBarFill}%`, height: '100%', background: 'linear-gradient(90deg, #a6e3a1 0%, #00e5ff 100%)', borderRadius: 12 }} />
                </div>
              </div>
            </div>

            {/* Metric Trio */}
            <div style={{ display: 'flex', gap: 16, width: 960, marginBottom: 20 }}>
              <div style={{ flex: 1, background: 'rgba(17, 17, 27, 0.9)', border: '2px solid rgba(0, 229, 255, 0.4)', borderRadius: 20, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontFamily: 'system-ui', color: '#89b4fa', fontWeight: 800 }}>{v?.act4?.stat1_title || 'EXECUTION'}</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: '#00e5ff', marginTop: 4 }}>{v?.act4?.stat1_val || '5× SPEED'}</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(17, 17, 27, 0.9)', border: '2px solid rgba(166, 227, 161, 0.4)', borderRadius: 20, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontFamily: 'system-ui', color: '#a6e3a1', fontWeight: 800 }}>{v?.act4?.stat2_title || 'STACK FRAMES'}</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: '#a6e3a1', marginTop: 4 }}>{v?.act4?.stat2_val || 'ZERO'}</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(17, 17, 27, 0.9)', border: '2px solid rgba(249, 226, 175, 0.4)', borderRadius: 20, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontFamily: 'system-ui', color: '#f9e2af', fontWeight: 800 }}>{v?.act4?.stat3_title || 'CRASH RISK'}</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: '#f9e2af', marginTop: 4 }}>{v?.act4?.stat3_val || '0%'}</div>
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
              <span>{v?.act4?.rule || '💡 Golden Rule: Never recurse deep trees in Python.'}</span>
              <span style={{ color: '#0284c7', textTransform: 'uppercase' }}>{v?.act4?.speedup_label || 'USE DEQUE'}</span>
            </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ---------------- LAYER 2: SUBMAGIC NEON PILL CAPTIONS ---------------- */}
      {t >= t_hook && (
        <div
          style={{
            position: 'absolute',
            bottom: 140,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 90,
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
              gap: '14px 18px',
              maxWidth: 960,
            }}
          >
            {currentChunk.map((w, idx) => {
              const isCurrent = activeWord ? activeWord.start === w.start : false;
              const wordAge = frame - f(w.start);
              const pop = isCurrent
                ? spring({ frame: wordAge, fps, config: { damping: 11, stiffness: 220 } })
                : 1.0;
              const scale = isCurrent ? interpolate(pop, [0, 1], [0.92, 1.10]) : 1.0;

              return (
                <div
                  key={`${w.word}-${w.start}-${idx}`}
                  style={{
                    background: isCurrent ? '#00e5ff' : 'rgba(10, 15, 30, 0.78)',
                    backdropFilter: 'blur(8px)',
                    color: isCurrent ? '#030712' : '#ffffff',
                    border: isCurrent
                      ? '2px solid #ffffff'
                      : '1px solid rgba(255, 255, 255, 0.22)',
                    borderRadius: 18,
                    padding: '10px 22px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 900,
                    fontSize: 50,
                    textTransform: 'uppercase',
                    boxShadow: isCurrent
                      ? '0 0 45px rgba(0, 229, 255, 0.95), 0 8px 25px rgba(0, 0, 0, 0.85)'
                      : '0 4px 16px rgba(0, 0, 0, 0.6)',
                    transform: `scale(${scale})`,
                    display: 'inline-block',
                    letterSpacing: '0.04em',
                  }}
                >
                  {w.word}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- LAYER 3: MINIMAL ACOUSTIC SOUND SET ---------------- */}
      {/* Primary Voiceover Narration */}
      <Audio src={staticFile(audioFile)} volume={1.0} />

      {/* Subtitle Word Transition Ticks (Subtle micro-click whenever active word changes) */}
      {words.map((w, i) => (
        <Sequence
          key={`sub-tick-${i}-${w.word}`}
          from={f(w.start)}
          durationInFrames={4}
        >
          <Audio src={staticFile('sounds/Click.mp3')} volume={0.14} />
        </Sequence>
      ))}

      {/* Hook Rapid Kinetic Word Clicks */}
      {hookWords.map((_, i) => {
        const clickFrame = Math.round(2 + i * 3.5);
        return (
          <Sequence
            key={`hook-click-${i}`}
            from={clickFrame}
            durationInFrames={5}
          >
            <Audio src={staticFile('sounds/Click.mp3')} volume={0.16} />
          </Sequence>
        );
      })}
      {v?.hook?.line2 && (
        <Sequence from={45} durationInFrames={6}>
          <Audio src={staticFile('sounds/Click.mp3')} volume={0.24} />
        </Sequence>
      )}

      {/* Subtle UI Clicks for Act Transitions & Milestones */}
      <Sequence from={f(8.5)} durationInFrames={f(0.35)}>
        <Audio src={staticFile('sounds/Click.mp3')} volume={0.18} />
      </Sequence>
      <Sequence from={f(14.3)} durationInFrames={f(0.35)}>
        <Audio src={staticFile('sounds/Click.mp3')} volume={0.20} />
      </Sequence>
      <Sequence from={f(19.0)} durationInFrames={f(0.35)}>
        <Audio src={staticFile('sounds/Click.mp3')} volume={0.18} />
      </Sequence>
      <Sequence from={f(24.2)} durationInFrames={f(0.35)}>
        <Audio src={staticFile('sounds/Click.mp3')} volume={0.20} />
      </Sequence>

      {/* Subtle Transition Whooshes (Phase-locked to dynamic act transitions, gentle volume 0.22) */}
      <Sequence from={f(t_hook)} durationInFrames={f(0.35)}>
        <Audio src={staticFile('sounds/transitions.mp3')} volume={0.22} />
      </Sequence>
      <Sequence from={f(t_act1)} durationInFrames={f(0.35)}>
        <Audio src={staticFile('sounds/transitions.mp3')} volume={0.22} />
      </Sequence>
      <Sequence from={f(t_act2)} durationInFrames={f(0.35)}>
        <Audio src={staticFile('sounds/transitions.mp3')} volume={0.22} />
      </Sequence>
      <Sequence from={f(t_act3)} durationInFrames={f(0.35)}>
        <Audio src={staticFile('sounds/transitions.mp3')} volume={0.22} />
      </Sequence>
    </AbsoluteFill>
  );
};
