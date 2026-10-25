import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ScopeLeakItem {
  category: string;
  extraHours: number;
  reason: string;
}

export interface RetainerMarginLeakDetectorProps {
  title?: string;
  clientName?: string;
  planName?: string;
  monthlyRetainerFee?: number;
  contractedHours?: number;
  loggedHours?: number;
  leakBreakdown?: ScopeLeakItem[];
  width?: number;
  height?: number;
}

const DEFAULT_BREAKDOWN: ScopeLeakItem[] = [
  { category: 'Out-of-Scope Revisions', extraHours: 8.5, reason: '4 rounds past contracted 2-round limit' },
  { category: 'Ad-hoc Slack Inquiries', extraHours: 5.5, reason: 'Unstructured daily messaging interruptions' },
  { category: 'Executive Strategy Syncs', extraHours: 4.0, reason: 'Extra stakeholder meetings unbilled' },
];

export const RetainerMarginLeakDetector: React.FC<RetainerMarginLeakDetectorProps> = ({
  title = 'RETAINER MARGIN LEAK DETECTOR',
  clientName = 'HyperScale Media Corp',
  planName = 'Growth Retainer Tier II',
  monthlyRetainerFee = 4000,
  contractedHours = 20,
  loggedHours = 38,
  leakBreakdown = DEFAULT_BREAKDOWN,
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

  // Animate logged hours ticking up from 20 to 38
  const hoursSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 18, stiffness: 75 },
  });

  const animatedLoggedHours = interpolate(
    hoursSpring,
    [0, 1],
    [contractedHours, loggedHours]
  );

  const overageHours = Math.max(0, animatedLoggedHours - contractedHours);
  const targetRate = monthlyRetainerFee / contractedHours; // $200/hr
  const realizedRate = monthlyRetainerFee / Math.max(contractedHours, animatedLoggedHours);
  const lostMarginValue = overageHours * targetRate;
  const marginLossPercentage = Math.round(((targetRate - realizedRate) / targetRate) * 100);

  // Pulse animation for critical red warning badge
  const pulseFactor = Math.sin(frame * 0.15) * 0.1 + 0.9;

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
        border: '1px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(239, 68, 68, 0.18)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background Warning Glow */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.22) 0%, transparent 70%)',
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
          {/* Warning Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 18px rgba(239, 68, 68, 0.5)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(90deg, #fca5a5 0%, #ef4444 100%)',
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
                  background: 'rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  transform: `scale(${pulseFactor})`,
                  transformOrigin: 'center',
                }}
              >
                MARGIN EROSION
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              {clientName} &bull; {planName}
            </div>
          </div>
        </div>

        {/* Retainer Fee Badge */}
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
            Retainer Fee
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
            ${monthlyRetainerFee.toLocaleString()}/mo
          </div>
        </div>
      </div>

      {/* Main Metric Comparison Cards: Contracted vs Realized */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        {/* Card 1: Hours Comparison */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            borderRadius: 14,
            padding: '12px 14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Contract vs Actual</div>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#ef4444', fontFamily: 'monospace' }}>
              {animatedLoggedHours.toFixed(1)}h
            </span>
            <span style={{ fontSize: 12, color: '#64748b' }}>/ {contractedHours}h cap</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: '#f87171', fontWeight: 700 }}>
            +{overageHours.toFixed(1)}h Over-serviced (90%)
          </div>
        </div>

        {/* Card 2: Hourly Rate Drop */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            borderRadius: 14,
            padding: '12px 14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Effective Hourly Rate</div>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace' }}>
              ${realizedRate.toFixed(0)}
            </span>
            <span style={{ fontSize: 12, color: '#64748b', textDecoration: 'line-through' }}>
              ${targetRate}/h
            </span>
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>
            -{marginLossPercentage}% Value Destruction
          </div>
        </div>

        {/* Card 3: Unbilled Margin Drain */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 14,
            padding: '12px 14px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.15)',
          }}
        >
          <div style={{ fontSize: 11, color: '#fca5a5', fontWeight: 600 }}>Monthly Margin Drain</div>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#ef4444', fontFamily: 'monospace' }}>
              -${Math.round(lostMarginValue).toLocaleString()}
            </span>
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: '#ef4444', fontWeight: 700 }}>
            Unbilled Agency Labor
          </div>
        </div>
      </div>

      {/* Visual Hours Gauge Bar */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.35)',
          borderRadius: 16,
          padding: '14px 18px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>● Contracted Scope ({contractedHours}h)</span>
            <span style={{ color: '#ef4444', fontWeight: 700 }}>● Scope Creep Overhang (+{overageHours.toFixed(1)}h)</span>
          </div>
          <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>
            {Math.round((animatedLoggedHours / contractedHours) * 100)}% of Retainer Cap
          </span>
        </div>

        {/* Dual Stacked Progress Bar */}
        <div
          style={{
            width: '100%',
            height: 14,
            borderRadius: 9999,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            display: 'flex',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Target contract bar (fixed width 50% relative to 40h total view) */}
          <div
            style={{
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)',
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)',
            }}
          />

          {/* Creep bar expanding */}
          <div
            style={{
              width: `${Math.min(50, ((animatedLoggedHours - contractedHours) / contractedHours) * 50)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)',
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.7)',
            }}
          />

          {/* 100% Retainer Cap line indicator */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 3,
              backgroundColor: '#ffffff',
              boxShadow: '0 0 8px #ffffff',
            }}
          />
        </div>
      </div>

      {/* Scope Creep Source Breakdown */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flex: 1,
          zIndex: 2,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Where The Hours Leaked (Root Cause Analysis):
        </div>

        {leakBreakdown.map((item, i) => {
          const itemSpring = spring({
            frame: frame - (18 + i * 5),
            fps,
            config: { damping: 14, stiffness: 100 },
          });

          return (
            <div
              key={item.category}
              style={{
                opacity: itemSpring,
                transform: `translateX(${interpolate(itemSpring, [0, 1], [-15, 0])}px)`,
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 10,
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    boxShadow: '0 0 8px #ef4444',
                  }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{item.category}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{item.reason}</div>
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#f87171',
                  fontFamily: 'monospace',
                  background: 'rgba(239, 68, 68, 0.15)',
                  padding: '3px 8px',
                  borderRadius: 6,
                }}
              >
                +{item.extraHours}h unbilled
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Alert Box */}
      <div
        style={{
          marginTop: 10,
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.2) 0%, rgba(15, 23, 42, 0.6) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 12,
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fca5a5' }}>
            Action: Re-scope retainer to 40h Tier or trigger $200/hr billing clause immediately.
          </span>
        </div>
      </div>
    </div>
  );
};
