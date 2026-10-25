import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FeedPlatform {
  id: string;
  name: string;
  handle: string;
  badge: string;
  primaryColor: string;
  secondaryColor: string;
  metadata: string;
  pingMs: number;
}

export interface MultiFeedPublisherProps {
  title?: string;
  subtitle?: string;
  videoTitle?: string;
  videoSpecs?: string;
  platforms?: FeedPlatform[];
  width?: number;
  height?: number;
}

const DEFAULT_PLATFORMS: FeedPlatform[] = [
  {
    id: 'yt-shorts',
    name: 'YouTube Shorts',
    handle: '@alexrivera.biz',
    badge: 'MONETIZED • 4K HDR',
    primaryColor: '#ef4444', // Red
    secondaryColor: '#b91c1c',
    metadata: 'Category: Education • Tags Auto-Appended',
    pingMs: 384,
  },
  {
    id: 'tiktok',
    name: 'TikTok Feed',
    handle: '@alexrivera_ai',
    badge: 'ALGO-OPTIMIZED • TRENDING SOUND',
    primaryColor: '#06b6d4', // Cyan / TikTok
    secondaryColor: '#f43f5e', // TikTok pink
    metadata: 'Sound Match: 100% • Duet & Stitch Enabled',
    pingMs: 412,
  },
  {
    id: 'ig-reels',
    name: 'Instagram Reels',
    handle: '@alex.rivera.official',
    badge: 'FEED & PROFILE GRID PINNED',
    primaryColor: '#ec4899', // Pink / Insta
    secondaryColor: '#f97316', // Orange
    metadata: 'Cover Frame Auto-Picked • Recommended on FB',
    pingMs: 296,
  },
];

