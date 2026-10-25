import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export interface TimesheetEntry {
  task: string;
  time: string;
  status: 'approved' | 'disputed' | 'untracked';
}

export interface HourlyToRetainerConverterProps {
  title?: string;
  hourlyRate?: number;
  hourlyHours?: number;
  retainerMonthly?: number;
  clientName?: string;
  comparisonMetric?: string;
  timesheetEntries?: TimesheetEntry[];
}

export const HourlyToRetainerConverter: React.FC<HourlyToRetainerConverterProps> = ({
  title = 'Hourly Trap vs. Monthly Retainer',
  hourlyRate = 85,
  hourlyHours = 40,
  retainerMonthly = 6500,
  clientName = 'Fintech Mobile Lead',
  comparisonMetric = '+91% Revenue · 0 Admin Hours',
  timesheetEntries = [
    { task: 'Slack reply & asset export', time: '0.25h', status: 'untracked' },
    { task: 'Mobile checkout bug triage', time: '1.50h', status: 'disputed' },
    { task: 'Ad-hoc stakeholder call', time: '0.75h', status: 'untracked' },
    { task: 'Figma wireframe revisions', time: '2.50h', status: 'approved' },
    { task: 'Design system audit sync', time: '1.25h', status: 'disputed' },
    { task: 'Handoff meeting notes', time: '0.50h', status: 'approved' },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 150-frame animation cycle for organic motion
  const loopDuration = 150;
  const cycleFrame = frame % loopDuration;

  // Spring animations for entrance and comparison emphasis
  const entranceSpring = spring({
    frame: cycleFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const morphProgress = spring({
    frame: cycleFrame - 25,
    fps,
    config: { damping: 13, stiffness: 85 },
  });

  const hourlyTotal = hourlyRate * hourlyHours;
  const revenueGain = retainerMonthly - hourlyTotal;
  const percentageGain = Math.round((revenueGain / hourlyTotal) * 100);

  // Oscillating glow for retainer card
  const retainerGlow = interpolate(
    Math.sin(cycleFrame * 0.1),
    [-1, 1],
    [0.2, 0.45]
  );

  return (
    <div
      style={{
        width: 890,
        minHeight: 570,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(24, 33, 54, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 28,
        padding: '30px 34px',
        boxShadow:
          '0 25px 65px -15px rgba(0, 0, 0, 0.7), 0 0 45px -10px rgba(56, 189, 248, 0.15)',
        backdropFilter: 'blur(20px)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.12)',
                padding: '4px 10px',
                borderRadius: 8,
              }}
            >
              Freelance Pricing Paradigm
            </span>
            <span style={{ fontSize: 13, color: '#64748b' }}>Client: {clientName}</span>
          </div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#ffffff',
              margin: '6px 0 0 0',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h2>
        </div>

        {/* Highlight badge */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 14,
            padding: '8px 16px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#6ee7b7', fontWeight: 700 }}>
            Automated Upside
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: '#ffffff',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            +{percentageGain}% Profit Lift
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 60px 1fr',
          gap: 16,
          alignItems: 'stretch',
          flex: 1,
        }}
      >
        {/* LEFT CARD: Hourly Timesheet Trap */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.55)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 20,
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Card Label */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#ef4444', fontSize: 16 }}>⚠️</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f87171' }}>
                Hourly Tracking
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 6,
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#fca5a5',
                fontWeight: 600,
              }}
            >
              40 Logged Tasks
            </span>
          </div>

          {/* Micro-logged timesheet list */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, overflow: 'hidden' }}>
            {timesheetEntries.map((entry, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '7px 10px',
                  borderRadius: 8,
                  background:
                    entry.status === 'disputed'
                      ? 'rgba(239, 68, 68, 0.12)'
                      : 'rgba(15, 23, 42, 0.45)',
                  border:
                    entry.status === 'disputed'
                      ? '1px solid rgba(239, 68, 68, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.04)',
                  fontSize: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: '#64748b' }}>#{idx + 1}</span>
                  <span style={{ color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 170 }}>
                    {entry.task}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                      color: entry.status === 'disputed' ? '#fca5a5' : '#94a3b8',
                    }}
                  >
                    {entry.time}
                  </span>
                  {entry.status === 'disputed' && (
                    <span style={{ fontSize: 9, color: '#ef4444', fontWeight: 700 }}>DISPUTED</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Hourly Summary Footer */}
          <div
            style={{
              marginTop: 14,
              paddingTop: 12,
              borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>40h @ ${hourlyRate}/hr</div>
              <div style={{ fontSize: 10, color: '#ef4444' }}>~6h lost in disputes</div>
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace",
                color: '#f87171',
              }}
            >
              ${hourlyTotal.toLocaleString()}
            </div>
          </div>
        </div>

        {/* MIDDLE: Animated Converter Arrow */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
              transform: `scale(${1 + Math.sin(cycleFrame * 0.15) * 0.08})`,
              zIndex: 2,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#38bdf8',
              letterSpacing: '0.08em',
              marginTop: 8,
              textAlign: 'center',
            }}
          >
            AI Shift
          </span>
        </div>

        {/* RIGHT CARD: Value Retainer Model */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 20,
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: `0 0 35px rgba(16, 185, 129, ${retainerGlow}), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
          }}
        >
          {/* Card Label */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#10b981', fontSize: 16 }}>💎</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#34d399' }}>
                  Monthly Value Retainer
                </span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#6ee7b7',
                  fontWeight: 700,
                }}
              >
                1 Auto-Draft / Mo
              </span>
            </div>

            {/* Retainer Value Bar */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: 14,
                padding: '16px 18px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
                Tier: Enterprise Product Partner
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#10b981',
                  letterSpacing: '-0.02em',
                }}
              >
                ${retainerMonthly.toLocaleString()}
                <span style={{ fontSize: 15, fontWeight: 500, color: '#64748b' }}> /month</span>
              </div>
              <div style={{ fontSize: 11, color: '#38bdf8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>⚡ Auto-charged via Stripe Billing on 1st</span>
              </div>
            </div>

            {/* Key Retainer Perks List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Zero timesheet audits or line disputes',
                'Guaranteed priority availability SLA',
                'Predictable recurring monthly runway',
              ].map((perk, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#e2e8f0' }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    ✓
                  </div>
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Retainer Summary Footer */}
          <div
            style={{
              marginTop: 14,
              paddingTop: 12,
              borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 600 }}>
              +${revenueGain.toLocaleString()} more profit/mo
            </span>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '4px 10px',
                borderRadius: 8,
              }}
            >
              100% Guaranteed
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Comparison Bar */}
      <div
        style={{
          marginTop: 18,
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 14,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 13,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>🚀</span>
          <span style={{ color: '#cbd5e1' }}>Freelancer Impact:</span>
          <span style={{ fontWeight: 700, color: '#ffffff' }}>{comparisonMetric}</span>
        </div>
        <div style={{ color: '#94a3b8', fontSize: 12 }}>
          Saved: <strong style={{ color: '#38bdf8' }}>14 hrs</strong> admin overhead / month
        </div>
      </div>
    </div>
  );
};
