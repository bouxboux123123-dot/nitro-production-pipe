import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface HealthMetricItem {
  id: string;
  name: string;
  value: string;
  benchmark: string;
  status: 'healthy' | 'warning' | 'critical';
  weight: string;
  detail: string;
}

export interface ClientHealthScorecardProps {
  title?: string;
  clientName?: string;
  clientTier?: string;
  compositeScore?: number; // 0 - 100
  metrics?: HealthMetricItem[];
  width?: number;
  height?: number;
}

const DEFAULT_METRICS: HealthMetricItem[] = [
  {
    id: 'nps',
    name: 'Client Sentiment (NPS)',
    value: '6.0 / 10',
    benchmark: 'Goal: > 8.5',
    status: 'warning',
    weight: '30%',
    detail: 'Passive rating; slight communication friction noted',
  },
  {
    id: 'revisions',
    name: 'Revision Friction',
    value: '4.8 Rounds',
    benchmark: 'SLA Cap: 2.0',
    status: 'critical',
    weight: '35%',
    detail: '+140% revision excess; eroding production margins',
  },
  {
    id: 'dso',
    name: 'Payment Velocity (DSO)',
    value: '48 Days',
    benchmark: 'Terms: Net 15',
    status: 'warning',
    weight: '35%',
    detail: '33 days overdue; recurring cash flow delay',
  },
];

export const ClientHealthScorecard: React.FC<ClientHealthScorecardProps> = ({
  title = 'CLIENT HEALTH & RETENTION SCORECARD',
  clientName = 'Aura Media Group',
  clientTier = 'Enterprise Retainer ($7,500/mo)',
  compositeScore = 54,
  metrics = DEFAULT_METRICS,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Root entrance spring
  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.9 },
  });

  // Score count-up spring
  const scoreSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 16, stiffness: 70 },
  });

  const animatedScore = Math.round(interpolate(scoreSpring, [0, 1], [0, compositeScore]));

  // Determine overall status colors
  const isCritical = animatedScore < 50;
  const isWarning = animatedScore >= 50 && animatedScore < 75;
  const isHealthy = animatedScore >= 75;

  const scoreColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';
  const scoreLabel = isCritical ? 'CHURN RISK' : isWarning ? 'AMBER ALERT' : 'HEALTHY ACCOUNT';

  // SVG Circular progress math (radius = 48, circum = 2 * PI * 48 ~ 301.6)
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * (animatedScore / 100));

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
        border: `1px solid ${isWarning ? 'rgba(245, 158, 11, 0.35)' : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px ${scoreColor}22`,
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
          top: -70,
          right: -70,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${scoreColor}26 0%, transparent 70%)`,
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
          {/* Health Shield Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${scoreColor} 0%, #0f172a 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1.5px solid ${scoreColor}`,
              boxShadow: `0 0 16px ${scoreColor}55`,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
                  background: `${scoreColor}22`,
                  color: scoreColor,
                  border: `1px solid ${scoreColor}55`,
                }}
              >
                {scoreLabel}
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              {clientName} &bull; {clientTier}
            </div>
          </div>
        </div>

        {/* Status indicator badge */}
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
            Account Health
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: scoreColor, fontFamily: 'monospace' }}>
            {scoreLabel}
          </div>
        </div>
      </div>

      {/* Main Top Section: Radial Score Dial + Executive Summary */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          background: 'rgba(0, 0, 0, 0.35)',
          borderRadius: 18,
          padding: '16px 22px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        {/* Radial Progress Meter */}
        <div style={{ position: 'relative', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Circle */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke={scoreColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                filter: `drop-shadow(0 0 8px ${scoreColor})`,
                transition: 'stroke-dashoffset 0.1s ease',
              }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 900, fontFamily: 'monospace', color: scoreColor, lineHeight: 1 }}>
              {animatedScore}
            </span>
            <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, marginTop: 2 }}>/ 100</span>
          </div>
        </div>

        {/* Summary Text */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc' }}>
            Account Vulnerability Diagnostic
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 1.5 }}>
            Composite weighted score combining NPS survey response, scope revision multiplier, and invoice remittance speed.
            Currently sitting in <span style={{ color: scoreColor, fontWeight: 700 }}>Amber Alert status</span> requiring retention intervention.
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700 }}>• Target Benchmark: 80+ pts</span>
            <span style={{ fontSize: 11, color: '#f87171', fontWeight: 700 }}>• Churn Cliff: &lt; 50 pts</span>
          </div>
        </div>
      </div>

      {/* 3 Weighted Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          flex: 1,
          zIndex: 2,
        }}
      >
        {metrics.map((m, index) => {
          const itemSpring = spring({
            frame: frame - (16 + index * 5),
            fps,
            config: { damping: 14, stiffness: 100 },
          });

          const mColor =
            m.status === 'critical' ? '#ef4444' : m.status === 'warning' ? '#f59e0b' : '#10b981';

          return (
            <div
              key={m.id}
              style={{
                opacity: itemSpring,
                transform: `translateY(${interpolate(itemSpring, [0, 1], [14, 0])}px)`,
                background: 'rgba(15, 23, 42, 0.65)',
                border: `1px solid ${mColor}44`,
                borderRadius: 14,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>{m.name}</span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#94a3b8',
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    Wt {m.weight}
                  </span>
                </div>

                <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: mColor, fontFamily: 'monospace' }}>
                    {m.value}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{m.benchmark}</div>
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 11,
                  color: '#cbd5e1',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingTop: 8,
                  lineHeight: 1.35,
                }}
              >
                {m.detail}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Retention Action Prescription */}
      <div
        style={{
          marginTop: 12,
          padding: '10px 16px',
          borderRadius: 12,
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>🛡️</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fef3c7' }}>
            Retention Action: Trigger 30-day scope reset call & enforce 2-round review boundaries.
          </span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.04em' }}>
          HIGH PRIORITY
        </div>
      </div>
    </div>
  );
};
