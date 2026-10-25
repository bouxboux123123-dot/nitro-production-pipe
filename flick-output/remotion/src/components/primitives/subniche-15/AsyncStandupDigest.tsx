import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StandupBulletItem {
  type: 'done' | 'today' | 'blocker';
  tag: string;
  tagColor: string;
  tagBg: string;
  headline: string;
  detail: string;
  metric?: string;
}

export interface AsyncStandupDigestProps {
  botName?: string;
  channelName?: string;
  authorName?: string;
  authorRole?: string;
  avatarSeed?: string;
  timeSavedMinutes?: number;
  readDurationSeconds?: number;
  bullets?: StandupBulletItem[];
}

export const AsyncStandupDigest: React.FC<AsyncStandupDigestProps> = ({
  botName = 'AsyncPulse Bot',
  channelName = '#eng-core-standup',
  authorName = 'Alex Chen',
  authorRole = 'Staff Infrastructure Lead (Berlin, UTC+1)',
  timeSavedMinutes = 45,
  readDurationSeconds = 42,
  bullets = [
    {
      type: 'done',
      tag: 'COMPLETED YESTERDAY',
      tagColor: '#34d399',
      tagBg: 'rgba(52, 211, 153, 0.15)',
      headline: 'PostgreSQL 16 Zero-Downtime Partitioning (PR #892)',
      detail: 'Migrated 42M rows across 8 geo-shards with zero query latency spikes during peak European traffic.',
      metric: '+41% query throughput',
    },
    {
      type: 'today',
      tag: 'IN FLIGHT TODAY',
      tagColor: '#38bdf8',
      tagBg: 'rgba(56, 189, 248, 0.15)',
      headline: 'Cloudflare Edge Token Validation & Rate Limiter',
      detail: 'Benchmarking Redis cluster latency in Tokyo and US-East; releasing canary build to 5% enterprise traffic.',
      metric: 'Ship target: 16:30 UTC',
    },
    {
      type: 'blocker',
      tag: 'BLOCKERS & DEPENDENCIES',
      tagColor: '#fbbf24',
      tagBg: 'rgba(251, 191, 36, 0.15)',
      headline: 'Zero hard blockers • Async hand-off ready',
      detail: 'Awaiting async IAM signature from @sarah_sec (NYC). PR walkthrough Loom recorded (2m 15s).',
      metric: 'Loom video attached',
    },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });

  // Call cancellation strike animation
  const strikeProgress = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Glow pulse for the async digest pill
  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.15, 0.35]
  );

  return (
    <div
      style={{
        width: 880,
        height: 620,
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        borderRadius: 24,
        border: '1px solid rgba(148, 163, 184, 0.18)',
        boxShadow:
          '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 45px rgba(52, 211, 153, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        transform: `scale(${entrance})`,
        opacity: entrance,
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 85% 15%, rgba(52, 211, 153, 0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header comparison strip: Zoom vs Async Bot */}
      <div
        style={{
          padding: '14px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        {/* Left: 45m Zoom Call Struck Out */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: 0.85,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              position: 'relative',
              padding: '6px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              borderRadius: 8,
              border: '1px solid rgba(239, 68, 68, 0.25)',
            }}
          >
            {/* Strike-through line */}
            <div
              style={{
                position: 'absolute',
                left: 6,
                right: 6,
                top: '50%',
                height: 2,
                backgroundColor: '#ef4444',
                transform: `scaleX(${strikeProgress})`,
                transformOrigin: 'left center',
                boxShadow: '0 0 6px #ef4444',
                zIndex: 3,
              }}
            />
            <span style={{ fontSize: 13 }}>📹</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fca5a5' }}>
              45-Min Morning Zoom Standup
            </span>
            <span style={{ fontSize: 11, color: '#f87171' }}>(6 Eng Hours Lost)</span>
          </div>

          <span style={{ fontSize: 14, color: '#64748b', fontWeight: 800 }}>➔</span>

          {/* Right: Async Bot Activated */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              backgroundColor: `rgba(52, 211, 153, ${glowIntensity})`,
              borderRadius: 8,
              border: '1px solid rgba(52, 211, 153, 0.5)',
              boxShadow: '0 0 16px rgba(52, 211, 153, 0.2)',
            }}
          >
            <span style={{ fontSize: 13 }}>⚡</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#a7f3d0' }}>
              Async Bot Standup ({readDurationSeconds}s Read)
            </span>
          </div>
        </div>

        {/* Time saved tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: 20,
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            fontSize: 11,
            fontWeight: 800,
            color: '#38bdf8',
          }}
        >
          <span>⏱️ +{timeSavedMinutes}m Saved / Dev</span>
        </div>
      </div>

      {/* Standup Card Body */}
      <div
        style={{
          flex: 1,
          padding: '20px 28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        {/* Author / Bot Profile Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 12,
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Avatar with status indicator */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 15,
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
              >
                AC
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#34d399',
                  border: '2px solid #0f172a',
                  boxShadow: '0 0 6px #34d399',
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>
                  {authorName}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontWeight: 700,
                  }}
                >
                  {botName}
                </span>
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  in {channelName}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                {authorRole} • Submitted at 08:58 AM (Async)
              </div>
            </div>
          </div>

          {/* Audio/Loom Attachment preview */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid white',
                  borderTop: '3.5px solid transparent',
                  borderBottom: '3.5px solid transparent',
                  marginLeft: 2,
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9' }}>
                Loom Walkthrough
              </span>
              <span style={{ fontSize: 9, color: '#94a3b8' }}>2m 15s • 1.5x speed</span>
            </div>
          </div>
        </div>

        {/* 3 Progress Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bullets.map((bullet, idx) => {
            const itemEntrance = spring({
              frame: frame - 12 - idx * 8,
              fps,
              config: { damping: 16, stiffness: 110 },
            });

            return (
              <div
                key={bullet.type}
                style={{
                  opacity: itemEntrance,
                  transform: `translateY(${(1 - itemEntrance) * 15}px)`,
                  padding: '12px 16px',
                  backgroundColor: 'rgba(30, 41, 59, 0.55)',
                  borderRadius: 14,
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Accent vertical line */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    backgroundColor: bullet.tagColor,
                  }}
                />

                {/* Status icon badge */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: bullet.tagBg,
                    border: `1px solid ${bullet.tagColor}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {bullet.type === 'done' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={bullet.tagColor} strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                  {bullet.type === 'today' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={bullet.tagColor} strokeWidth="2.5">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  )}
                  {bullet.type === 'blocker' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={bullet.tagColor} strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                </div>

                {/* Content details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: bullet.tagColor,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {bullet.tag}
                    </div>
                    {bullet.metric && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#cbd5e1',
                          backgroundColor: 'rgba(255, 255, 255, 0.07)',
                          padding: '2px 8px',
                          borderRadius: 4,
                        }}
                      >
                        {bullet.metric}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', marginTop: 3 }}>
                    {bullet.headline}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 3, lineHeight: 1.4 }}>
                    {bullet.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reaction Bar & Stats Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 8,
          }}
        >
          {/* Reaction chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[
              { emoji: '🚀', count: 5, active: true },
              { emoji: '🔥', count: 4, active: true },
              { emoji: '👀', count: 3, active: false },
              { emoji: '🙌', count: 2, active: false },
            ].map((rxn) => (
              <div
                key={rxn.emoji}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 10px',
                  borderRadius: 20,
                  backgroundColor: rxn.active ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: rxn.active ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: rxn.active ? '#38bdf8' : '#94a3b8',
                }}
              >
                <span>{rxn.emoji}</span>
                <span>{rxn.count}</span>
              </div>
            ))}
          </div>

          {/* Reading Speed Metric */}
          <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#34d399' }} />
            <span>Read by 12/12 team members</span>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div
        style={{
          height: 42,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          fontSize: 11,
          color: '#94a3b8',
          zIndex: 3,
        }}
      >
        <div>
          Protocol: <span style={{ color: '#34d399', fontWeight: 600 }}>Zero Sync Meetings</span> • Continuous Asynchronous Velocity
        </div>
        <div style={{ color: '#64748b' }}>StandupPulse v4.1</div>
      </div>
    </div>
  );
};
