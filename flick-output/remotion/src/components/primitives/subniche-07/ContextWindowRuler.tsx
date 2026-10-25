import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MilestoneItem {
  tokens: string;
  tokenCount: number;
  label: string;
  analogy: string;
  pages: string;
  badgeColor: string;
  iconType: 'paper' | 'book' | 'archive';
}

export interface ContextWindowRulerProps {
  title?: string;
  subtitle?: string;
  activeLevel?: '8k' | '128k' | '1m' | 'animated';
  milestones?: MilestoneItem[];
  accentColor?: string;
  style?: React.CSSProperties;
}

const DEFAULT_MILESTONES: MilestoneItem[] = [
  {
    tokens: '8K',
    tokenCount: 8192,
    label: 'GPT-4 (2023)',
    analogy: 'Standard Essay / Short Article',
    pages: '~16 Pages',
    badgeColor: '#f43f5e',
    iconType: 'paper',
  },
  {
    tokens: '128K',
    tokenCount: 131072,
    label: 'GPT-4o / Claude 3',
    analogy: 'Financial 10-K Report & Full Novel',
    pages: '~350 Pages',
    badgeColor: '#38bdf8',
    iconType: 'book',
  },
  {
    tokens: '1M+',
    tokenCount: 1048576,
    label: 'Gemini 1.5 / Llama 3.1',
    analogy: 'Entire Codebase + 1hr Video + 30 Books',
    pages: '~2,500 Pages',
    badgeColor: '#10b981',
    iconType: 'archive',
  },
];

