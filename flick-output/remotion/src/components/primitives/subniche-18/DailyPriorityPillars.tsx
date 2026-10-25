import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PriorityPillarItem {
  id: string;
  rank: number;
  title: string;
  category: string;
  impactBadge: string;
  duration: string;
  status: 'active' | 'queued' | 'completed';
}

export interface DeferredTaskItem {
  id: string;
  title: string;
  reason: string;
}

export interface DailyPriorityPillarsProps {
  title?: string;
  subtitle?: string;
  timeContext?: string;
  pillars?: PriorityPillarItem[];
  deferredTasks?: DeferredTaskItem[];
  width?: number;
  height?: number;
}

const DEFAULT_PILLARS: PriorityPillarItem[] = [
  {
    id: 'p1',
    rank: 1,
    title: 'Ship V2 Checkout Flow Refactor',
    category: 'Core Engineering',
    impactBadge: 'VITAL REVENUE IMPACT',
    duration: '90m Focus Block',
    status: 'active',
  },
  {
    id: 'p2',
    rank: 2,
    title: 'Finalize Enterprise Client MSA',
    category: 'Commercial Growth',
    impactBadge: 'HIGH-LEVERAGE CLOSE',
    duration: '60m Focus Block',
    status: 'queued',
  },
  {
    id: 'p3',
    rank: 3,
    title: 'Record & Polish Product Launch Video',
    category: 'Brand & Distribution',
    impactBadge: 'LEAD GENERATION',
    duration: '45m Focus Block',
    status: 'queued',
  },
];

const DEFAULT_DEFERRED: DeferredTaskItem[] = [
  { id: 'd1', title: 'Triage 120 unread Slack channel pings', reason: 'Reactive Noise' },
  { id: 'd2', title: 'Color-code Google Drive archives', reason: 'Low-Leverage Busywork' },
  { id: 'd3', title: 'Check Stripe dashboard for the 8th time', reason: 'Dopamine Check' },
  { id: 'd4', title: 'Reply to non-urgent cold vendor pitches', reason: 'Afternoon Batch' },
];

export const DailyPriorityPillars: React.FC<DailyPriorityPillarsProps> = ({
  title = 'DAILY PRIORITY PILLARS',
  subtitle = 'The Rule of 3: Non-Negotiables First • Silence Reactive Busywork',
  timeContext = '08:30 AM MORNING TRIAGE',
  pillars = DEFAULT_PILLARS,
  deferredTasks = DEFAULT_DEFERRED,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Root entrance
  const rootEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const cardOpacity = interpolate(rootEntrance, [0, 1], [0, 1]);
  const cardScale = interpolate(rootEntrance, [0, 1], [0.94, 1]);
  const cardY = interpolate(rootEntrance, [0, 1], [24, 0]);

  // Dynamic pulse for active pillar
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.12);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 28,
        background: 'linear-gradient(150deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(245, 158, 11, 0.15)',
        backdropFilter: 'blur(20px)',
        padding: '32px 38px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Background ambient gold aura */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          left: '20%',
          width: 400,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 14px',
              borderRadius: 999,
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.45)',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#f59e0b',
                boxShadow: `0 0 ${8 + pulse * 6}px #f59e0b`,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: '#fde68a',
                textTransform: 'uppercase',
              }}
            >
              {timeContext} // STRICT 3-PILLAR RULE
            </span>
          </div>

          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: -0.5,
              margin: '2px 0 4px 0',
              background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, fontWeight: 500 }}>
            {subtitle}
          </p>
        </div>

        {/* Capacity Indicator Pill */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.85)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: 16,
            padding: '8px 16px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
            Daily Focus Capacity
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b', marginTop: 2 }}>
            3 OF 3 SLOTS LOCKED
          </div>
        </div>
      </div>

      {/* Middle: 3 Critical Pillar Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          position: 'relative',
          zIndex: 2,
          margin: '16px 0 12px 0',
        }}
      >
        {pillars.map((pillar, idx) => {
          // Staggered spring entrance
          const pSpring = spring({
            frame: frame - (idx * 8 + 6),
            fps,
            config: { damping: 14, stiffness: 120, mass: 0.8 },
          });
          const pY = interpolate(pSpring, [0, 1], [30, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const pOpacity = interpolate(pSpring, [0, 1], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const isActive = pillar.status === 'active';
          const accentBorder = isActive
            ? 'rgba(245, 158, 11, 0.7)'
            : 'rgba(255, 255, 255, 0.12)';
          const accentBg = isActive
            ? 'linear-gradient(160deg, rgba(245, 158, 11, 0.14) 0%, rgba(15, 23, 42, 0.95) 100%)'
            : 'rgba(15, 23, 42, 0.75)';

          return (
            <div
              key={pillar.id}
              style={{
                transform: `translateY(${pY}px)`,
                opacity: pOpacity,
                background: accentBg,
                border: `1.5px solid ${accentBorder}`,
                boxShadow: isActive ? '0 12px 30px rgba(245, 158, 11, 0.2)' : '0 8px 20px rgba(0,0,0,0.3)',
                borderRadius: 20,
                padding: '20px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 220,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Pillar Rank Tag & Active Marker */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)',
                      color: isActive ? '#0f172a' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: 14,
                    }}
                  >
                    #{pillar.rank}
                  </div>

                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: 1,
                      color: isActive ? '#f59e0b' : '#94a3b8',
                      background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      padding: '3px 8px',
                      borderRadius: 6,
                      textTransform: 'uppercase',
                    }}
                  >
                    {pillar.status}
                  </span>
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {pillar.category}
                </div>

                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#ffffff',
                    margin: '6px 0 12px 0',
                    lineHeight: 1.35,
                  }}
                >
                  {pillar.title}
                </h3>
              </div>

              {/* Bottom Metadata */}
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    fontSize: 10,
                    fontWeight: 800,
                    color: isActive ? '#fef08a' : '#cbd5e1',
                    background: isActive ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    padding: '3px 8px',
                    borderRadius: 6,
                    marginBottom: 10,
                    letterSpacing: 0.5,
                  }}
                >
                  {pillar.impactBadge}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color: '#64748b',
                    fontWeight: 600,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{pillar.duration}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Blurred Secondary Tasks with Lock Stamp */}
      <div
        style={{
          position: 'relative',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
          padding: '16px 22px',
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        {/* Background list blurred out */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            filter: 'blur(3.5px)',
            opacity: 0.28,
            userSelect: 'none',
          }}
        >
          {deferredTasks.map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: '#cbd5e1',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#64748b' }} />
              <span style={{ textDecoration: 'line-through' }}>{t.title}</span>
            </div>
          ))}
        </div>

        {/* Lock Overlay Banner */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            background: 'rgba(15, 23, 42, 0.88)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fca5a5', letterSpacing: 0.5 }}>
                SECONDARY BACKLOG BLURRED & FROZEN
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                All non-pillar tasks deferred to afternoon batch processing (after 16:00).
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#f59e0b',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              padding: '6px 14px',
              borderRadius: 999,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            RULE: &le; 3 PRIORITIES ONLY
          </div>
        </div>
      </div>
    </div>
  );
};
