import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ApiRateLimitBarProps {
  platformName?: string;
  planName?: string;
  usedTasks?: number;
  totalCeiling?: number;
  daysRemaining?: number;
  currentBurstReq?: number;
  burstLimitReq?: number;
}

export const ApiRateLimitBar: React.FC<ApiRateLimitBarProps> = ({
  platformName = 'Zapier Multi-Pipeline',
  planName = 'Pro Automation Tier',
  usedTasks = 7840,
  totalCeiling = 10000,
  daysRemaining = 8,
  currentBurstReq = 124,
  burstLimitReq = 150,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });

  // Gauge fill animated progress
  const fillProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 20, stiffness: 90, mass: 1 },
  });

  const percentage = Math.min(100, Math.round((usedTasks / totalCeiling) * 100));
  const animatedUsed = Math.round(usedTasks * fillProgress);
  const animatedPercentage = (percentage * fillProgress).toFixed(1);

  // Rate burst percentage
  const burstPercent = Math.min(100, Math.round((currentBurstReq / burstLimitReq) * 100));

  // Pulse alert for high usage warning
  const warningPulse = interpolate((frame * 2) % 30, [0, 15, 30], [0.7, 1, 0.7]);

  // Projected end of month usage
  const projectedMonthly = Math.round((usedTasks / (30 - daysRemaining)) * 30);
  const isOverCeiling = projectedMonthly > totalCeiling;

  return (
    <div
      style={{
        width: 900,
        height: 580,
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        borderRadius: 24,
        border: '1px solid rgba(245, 158, 11, 0.3)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 45px rgba(245, 158, 11, 0.12)',
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
          background: 'radial-gradient(circle at 75% 25%, rgba(245, 158, 11, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header */}
      <div
        style={{
          height: 64,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              background: 'rgba(245, 158, 11, 0.18)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              fontSize: 11,
              fontWeight: 800,
              color: '#fbbf24',
              letterSpacing: '0.05em',
            }}
          >
            QUOTA & CAPACITY
          </div>
          <div>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>{platformName}</span>
            <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 8 }}>({planName})</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Cycle Reset:</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              padding: '3px 8px',
              borderRadius: 6,
              border: '1px solid rgba(56, 189, 248, 0.25)',
            }}
          >
            {daysRemaining} Days Left
          </span>
        </div>
      </div>

      {/* Center Main Fuel Gauge Area */}
      <div
        style={{
          flex: 1,
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 24,
          zIndex: 1,
        }}
      >
        {/* Main Consumption Stat Overview */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Monthly Task Consumption Pacing
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 900, color: '#f8fafc' }}>
                {animatedUsed.toLocaleString()}
              </span>
              <span style={{ fontSize: 18, color: '#64748b', fontWeight: 600 }}>
                / {totalCeiling.toLocaleString()} ops
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: percentage >= 80 ? '#f59e0b' : '#34d399',
                fontFamily: 'monospace',
              }}
            >
              {animatedPercentage}%
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Of monthly ceiling reached</div>
          </div>
        </div>

        {/* Primary Segmented Fuel Gauge Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              height: 28,
              width: '100%',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Filled Progress Bar with Gradient */}
            <div
              style={{
                height: '100%',
                width: `${percentage * fillProgress}%`,
                background:
                  percentage >= 80
                    ? 'linear-gradient(90deg, #10b981 0%, #f59e0b 65%, #ef4444 100%)'
                    : 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)',
                borderRadius: 14,
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
                transition: 'width 0.1s ease',
              }}
            />

            {/* Segment Notch Overlays (at 25%, 50%, 75%, 100%) */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '25%', width: 2, backgroundColor: 'rgba(15, 23, 42, 0.6)' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, backgroundColor: 'rgba(15, 23, 42, 0.6)' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '75%', width: 2, backgroundColor: 'rgba(15, 23, 42, 0.6)' }} />
          </div>

          {/* Notch Markers */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>
            <span>0% (0)</span>
            <span>25% (2.5k)</span>
            <span>50% (5.0k)</span>
            <span>75% (7.5k)</span>
            <span style={{ color: '#ef4444', fontWeight: 700 }}>10,000 MAX</span>
          </div>
        </div>

        {/* Lower Double Gauge Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {/* Widget 1: Rate Burst Throttle (Per Minute) */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>API Burst Rate Throttle</span>
              <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>
                {currentBurstReq} / {burstLimitReq} req/min
              </span>
            </div>

            <div
              style={{
                height: 8,
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${burstPercent}%`,
                  backgroundColor: burstPercent > 85 ? '#ef4444' : '#38bdf8',
                  borderRadius: 4,
                  boxShadow: '0 0 8px #38bdf8',
                }}
              />
            </div>

            <div style={{ fontSize: 11, color: '#64748b' }}>
              Buffer remaining: {burstLimitReq - currentBurstReq} requests before 429 Too Many Requests
            </div>
          </div>

          {/* Widget 2: Predictive Pacing Calculator */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              backgroundColor: isOverCeiling ? 'rgba(239, 68, 68, 0.1)' : 'rgba(30, 41, 59, 0.6)',
              border: `1px solid ${isOverCeiling ? 'rgba(239, 68, 68, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Month-End Pacing Forecast</span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 12,
                  fontWeight: 800,
                  color: isOverCeiling ? '#f87171' : '#34d399',
                }}
              >
                {projectedMonthly.toLocaleString()} ops
              </span>
            </div>

            <div style={{ fontSize: 12, color: isOverCeiling ? '#fca5a5' : '#a7f3d0', fontWeight: 600 }}>
              {isOverCeiling ? '⚠️ Projected +12% over quota limit' : '✓ Normal pacing within limits'}
            </div>

            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              Auto-throttle safety circuit will activate at 95% ceiling.
            </div>
          </div>
        </div>
      </div>

      {/* Warning Alert Banner Bar */}
      <div
        style={{
          margin: '0 28px 20px 28px',
          padding: '10px 16px',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          border: `1px solid rgba(245, 158, 11, ${warningPulse * 0.6})`,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          color: '#fef3c7',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span>
            <strong>Quota Advisory:</strong> High webhook surge detected in Loop Iterator step. 2,160 ops remaining.
          </span>
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: '#fbbf24',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Adjust Polling Interval →
        </div>
      </div>
    </div>
  );
};
