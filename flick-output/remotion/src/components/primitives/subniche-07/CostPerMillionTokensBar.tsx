import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CostBarItem {
  model: string;
  era: string;
  cost: number;
  costLabel: string;
  color: string;
  isBaseline?: boolean;
  isCheapest?: boolean;
}

export interface CostPerMillionTokensBarProps {
  title?: string;
  subtitle?: string;
  currencySymbol?: string;
  items?: CostBarItem[];
  style?: React.CSSProperties;
}

const DEFAULT_COST_ITEMS: CostBarItem[] = [
  {
    model: 'GPT-4 (Launch)',
    era: 'Mar 2023',
    cost: 30.0,
    costLabel: '$30.00',
    color: '#ef4444',
    isBaseline: true,
  },
  {
    model: 'GPT-4 Turbo',
    era: 'Nov 2023',
    cost: 10.0,
    costLabel: '$10.00',
    color: '#f59e0b',
  },
  {
    model: 'Claude 3.5 Sonnet',
    era: 'Jun 2024',
    cost: 3.0,
    costLabel: '$3.00',
    color: '#a855f7',
  },
  {
    model: 'GPT-4o Mini',
    era: 'Jul 2024',
    cost: 0.15,
    costLabel: '$0.15',
    color: '#38bdf8',
  },
  {
    model: 'Gemini 1.5 Flash / DeepSeek',
    era: 'Late 2024',
    cost: 0.075,
    costLabel: '$0.075',
    color: '#10b981',
    isCheapest: true,
  },
];

export const CostPerMillionTokensBar: React.FC<CostPerMillionTokensBarProps> = ({
  title = 'LLM TOKEN COST COLLAPSE',
  subtitle = 'Cost Per 1,000,000 Output Tokens (USD)',
  currencySymbol = '$',
  items = DEFAULT_COST_ITEMS,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const maxCost = items[0]?.cost || 30.0;

  return (
    <div
      style={{
        width: 880,
        height: 600,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(56, 189, 248, 0.22)',
        borderRadius: 24,
        padding: '30px 36px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(56, 189, 248, 0.1)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        opacity: enterSpring,
        transform: `translateY(${(1 - enterSpring) * 20}px)`,
        ...style,
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 2,
                color: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                padding: '3px 9px',
                borderRadius: 8,
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              UNIT ECONOMICS
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>• Price Per Million Tokens</span>
          </div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: -0.5 }}>
            {title}
          </h2>
          <p style={{ margin: '3px 0 0 0', fontSize: 13, color: '#94a3b8' }}>{subtitle}</p>
        </div>

        {/* Deflation Badge */}
        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 16,
            padding: '8px 16px',
            textAlign: 'right',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.15)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', letterSpacing: 0.5 }}>
            📉 -99.7% CRASH
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>
            400x MORE AFFORDABLE
          </div>
        </div>
      </div>

      {/* Horizontal Bar Chart List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '14px 0' }}>
        {items.map((item, idx) => {
          // Staggered bar expansion spring
          const barSpring = spring({
            frame: Math.max(0, frame - 8 - idx * 8),
            fps,
            config: { damping: 15, stiffness: 100 },
          });

          // Scale percentage (use log or proportional scaling with minimum visual threshold)
          // Since 30 vs 0.075 is a 400x delta, linear scaling would make the small bar 1px.
          // Let's use a hybrid visual curve (e.g. logarithmic / power curve) so small bars remain clearly readable!
          const linearRatio = item.cost / maxCost;
          // Power curve: Math.pow(ratio, 0.45) gives clear proportional distinction while keeping 0.075 readable
          const visualRatio = Math.max(0.04, Math.pow(linearRatio, 0.48));
          const currentWidthPercent = visualRatio * 100 * barSpring;

          return (
            <div
              key={item.model}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: item.isCheapest
                  ? 'rgba(16, 185, 129, 0.06)'
                  : 'rgba(30, 41, 59, 0.35)',
                border: item.isCheapest
                  ? '1px solid rgba(16, 185, 129, 0.35)'
                  : '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 12,
                padding: '8px 16px',
              }}
            >
              {/* Model Name and Era */}
              <div style={{ width: 220, flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                  {item.model}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span>{item.era}</span>
                  {item.isCheapest && (
                    <span
                      style={{
                        color: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontWeight: 800,
                        fontSize: 9,
                      }}
                    >
                      CURRENT CHEAPEST
                    </span>
                  )}
                </div>
              </div>

              {/* Bar track and fill */}
              <div
                style={{
                  flex: 1,
                  height: 22,
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: 11,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div
                  style={{
                    width: `${currentWidthPercent}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${item.color}88, ${item.color})`,
                    borderRadius: 11,
                    boxShadow: `0 0 12px ${item.color}aa`,
                    transition: 'width 0.05s ease',
                  }}
                />
              </div>

              {/* Price Label */}
              <div style={{ width: 100, textAlign: 'right', flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 900,
                    fontFamily: 'monospace',
                    color: item.color,
                  }}
                >
                  {item.costLabel}
                  <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 2 }}>/1M</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Ribbon */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 12,
          fontSize: 12,
          color: '#64748b',
        }}
      >
        <span>Trend: Hardware efficiency (Blackwell, TPUs) + Distillation + MoE Architectures</span>
        <span style={{ color: '#10b981', fontWeight: 600 }}>$1 in 2023 = $400 in 2025</span>
      </div>
    </div>
  );
};
