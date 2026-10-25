import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DistractionShieldBlockerProps {
  blockedUrl?: string;
  domainName?: string;
  category?: string;
  focusBlockName?: string;
  redirectUrl?: string;
  timeRemaining?: string;
  interceptionsToday?: number;
  width?: number;
  height?: number;
}

export const DistractionShieldBlocker: React.FC<DistractionShieldBlockerProps> = ({
  blockedUrl = 'https://twitter.com/notifications/trending',
  domainName = 'x.com / twitter.com',
  category = 'Algorithmic Infinite-Scroll Feed',
  focusBlockName = 'Morning Deep Work Block (09:00 - 11:30)',
  redirectUrl = 'Obsidian // Q4 System Architecture Roadmap',
  timeRemaining = '34m 12s remaining in session',
  interceptionsToday = 14,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance of browser window
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const cardOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const cardScale = interpolate(entrance, [0, 1], [0.94, 1]);
  const cardY = interpolate(entrance, [0, 1], [25, 0]);

  // Shield Impact Slam at frame 16
  const slamProgress = spring({
    frame: frame - 16,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.9 },
  });

  const shieldScale = interpolate(slamProgress, [0, 1], [1.35, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shieldOpacity = interpolate(slamProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Shockwave ring expansion after impact
  const shockwave = interpolate(frame, [16, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shockwaveScale = 1 + shockwave * 1.5;
  const shockwaveOpacity = (1 - shockwave) * 0.8;

  // Pulse animation for alert badge
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.15);

  // Auto redirect countdown progress bar (fills from frame 20 to 90)
  const redirectProgress = interpolate(frame, [25, 90], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 24,
        background: '#090d16',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(239, 68, 68, 0.25)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Browser Window Chrome */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {/* Window controls and Tab */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
          </div>

          {/* Active Tab trying to load */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '8px 8px 0 0',
              padding: '6px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 600,
              color: frame > 16 ? '#fca5a5' : '#94a3b8',
            }}
          >
            {frame > 16 ? (
              <span style={{ color: '#ef4444', fontWeight: 800 }}>⛔ BLOCKED:</span>
            ) : (
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }} />
            )}
            <span>Notifications (99+) • {domainName}</span>
          </div>

          <div style={{ width: 44 }} />
        </div>

        {/* Address Bar */}
        <div
          style={{
            background: 'rgba(11, 15, 25, 0.9)',
            border: frame > 16 ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13,
            fontFamily: 'monospace',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={frame > 16 ? '#ef4444' : '#64748b'} strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span
              style={{
                color: frame > 16 ? '#f87171' : '#94a3b8',
                textDecoration: frame > 16 ? 'line-through' : 'none',
              }}
            >
              {blockedUrl}
            </span>
          </div>

          {frame > 16 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.15)',
                padding: '2px 8px',
                borderRadius: 4,
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              INTERCEPTED
            </span>
          )}
        </div>
      </div>

      {/* Main Stage: Shield Lockdown Wall */}
      <div
        style={{
          flex: 1,
          padding: '28px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: 'radial-gradient(ellipse at center, rgba(30, 27, 75, 0.5) 0%, rgba(9, 13, 22, 0.95) 100%)',
        }}
      >
        {/* Hexagonal cyber grid effect in background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(rgba(239, 68, 68, 0.12) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />

        {/* Shockwave ring */}
        {shockwave > 0 && shockwave < 1 && (
          <div
            style={{
              position: 'absolute',
              width: 180,
              height: 180,
              borderRadius: '50%',
              border: '2px solid rgba(239, 68, 68, 0.7)',
              transform: `scale(${shockwaveScale})`,
              opacity: shockwaveOpacity,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Slamming Shield Badge */}
        <div
          style={{
            transform: `scale(${shieldScale})`,
            opacity: shieldOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 3,
            width: '100%',
          }}
        >
          {/* Shield Icon Container */}
          <div
            style={{
              width: 86,
              height: 86,
              borderRadius: 24,
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.35) 100%)',
              border: '2px solid rgba(239, 68, 68, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 ${25 + pulse * 15}px rgba(239, 68, 68, 0.4)`,
              marginBottom: 16,
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          {/* Alert Status Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 999,
              background: 'rgba(239, 68, 68, 0.18)',
              border: '1px solid rgba(239, 68, 68, 0.45)',
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 8px #ef4444',
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: '#fca5a5', textTransform: 'uppercase' }}>
              DISTRACTION SHIELD ENGAGED
            </span>
          </div>

          <h2
            style={{
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: -0.5,
              margin: '0 0 6px 0',
              textAlign: 'center',
              color: '#ffffff',
              textShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
            }}
          >
            ACCESS DENIED BY FOCUS PROTOCOL
          </h2>

          <p
            style={{
              fontSize: 14,
              color: '#cbd5e1',
              margin: '0 0 20px 0',
              textAlign: 'center',
              maxWidth: 620,
            }}
          >
            <span style={{ color: '#fca5a5', fontWeight: 700 }}>{category}</span> is locked during{' '}
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{focusBlockName}</span>.
          </p>

          {/* 3 Telemetry Cards Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              width: '100%',
              maxWidth: 760,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 14,
                padding: '12px 16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                Impulses Intercepted
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#f87171', marginTop: 2 }}>
                #{interceptionsToday} Today
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Dopamine trap neutralized</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 14,
                padding: '12px 16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                Deep Work Preserved
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#34d399', marginTop: 2 }}>
                +52 Minutes
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Saved from algorithmic rabbit holes</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 14,
                padding: '12px 16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                Block Countdown
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>
                {timeRemaining}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Lock releases automatically</div>
            </div>
          </div>

          {/* Auto Redirect Action Box */}
          <div
            style={{
              width: '100%',
              maxWidth: 760,
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 16,
              padding: '14px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
                  Auto-routing back to primary objective:
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>
                  {redirectUrl}
                </span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>
                {Math.round(redirectProgress)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: 6,
                borderRadius: 999,
                background: 'rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${redirectProgress}%`,
                  background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)',
                  borderRadius: 999,
                  boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
