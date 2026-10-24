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

export const PythonStackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps; // current playback time in seconds

  const words = useMemo(() => manifestData.words as WordTimestamp[], []);

  // Find active word for karaoke subtitles
  const activeWordIndex = words.findIndex((w) => t >= w.start && t <= w.end);
  const activeWord = activeWordIndex !== -1 ? words[activeWordIndex] : null;

  // Active phrase (cluster of ~3 words around current word for context)
  const visiblePhrase = useMemo(() => {
    if (activeWordIndex === -1) {
      // Find the last spoken word or upcoming
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
  // TIMINGS (Total: 30.0s / 900 frames)
  // Hook: 0.0s - 5.8s ("Your Python app just crashed... RecursionError")
  // Act 1: 5.8s - 12.5s (The Call Stack Frame Allocation)
  // Act 2: 12.5s - 18.8s (The 1000-Frame Fatal Crash)
  // Act 3: 18.8s - 24.0s (The Deque Solution)
  // Act 4: 24.0s - 30.0s (The 5x Benchmark Payoff & Golden Rule)
  // -------------------------------------------------------------

  // --- BACKGROUND COLOR GRADE & VIGNETTE ---
  const bgHue = interpolate(t, [0, 5.8, 12.5, 18.8, 24.0], [0, 200, 350, 160, 190], {
    extrapolateRight: 'clamp',
  });
  const bgSaturate = interpolate(t, [12.5, 14.5, 18.5, 24.0], [1.0, 1.8, 1.1, 1.2], {
    extrapolateRight: 'clamp',
  });
  const bgBlur = interpolate(t, [26.0, 28.5], [0, 8], {
    extrapolateRight: 'clamp',
  });

  // --- CAMERA SHAKE (2D: X + Y) ---
  const isCrashing = t >= 14.2 && t <= 16.5;
  const shakeX = isCrashing ? Math.sin(frame * 1.9) * 22 * (1 - (t - 14.2) / 2.3) : 0;
  const shakeY = isCrashing ? Math.cos(frame * 2.3) * 16 * (1 - (t - 14.2) / 2.3) : 0;

  // Flash on crash hit (t=14.3s)
  const crashFlash = interpolate(t, [14.28, 14.35, 14.55], [0, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- HOOK ANIMATIONS (0.0s - 5.8s) ---
  const hookLine1Spring = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const hookLine2Spring = spring({ frame: frame - Math.round(2.6 * fps), fps, config: { damping: 10, stiffness: 180 } });
  const hookLine3Spring = spring({ frame: frame - Math.round(4.4 * fps), fps, config: { damping: 14, stiffness: 120 } });
  const hookExit = interpolate(t, [5.4, 5.8], [0, -1400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hookOpacity = interpolate(t, [5.4, 5.8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // --- ACT 1: HAIRLINE HERO (5.8s - 12.5s) ---
  const act1Entry = spring({ frame: frame - Math.round(5.8 * fps), fps, config: { damping: 14, stiffness: 120 } });
  const act1Exit = interpolate(t, [12.2, 12.5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act1ScaleExit = interpolate(t, [12.2, 12.5], [1, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Hairline intensity ramps smoothly
  const hairlineIntensity = interpolate(t, [5.8, 8.5, 12.0], [0.35, 0.75, 1.0], {
    extrapolateRight: 'clamp',
  });

  // Tethered tooltips
  const tag1Pop = spring({ frame: frame - Math.round(7.2 * fps), fps, config: { damping: 12 } });
  const tag2Pop = spring({ frame: frame - Math.round(9.2 * fps), fps, config: { damping: 12 } });
  const tag3Pop = spring({ frame: frame - Math.round(10.6 * fps), fps, config: { damping: 12 } });

  // --- ACT 2: 1000-FRAME CRASH (12.5s - 18.8s) ---
  const act2Entry = spring({ frame: frame - Math.round(12.5 * fps), fps, config: { damping: 14, stiffness: 130 } });
  const act2Exit = interpolate(t, [18.5, 18.8], [0, -1300], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Exponential depth counter 1 -> 1000
  const counterVal = Math.min(
    1000,
    Math.round(
      interpolate(t, [12.6, 14.3], [1, 1000], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: (x) => Math.pow(x, 3.5),
      })
    )
  );
  const depthBarWidth = (counterVal / 1000) * 100;

  const errorSlam = spring({
    frame: frame - Math.round(14.3 * fps),
    fps,
    config: { damping: 8, stiffness: 220 },
  });

  // --- ACT 3: DEQUE REVOLUTION (18.8s - 24.0s) ---
  const act3Entry = spring({ frame: frame - Math.round(18.8 * fps), fps, config: { damping: 13, stiffness: 140 } });
  const act3Exit = interpolate(t, [23.7, 24.0], [0, -1300], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const railOffset = (frame * 12) % 240;

  // --- ACT 4: 5X BENCHMARK PAYOFF (24.0s - 30.0s) ---
  const act4Entry = spring({ frame: frame - Math.round(24.0 * fps), fps, config: { damping: 14, stiffness: 130 } });

  // Big stat counter 1.0 -> 5.0
  const speedupVal = interpolate(t, [24.2, 26.5], [1.0, 5.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }).toFixed(1);

  const recursionBarFill = interpolate(t, [24.5, 26.0], [0, 20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dequeBarFill = interpolate(t, [24.5, 26.8], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#07080e', overflow: 'hidden' }}>
      {/* ---------------- LAYER 0: Dynamic Background & Color Grading ---------------- */}
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
        {/* Dynamic Per-Act Vignette */}
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

      {/* Screen White Flash on Crash */}
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

      <Audio src={staticFile('full-dialogue.mp3')} />

      {/* ===================== HOOK: 0.0s - 5.8s ===================== */}
      {t < 6.0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 50px',
            gap: 28,
            transform: `translateY(${hookExit}px)`,
            opacity: hookOpacity,
            textAlign: 'center',
          }}
        >
          {/* Tag */}
          <div
            style={{
              transform: `scale(${hookLine1Spring})`,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 50,
              padding: '12px 32px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 24,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            ⚠️ PYTHON INTERNALS
          </div>

          {/* Hook Headline */}
          <div
            style={{
              transform: `scale(${hookLine1Spring})`,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 76,
              fontWeight: 900,
              lineHeight: 1.1,
              color: '#ffffff',
              textShadow: '0 8px 30px rgba(0,0,0,0.95)',
            }}
          >
            Your Python App <br />
            <span style={{ color: '#f38ba8', textShadow: '0 0 35px rgba(243, 139, 168, 0.8)' }}>
              JUST CRASHED.
            </span>
          </div>

          {/* Error Tag dropping in */}
          {t >= 2.6 && (
            <div
              style={{
                transform: `scale(${hookLine2Spring})`,
                background: 'rgba(243, 139, 168, 0.25)',
                border: '3px solid #f38ba8',
                borderRadius: 20,
                padding: '16px 36px',
                fontFamily: 'monospace',
                fontSize: 48,
                fontWeight: 900,
                color: '#ffffff',
                boxShadow: '0 0 45px rgba(243, 139, 168, 0.7)',
                letterSpacing: '0.04em',
              }}
            >
              💥 RecursionError
            </div>
          )}

          {/* Subtext */}
          {t >= 4.4 && (
            <div
              style={{
                transform: `scale(${hookLine3Spring})`,
                fontFamily: 'system-ui, -apple-system, sans-serif',
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
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 120,
            opacity: act1Exit,
            transform: `scale(${act1Entry * act1ScaleExit})`,
          }}
        >
          {/* Floating Section Banner */}
          <div
            style={{
              background: 'rgba(116, 199, 236, 0.18)',
              border: '2px solid #74c7ec',
              borderRadius: 30,
              padding: '10px 28px',
              fontFamily: 'system-ui',
              fontSize: 22,
              fontWeight: 900,
              color: '#89dceb',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 0 25px rgba(116, 199, 236, 0.3)',
              marginBottom: 10,
            }}
          >
            CPYTHON CALL STACK ALLOCATION
          </div>

          <div
            style={{
              fontFamily: 'system-ui',
              fontSize: 44,
              fontWeight: 900,
              color: '#ffffff',
              textAlign: 'center',
              textShadow: '0 4px 20px rgba(0,0,0,0.9)',
              marginBottom: 20,
            }}
          >
            Every Call Pushes a Frame
          </div>

          {/* Hero Hairline 3D Stack - EXPANDED TO FULL CANVAS HERO */}
          <div
            style={{
              width: 1000,
              height: 640,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 720, height: 600 }}>
              <Stack theme="dark" intensity={hairlineIntensity} play={true} style={{ width: '100%', height: '100%' }} />
            </div>

            {/* Tethered Callout Badges */}
            {t >= 7.2 && (
              <div
                style={{
                  position: 'absolute',
                  top: 80,
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
                  boxShadow: '0 12px 30px rgba(0,0,0,0.8), 0 0 25px rgba(116, 199, 236, 0.4)',
                }}
              >
                📦 locals: &#123; n: 42 &#125;
              </div>
            )}

            {t >= 9.2 && (
              <div
                style={{
                  position: 'absolute',
                  top: 250,
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
                  boxShadow: '0 12px 30px rgba(0,0,0,0.8), 0 0 25px rgba(249, 226, 175, 0.4)',
                }}
              >
                📍 bytecode_ip: 0x7F4A
              </div>
            )}

            {t >= 10.6 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 70,
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
                  boxShadow: '0 12px 30px rgba(0,0,0,0.8), 0 0 25px rgba(203, 166, 247, 0.4)',
                }}
              >
                📚 eval_stack: [arg0]
              </div>
            )}
          </div>

          {/* Takeaway Pill */}
          <div
            style={{
              background: 'rgba(24, 24, 37, 0.9)',
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
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 110,
            transform: `translateX(${act2Exit}px) scale(${act2Entry})`,
          }}
        >
          {/* Act Badge */}
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
              textTransform: 'uppercase',
              boxShadow: '0 0 25px rgba(243, 139, 168, 0.4)',
              marginBottom: 16,
            }}
          >
            CALL STACK EXHAUSTION
          </div>

          {/* GIANT DEPTH COUNTER HERO */}
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 120,
              fontWeight: 900,
              color: counterVal >= 1000 ? '#f38ba8' : '#ffffff',
              lineHeight: 1.0,
              textShadow:
                counterVal >= 1000
                  ? '0 0 45px rgba(243, 139, 168, 0.9)'
                  : '0 8px 30px rgba(0,0,0,0.95)',
              marginBottom: 10,
            }}
          >
            {counterVal}
            <span style={{ fontSize: 44, color: 'rgba(255,255,255,0.6)', marginLeft: 8 }}>/ 1000</span>
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
              marginBottom: 26,
            }}
          >
            <div
              style={{
                width: `${depthBarWidth}%`,
                height: '100%',
                background:
                  counterVal >= 1000
                    ? '#f38ba8'
                    : 'linear-gradient(90deg, #f9e2af 0%, #f38ba8 100%)',
                boxShadow: '0 0 20px rgba(243, 139, 168, 0.8)',
              }}
            />
          </div>

          {/* Faulty Code Snippet */}
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

          {/* FATAL ERROR MODAL SLAM */}
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
                Python enforces a hard 1,000 call limit to prevent C runtime segmentation faults.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== ACT 3: DEQUE REVOLUTION (18.8s - 24.0s) ===================== */}
      {t >= 18.6 && t < 24.2 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 110,
            transform: `translateX(${act3Exit}px) scale(${act3Entry})`,
          }}
        >
          {/* Act Badge */}
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
              textTransform: 'uppercase',
              boxShadow: '0 0 25px rgba(166, 227, 161, 0.4)',
              marginBottom: 16,
            }}
          >
            THE ITERATIVE SOLUTION
          </div>

          <div
            style={{
              fontFamily: 'system-ui',
              fontSize: 48,
              fontWeight: 900,
              color: '#ffffff',
              textAlign: 'center',
              textShadow: '0 4px 20px rgba(0,0,0,0.9)',
              marginBottom: 20,
            }}
          >
            Swap to <span style={{ color: '#a6e3a1' }}>collections.deque</span>
          </div>

          {/* Clean Deque Code Card */}
          <div
            style={{
              width: 960,
              background: 'rgba(17, 17, 27, 0.96)',
              border: '2px solid rgba(166, 227, 161, 0.5)',
              borderRadius: 22,
              padding: '24px 32px',
              fontFamily: 'monospace',
              fontSize: 26,
              lineHeight: 1.6,
              color: '#cdd6f4',
              boxShadow: '0 16px 40px rgba(0,0,0,0.9)',
              marginBottom: 24,
            }}
          >
            <div style={{ color: '#a6e3a1', fontWeight: 900 }}>from collections import deque</div>
            <div style={{ color: '#89dceb', marginTop: 6 }}>stack = deque([root_node])</div>
            <div style={{ color: '#cdd6f4', marginTop: 6 }}>while stack:</div>
            <div style={{ paddingLeft: 36, color: '#fab387' }}>node = stack.pop()  # O(1) Instant</div>
            <div style={{ paddingLeft: 36, color: '#a6e3a1' }}>stack.extend(node.children)</div>
          </div>

          {/* Full Width Sliding Heap Node Rail */}
          <div
            style={{
              width: 1040,
              height: 140,
              background: 'rgba(17, 17, 27, 0.85)',
              border: '2px solid rgba(166, 227, 161, 0.4)',
              borderRadius: 22,
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 12px 30px rgba(0,0,0,0.85)',
            }}
          >
            <div style={{ fontSize: 16, fontFamily: 'monospace', color: '#a6e3a1', fontWeight: 900, marginBottom: 10 }}>
              [HEAP QUEUE BUFFER: UNLIMITED MEMORY · O(1) PUSH &amp; POP]
            </div>
            <div style={{ display: 'flex', gap: 16, transform: `translateX(${-railOffset}px)` }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    minWidth: 170,
                    padding: '12px 18px',
                    borderRadius: 14,
                    background: i % 2 === 0 ? 'rgba(166, 227, 161, 0.2)' : 'rgba(116, 199, 236, 0.2)',
                    border: i % 2 === 0 ? '2px solid #a6e3a1' : '2px solid #74c7ec',
                    fontFamily: 'monospace',
                    fontSize: 18,
                    fontWeight: 800,
                    color: i % 2 === 0 ? '#a6e3a1' : '#74c7ec',
                    textAlign: 'center',
                  }}
                >
                  Heap Node #{i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Benefit Badge */}
          <div
            style={{
              marginTop: 20,
              background: 'rgba(24, 24, 37, 0.9)',
              border: '2px solid rgba(166, 227, 161, 0.4)',
              borderRadius: 20,
              padding: '14px 32px',
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
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 100,
            transform: `scale(${act4Entry})`,
          }}
        >
          {/* Act Badge */}
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
              textTransform: 'uppercase',
              boxShadow: '0 0 35px rgba(0, 229, 255, 0.5)',
              marginBottom: 14,
            }}
          >
            BENCHMARK VICTORY
          </div>

          {/* GIANT STAT COUNTER */}
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

          {/* Bar Chart Race (Bigger: 60px height) */}
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
            {/* Recursion Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'system-ui', fontSize: 18, fontWeight: 800, color: '#f38ba8' }}>
                <span>Standard Recursion</span>
                <span>Crash at 1,000 frames (RecursionError)</span>
              </div>
              <div style={{ height: 38, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ width: `${recursionBarFill}%`, height: '100%', background: '#f38ba8', borderRadius: 12 }} />
              </div>
            </div>

            {/* Deque Bar */}
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

      {/* ---------------- LAYER 2: TikTok-Style Kinetic Karaoke Subtitles ---------------- */}
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
                    ? '0 0 28px rgba(0, 229, 255, 0.9), 0 4px 12px rgba(0,0,0,0.95)'
                    : '0 4px 16px rgba(0, 0, 0, 0.95)',
                  transform: isCurrent ? 'scale(1.12)' : 'scale(1.0)',
                  transition: 'transform 0.06s ease-out, color 0.06s ease-out',
                  display: 'inline-block',
                }}
              >
                {w.word}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