export const MultiFeedPublisher: React.FC<MultiFeedPublisherProps> = ({
  title = 'OMNICHANNEL 1-CLICK DISPATCH',
  subtitle = 'Simultaneous API Broadcast: Shorts • TikTok • Reels',
  videoTitle = '3 AI Tools That Replace a $5,000 Marketing Agency',
  videoSpecs = '1080×1920 Vertical • 58s Duration • Auto-Captions • 5 Viral Tags',
  platforms = DEFAULT_PLATFORMS,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master card entrance
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.93, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [24, 0]);

  // Click animation triggers at frame 22
  const clickFrame = 22;
  const isClicked = frame >= clickFrame;
  const buttonPressSpring = spring({
    frame: frame - clickFrame,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.6 },
  });
  const buttonScale = isClicked
    ? interpolate(buttonPressSpring, [0, 0.4, 1], [1, 0.92, 1])
    : 1;

  // Expanding shockwave ripple from button
  const rippleProgress = isClicked
    ? interpolate(frame - clickFrame, [0, 45], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Beam animation travel progress (0 to 1)
  const beamProgress = interpolate(frame, [25, 45], [0, 1], {
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
        background:
          'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.90) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow:
          '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.15)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background glow flares */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '20%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -50,
          right: -50,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 14,
          marginBottom: 14,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Dispatch antenna icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4.5c1.45-1.47 4.5-2 4.5-2" />
              <path d="M15 6v5s3.03-.55 4.5-2c1.47-1.45 2-4.5 2-4.5" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
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
                  padding: '2px 8px',
                  borderRadius: 9999,
                  background:
                    beamProgress < 1
                      ? isClicked
                        ? 'rgba(56, 189, 248, 0.25)'
                        : 'rgba(245, 158, 11, 0.25)'
                      : 'rgba(16, 185, 129, 0.25)',
                  color:
                    beamProgress < 1
                      ? isClicked
                        ? '#38bdf8'
                        : '#fbbf24'
                      : '#34d399',
                  border: `1px solid ${
                    beamProgress < 1
                      ? isClicked
                        ? 'rgba(56, 189, 248, 0.5)'
                        : 'rgba(245, 158, 11, 0.4)'
                      : 'rgba(16, 185, 129, 0.4)'
                  }`,
                }}
              >
                {!isClicked
                  ? 'AWAITING DISPATCH'
                  : beamProgress < 1
                  ? 'SHOOTING TO FEEDS...'
                  : '3 CHANNELS LIVE (100%)'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              {subtitle}
            </div>
          </div>
        </div>

        {/* Sync Rate Readout */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '6px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: 10,
                color: '#94a3b8',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Simultaneous Sync
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>
              3 Live Targets • 0s Delay
            </div>
          </div>
        </div>
      </div>

      {/* Asset Metadata Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 12,
          padding: '8px 14px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: 16,
          fontSize: 12,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: 4,
              backgroundColor: 'rgba(56, 189, 248, 0.2)',
              color: '#38bdf8',
              fontWeight: 800,
              fontSize: 10,
            }}
          >
            MASTER REEL
          </span>
          <span style={{ fontWeight: 700, color: '#f8fafc' }}>{videoTitle}</span>
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>{videoSpecs}</div>
      </div>

      {/* MAIN DISPATCH STAGE: CENTRAL BUTTON ON LEFT, SHOOTING BEAMS TO 3 PLATFORMS ON RIGHT */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: 20,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* SVG BEAMS OVERLAY (Shooting from Center-Left button to the 3 platform cards) */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {platforms.map((p, pIdx) => {
            // Origin is button right center (~250px X, 160px Y)
            const startX = 260;
            const startY = 160;
            // Target is platform card left edge (~380px X, varying Y)
            const targetX = 380;
            const targetY = 55 + pIdx * 105;

            // Animated dash offset to create flowing laser line
            const dashOffset = -frame * 6;

            return (
              <g key={p.id}>
                {/* Base track */}
                <path
                  d={`M ${startX} ${startY} C ${startX + 60} ${startY}, ${
                    targetX - 60
                  } ${targetY}, ${targetX} ${targetY}`}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Animated Glowing Laser Stream when clicked */}
                {isClicked && (
                  <path
                    d={`M ${startX} ${startY} C ${startX + 60} ${startY}, ${
                      targetX - 60
                    } ${targetY}, ${targetX} ${targetY}`}
                    fill="none"
                    stroke={p.primaryColor}
                    strokeWidth="3.5"
                    strokeDasharray="12 8"
                    strokeDashoffset={dashOffset}
                    style={{
                      filter: `drop-shadow(0 0 8px ${p.primaryColor})`,
                      opacity: beamProgress,
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* LEFT: MASTER PUBLISH COMMAND CONSOLE */}
        <div
          style={{
            width: 260,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.75)',
            borderRadius: 18,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px 16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Shockwave ripple */}
          {isClicked && rippleProgress < 1 && (
            <div
              style={{
                position: 'absolute',
                width: 220,
                height: 220,
                borderRadius: '50%',
                border: '2px solid #38bdf8',
                transform: `scale(${rippleProgress * 2})`,
                opacity: 1 - rippleProgress,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Central Mega Publish Trigger Button */}
          <div
            style={{
              transform: `scale(${buttonScale})`,
              transition: 'transform 0.1s ease-out',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: '50%',
                background: isClicked
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid ${
                  isClicked ? '#34d399' : 'rgba(255, 255, 255, 0.4)'
                }`,
                boxShadow: isClicked
                  ? '0 0 35px rgba(16, 185, 129, 0.6), inset 0 0 15px rgba(255,255,255,0.3)'
                  : '0 0 35px rgba(56, 189, 248, 0.5), inset 0 0 15px rgba(255,255,255,0.3)',
              }}
            >
              {isClicked ? (
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              )}
            </div>

            <div
              style={{
                marginTop: 14,
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: '0.05em',
                color: isClicked ? '#34d399' : '#38bdf8',
                textAlign: 'center',
                textTransform: 'uppercase',
              }}
            >
              {isClicked ? 'DISPATCHED' : 'PUBLISH NOW'}
            </div>
            <div
              style={{
                fontSize: 10,
                color: '#94a3b8',
                marginTop: 4,
                textAlign: 'center',
              }}
            >
              {isClicked
                ? 'Payload sent to 3 feeds'
                : 'Triggers simultaneous sync'}
            </div>
          </div>

          {/* Quick metric pill under button */}
          <div
            style={{
              marginTop: 20,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: 10,
              color: '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#34d399',
              }}
            />
            <span>3 Webhooks Armed & Ready</span>
          </div>
        </div>

        {/* RIGHT: 3 DESTINATION PLATFORM CARDS */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 2,
          }}
        >
          {platforms.map((platform, idx) => {
            // Platform specific progress filling from frame 26 to 55 + idx*5
            const startFill = 26 + idx * 4;
            const endFill = 52 + idx * 5;

            const progressPct = interpolate(
              frame,
              [startFill, endFill],
              [0, 100],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }
            );

            const isDone = progressPct >= 100;

            return (
              <div
                key={platform.id}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                  borderRadius: 14,
                  border: `1px solid ${
                    isDone ? platform.primaryColor : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  padding: '12px 16px',
                  boxShadow: isDone
                    ? `0 4px 20px -4px ${platform.primaryColor}40`
                    : 'none',
                  transition: 'border-color 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Active glow corner */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 4,
                    backgroundColor: platform.primaryColor,
                    boxShadow: `0 0 10px ${platform.primaryColor}`,
                  }}
                />

                {/* Top Row: Icon, Name, Handle, Status Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Platform Logo Circle */}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: platform.primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 10px ${platform.primaryColor}88`,
                      }}
                    >
                      {platform.id === 'yt-shorts' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                      {platform.id === 'tiktok' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.7V16a4 4 0 0 1-4 4" />
                        </svg>
                      )}
                      {platform.id === 'ig-reels' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                          <rect x="2" y="2" width="20" height="20" rx="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      )}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: '#f8fafc',
                        }}
                      >
                        {platform.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>
                        {platform.handle}
                      </div>
                    </div>
                  </div>

                  {/* Status pill */}
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: isDone
                        ? `${platform.primaryColor}25`
                        : 'rgba(255, 255, 255, 0.08)',
                      color: isDone ? platform.primaryColor : '#94a3b8',
                      border: `1px solid ${
                        isDone
                          ? `${platform.primaryColor}60`
                          : 'rgba(255, 255, 255, 0.1)'
                      }`,
                    }}
                  >
                    {isDone
                      ? 'SYNCED & LIVE'
                      : progressPct > 0
                      ? `UPLOADING ${Math.round(progressPct)}%`
                      : 'QUEUED'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    height: 5,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progressPct}%`,
                      background: `linear-gradient(90deg, ${platform.primaryColor}, ${platform.secondaryColor})`,
                      boxShadow: `0 0 8px ${platform.primaryColor}`,
                      transition: 'width 0.1s linear',
                    }}
                  />
                </div>

                {/* Card Sub-metadata */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 10,
                    color: '#64748b',
                  }}
                >
                  <span>{platform.metadata}</span>
                  <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                    HTTP {isDone ? '200' : '---'} ({platform.pingMs}ms)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM METRICS BAR */}
      <div
        style={{
          marginTop: 14,
          paddingTop: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 11,
          color: '#94a3b8',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
          <span>API Tokens: YouTube Partner API • TikTok Business • Instagram Graph v19</span>
        </div>
        <div style={{ color: '#38bdf8', fontWeight: 600 }}>
          Distribution Multiplier: 300% Reach
        </div>
      </div>
    </div>
  );
};