export const ContextWindowRuler: React.FC<ContextWindowRulerProps> = ({
  title = 'CONTEXT WINDOW EXPANSION',
  subtitle = 'Token Horizon & Full Document Memory Scale',
  activeLevel = 'animated',
  milestones = DEFAULT_MILESTONES,
  accentColor = '#38bdf8',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
  });

  // Tape ruler progression (0 to 1)
  const scanProgress = interpolate(frame, [15, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Dynamic token counter
  const animatedTokens = Math.round(
    interpolate(
      scanProgress,
      [0, 0.35, 0.7, 1],
      [8192, 65536, 131072, 1048576],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )
  );

  // Ruler height markers (15 ticks)
  const ticks = Array.from({ length: 17 }, (_, i) => i);

  return (
    <div
      style={{
        width: 880,
        height: 600,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(56, 189, 248, 0.22)',
        borderRadius: 24,
        padding: '32px 36px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(56, 189, 248, 0.1)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        opacity: enterProgress,
        transform: `translateY(${(1 - enterProgress) * 24}px) scale(${0.96 + enterProgress * 0.04})`,
        ...style,
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 2.2,
                color: accentColor,
                textTransform: 'uppercase',
                background: 'rgba(56, 189, 248, 0.12)',
                padding: '4px 10px',
                borderRadius: 8,
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              LLM BENCHMARK SPEC
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>• Page 4 / Workflow News</span>
          </div>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: -0.5, color: '#ffffff' }}>
            {title}
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#94a3b8', fontWeight: 400 }}>
            {subtitle}
          </p>
        </div>

        {/* Live Token Meter Badge */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            padding: '10px 18px',
            borderRadius: 14,
            textAlign: 'right',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
            Current Capacity
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              fontFamily: 'monospace',
              color: scanProgress > 0.8 ? '#10b981' : '#38bdf8',
              letterSpacing: -0.5,
            }}
          >
            {animatedTokens.toLocaleString()}
            <span style={{ fontSize: 13, color: '#cbd5e1', marginLeft: 4 }}>TOKENS</span>
          </div>
        </div>
      </div>

      {/* Main Content Body: Ruler + Milestone Cards */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', flex: 1, marginTop: 18 }}>
        {/* Vertical Ruler Column */}
        <div
          style={{
            width: 110,
            height: 380,
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            padding: '12px 10px',
            display: 'flex',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          {/* Active Fill Gradient */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${scanProgress * 100}%`,
              background: 'linear-gradient(to top, rgba(244, 63, 94, 0.4), rgba(56, 189, 248, 0.5) 40%, rgba(16, 185, 129, 0.7) 100%)',
              borderTop: '2px solid #34d399',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)',
              transition: 'height 0.05s linear',
            }}
          />

          {/* Ruler Tick Marks */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column-reverse',
              justifyContent: 'space-between',
              zIndex: 2,
            }}
          >
            {ticks.map((idx) => {
              const isMajor = idx === 0 || idx === 7 || idx === 16;
              const label = idx === 0 ? '8K' : idx === 7 ? '128K' : idx === 16 ? '1M' : '';
              const tickFillPercent = (idx / 16) * 100;
              const isReached = scanProgress * 100 >= tickFillPercent;

              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: isMajor ? 26 : 14,
                      height: isMajor ? 2.5 : 1.5,
                      backgroundColor: isReached
                        ? isMajor
                          ? '#ffffff'
                          : 'rgba(255, 255, 255, 0.8)'
                        : 'rgba(148, 163, 184, 0.3)',
                      borderRadius: 1,
                      boxShadow: isReached && isMajor ? '0 0 8px rgba(255,255,255,0.8)' : 'none',
                    }}
                  />
                  {isMajor && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: isReached ? '#ffffff' : '#64748b',
                      }}
                    >
                      {label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Floating Laser Indicator Needle */}
          <div
            style={{
              position: 'absolute',
              bottom: `calc(${scanProgress * 100}% - 7px)`,
              left: -4,
              right: -4,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          >
            <div
              style={{
                width: '100%',
                height: 2,
                backgroundColor: '#ffffff',
                boxShadow: '0 0 12px #38bdf8, 0 0 4px #ffffff',
              }}
            />
          </div>
        </div>

        {/* Milestone Detail Cards */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {milestones.map((item, index) => {
            const milestoneThreshold = index === 0 ? 0.05 : index === 1 ? 0.45 : 0.85;
            const isUnlocked = scanProgress >= milestoneThreshold;

            const cardSpring = spring({
              frame: Math.max(0, frame - 10 - index * 12),
              fps,
              config: { damping: 15, stiffness: 120 },
            });

            return (
              <div
                key={item.tokens}
                style={{
                  background: isUnlocked
                    ? 'rgba(30, 41, 59, 0.75)'
                    : 'rgba(15, 23, 42, 0.45)',
                  border: isUnlocked
                    ? `1px solid ${item.badgeColor}55`
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 16,
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: isUnlocked
                    ? `0 6px 20px rgba(0, 0, 0, 0.3), inset 0 0 15px ${item.badgeColor}15`
                    : 'none',
                  opacity: cardSpring,
                  transform: `translateX(${(1 - cardSpring) * 20}px)`,
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* Icon Container */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `${item.badgeColor}20`,
                      border: `1px solid ${item.badgeColor}66`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.badgeColor,
                    }}
                  >
                    {item.iconType === 'paper' && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <line x1="10" y1="9" x2="8" y2="9" />
                      </svg>
                    )}
                    {item.iconType === 'book' && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    )}
                    {item.iconType === 'archive' && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="5" rx="1" />
                        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
                        <path d="M10 12h4" />
                      </svg>
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: '#ffffff',
                        }}
                      >
                        {item.tokens} Horizon
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 6,
                          backgroundColor: `${item.badgeColor}22`,
                          color: item.badgeColor,
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 3 }}>
                      {item.analogy}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: isUnlocked ? '#f8fafc' : '#64748b',
                    }}
                  >
                    {item.pages}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: isUnlocked ? item.badgeColor : '#475569',
                      fontWeight: 600,
                      marginTop: 2,
                    }}
                  >
                    {isUnlocked ? '✓ FULL RETRIEVAL' : 'UPCOMING'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info Ribbon */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 14,
          fontSize: 12,
          color: '#64748b',
        }}
      >
        <span>Architecture: Multi-Head Latent Attention & FlashAttention-3</span>
        <span style={{ color: '#38bdf8', fontWeight: 600 }}>128x Expansion Over 18 Months</span>
      </div>
    </div>
  );
};
