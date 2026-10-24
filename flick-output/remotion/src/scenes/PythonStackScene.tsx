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

  // Subtitle groups
  const subtitleGroups = useMemo(() => {
    const rawWords = manifestData.words as WordTimestamp[];
    const groups: {
      id: number;
      start: number;
      end: number;
      words: { word: string; start: number; end: number; isKeyword: boolean }[];
    }[] = [];

    const KEYWORDS = [
      'STACK',
      'FRAME',
      'FRAMES',
      'RECURSIONERROR',
      'DEQUE',
      'HEAP',
      'MEMORY',
      'CPYTHON',
      'RECURSIVE',
      'LIMIT',
    ];

    let currentGroup: { word: string; start: number; end: number; isKeyword: boolean }[] = [];
    rawWords.forEach((w) => {
      const cleanUpper = w.word.toUpperCase().replace(/[^A-Z]/g, '');
      const isKeyword = KEYWORDS.some((k) => cleanUpper.includes(k));
      currentGroup.push({ ...w, isKeyword });

      const hasPunctuation = /[.,?!]/.test(w.word);
      if (currentGroup.length >= 4 || (currentGroup.length >= 3 && hasPunctuation)) {
        groups.push({
          id: groups.length,
          start: currentGroup[0].start,
          end: currentGroup[currentGroup.length - 1].end + 0.15,
          words: currentGroup,
        });
        currentGroup = [];
      }
    });

    if (currentGroup.length > 0) {
      groups.push({
        id: groups.length,
        start: currentGroup[0].start,
        end: currentGroup[currentGroup.length - 1].end + 0.2,
        words: currentGroup,
      });
    }

    return groups;
  }, []);

  const activeGroup = subtitleGroups.find(
    (g) => t >= g.start && t <= g.end
  );

  // -------------------------------------------------------------
  // ACT TIMINGS & TRANSITIONS
  // Act 1: 0.0s - 14.5s (The Call Stack Frame Allocation)
  // Act 2: 14.5s - 28.5s (The Crash: Recursion Depth Limit 1000)
  // Act 3: 28.5s - 37.0s (The Solution: collections.deque in Heap)
  // Act 4: 37.0s - 43.66s (The Benchmark Payoff & Performance Win)
  // -------------------------------------------------------------

  // Act 1 Animations
  const act1Entry = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const act1Exit = interpolate(t, [14.0, 14.8], [0, -1200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act1Opacity = interpolate(t, [14.0, 14.6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Hairline intensity ramps as calls push
  const hairlineIntensity = interpolate(t, [0, 4.0, 8.0], [0.35, 0.65, 0.95], {
    extrapolateRight: 'clamp',
  });

  // Callout tags popping during Act 1
  const tag1Pop = spring({ frame: frame - Math.round(5.0 * fps), fps, config: { damping: 12 } });
  const tag2Pop = spring({ frame: frame - Math.round(9.5 * fps), fps, config: { damping: 12 } });
  const tag3Pop = spring({ frame: frame - Math.round(11.5 * fps), fps, config: { damping: 12 } });

  // Act 2 Animations (The Crash)
  const act2EntryX = interpolate(t, [14.2, 14.9], [1200, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act2ExitX = interpolate(t, [28.0, 28.8], [0, -1200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act2CurrentX = t < 28.0 ? act2EntryX : act2ExitX;

  // Camera impact shake when RecursionError hits (~17.5s - 19.5s)
  const isShaking = t >= 17.5 && t <= 19.5;
  const shakeIntensity = isShaking ? Math.sin(frame * 1.8) * 16 * (1 - (t - 17.5) / 2.0) : 0;

  // Counter ticking 1 -> 1000
  const counterVal = Math.min(
    1000,
    Math.round(
      interpolate(t, [14.5, 17.5], [1, 1000], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: (x) => Math.pow(x, 3), // Exponential ramp
      })
    )
  );

  // Error slam modal
  const errorSlam = spring({
    frame: frame - Math.round(17.8 * fps),
    fps,
    config: { damping: 9, stiffness: 180 },
  });

  // Act 3 Animations (The Deque Solution)
  const act3EntryX = interpolate(t, [28.2, 28.9], [1200, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act3ExitX = interpolate(t, [36.5, 37.2], [0, -1200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act3CurrentX = t < 36.5 ? act3EntryX : act3ExitX;

  // Animated sliding node rail for Deque
  const railOffset = (frame * 6) % 180;

  // Act 4 Animations (Benchmark Race & Final Payoff)
  const act4EntryY = interpolate(t, [36.8, 37.5], [800, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const act4Spring = spring({ frame: frame - Math.round(36.8 * fps), fps, config: { damping: 15, stiffness: 110 } });

  // Race bars fill
  const recursionBarFill = interpolate(t, [37.5, 39.5], [0, 22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dequeBarFill = interpolate(t, [37.5, 39.5], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0d14', overflow: 'hidden' }}>
      {/* ---------------- LAYER 0: Bottom Background Video + 45% Black Vignette ---------------- */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          transform: `translate(${shakeIntensity}px, ${shakeIntensity * 0.5}px)`,
        }}
      >
        <Video
          src={staticFile('minecraft_bg.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at center, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.75) 100%)',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
          }}
        />
      </div>

      <Audio src={staticFile('full-dialogue.mp3')} />

      {/* ---------------- LAYER 1: Dynamic Evolving Acts (Catppuccin Theme) ---------------- */}

      {/* ===================== ACT 1: Call Stack Frame Allocation (0s - 14.5s) ===================== */}
      {t < 15.0 && (
        <div
          style={{
            position: 'absolute',
            top: 150,
            left: 60,
            width: 960,
            zIndex: 10,
            transform: `translateX(${act1Exit}px) scale(${act1Entry})`,
            opacity: act1Opacity,
            borderRadius: 28,
            background: 'rgba(24, 24, 37, 0.92)',
            border: '2px solid rgba(116, 199, 236, 0.4)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(116, 199, 236, 0.2)',
            backdropFilter: 'blur(20px)',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#f38ba8' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#f9e2af' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#a6e3a1' }} />
            </div>
            <div style={{ fontFamily: 'system-ui', fontSize: 20, fontWeight: 800, color: '#89b4fa', letterSpacing: '0.04em' }}>
              ACT 1: CPYTHON CALL STACK
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: '#a6e3a1', background: 'rgba(166, 227, 161, 0.15)', padding: '4px 12px', borderRadius: 8, border: '1px solid rgba(166, 227, 161, 0.4)' }}>
              ALLOCATING FRAMES
            </div>
          </div>

          {/* Hairline Live 3D Stack */}
          <div
            style={{
              width: '100%',
              height: 390,
              borderRadius: 20,
              background: 'rgba(17, 17, 27, 0.85)',
              border: '1px solid rgba(116, 199, 236, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 12, left: 16, fontFamily: 'monospace', fontSize: 14, color: '#74c7ec', fontWeight: 700 }}>
              [HAIRLINE ISOMETRIC CALL STACK]
            </div>
            <div style={{ width: 440, height: 360 }}>
              <Stack theme="dark" intensity={hairlineIntensity} play={true} style={{ width: '100%', height: '100%' }} />
            </div>

            {/* Micro-Motion Callouts Tethered to Stack */}
            {t >= 5.0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 50,
                  right: 20,
                  transform: `scale(${Math.max(0, tag1Pop)})`,
                  background: 'rgba(116, 199, 236, 0.2)',
                  border: '1px solid #74c7ec',
                  borderRadius: 10,
                  padding: '6px 14px',
                  fontFamily: 'monospace',
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#89dceb',
                }}
              >
                📦 locals: &#123; n: 42 &#125;
              </div>
            )}
            {t >= 9.5 && (
              <div
                style={{
                  position: 'absolute',
                  top: 130,
                  left: 20,
                  transform: `scale(${Math.max(0, tag2Pop)})`,
                  background: 'rgba(249, 226, 175, 0.2)',
                  border: '1px solid #f9e2af',
                  borderRadius: 10,
                  padding: '6px 14px',
                  fontFamily: 'monospace',
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#f9e2af',
                }}
              >
                📍 bytecode_ip: 0x7F4A
              </div>
            )}
            {t >= 11.5 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 40,
                  right: 25,
                  transform: `scale(${Math.max(0, tag3Pop)})`,
                  background: 'rgba(203, 166, 247, 0.2)',
                  border: '1px solid #cba6f7',
                  borderRadius: 10,
                  padding: '6px 14px',
                  fontFamily: 'monospace',
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#cba6f7',
                }}
              >
                📚 eval_stack: [arg0, arg1]
              </div>
            )}
          </div>

          {/* Explanation Pill */}
          <div
            style={{
              background: 'rgba(116, 199, 236, 0.1)',
              border: '1px solid rgba(116, 199, 236, 0.3)',
              borderRadius: 14,
              padding: '12px 18px',
              fontFamily: 'system-ui',
              fontSize: 16,
              fontWeight: 700,
              color: '#cdd6f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>⚡ Each function call pushes an isolated <strong>CPython Frame Object</strong></span>
            <span style={{ color: '#00e5ff' }}>HEAVY OVERHEAD</span>
          </div>
        </div>
      )}

      {/* ===================== ACT 2: The Crash & Recursion Limit (14.5s - 28.5s) ===================== */}
      {t >= 14.0 && t < 29.0 && (
        <div
          style={{
            position: 'absolute',
            top: 150,
            left: 60,
            width: 960,
            zIndex: 10,
            transform: `translateX(${act2CurrentX}px)`,
            borderRadius: 28,
            background: 'rgba(24, 24, 37, 0.94)',
            border: isShaking ? '3px solid #f38ba8' : '2px solid rgba(243, 139, 168, 0.5)',
            boxShadow: isShaking ? '0 0 50px rgba(243, 139, 168, 0.6)' : '0 24px 60px rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#f38ba8' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#f9e2af' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#a6e3a1' }} />
            </div>
            <div style={{ fontFamily: 'system-ui', fontSize: 20, fontWeight: 800, color: '#f38ba8', letterSpacing: '0.04em' }}>
              ACT 2: RECURSION LIMIT EXCEEDED
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 900, color: '#f38ba8', background: 'rgba(243, 139, 168, 0.2)', padding: '4px 14px', borderRadius: 8, border: '1px solid #f38ba8' }}>
              DEPTH: {counterVal} / 1000
            </div>
          </div>

          {/* Faulty Recursive Syntax Card */}
          <div
            style={{
              background: 'rgba(17, 17, 27, 0.95)',
              border: '1px solid rgba(243, 139, 168, 0.4)',
              borderRadius: 18,
              padding: '20px 24px',
              fontFamily: 'monospace',
              fontSize: 18,
              lineHeight: 1.5,
              color: '#cdd6f4',
            }}
          >
            <div style={{ color: '#f38ba8', fontWeight: 800, marginBottom: 8 }}>
              def recurse_tree(node):
            </div>
            <div style={{ paddingLeft: 24, color: '#89b4fa' }}>
              # Pushes frame {counterVal}...
            </div>
            <div style={{ paddingLeft: 24, color: '#fab387' }}>
              return recurse_tree(node.next)
            </div>
          </div>

          {/* Crash Modal Slamming In at ~18s */}
          {t >= 17.5 && (
            <div
              style={{
                transform: `scale(${Math.max(0, errorSlam)})`,
                background: 'rgba(243, 139, 168, 0.18)',
                border: '2px solid #f38ba8',
                borderRadius: 18,
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                boxShadow: '0 0 35px rgba(243, 139, 168, 0.4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f38ba8', fontWeight: 900, fontSize: 20 }}>
                <span>💥</span>
                <span>FATAL EXECUTION HALT</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 16, color: '#ffffff', fontWeight: 700 }}>
                RecursionError: maximum recursion depth exceeded while calling a Python object
              </div>
              <div style={{ fontFamily: 'system-ui', fontSize: 14, color: '#f9e2af' }}>
                Default limit capped at 1,000 frames to prevent C-level stack overflow crash.
              </div>
            </div>
          )}

          {/* Warning banner */}
          <div
            style={{
              background: 'rgba(243, 139, 168, 0.1)',
              border: '1px solid rgba(243, 139, 168, 0.3)',
              borderRadius: 14,
              padding: '12px 18px',
              fontFamily: 'system-ui',
              fontSize: 16,
              fontWeight: 700,
              color: '#f38ba8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>⚠️ Call stack exhausted: program immediately aborted</span>
            <span style={{ color: '#ffffff' }}>LIMIT: 1,000</span>
          </div>
        </div>
      )}

      {/* ===================== ACT 3: The Deque Transformation (28.5s - 37.0s) ===================== */}
      {t >= 28.0 && t < 37.5 && (
        <div
          style={{
            position: 'absolute',
            top: 150,
            left: 60,
            width: 960,
            zIndex: 10,
            transform: `translateX(${act3CurrentX}px)`,
            borderRadius: 28,
            background: 'rgba(24, 24, 37, 0.94)',
            border: '2px solid rgba(166, 227, 161, 0.5)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(166, 227, 161, 0.25)',
            backdropFilter: 'blur(20px)',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#a6e3a1' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#74c7ec' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#cba6f7' }} />
            </div>
            <div style={{ fontFamily: 'system-ui', fontSize: 20, fontWeight: 800, color: '#a6e3a1', letterSpacing: '0.04em' }}>
              ACT 3: THE DEQUE CONVERSION
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 900, color: '#a6e3a1', background: 'rgba(166, 227, 161, 0.2)', padding: '4px 12px', borderRadius: 8, border: '1px solid #a6e3a1' }}>
              HEAP MEMORY (UNLIMITED)
            </div>
          </div>

          {/* Clean Deque Syntax Card */}
          <div
            style={{
              background: 'rgba(17, 17, 27, 0.95)',
              border: '1px solid rgba(166, 227, 161, 0.4)',
              borderRadius: 18,
              padding: '20px 24px',
              fontFamily: 'monospace',
              fontSize: 18,
              lineHeight: 1.5,
              color: '#cdd6f4',
            }}
          >
            <div style={{ color: '#a6e3a1', fontWeight: 800 }}>from collections import deque</div>
            <div style={{ color: '#89dceb', marginTop: 4 }}>stack = deque([root_node])</div>
            <div style={{ color: '#cdd6f4', marginTop: 4 }}>while stack:</div>
            <div style={{ paddingLeft: 24, color: '#fab387' }}>node = stack.pop()  # O(1) Instant</div>
            <div style={{ paddingLeft: 24, color: '#a6e3a1' }}>stack.extend(node.children)</div>
          </div>

          {/* Animated Node Rail (Visualizing Heap Push/Pop) */}
          <div
            style={{
              height: 140,
              background: 'rgba(17, 17, 27, 0.8)',
              border: '1px solid rgba(166, 227, 161, 0.3)',
              borderRadius: 18,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#a6e3a1', fontWeight: 800, marginBottom: 8 }}>
              [HEAP QUEUE BUFFER: RAPID O(1) PUSH &amp; POP]
            </div>
            <div style={{ display: 'flex', gap: 14, transform: `translateX(${-railOffset}px)` }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    minWidth: 150,
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: 'rgba(166, 227, 161, 0.15)',
                    border: '1px solid #a6e3a1',
                    fontFamily: 'monospace',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#a6e3a1',
                    textAlign: 'center',
                  }}
                >
                  Node #{i + 1} (Heap)
                </div>
              ))}
            </div>
          </div>

          {/* Benefit Pill */}
          <div
            style={{
              background: 'rgba(166, 227, 161, 0.1)',
              border: '1px solid rgba(166, 227, 161, 0.3)',
              borderRadius: 14,
              padding: '12px 18px',
              fontFamily: 'system-ui',
              fontSize: 16,
              fontWeight: 700,
              color: '#a6e3a1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>✅ Heap allocation scales to millions of items with <strong>ZERO frame overhead</strong></span>
            <span style={{ color: '#00e5ff' }}>O(1) COMPLEXITY</span>
          </div>
        </div>
      )}

      {/* ===================== ACT 4: The Benchmark Payoff (37.0s - 43.66s) ===================== */}
      {t >= 36.8 && (
        <div
          style={{
            position: 'absolute',
            top: 150,
            left: 60,
            width: 960,
            zIndex: 10,
            transform: `translateY(${act4EntryY}px) scale(${act4Spring})`,
            borderRadius: 28,
            background: 'rgba(24, 24, 37, 0.94)',
            border: '2px solid rgba(0, 229, 255, 0.5)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 45px rgba(0, 229, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#00e5ff' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#a6e3a1' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#f9e2af' }} />
            </div>
            <div style={{ fontFamily: 'system-ui', fontSize: 20, fontWeight: 800, color: '#00e5ff', letterSpacing: '0.04em' }}>
              ACT 4: ARCHITECTURAL VICTORY
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 900, color: '#00e5ff', background: 'rgba(0, 229, 255, 0.15)', padding: '4px 12px', borderRadius: 8, border: '1px solid #00e5ff' }}>
              BENCHMARK RESULT
            </div>
          </div>

          {/* Bar Chart Race: Recursion vs Iterative Deque */}
          <div
            style={{
              background: 'rgba(17, 17, 27, 0.95)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: 20,
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            {/* Recursion Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'system-ui', fontSize: 15, fontWeight: 700, color: '#f38ba8' }}>
                <span>Standard Recursion (Call Stack)</span>
                <span>Crash at 1,000 frames (RecursionError)</span>
              </div>
              <div style={{ height: 26, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ width: `${recursionBarFill}%`, height: '100%', background: '#f38ba8', borderRadius: 8 }} />
              </div>
            </div>

            {/* Deque Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'system-ui', fontSize: 15, fontWeight: 700, color: '#a6e3a1' }}>
                <span>Iterative Deque (Heap Memory)</span>
                <span>100,000+ items (0.02s · 100% Success)</span>
              </div>
              <div style={{ height: 26, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ width: `${dequeBarFill}%`, height: '100%', background: 'linear-gradient(90deg, #a6e3a1 0%, #00e5ff 100%)', borderRadius: 8 }} />
              </div>
            </div>
          </div>

          {/* Stat metrics */}
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ flex: 1, background: 'rgba(17, 17, 27, 0.8)', border: '1px solid rgba(0, 229, 255, 0.3)', borderRadius: 16, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontFamily: 'system-ui', color: '#89b4fa', fontWeight: 700 }}>SPEEDUP</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#00e5ff' }}>4.8× FASTER</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(17, 17, 27, 0.8)', border: '1px solid rgba(166, 227, 161, 0.3)', borderRadius: 16, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontFamily: 'system-ui', color: '#a6e3a1', fontWeight: 700 }}>STACK OVERHEAD</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#a6e3a1' }}>ZERO FRAMES</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(17, 17, 27, 0.8)', border: '1px solid rgba(249, 226, 175, 0.3)', borderRadius: 16, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontFamily: 'system-ui', color: '#f9e2af', fontWeight: 700 }}>LIMIT RISK</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#f9e2af' }}>0% CRASH</div>
            </div>
          </div>

          {/* Takeaway */}
          <div
            style={{
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              borderRadius: 14,
              padding: '12px 18px',
              fontFamily: 'system-ui',
              fontSize: 16,
              fontWeight: 800,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>🚀 Rule of thumb: <strong>Always use collections.deque for deep graphs</strong></span>
            <span style={{ color: '#00e5ff' }}>SAVE THE STACK</span>
          </div>
        </div>
      )}

      {/* ---------------- LAYER 2: Center-Bottom Kinetic Subtitles ---------------- */}
      <div
        style={{
          position: 'absolute',
          bottom: 240,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 30,
          pointerEvents: 'none',
        }}
      >
        {activeGroup && (
          <div
            style={{
              maxWidth: 920,
              background: 'rgba(17, 17, 27, 0.88)',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 24,
              padding: '16px 36px',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.95)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '10px 18px',
              backdropFilter: 'blur(16px)',
            }}
          >
            {activeGroup.words.map((w, idx) => {
              const isWordActive = t >= w.start && t <= w.end;
              const isHighlight =
                w.isKeyword ||
                w.word.toUpperCase().includes('STACK') ||
                w.word.toUpperCase().includes('FRAME') ||
                w.word.toUpperCase().includes('RECURSIONERROR') ||
                w.word.toUpperCase().includes('DEQUE');

              return (
                <span
                  key={idx}
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 900,
                    fontSize: 48,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: isHighlight
                      ? '#00e5ff' // Cyan highlight for key technical words
                      : isWordActive
                      ? '#ffffff'
                      : 'rgba(255, 255, 255, 0.75)',
                    textShadow: isHighlight
                      ? '0 0 20px rgba(0, 229, 255, 0.85), 0 2px 6px rgba(0,0,0,0.9)'
                      : '0 4px 14px rgba(0, 0, 0, 0.95)',
                    transform: isWordActive ? 'scale(1.08)' : 'scale(1.0)',
                    transition: 'transform 0.08s ease-out',
                    display: 'inline-block',
                  }}
                >
                  {w.word}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
