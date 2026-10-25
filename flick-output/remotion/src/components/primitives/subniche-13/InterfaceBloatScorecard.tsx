import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BloatMetric {
  label: string;
  linearValue: string;
  jiraValue: string;
  isLinearWinner: boolean;
}

export interface InterfaceBloatScorecardProps {
  title?: string;
  subtitle?: string;
  linearTitle?: string;
  jiraTitle?: string;
  metrics?: BloatMetric[];
  width?: number;
  height?: number;
}

const DEFAULT_METRICS: BloatMetric[] = [
  { label: 'Required Form Fields', linearValue: '3 minimal fields', jiraValue: '28+ mandatory inputs', isLinearWinner: true },
  { label: 'Mouse Clicks to File', linearValue: '0 (100% Keyboard)', jiraValue: '9 nested dropdown clicks', isLinearWinner: true },
  { label: 'DOM Nodes & Tabs', linearValue: 'Single modal (12 nodes)', jiraValue: '8 tabs & 3 nested modals', isLinearWinner: true },
  { label: 'Context Switch Friction', linearValue: 'Zero Flow Interruption', jiraValue: 'High Cognitive Load', isLinearWinner: true },
];

export const InterfaceBloatScorecard: React.FC<InterfaceBloatScorecardProps> = ({
  title = 'INTERFACE BLOAT SCORECARD',
  subtitle = 'Keyboard Flow-State vs Nested Enterprise Menus',
  linearTitle = 'Linear: Streamlined Velocity',
  jiraTitle = 'Legacy Jira: Administrative Friction',
  metrics = DEFAULT_METRICS,
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Stagger animations for metric rows
  const cardLeftSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  const cardRightSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  // Subtle pulsing effect for keyboard prompt
  const pulse = Math.sin(frame * 0.15) * 0.5 + 0.5;

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(20, 24, 38, 0.98) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.12)',
        backdropFilter: 'blur(20px)',
        padding: '26px 30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#f8fafc',
        boxSizing: 'border-box',
        transform: `scale(${interpolate(entrance, [0, 1], [0.93, 1])}) translateY(${interpolate(entrance, [0, 1], [25, 0])}px)`,
        opacity: interpolate(entrance, [0, 1], [0, 1]),
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <span
              style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.2px',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                textTransform: 'uppercase',
              }}
            >
              UX Audit
            </span>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              DEVELOPER COGNITIVE OVERHEAD
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.4px' }}>
            {title}
          </h2>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>{subtitle}</p>
        </div>

        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '10px',
            padding: '6px 14px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: '10px', color: '#34d399', fontWeight: 600 }}>FLOW INDEX</div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: '#10b981', fontFamily: '"JetBrains Mono", monospace' }}>
            94% vs 28%
          </div>
        </div>
      </div>

      {/* Side-by-Side Visual Mockups */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', margin: '10px 0' }}>
        {/* Minimalist UI Preview */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.45)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '16px',
            padding: '16px',
            transform: `translateY(${interpolate(cardLeftSpring, [0, 1], [15, 0])}px)`,
            opacity: interpolate(cardLeftSpring, [0, 1], [0, 1]),
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#e0f2fe' }}>{linearTitle}</span>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.15)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              KEYBOARD-FIRST
            </span>
          </div>

          {/* Minimal UI Simulation */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {/* Command search bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#38bdf8', fontSize: '12px' }}>❯</span>
                <span style={{ fontSize: '12px', color: '#f1f5f9', fontWeight: 500 }}>
                  Fix edge routing cache invalidation
                </span>
              </div>
              <div
                style={{
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#7dd3fc',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '10px',
                  padding: '2px 5px',
                  borderRadius: '4px',
                }}
              >
                ↵ Enter
              </div>
            </div>

            {/* Quick tags row */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <span
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  fontSize: '10px',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                ● Urgent
              </span>
              <span
                style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#a5b4fc',
                  fontSize: '10px',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                }}
              >
                @Alex
              </span>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#6ee7b7',
                  fontSize: '10px',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                Sprint 42
              </span>
            </div>

            {/* Hotkey hint line */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '10.5px',
                color: '#64748b',
                marginTop: '4px',
              }}
            >
              <span>Quick shortcuts:</span>
              <span
                style={{
                  color: '#38bdf8',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  fontFamily: '"JetBrains Mono", monospace',
                  opacity: 0.8 + 0.2 * pulse,
                }}
              >
                C (Create)
              </span>
              <span
                style={{
                  color: '#38bdf8',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                P (Priority)
              </span>
            </div>
          </div>
        </div>

        {/* Bloated Enterprise UI Preview */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.35)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            transform: `translateY(${interpolate(cardRightSpring, [0, 1], [15, 0])}px)`,
            opacity: interpolate(cardRightSpring, [0, 1], [0, 1]),
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#fee2e2' }}>{jiraTitle}</span>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#f87171',
                background: 'rgba(239, 68, 68, 0.15)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              NESTED FORM HELL
            </span>
          </div>

          {/* Bloated UI Simulation */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {/* Cluttered Tabs */}
            <div style={{ display: 'flex', gap: '4px', overflow: 'hidden', paddingBottom: '3px' }}>
              {['Details*', 'Billing Cost', 'Workflows', 'Custom (18)', 'SLA Rules'].map((tab, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: '9px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: idx === 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: idx === 0 ? '#fca5a5' : '#64748b',
                    whiteSpace: 'nowrap',
                    border: idx === 0 ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>

            {/* Overwhelming Form Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  padding: '4px 6px',
                  borderRadius: '4px',
                }}
              >
                <div style={{ fontSize: '9px', color: '#f87171' }}>* Root Cause Code</div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>[ Select code... ] ▾</div>
              </div>
              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  padding: '4px 6px',
                  borderRadius: '4px',
                }}
              >
                <div style={{ fontSize: '9px', color: '#f87171' }}>* Cost Center Allocation</div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>[ CC-9082 Finance ] ▾</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '4px 6px',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '9px', color: '#94a3b8' }}>* Target Release Train & Epic Link</div>
              <div style={{ fontSize: '9px', color: '#ef4444' }}>⚠️ 8 Required sub-fields</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Metrics Grid */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '12px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr', paddingBottom: '4px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>FRICTION CRITERIA</span>
          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>LINEAR APPROACH</span>
          <span style={{ fontSize: '11px', color: '#f87171', fontWeight: 600 }}>LEGACY JIRA APPROACH</span>
        </div>

        {metrics.map((m, idx) => {
          const rowEntrance = spring({
            frame: frame - (14 + idx * 4),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 2fr',
                alignItems: 'center',
                opacity: interpolate(rowEntrance, [0, 1], [0.2, 1]),
                transform: `translateX(${interpolate(rowEntrance, [0, 1], [-8, 0])}px)`,
              }}
            >
              <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 500 }}>{m.label}</span>
              <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '10px' }}>✓</span> {m.linearValue}
              </span>
              <span style={{ fontSize: '12px', color: '#fca5a5', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '10px' }}>✕</span> {m.jiraValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
