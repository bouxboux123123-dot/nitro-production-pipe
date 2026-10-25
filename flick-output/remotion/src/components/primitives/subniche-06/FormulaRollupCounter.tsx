import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RollupLineItem {
  id: string;
  name: string;
  category: string;
  amount: number;
}

export interface FormulaRollupCounterProps {
  title?: string;
  parentRecordName?: string;
  parentRecordId?: string;
  formulaExpression?: string;
  items?: RollupLineItem[];
  budgetCap?: number;
  width?: number;
  height?: number;
}

const DEFAULT_ITEMS: RollupLineItem[] = [
  { id: 'item-1', name: 'System Architecture & Spec', category: 'Planning', amount: 12500 },
  { id: 'item-2', name: 'UI/UX Component System', category: 'Frontend', amount: 18400 },
  { id: 'item-3', name: 'Microservices & API Hub', category: 'Backend', amount: 22000 },
  { id: 'item-4', name: 'Database Schema & Partitioning', category: 'Data', amount: 9600 },
  { id: 'item-5', name: 'Auth0 SSO & RBAC Security', category: 'Security', amount: 8200 },
  { id: 'item-6', name: 'Stripe Billing & Invoicing Engine', category: 'Payments', amount: 14300 },
  { id: 'item-7', name: 'Automated CI/CD Pipeline', category: 'DevOps', amount: 7800 },
  { id: 'item-8', name: 'Penetration Testing & Hardening', category: 'Audit', amount: 11500 },
  { id: 'item-9', name: 'Automated E2E Test Suite', category: 'QA', amount: 15500 },
  { id: 'item-10', name: 'Cloud Multi-Region Infrastructure', category: 'Infra', amount: 15000 },
];

export const FormulaRollupCounter: React.FC<FormulaRollupCounterProps> = ({
  title = 'REAL-TIME FORMULA ROLLUP AGGREGATOR',
  parentRecordName = 'Project Apex: Next-Gen Enterprise CRM',
  parentRecordId = 'PRJ-8820-ENT',
  formulaExpression = "ROLLUP(LineItems.Amount, 'SUM')",
  items = DEFAULT_ITEMS,
  budgetCap = 150000,
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

  const totalSum = items.reduce((acc, curr) => acc + curr.amount, 0);

  // Rollup accumulation over time (frames 15 to 70)
  const rollupProgress = interpolate(frame, [15, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Calculate current interpolated value with dynamic counting
  const currentRollingAmount = Math.round(rollupProgress * totalSum);
  const formattedRollingAmount = `$${currentRollingAmount.toLocaleString()}`;

  // Percentage of budget cap
  const budgetUtilization = Math.min(100, Math.round((currentRollingAmount / budgetCap) * 100));

  // Pulse effect when fully aggregated
  const isComplete = rollupProgress >= 1;
  const completePulse = isComplete ? Math.sin((frame - 75) * 0.2) * 0.4 + 0.6 : 0;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: enterSpring,
        transform: `scale(${interpolate(enterSpring, [0, 1], [0.93, 1])})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.12)',
        padding: '22px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background Matrix grid accents */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(16, 185, 129, 0.08) 1.5px, transparent 1.5px), radial-gradient(rgba(56, 189, 248, 0.05) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 12,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.5)',
            }}
          >
            <span style={{ fontSize: 18, color: '#ffffff', fontWeight: 900 }}>∑</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', color: '#34d399' }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
              Formula: <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{formulaExpression}</span>
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 12px',
            borderRadius: 999,
            background: isComplete ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
            border: `1px solid ${isComplete ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isComplete ? '#10b981' : '#38bdf8',
              boxShadow: `0 0 8px ${isComplete ? '#10b981' : '#38bdf8'}`,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: isComplete ? '#6ee7b7' : '#7dd3fc',
            }}
          >
            {isComplete ? '10/10 ITEMS AGGREGATED' : 'EVALUATING FORMULA...'}
          </span>
        </div>
      </div>

      {/* PARENT RECORD HERO CARD (With Live Rollup Counter) */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.75)',
          border: isComplete ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 16,
          padding: '16px 20px',
          marginBottom: 16,
          position: 'relative',
          boxShadow: isComplete
            ? `0 10px 25px rgba(0, 0, 0, 0.5), 0 0 30px rgba(16, 185, 129, ${0.15 + completePulse * 0.2})`
            : '0 10px 25px rgba(0, 0, 0, 0.3)',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748b' }}>{parentRecordId}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                PARENT ROW
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>
              {parentRecordName}
            </div>
          </div>

          {/* Grand Rollup Ticker Display */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em' }}>
              Computed Rollup Sum
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                fontFamily: 'monospace',
                color: '#34d399',
                textShadow: '0 0 20px rgba(52, 211, 153, 0.4)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                marginTop: 2,
              }}
            >
              {formattedRollingAmount}
            </div>
          </div>
        </div>

        {/* Progress Bar: Budget Utilization */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>
            <span>Budget Allocation Tracker</span>
            <span style={{ fontFamily: 'monospace', color: '#e2e8f0', fontWeight: 600 }}>
              {budgetUtilization}% of ${budgetCap.toLocaleString()} Cap
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${budgetUtilization}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981 0%, #38bdf8 100%)',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)',
                borderRadius: 999,
                transition: 'width 0.05s linear',
              }}
            />
          </div>
        </div>
      </div>

      {/* SECTION HEADER: 10 CHILD LINE ITEMS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#94a3b8',
          marginBottom: 10,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>📂</span>
          <span>NESTED CHILD ROWS ({items.length} LINE ITEMS)</span>
        </div>
        <div style={{ color: '#64748b' }}>
          Auto-Sum Engine: <span style={{ color: '#34d399' }}>Live Reactive</span>
        </div>
      </div>

      {/* 10 NESTED CHILDREN (2-column layout for clean visibility & compactness) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px 12px',
          flex: 1,
          zIndex: 2,
        }}
      >
        {items.map((item, idx) => {
          // Entrance and activation trigger timing
          const triggerFrame = 16 + idx * 5.5;
          const isActive = frame >= triggerFrame;
          const rowSpring = spring({
            frame: frame - (10 + idx * 3),
            fps,
            config: { damping: 15, stiffness: 140 },
          });

          return (
            <div
              key={item.id}
              style={{
                background: isActive ? 'rgba(30, 41, 59, 0.85)' : 'rgba(15, 23, 42, 0.5)',
                border: isActive
                  ? '1px solid rgba(16, 185, 129, 0.35)'
                  : '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 10,
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: rowSpring,
                transform: `translateY(${interpolate(rowSpring, [0, 1], [15, 0])}px)`,
                boxShadow: isActive ? '0 2px 10px rgba(16, 185, 129, 0.1)' : 'none',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                {/* Index & Status Indicator */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    color: isActive ? '#34d399' : '#64748b',
                    flexShrink: 0,
                  }}
                >
                  {isActive ? '✓' : idx + 1}
                </div>

                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: isActive ? '#f1f5f9' : '#94a3b8',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>
                    {item.category}
                  </div>
                </div>
              </div>

              {/* Amount badge */}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: isActive ? '#34d399' : '#64748b',
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  flexShrink: 0,
                  marginLeft: 8,
                }}
              >
                ${item.amount.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#64748b',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#10b981' }}>●</span>
          <span>Zero-latency Rollup: DAG dependency re-evaluated in 0.8ms</span>
        </div>
        <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
          Rollup Result: {formattedRollingAmount} / ${totalSum.toLocaleString()}
        </div>
      </div>
    </div>
  );
};
