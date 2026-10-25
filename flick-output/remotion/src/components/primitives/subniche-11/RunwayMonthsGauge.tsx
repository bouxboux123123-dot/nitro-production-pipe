import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RunwayMonthsGaugeProps {
  title?: string;
  subtitle?: string;
  initialMonths?: number;
  targetMonths?: number;
  initialBurn?: number;
  targetBurn?: number;
  seatsPurged?: number;
  transitionStartFrame?: number;
  width?: number;
  height?: number;
}

export const RunwayMonthsGauge: React.FC<RunwayMonthsGaugeProps> = ({
  title = 'RUNWAY EXTENSION METER',
  subtitle = 'Automated SaaS Seat Purge & Burn-Rate Cutting',
  initialMonths = 3.2,
  targetMonths = 9.4,
  initialBurn = 84500,
  targetBurn = 28700,
  seatsPurged = 38,
  transitionStartFrame = 35,
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Action leap spring (seat purge kicks in)
  const purgeSpring = spring({
    frame: Math.max(0, frame - transitionStartFrame),
    fps,
    config: { damping: 13, stiffness: 85, mass: 1 },
  });

  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.94, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [24, 0]);

  // Current values based on purge spring
  const currentMonths = interpolate(purgeSpring, [0, 1], [initialMonths, targetMonths]);
  const currentBurn = Math.round(interpolate(purgeSpring, [0, 1], [initialBurn, targetBurn]));
  const currentSeats = Math.round(interpolate(purgeSpring, [0, 1], [0, seatsPurged]));
  const burnSaved = initialBurn - currentBurn;

  // Arc Gauge Geometry (Semi-circle / 220 degree arc)
  // Max scale is 12 months. 0m -> -110deg, 12m -> +110deg
  const minAngle = -110;
  const maxAngle = 110;
  const angleRange = maxAngle - minAngle;
  const maxScaleMonths = 12;
  const currentAngle = minAngle + (Math.min(currentMonths, maxScaleMonths) / maxScaleMonths) * angleRange;

  // Color transitions from Red (#ef4444) to Amber (#f59e0b) to Emerald (#10b981)
  const isDanger = currentMonths < 4.5;
  const isHealthy = currentMonths >= 7.0;
  const primaryGlowColor = isHealthy ? '#10b981' : isDanger ? '#ef4444' : '#f59e0b';

  // Pulse animation for alert or success
  const pulseLoop = Math.sin((frame / fps) * Math.PI * 3);
  const pulseOpacity = interpolate(pulseLoop, [-1, 1], [0.55, 0.95]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(17, 24, 39, 0.96) 100%)',
        borderRadius: 24,
        border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
        boxShadow: `0 24px 48px -12px rgba(0, 0, 0, 0.75), 0 0 35px ${isHealthy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
        backdropFilter: 'blur(16px)',
        padding: '28px 32px',
        boxSizing: 'border-box',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient glow grid */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${isHealthy ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.18)'} 0%, transparent 70%)`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: primaryGlowColor,
                boxShadow: `0 0 10px ${primaryGlowColor}`,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: primaryGlowColor,
              }}
            >
              {title}
            </span>
            <span
              style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              REVISE & EXTEND
            </span>
          </div>
          <h2
            style={{
              margin: '6px 0 0 0',
              fontSize: 22,
              fontWeight: 700,
              color: '#f1f5f9',
              letterSpacing: '-0.02em',
            }}
          >
            {subtitle}
          </h2>
        </div>

        {/* Live Status Pill */}
        <div
          style={{
            padding: '8px 14px',
            borderRadius: 100,
            background: isHealthy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: primaryGlowColor,
              opacity: pulseOpacity,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: isHealthy ? '#34d399' : '#f87171',
            }}
          >
            {isHealthy ? 'RUNWAY SECURED: +186 DAYS' : 'CRITICAL BURN: 96 DAYS LEFT'}
          </span>
        </div>
      </div>

      {/* Main Gauge & Visual Center */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '10px 0',
        }}
      >
        <svg width="420" height="230" viewBox="0 0 420 230" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="gaugeTrackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Arc Track */}
          {/* Center: (210, 190), Radius: 150 */}
          <path
            d="M 68 190 A 150 150 0 0 1 352 190"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Danger zone indicator (< 4 mo) */}
          <path
            d="M 68 190 A 150 150 0 0 1 135 77"
            fill="none"
            stroke="rgba(239, 68, 68, 0.3)"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Active Gradient Meter Stroke */}
          <path
            d="M 68 190 A 150 150 0 0 1 352 190"
            fill="none"
            stroke="url(#gaugeTrackGrad)"
            strokeWidth="22"
            strokeDasharray="450"
            strokeDashoffset={interpolate(currentMonths, [0, maxScaleMonths], [450, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Ticks and Month Labels */}
          {[1, 3, 6, 9, 12].map((tick) => {
            const tickAngle = ((minAngle + (tick / maxScaleMonths) * angleRange) * Math.PI) / 180;
            const x = 210 + 175 * Math.sin(tickAngle);
            const y = 190 - 175 * Math.cos(tickAngle);
            return (
              <text
                key={tick}
                x={x}
                y={y}
                fill="rgba(148, 163, 184, 0.7)"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {tick}m
              </text>
            );
          })}

          {/* Needle pivot and arrow */}
          <g
            transform={`translate(210, 190) rotate(${currentAngle})`}
            style={{ transition: 'transform 0.05s linear' }}
          >
            {/* Needle line */}
            <line
              x1="0"
              y1="10"
              x2="0"
              y2="-136"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              filter="drop-shadow(0 0 4px rgba(255,255,255,0.8))"
            />
            {/* Arrow head / pointer */}
            <polygon points="-6,-132 6,-132 0,-146" fill="#ffffff" />
            {/* Central hub ring */}
            <circle cx="0" cy="0" r="16" fill="#0f172a" stroke={primaryGlowColor} strokeWidth="4" />
            <circle cx="0" cy="0" r="6" fill="#ffffff" />
          </g>
        </svg>

        {/* Big Numeric Center Display */}
        <div
          style={{
            position: 'absolute',
            bottom: 6,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                textShadow: `0 0 25px ${primaryGlowColor}`,
              }}
            >
              {currentMonths.toFixed(1)}
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#94a3b8',
                letterSpacing: '0.05em',
              }}
            >
              MONTHS
            </span>
          </div>

          {/* Extension Badge */}
          <div
            style={{
              marginTop: 6,
              padding: '4px 12px',
              borderRadius: 20,
              background: isHealthy ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${isHealthy ? '#10b981' : '#ef4444'}`,
              fontSize: 12,
              fontWeight: 800,
              color: isHealthy ? '#34d399' : '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>{isHealthy ? '▲ +6.2 MONTHS ADDED' : '▼ 3.2 MONTHS (CRITICAL)'}</span>
          </div>
        </div>
      </div>

      {/* Bottom 3 Stat Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {/* Metric 1: Monthly Burn Rate */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 16,
            padding: '14px 16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Monthly Burn Rate
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc' }}>
              ${currentBurn.toLocaleString()}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>
              -${burnSaved.toLocaleString()}
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
            Reduced from ${initialBurn.toLocaleString()}/mo
          </div>
        </div>

        {/* Metric 2: Zombie Seats Purged */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 16,
            padding: '14px 16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Unused SaaS Seats Cut
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#38bdf8' }}>
              {currentSeats}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>
              of {seatsPurged} licenses
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
            Zero productivity impact
          </div>
        </div>

        {/* Metric 3: Burn Multiple */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 16,
            padding: '14px 16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Capital Burn Multiple
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: isHealthy ? '#34d399' : '#f87171',
              }}
            >
              {interpolate(purgeSpring, [0, 1], [2.9, 0.9]).toFixed(1)}x
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>
              Top Quartile
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
            Was 2.9x (High Risk Venture)
          </div>
        </div>
      </div>

      {/* Bottom Cash Horizon Progress Line */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 12,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>
            Depletion Date Pushed From <strong style={{ color: '#f87171' }}>June 14</strong> to{' '}
            <strong style={{ color: '#34d399' }}>December 28</strong>
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#38bdf8',
            background: 'rgba(56, 189, 248, 0.12)',
            padding: '3px 8px',
            borderRadius: 6,
          }}
        >
          CASH LIFELINE +197 DAYS
        </span>
      </div>
    </div>
  );
};
