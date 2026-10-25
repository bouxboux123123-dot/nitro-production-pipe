import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PomodoroRadialTimerProps {
  title?: string;
  subtitle?: string;
  taskName?: string;
  totalMinutes?: number;
  remainingMinutes?: number;
  remainingSeconds?: number;
  intervalIndex?: number;
  totalIntervals?: number;
  streakCount?: number;
  accentColor?: string;
  width?: number;
  height?: number;
}

export const PomodoroRadialTimer: React.FC<PomodoroRadialTimerProps> = ({
  title = '25-MIN DEEP WORK BLOCK',
  subtitle = 'Zero Multitasking • Blacklist Engaged • Flow State',
  taskName = 'Refactor Core Architecture & Schema',
  totalMinutes = 25,
  remainingMinutes = 21,
  remainingSeconds = 48,
  intervalIndex = 3,
  totalIntervals = 4,
  streakCount = 3,
  accentColor = '#f43f5e', // Vibrant Pomodoro Rose
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro card entrance
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const cardOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const cardScale = interpolate(entrance, [0, 1], [0.94, 1]);
  const cardY = interpolate(entrance, [0, 1], [24, 0]);

  // Dial progress spring animation
  const dialSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 18, stiffness: 80, mass: 1 },
  });

  // Calculate dynamic countdown display
  // Assume a 25 min total; animate slightly as frames progress for video realism
  const elapsedSecSimulated = Math.floor(frame / 6); // advance simulated seconds
  const currentTotalSec = Math.max(
    0,
    remainingMinutes * 60 + remainingSeconds - elapsedSecSimulated
  );
  const displayMin = Math.floor(currentTotalSec / 60);
  const displaySec = currentTotalSec % 60;
  const formattedTime = `${String(displayMin).padStart(2, '0')}:${String(displaySec).padStart(2, '0')}`;

  // Circular dial math
  const radius = 135;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // Progress from 0 (just started) to 1 (session done)
  const targetProgress = 1 - currentTotalSec / (totalMinutes * 60);
  const animatedProgress = interpolate(dialSpring, [0, 1], [0, targetProgress], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const strokeDashoffset = circumference * (1 - animatedProgress);

  // Pulsing glow factor
  const pulseFactor = 0.5 + 0.5 * Math.sin(frame * 0.12);
  const glowShadow = `0 0 ${16 + pulseFactor * 12}px ${accentColor}66`;

  // Orbiting indicator dot coordinates
  const angle = animatedProgress * 2 * Math.PI - Math.PI / 2;
  const cx = 170;
  const cy = 170;
  const dotX = cx + radius * Math.cos(angle);
  const dotY = cy + radius * Math.sin(angle);

  // Ticks around dial
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const tickAngle = (i / 48) * 2 * Math.PI - Math.PI / 2;
    const innerR = i % 4 === 0 ? radius - 24 : radius - 18;
    const outerR = radius - 12;
    const x1 = cx + innerR * Math.cos(tickAngle);
    const y1 = cy + innerR * Math.sin(tickAngle);
    const x2 = cx + outerR * Math.cos(tickAngle);
    const y2 = cy + outerR * Math.sin(tickAngle);
    const isPassed = i / 48 <= animatedProgress;
    return { x1, y1, x2, y2, isPassed, isMajor: i % 4 === 0 };
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 28,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.90) 100%)',
        border: '1px solid rgba(244, 63, 94, 0.28)',
        boxShadow: `0 24px 60px rgba(0, 0, 0, 0.65), ${glowShadow}`,
        backdropFilter: 'blur(20px)',
        padding: '36px 44px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Background ambient radial glow */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          left: '30%',
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}25 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Row */}
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
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.45)',
              marginBottom: 8,
            }}
          >
            {/* Pulsing Red Dot */}
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: accentColor,
                boxShadow: `0 0 ${8 + pulseFactor * 6}px ${accentColor}`,
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: '#fda4af',
                textTransform: 'uppercase',
              }}
            >
              FOCUS BLOCK #{intervalIndex} // ACTIVE
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
          <p
            style={{
              fontSize: 14,
              color: '#94a3b8',
              margin: 0,
              fontWeight: 500,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Streak Counter Pill */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 16,
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.5 7 5 9.5 5 14a7 7 0 0014 0c0-4.5-3.5-7-7-12z"
              fill="url(#flameGrad)"
            />
            <path
              d="M12 11c-1.5 2-2.5 3-2.5 5a2.5 2.5 0 005 0c0-2-1-3-2.5-5z"
              fill="#ffffff"
            />
            <defs>
              <linearGradient id="flameGrad" x1="5" y1="2" x2="19" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f59e0b" />
                <stop offset="1" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              Focus Streak
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fef08a' }}>
              {streakCount} Sprints Locked
            </div>
          </div>
        </div>
      </div>

      {/* Middle Interactive Section: Dial + Side Telemetry */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 28,
          position: 'relative',
          zIndex: 2,
          margin: '10px 0',
        }}
      >
        {/* Left Telemetry Box */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Current Focus Task Card */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: '16px 18px',
            }}
          >
            <div style={{ fontSize: 11, color: '#f43f5e', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
              CURRENT MISSION
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>
              {taskName}
            </div>
            <div
              style={{
                marginTop: 10,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: '#34d399',
                fontWeight: 600,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>Single-Tasking Protected</span>
            </div>
          </div>

          {/* Metric Pill: Notifications Blocked */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#818cf8',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>DND SHIELD</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>Zero Pings Muted</div>
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#a5b4fc',
                background: 'rgba(99, 102, 241, 0.2)',
                padding: '4px 10px',
                borderRadius: 8,
              }}
            >
              LOCKED
            </span>
          </div>
        </div>

        {/* Central Radial Dial SVG */}
        <div
          style={{
            position: 'relative',
            width: 340,
            height: 340,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="340" height="340" viewBox="0 0 340 340" style={{ transform: 'rotate(0deg)' }}>
            <defs>
              <linearGradient id="pomodoroDialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="60%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#fda4af" />
              </linearGradient>
              <filter id="dialGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Outer Ring */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth={strokeWidth}
            />

            {/* Tick Marks */}
            {ticks.map((t, idx) => (
              <line
                key={idx}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={t.isPassed ? 'rgba(244, 63, 94, 0.85)' : 'rgba(255, 255, 255, 0.15)'}
                strokeWidth={t.isMajor ? 2.5 : 1.2}
                strokeLinecap="round"
              />
            ))}

            {/* Active Arc Progress */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="url(#pomodoroDialGrad)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
              filter="url(#dialGlow)"
            />

            {/* Orbiting Pip Indicator */}
            {animatedProgress > 0.02 && (
              <circle
                cx={dotX}
                cy={dotY}
                r={9}
                fill="#ffffff"
                stroke={accentColor}
                strokeWidth={3}
                style={{
                  filter: `drop-shadow(0 0 10px ${accentColor})`,
                }}
              />
            )}
          </svg>

          {/* Center Digital Display Content */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                color: '#fda4af',
                marginBottom: 2,
              }}
            >
              TIME REMAINING
            </div>

            <div
              style={{
                fontSize: 54,
                fontWeight: 900,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: -1.5,
                lineHeight: 1,
                color: '#ffffff',
                textShadow: '0 0 30px rgba(244, 63, 94, 0.45)',
              }}
            >
              {formattedTime}
            </div>

            <div
              style={{
                marginTop: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 999,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
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
              <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0', letterSpacing: 0.5 }}>
                GAMMA FLOW STATE
              </span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Box */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Next Up: Break Card */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: '16px 18px',
            }}
          >
            <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
              UPCOMING RECOVERY
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>
              5-Min Screen-Free Walk
            </div>
            <div
              style={{
                marginTop: 10,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: '#94a3b8',
                fontWeight: 600,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
              <span>Hydrate & Reset Eyes</span>
            </div>
          </div>

          {/* Soundscape Pill */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34d399',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>AUDIO SHIELD</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>40Hz Binaural</div>
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '4px 10px',
                borderRadius: 8,
              }}
            >
              PLAYING
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Interval Sprint Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
          padding: '14px 24px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
            Daily Focus Target:
          </span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>
            {intervalIndex} of {totalIntervals} Cycles
          </span>
        </div>

        {/* 4 Sprint Capsules */}
        <div style={{ display: 'flex', gap: 12 }}>
          {Array.from({ length: totalIntervals }, (_, i) => {
            const index = i + 1;
            const isCompleted = index < intervalIndex;
            const isCurrent = index === intervalIndex;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 12,
                  background: isCurrent
                    ? 'rgba(244, 63, 94, 0.22)'
                    : isCompleted
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isCurrent
                    ? '1px solid rgba(244, 63, 94, 0.6)'
                    : isCompleted
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : isCurrent ? (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: accentColor,
                      boxShadow: `0 0 8px ${accentColor}`,
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isCurrent ? '#fda4af' : isCompleted ? '#34d399' : '#64748b',
                  }}
                >
                  Block #{index}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
