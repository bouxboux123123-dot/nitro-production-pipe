import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface HireTriggerThresholdMeterProps {
  title?: string;
  agencyName?: string;
  baselineUtilization?: number; // e.g. 72%
  peakUtilization?: number; // e.g. 91%
  threshold?: number; // e.g. 85%
  totalHeadcount?: number;
  totalCapacityHours?: number;
  newAccountMangerRole?: string;
  hiringRunwayWeeks?: number;
  width?: number;
  height?: number;
}

export const HireTriggerThresholdMeter: React.FC<HireTriggerThresholdMeterProps> = ({
  title = 'CAPACITY HIRING GOVERNOR',
  agencyName = 'Nexus Creative Group',
  baselineUtilization = 72,
  peakUtilization = 91,
  threshold = 85,
  totalHeadcount = 4,
  totalCapacityHours = 160,
  newAccountMangerRole = 'Senior Account Manager',
  hiringRunwayWeeks = 4,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.9 },
  });

  // Animated meter fill ramping from baseline (72%) across threshold (85%) up to peak (91%)
  const fillSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 16, stiffness: 70 },
  });

  const currentUtilization = interpolate(
    fillSpring,
    [0, 1],
    [baselineUtilization, peakUtilization]
  );

  const isTriggered = currentUtilization >= threshold;
  const committedHours = Math.round((currentUtilization / 100) * totalCapacityHours);

  // Button activation spring when threshold is breached
  const triggerFrameOffset = 28;
  const triggerSpring = spring({
    frame: frame - triggerFrameOffset,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Pulsing glow for triggered state
  const pulse = isTriggered ? Math.sin(frame * 0.2) * 0.15 + 0.85 : 0;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: containerSpring,
        transform: `translateY(${interpolate(containerSpring, [0, 1], [30, 0])}px) scale(${interpolate(
          containerSpring,
          [0, 1],
          [0.93, 1]
        )})`,
        borderRadius: 24,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${isTriggered ? 'rgba(239, 68, 68, 0.45)' : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: isTriggered
          ? '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(239, 68, 68, 0.25)'
          : '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.12)',
        padding: '24px 28px',
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
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: isTriggered
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* User Plus / Scale Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: isTriggered
                ? 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)'
                : 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isTriggered ? '0 0 18px rgba(239, 68, 68, 0.5)' : '0 0 16px rgba(56, 189, 248, 0.4)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(90deg, #f8fafc 30%, #94a3b8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {title}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  background: isTriggered ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.15)',
                  color: isTriggered ? '#f87171' : '#38bdf8',
                  border: `1px solid ${isTriggered ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.3)'}`,
                }}
              >
                {isTriggered ? 'SCALE TRIGGER BREACHED' : 'CAPACITY NOMINAL'}
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              {agencyName} &bull; 85% Rule Autonomous Sourcing
            </div>
          </div>
        </div>

        {/* Current Headcount Pill */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '6px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Active AM Fleet
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
            {totalHeadcount} AMs ({totalCapacityHours}h/wk)
          </div>
        </div>
      </div>

      {/* Main Gauge Section */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: 18,
          padding: '20px 22px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        {/* Metric Readout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Collective Agency Utilization
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  color: isTriggered ? '#ef4444' : '#38bdf8',
                  lineHeight: 1,
                }}
              >
                {currentUtilization.toFixed(1)}%
              </span>
              <span style={{ fontSize: 14, color: '#94a3b8' }}>
                ({committedHours}h committed / {totalCapacityHours}h max)
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase' }}>
              Hiring Threshold
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace' }}>
              {threshold}%
            </div>
          </div>
        </div>

        {/* Capacity Bar Track with 85% Threshold Line */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 28,
            borderRadius: 14,
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            overflow: 'hidden',
          }}
        >
          {/* Progress fill */}
          <div
            style={{
              width: `${Math.min(100, currentUtilization)}%`,
              height: '100%',
              borderRadius: 14,
              background: isTriggered
                ? 'linear-gradient(90deg, #38bdf8 0%, #f59e0b 60%, #ef4444 100%)'
                : 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)',
              boxShadow: isTriggered ? '0 0 18px rgba(239, 68, 68, 0.6)' : '0 0 12px rgba(56, 189, 248, 0.4)',
              transition: 'width 0.1s ease',
            }}
          />

          {/* Threshold Line at 85% */}
          <div
            style={{
              position: 'absolute',
              left: `${threshold}%`,
              top: 0,
              bottom: 0,
              width: 3,
              backgroundColor: '#f59e0b',
              boxShadow: '0 0 10px #f59e0b',
              zIndex: 3,
            }}
          />
        </div>

        {/* Threshold Markers beneath bar */}
        <div
          style={{
            position: 'relative',
            marginTop: 8,
            fontSize: 11,
            color: '#64748b',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>0%</span>
          <span>50%</span>
          <span
            style={{
              position: 'absolute',
              left: `${threshold}%`,
              transform: 'translateX(-50%)',
              color: '#f59e0b',
              fontWeight: 800,
            }}
          >
            ▲ 85% HIRE TRIGGER
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* 3 Capacity Context Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 12,
            padding: '10px 14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Available Slack</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginTop: 2, fontFamily: 'monospace' }}>
            {Math.max(0, totalCapacityHours - committedHours)} Hours/wk
          </div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Buffers unexpected delays</div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 12,
            padding: '10px 14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Recruitment Lead Time</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b', marginTop: 2, fontFamily: 'monospace' }}>
            {hiringRunwayWeeks} Weeks
          </div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Sourcing to full billability</div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 12,
            padding: '10px 14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Burnout Risk Rating</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: isTriggered ? '#ef4444' : '#10b981',
              marginTop: 2,
              fontFamily: 'monospace',
            }}
          >
            {isTriggered ? 'SEVERE (Red)' : 'MODERATE (Green)'}
          </div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Based on current retainers</div>
        </div>
      </div>

      {/* The Dynamic Autonomous Trigger CTA Button */}
      <div
        style={{
          marginTop: 'auto',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <div
          style={{
            opacity: interpolate(triggerSpring, [0, 1], [0.5, 1]),
            transform: `scale(${interpolate(triggerSpring, [0, 1], [0.97, 1])})`,
            borderRadius: 16,
            padding: '16px 22px',
            background: isTriggered
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)'
              : 'rgba(30, 41, 59, 0.5)',
            border: isTriggered ? '2px solid #fca5a5' : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isTriggered
              ? `0 0 ${20 + pulse * 15}px rgba(239, 68, 68, 0.8), 0 10px 25px rgba(0, 0, 0, 0.5)`
              : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: isTriggered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              {isTriggered ? '🚨' : '⏱️'}
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: isTriggered ? '#ffffff' : '#94a3b8',
                }}
              >
                {isTriggered
                  ? `AUTOMATED TRIGGER: HIRE ${newAccountMangerRole.toUpperCase()}`
                  : 'STANDBY: CAPACITY BELOW 85% THRESHOLD'}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: isTriggered ? 'rgba(255, 255, 255, 0.85)' : '#64748b',
                  marginTop: 2,
                }}
              >
                {isTriggered
                  ? 'Initiate job post now to prevent delivery bottlenecks in 30 days'
                  : 'Agency workload operating safely within client satisfaction envelope'}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '6px 14px',
              borderRadius: 9999,
              backgroundColor: isTriggered ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
              color: isTriggered ? '#dc2626' : '#94a3b8',
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: '0.05em',
            }}
          >
            {isTriggered ? 'POST OPENING' : 'MONITORING'}
          </div>
        </div>
      </div>
    </div>
  );
};
