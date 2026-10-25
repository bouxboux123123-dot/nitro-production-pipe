import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ScreenRecordingSnippetProps {
  title?: string;
  badgeText?: string;
  appUrl?: string;
  stepLabel?: string;
  tabName?: string;
  actionButtonText?: string;
  successMessage?: string;
  width?: number;
  height?: number;
}

export const ScreenRecordingSnippet: React.FC<ScreenRecordingSnippetProps> = ({
  title = 'INSTANT UI WALKTHROUGH SNIPPET',
  badgeText = 'REPLACES 15-MIN SCREEN-SHARE CALL',
  appUrl = 'app.cloudinfra.io/security/api-tokens',
  stepLabel = 'How to rotate production webhook secret',
  tabName = 'API & Webhook Tokens',
  actionButtonText = 'Rotate Secret Now',
  successMessage = 'Production Secret Rotated & Copied to Vault',
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.9 },
  });

  // Cursor trajectory coordinates
  // Phase 1 (0 - 40): Moves towards the sidebar tab and clicks at frame 35
  // Phase 2 (40 - 80): Moves towards the primary action button and clicks at frame 75
  // Phase 3 (80+): Moves slightly and hovers, success banner appears
  const cursorX = interpolate(
    frame,
    [0, 25, 45, 70, 95],
    [720, 210, 220, 560, 570],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cursorY = interpolate(
    frame,
    [0, 25, 45, 70, 95],
    [520, 245, 255, 345, 355],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Click 1 ripple at frame 30-45
  const click1Age = frame - 30;
  const isClick1 = click1Age >= 0 && click1Age <= 20;
  const click1Scale = isClick1 ? interpolate(click1Age, [0, 20], [0.6, 2.5]) : 0;
  const click1Opacity = isClick1 ? interpolate(click1Age, [0, 20], [0.8, 0]) : 0;

  // Click 2 ripple at frame 70-85
  const click2Age = frame - 70;
  const isClick2 = click2Age >= 0 && click2Age <= 20;
  const click2Scale = isClick2 ? interpolate(click2Age, [0, 20], [0.6, 2.5]) : 0;
  const click2Opacity = isClick2 ? interpolate(click2Age, [0, 20], [0.8, 0]) : 0;

  // Action button activated after frame 75
  const isButtonActive = frame >= 75;
  const successSpring = spring({
    frame: frame - 78,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardEntrance,
        transform: `translateY(${interpolate(cardEntrance, [0, 1], [30, 0])}px) scale(${interpolate(
          cardEntrance,
          [0, 1],
          [0.94, 1]
        )})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.90) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow:
          '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(56, 189, 248, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        padding: '22px 26px',
        boxSizing: 'border-box',
        color: '#f8fafc',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 999,
                background: 'rgba(56, 189, 248, 0.18)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#38bdf8',
                  boxShadow: '0 0 6px #38bdf8',
                }}
              />
              {title}
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              {stepLabel}
            </span>
          </div>
        </div>

        {/* Call replacement badge */}
        <div
          style={{
            padding: '5px 12px',
            borderRadius: 10,
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            fontSize: 11,
            fontWeight: 800,
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>⚡</span>
          <span>{badgeText}</span>
        </div>
      </div>

      {/* Browser Mockup Window */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          margin: '12px 0',
          position: 'relative',
          height: 420,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Browser Top Bar */}
        <div
          style={{
            height: 38,
            background: 'rgba(30, 41, 59, 0.75)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            gap: 12,
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
          </div>

          {/* URL bar */}
          <div
            style={{
              flex: 1,
              maxWidth: 440,
              margin: '0 auto',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 6,
              padding: '3px 12px',
              fontSize: 11,
              fontFamily: 'monospace',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <span style={{ color: '#10b981' }}>🔒</span>
            <span style={{ color: '#e2e8f0' }}>https://</span>
            <span>{appUrl}</span>
          </div>

          <div style={{ fontSize: 10, color: '#64748b' }}>60 FPS Loom Capture</div>
        </div>

        {/* Mock Application Canvas */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '200px 1fr', position: 'relative' }}>
          {/* Sidebar */}
          <div
            style={{
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '16px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4, paddingLeft: 8 }}>
              Settings
            </div>
            {['General Profile', 'Team Permissions', tabName, 'Webhooks & Events', 'Audit Logs'].map((item) => {
              const isSelected = item === tabName;
              return (
                <div
                  key={item}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#38bdf8' : '#94a3b8',
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    border: isSelected ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 12 }}>{isSelected ? '🔑' : '📁'}</span>
                  <span>{item}</span>
                </div>
              );
            })}
          </div>

          {/* Main Area */}
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
                Production Access Tokens
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: 11, color: '#94a3b8' }}>
                Manage live microservice authentication secrets.
              </p>
            </div>

            {/* Secret key item card */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>
                  prod_gateway_secret_live
                </div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748b', marginTop: 2 }}>
                  Created 89 days ago • Last used 2m ago
                </div>
              </div>
              <div
                style={{
                  padding: '3px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontFamily: 'monospace',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                EXPIRES IN 48H
              </div>
            </div>

            {/* Action Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
              {/* Rotate Action Button */}
              <div
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  background: isButtonActive
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: isButtonActive
                    ? '0 0 20px rgba(16, 185, 129, 0.5)'
                    : '0 4px 12px rgba(37, 99, 235, 0.3)',
                  transition: 'background 0.2s ease',
                }}
              >
                <span>{isButtonActive ? '✔' : '⚡'}</span>
                <span>{isButtonActive ? 'Secret Regenerated!' : actionButtonText}</span>
              </div>

              <div style={{ fontSize: 11, color: '#64748b' }}>
                Click 1: Select Tab • Click 2: Rotate
              </div>
            </div>

            {/* Success Tooltip Popover (Appears after Click 2) */}
            {frame >= 78 && (
              <div
                style={{
                  opacity: successSpring,
                  transform: `translateY(${interpolate(successSpring, [0, 1], [10, 0])}px)`,
                  background: 'rgba(6, 78, 59, 0.9)',
                  border: '1px solid #10b981',
                  borderRadius: 10,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 6,
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: '#ffffff',
                  }}
                >
                  ✔
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#ecfdf5' }}>
                    {successMessage}
                  </div>
                  <div style={{ fontSize: 10, color: '#a7f3d0', marginTop: 1 }}>
                    Demonstrated in 4s asynchronous video clip. No sync meeting needed.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mouse Cursor & Click Ripple Overlays */}
          {/* Click 1 Ripple */}
          {isClick1 && (
            <div
              style={{
                position: 'absolute',
                left: 210,
                top: 245,
                width: 30,
                height: 30,
                borderRadius: '50%',
                border: '2px solid #38bdf8',
                transform: `translate(-50%, -50%) scale(${click1Scale})`,
                opacity: click1Opacity,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Click 2 Ripple */}
          {isClick2 && (
            <div
              style={{
                position: 'absolute',
                left: 560,
                top: 345,
                width: 30,
                height: 30,
                borderRadius: '50%',
                border: '2px solid #10b981',
                transform: `translate(-50%, -50%) scale(${click2Scale})`,
                opacity: click2Opacity,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Animated Cursor */}
          <div
            style={{
              position: 'absolute',
              left: cursorX,
              top: cursorY,
              transform: 'translate(-2px, -2px)',
              pointerEvents: 'none',
              zIndex: 10,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                fill="#ffffff"
                stroke="#0f172a"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            <div
              style={{
                marginLeft: 14,
                marginTop: -6,
                background: '#0284c7',
                padding: '2px 6px',
                borderRadius: 4,
                fontSize: 9,
                fontWeight: 700,
                color: '#fff',
                whiteSpace: 'nowrap',
              }}
            >
              Marcus (4s clip)
            </div>
          </div>
        </div>
      </div>

      {/* Loom Scrubber Bar at bottom */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 10,
          border: '1px solid rgba(255, 255, 255, 0.06)',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#94a3b8' }}>
          <span style={{ color: '#38bdf8' }}>▶</span>
          <span>0:04 / 0:15</span>
          <span
            style={{
              fontSize: 9,
              fontFamily: 'monospace',
              padding: '1px 5px',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.1)',
              color: '#e2e8f0',
            }}
          >
            1.5x SPEED
          </span>
        </div>
        <div style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>
          ⚡ 15-minute scheduled call eliminated with a 15-second snippet
        </div>
      </div>
    </div>
  );
};
