import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface OfflineVsCloudLatencyProps {
  title?: string;
  subtitle?: string;
  sampleText?: string;
  localLatencyMs?: number;
  cloudLatencyBaseMs?: number;
  width?: number;
  height?: number;
}

export const OfflineVsCloudLatency: React.FC<OfflineVsCloudLatencyProps> = ({
  title = 'KEYSTROKE LATENCY BENCHMARK',
  subtitle = 'Instant Local Markdown Files vs Proprietary Cloud Webview',
  sampleText = '# System Architecture: Autonomous Agents\n- [x] Zero-latency local vault storage\n- [ ] Syncing 24,000 blocks to remote DB...',
  localLatencyMs = 0.4,
  cloudLatencyBaseMs = 460,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.8 },
  });

  const cardOpacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const cardScale = interpolate(enterProgress, [0, 1], [0.94, 1]);
  const cardY = interpolate(enterProgress, [0, 1], [25, 0]);

  // Keystroke animation (typing characters over time)
  const typingStartFrame = 12;
  const typedCharCount = Math.floor(
    interpolate(frame, [typingStartFrame, typingStartFrame + 60], [0, sampleText.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // Cloud typing lag (delays by ~14 frames)
  const cloudLagFrames = 14;
  const cloudTypedCharCount = Math.floor(
    interpolate(frame, [typingStartFrame + cloudLagFrames, typingStartFrame + 60 + cloudLagFrames], [0, sampleText.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const localText = sampleText.slice(0, typedCharCount);
  const cloudText = sampleText.slice(0, cloudTypedCharCount);

  // Fluctuating cloud latency counter
  const cloudJitter = Math.sin(frame * 0.4) * 80 + Math.cos(frame * 0.7) * 45;
  const currentCloudLatency = Math.max(280, Math.round(cloudLatencyBaseMs + cloudJitter));

  // Blinking cursor
  const cursorBlink = Math.floor((frame / 12) % 2) === 0;

  // Cloud spinner rotation
  const spinnerRotation = (frame * 12) % 360;

  // Keypress pulse indicator
  const keyPulse = frame > typingStartFrame && frame < typingStartFrame + 60 ? (frame % 3 === 0 ? 1 : 0.6) : 0.4;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(16, 185, 129, 0.12)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background grid accent */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            'radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Speedometer Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.45)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  background: 'linear-gradient(90deg, #34d399, #38bdf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {title}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 9999,
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  letterSpacing: '0.05em',
                }}
              >
                1,150x FASTER DISK PIPELINE
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>

        {/* Live Keystroke Monitor */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(30, 41, 59, 0.7)',
            padding: '6px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981',
              opacity: keyPulse,
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#cbd5e1' }}>
            INPUT EVENT: <span style={{ color: '#38bdf8' }}>KEYDOWN</span>
          </span>
        </div>
      </div>

      {/* Split Comparison Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 18,
          marginTop: 18,
          flex: 1,
          zIndex: 2,
        }}
      >
        {/* LEFT PANEL: LOCAL MARKDOWN STORAGE */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)',
            borderRadius: 18,
            border: '1px solid rgba(16, 185, 129, 0.35)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 25px rgba(16, 185, 129, 0.05)',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'rgba(16, 185, 129, 0.25)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#34d399', letterSpacing: '0.04em' }}>
                  LOCAL .MD VAULT
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>Direct Disk NVMe I/O</div>
              </div>
            </div>

            {/* Instant Latency Gauge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 4,
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '4px 10px',
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>
                {localLatencyMs.toFixed(1)}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#6ee7b7' }}>ms</span>
            </div>
          </div>

          {/* Editor Sandbox Simulation */}
          <div
            style={{
              flex: 1,
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '14px 16px',
              fontFamily: 'monospace',
              fontSize: 12,
              lineHeight: '1.6',
              color: '#f8fafc',
              whiteSpace: 'pre-wrap',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ color: '#38bdf8' }}>{localText}</div>
            <span
              style={{
                display: 'inline-block',
                width: 7,
                height: 14,
                background: cursorBlink ? '#34d399' : 'transparent',
                verticalAlign: 'middle',
                marginLeft: 2,
              }}
            />
          </div>

          {/* Storage telemetry status */}
          <div
            style={{
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 11,
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
              <span style={{ color: '#34d399', fontWeight: 700 }}>SYNCHRONOUS NVMe WRITE</span>
            </div>
            <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>120 FPS FLUID</span>
          </div>
        </div>

        {/* RIGHT PANEL: CLOUD WEB APP */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)',
            borderRadius: 18,
            border: '1px solid rgba(239, 68, 68, 0.35)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 25px rgba(239, 68, 68, 0.05)',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f87171', letterSpacing: '0.04em' }}>
                  PROPRIETARY CLOUD
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>Remote Electron/WebSocket</div>
              </div>
            </div>

            {/* High Latency Gauge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 4,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '4px 10px',
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 900, color: '#f87171', fontFamily: 'monospace' }}>
                {currentCloudLatency}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fca5a5' }}>ms</span>
            </div>
          </div>

          {/* Editor Sandbox Simulation with lag */}
          <div
            style={{
              flex: 1,
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '14px 16px',
              fontFamily: 'monospace',
              fontSize: 12,
              lineHeight: '1.6',
              color: '#94a3b8',
              whiteSpace: 'pre-wrap',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>{cloudText}</div>
            <span
              style={{
                display: 'inline-block',
                width: 7,
                height: 14,
                background: cursorBlink ? '#f87171' : 'transparent',
                verticalAlign: 'middle',
                marginLeft: 2,
              }}
            />

            {/* Syncing Overlay Spinner */}
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(30, 41, 59, 0.85)',
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f87171"
                strokeWidth="2.5"
                style={{ transform: `rotate(${spinnerRotation}deg)` }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span style={{ fontSize: 9, color: '#fca5a5', fontWeight: 700 }}>SYNCING...</span>
            </div>
          </div>

          {/* Cloud telemetry status */}
          <div
            style={{
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 11,
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f87171' }} />
              <span style={{ color: '#f87171', fontWeight: 700 }}>THROTTLED NETWORK RTT</span>
            </div>
            <span style={{ color: '#fca5a5', fontFamily: 'monospace' }}>TYPING JITTER</span>
          </div>
        </div>
      </div>

      {/* Bottom Comparative Benchmark Ribbon */}
      <div
        style={{
          marginTop: 18,
          padding: '14px 20px',
          borderRadius: 16,
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            99.9% SPEED ADVANTAGE
          </div>
          <div style={{ fontSize: 12, color: '#cbd5e1' }}>
            Local markdown files save at the speed of SSD hardware without waiting for server round-trips.
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>EFFICIENCY DELTA</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#38bdf8' }}>
            {(currentCloudLatency / localLatencyMs).toFixed(0)}x Faster
          </div>
        </div>
      </div>
    </div>
  );
};
