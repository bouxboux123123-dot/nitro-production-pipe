import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ShutdownItem {
  id: string;
  title: string;
  subtext: string;
  triggerFrame: number;
  icon: 'inbox' | 'plan' | 'desk';
}

export interface EveningShutdownChecklistProps {
  title?: string;
  subtitle?: string;
  ritualTime?: string;
  shutdownItems?: ShutdownItem[];
  completionStatement?: string;
  width?: number;
  height?: number;
}

const DEFAULT_SHUTDOWN_ITEMS: ShutdownItem[] = [
  {
    id: 's1',
    title: 'Inbox Zero & Critical Slack Resolved',
    subtext: 'No urgent fires left unflagged; notifications muted until 08:30',
    triggerFrame: 20,
    icon: 'inbox',
  },
  {
    id: 's2',
    title: "Tomorrow's Top 3 Priorities Written Down",
    subtext: 'Morning decision fatigue eliminated before going to sleep',
    triggerFrame: 46,
    icon: 'plan',
  },
  {
    id: 's3',
    title: 'Physical & Digital Workspace Cleared',
    subtext: 'Browser tabs closed, notes wiped, laptop shut completely',
    triggerFrame: 72,
    icon: 'desk',
  },
];

export const EveningShutdownChecklist: React.FC<EveningShutdownChecklistProps> = ({
  title = 'EVENING SHUTDOWN PROTOCOL',
  subtitle = 'Psychological Closure Ritual • Protect Recovery • Prevent Burnout',
  ritualTime = '17:30 END OF DAY RITUAL',
  shutdownItems = DEFAULT_SHUTDOWN_ITEMS,
  completionStatement = 'SHUTDOWN COMPLETE // REST PROTOCOL SECURED',
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Root entrance
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const cardOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const cardScale = interpolate(entrance, [0, 1], [0.94, 1]);
  const cardY = interpolate(entrance, [0, 1], [24, 0]);

  // Calculate completed count and progress ratio
  let completedCount = 0;
  shutdownItems.forEach((item) => {
    if (frame >= item.triggerFrame) {
      completedCount += 1;
    }
  });

  const isAllComplete = completedCount === shutdownItems.length;

  // Spring animation for final banner when all complete
  const allCompleteSpring = spring({
    frame: frame - 78,
    fps,
    config: { damping: 12, stiffness: 150, mass: 0.8 },
  });

  const bannerScale = interpolate(allCompleteSpring, [0, 1], [0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bannerOpacity = interpolate(allCompleteSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse factor for complete state
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.15);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 28,
        background: 'linear-gradient(150deg, rgba(15, 23, 42, 0.96) 0%, rgba(20, 30, 48, 0.92) 100%)',
        border: isAllComplete
          ? '1.5px solid rgba(16, 185, 129, 0.55)'
          : '1px solid rgba(56, 189, 248, 0.3)',
        boxShadow: isAllComplete
          ? `0 24px 60px rgba(0, 0, 0, 0.75), 0 0 ${25 + pulse * 15}px rgba(16, 185, 129, 0.3)`
          : '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.15)',
        backdropFilter: 'blur(20px)',
        padding: '34px 42px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Background ambient emerald/cyan glow */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: '15%',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: isAllComplete
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, transparent 70%)',
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
              background: isAllComplete ? 'rgba(16, 185, 129, 0.18)' : 'rgba(56, 189, 248, 0.15)',
              border: isAllComplete ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(56, 189, 248, 0.45)',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isAllComplete ? '#10b981' : '#38bdf8',
                boxShadow: `0 0 8px ${isAllComplete ? '#10b981' : '#38bdf8'}`,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: isAllComplete ? '#6ee7b7' : '#7dd3fc',
                textTransform: 'uppercase',
              }}
            >
              {ritualTime} // 3-STEP CLOSEOUT
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

        {/* Progress Tracker Pill */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.85)',
            border: isAllComplete ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 16,
            padding: '8px 18px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
            Checklist Progress
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: isAllComplete ? '#34d399' : '#ffffff',
              marginTop: 2,
            }}
          >
            {completedCount} OF {shutdownItems.length} COMPLETED
          </div>
        </div>
      </div>

      {/* Middle: 3 Big Checklist Rows */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          position: 'relative',
          zIndex: 2,
          margin: '12px 0',
        }}
      >
        {shutdownItems.map((item, idx) => {
          const isDone = frame >= item.triggerFrame;

          // Spring for check pop
          const checkSpring = spring({
            frame: frame - item.triggerFrame,
            fps,
            config: { damping: 12, stiffness: 160, mass: 0.7 },
          });

          const checkScale = isDone
            ? interpolate(checkSpring, [0, 1], [0.5, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : 1;

          return (
            <div
              key={item.id}
              style={{
                background: isDone
                  ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)'
                  : 'rgba(15, 23, 42, 0.75)',
                border: isDone
                  ? '1.5px solid rgba(16, 185, 129, 0.45)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 18,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'border 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Checkbox Icon Circle */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: isDone ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                    border: isDone ? 'none' : '2px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transform: `scale(${checkScale})`,
                    boxShadow: isDone ? '0 0 16px rgba(16, 185, 129, 0.5)' : 'none',
                  }}
                >
                  {isDone ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>
                      {idx + 1}
                    </span>
                  )}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: isDone ? '#ffffff' : '#94a3b8',
                      textDecoration: isDone ? 'none' : 'none',
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12, color: isDone ? '#a7f3d0' : '#64748b', marginTop: 3 }}>
                    {item.subtext}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: isDone ? '#34d399' : '#64748b',
                  background: isDone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  padding: '5px 12px',
                  borderRadius: 8,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                {isDone ? 'COMPLETED [✓]' : 'PENDING'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Completion Banner */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        {isAllComplete ? (
          <div
            style={{
              transform: `scale(${bannerScale})`,
              opacity: bannerOpacity,
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 95, 70, 0.3) 100%)',
              border: '1.5px solid rgba(16, 185, 129, 0.6)',
              borderRadius: 20,
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                  <line x1="12" y1="2" x2="12" y2="12" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', letterSpacing: 1 }}>
                  {completionStatement}
                </div>
                <div style={{ fontSize: 11, color: '#a7f3d0' }}>
                  Zero lingering work thoughts. Tomorrow is entirely pre-decided.
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: '#10b981',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '6px 14px',
                borderRadius: 999,
                letterSpacing: 0.5,
              }}
            >
              LAPTOP CLOSED
            </div>
          </div>
        ) : (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 20,
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
                Finish remaining items to engage full subconscious recovery.
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              EST. TIME: ~3 MINS
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
