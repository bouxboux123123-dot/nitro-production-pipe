import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CalendarDayPost {
  dayNumber: number;
  label: string;
  time: string;
  channels: ('yt' | 'tt' | 'ig' | 'li')[];
  type: string;
}

export interface OmniChannelCalendarGridProps {
  title?: string;
  subtitle?: string;
  monthName?: string;
  totalPosts?: number;
  width?: number;
  height?: number;
}

const POST_TYPES = ['Viral Hook', 'Framework', 'Tutorial', 'Case Study', 'Tool Review', 'Contrarian', 'SOP Guide'];

// Pre-generate 30 days of coordinated posts
const CALENDAR_POSTS: CalendarDayPost[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const timeSlots = ['09:15 AM', '01:45 PM', '07:30 PM'];
  const assignedTime = timeSlots[i % timeSlots.length];
  const postType = POST_TYPES[i % POST_TYPES.length];

  return {
    dayNumber: day,
    label: `Post #${day < 10 ? '0' + day : day}`,
    time: assignedTime,
    channels: ['yt', 'tt', 'ig', 'li'],
    type: postType,
  };
});

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const OmniChannelCalendarGrid: React.FC<OmniChannelCalendarGridProps> = ({
  title = '30-DAY CONTENT MATRIX AUTO-SCHEDULER',
  subtitle = '1 Master Clip → 30 Coordinated Multi-Platform Drops in 2 Seconds',
  monthName = 'NOVEMBER 2026',
  totalPosts = 30,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.93, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [24, 0]);

  // Rapid filling across 30 days in ~2 seconds (frame 8 to 58)
  const scheduledCount = Math.min(
    totalPosts,
    Math.floor(
      interpolate(frame, [8, 56], [0, totalPosts], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    )
  );

  const fillProgressPct = Math.round((scheduledCount / totalPosts) * 100);

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
        padding: '22px 26px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
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
          paddingBottom: 12,
          marginBottom: 12,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Calendar icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 16.5,
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
                    fillProgressPct < 100
                      ? 'rgba(56, 189, 248, 0.2)'
                      : 'rgba(16, 185, 129, 0.25)',
                  color: fillProgressPct < 100 ? '#38bdf8' : '#34d399',
                  border: `1px solid ${
                    fillProgressPct < 100
                      ? 'rgba(56, 189, 248, 0.4)'
                      : 'rgba(16, 185, 129, 0.4)'
                  }`,
                }}
              >
                {fillProgressPct < 100 ? 'AUTO-FILL IN PROGRESS' : '30/30 DAYS ARMED'}
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 1 }}>
              {subtitle}
            </div>
          </div>
        </div>

        {/* Counter Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '6px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: 9.5,
                color: '#94a3b8',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Scheduled Queue
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: fillProgressPct === 100 ? '#34d399' : '#38bdf8',
                fontFamily: 'monospace',
              }}
            >
              {scheduledCount} / {totalPosts} POSTS
            </div>
          </div>
        </div>
      </div>

      {/* SUB-HEADER CONTROLS & PLATFORMS KEY */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 12,
          padding: '6px 14px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: 10,
          fontSize: 11,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
            {monthName}
          </span>
          <span style={{ color: '#475569' }}>•</span>
          <span style={{ color: '#94a3b8' }}>Cadence: 1 Daily Drop × 4 Networks</span>
        </div>

        {/* Channel dot indicators legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <span style={{ fontSize: 10, color: '#cbd5e1' }}>Shorts</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#06b6d4' }} />
            <span style={{ fontSize: 10, color: '#cbd5e1' }}>TikTok</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ec4899' }} />
            <span style={{ fontSize: 10, color: '#cbd5e1' }}>Reels</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3b82f6' }} />
            <span style={{ fontSize: 10, color: '#cbd5e1' }}>LinkedIn</span>
          </div>
        </div>
      </div>

      {/* WEEKDAY COLUMN LABELS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 6,
          marginBottom: 6,
          textAlign: 'center',
          fontSize: 10,
          fontWeight: 700,
          color: '#64748b',
          zIndex: 2,
        }}
      >
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 30-DAY CALENDAR GRID (5 rows x 7 cols) */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridTemplateRows: 'repeat(5, 1fr)',
          gap: 6,
          zIndex: 2,
        }}
      >
        {Array.from({ length: 35 }).map((_, idx) => {
          const post = CALENDAR_POSTS[idx];
          const isPostDay = !!post;

          if (!isPostDay) {
            // Empty placeholder cell for days 31-35
            return (
              <div
                key={`empty-${idx}`}
                style={{
                  borderRadius: 10,
                  background: 'rgba(15, 23, 42, 0.3)',
                  border: '1px dashed rgba(255, 255, 255, 0.04)',
                  opacity: 0.3,
                }}
              />
            );
          }

          // Staggered pop-in calculation: Frame 8 + (idx * 1.5)
          const cellStartFrame = 8 + idx * 1.5;
          const isPopulated = frame >= cellStartFrame;
          const popSpring = spring({
            frame: frame - cellStartFrame,
            fps,
            config: { damping: 12, stiffness: 150, mass: 0.6 },
          });

          const cellScale = isPopulated
            ? interpolate(popSpring, [0, 1], [0.85, 1])
            : 0.9;
          const cellOpacity = isPopulated
            ? interpolate(popSpring, [0, 1], [0.4, 1])
            : 0.35;

          return (
            <div
              key={post.dayNumber}
              style={{
                borderRadius: 10,
                opacity: cellOpacity,
                transform: `scale(${cellScale})`,
                background: isPopulated
                  ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)'
                  : 'rgba(15, 23, 42, 0.4)',
                border: isPopulated
                  ? '1px solid rgba(56, 189, 248, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: isPopulated
                  ? '0 4px 12px -2px rgba(0,0,0,0.5), 0 0 10px rgba(56, 189, 248, 0.15)'
                  : 'none',
                padding: '6px 8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.15s ease',
              }}
            >
              {/* Top Row: Day Number & Mini Checkmark */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: isPopulated ? '#f8fafc' : '#64748b',
                  }}
                >
                  {post.dayNumber < 10 ? `0${post.dayNumber}` : post.dayNumber}
                </span>

                {isPopulated && (
                  <span
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.25)',
                      color: '#34d399',
                      fontSize: 8.5,
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>

              {/* Middle: Post Type & Timing */}
              <div>
                <div
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: isPopulated ? '#38bdf8' : '#475569',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {isPopulated ? post.type : 'Pending'}
                </div>
                <div
                  style={{
                    fontSize: 7.5,
                    color: '#94a3b8',
                    marginTop: 1,
                  }}
                >
                  {post.time}
                </div>
              </div>

              {/* Bottom: 4 Channel dots */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  marginTop: 2,
                }}
              >
                <span
                  style={{
                    width: 4.5,
                    height: 4.5,
                    borderRadius: '50%',
                    backgroundColor: isPopulated ? '#ef4444' : '#334155',
                  }}
                />
                <span
                  style={{
                    width: 4.5,
                    height: 4.5,
                    borderRadius: '50%',
                    backgroundColor: isPopulated ? '#06b6d4' : '#334155',
                  }}
                />
                <span
                  style={{
                    width: 4.5,
                    height: 4.5,
                    borderRadius: '50%',
                    backgroundColor: isPopulated ? '#ec4899' : '#334155',
                  }}
                />
                <span
                  style={{
                    width: 4.5,
                    height: 4.5,
                    borderRadius: '50%',
                    backgroundColor: isPopulated ? '#3b82f6' : '#334155',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM SUMMARY ROW */}
      <div
        style={{
          marginTop: 12,
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
          <span>Time Saved: 42.5 hrs/mo • 1 Master Clip → 30 Automated Daily Drops</span>
        </div>
        <div style={{ color: '#38bdf8', fontWeight: 600 }}>
          Zero Manual Uploads Needed
        </div>
      </div>
    </div>
  );
};
