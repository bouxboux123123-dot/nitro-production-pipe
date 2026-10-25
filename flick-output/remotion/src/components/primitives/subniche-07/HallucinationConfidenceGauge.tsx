import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CitationItem {
  id: string;
  source: string;
  excerpt: string;
  isVerified: boolean;
  score: string;
}

export interface HallucinationConfidenceGaugeProps {
  title?: string;
  subtitle?: string;
  mode?: 'grounded' | 'hallucinating' | 'adaptive';
  confidenceScore?: number;
  queryText?: string;
  citations?: CitationItem[];
  style?: React.CSSProperties;
}

const DEFAULT_CITATIONS: CitationItem[] = [
  {
    id: 'CIT-01',
    source: 'SEC Form 10-Q Filing (Q3 2024)',
    excerpt: 'Consolidated Revenue reported at $35.08B (+94% YoY)',
    isVerified: true,
    score: '99.9%',
  },
  {
    id: 'CIT-02',
    source: 'NVIDIA Official IR Earnings Release',
    excerpt: 'Data Center segment gross margins sustained at 74.6%',
    isVerified: true,
    score: '99.2%',
  },
  {
    id: 'CIT-03',
    source: 'Bloomberg Consensus Terminal v8.2',
    excerpt: 'Guidance beat baseline Wall Street consensus by $2.1B',
    isVerified: true,
    score: '97.8%',
  },
];

export const HallucinationConfidenceGauge: React.FC<HallucinationConfidenceGaugeProps> = ({
  title = 'HALLUCINATION VS GROUNDING GAUGE',
  subtitle = 'Real-Time Fact Verification & Context Faithfulness',
  mode = 'adaptive',
  confidenceScore = 98.4,
  queryText = 'Verify NVIDIA Q3 Fiscal 2025 Data Center Revenue Figures',
  citations = DEFAULT_CITATIONS,
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

  // Adaptive animation: dips into red first, then soars up to green with verified citations!
  let effectiveScore = confidenceScore;
  if (mode === 'adaptive') {
    // Dip into red (22%) at frame 0-25, then climb steadily to 98% by frame 60
    effectiveScore = interpolate(
      frame,
      [0, 20, 55, 80],
      [28, 22, 92, confidenceScore],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  } else if (mode === 'hallucinating') {
    effectiveScore = 24;
  }

  const isGreen = effectiveScore >= 75;
  const isYellow = effectiveScore >= 45 && effectiveScore < 75;
  const activeColor = isGreen ? '#10b981' : isYellow ? '#f59e0b' : '#ef4444';
  const riskLabel = isGreen ? 'VERIFIED FACTUAL' : isYellow ? 'MODERATE INFERENCE' : 'HIGH HALLUCINATION RISK';

  // Liquid column height (0% to 100%)
  const liquidHeightPercent = Math.min(100, Math.max(8, effectiveScore));

  // Pulse glow effect
  const pulse = Math.sin(frame * 0.15) * 4;

  return (
    <div
      style={{
        width: 880,
        height: 600,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${activeColor}44`,
        borderRadius: 24,
        padding: '30px 36px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: `0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px ${activeColor}20`,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        opacity: enterSpring,
        transform: `translateY(${(1 - enterSpring) * 20}px)`,
        transition: 'border 0.2s ease, box-shadow 0.2s ease',
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
                color: activeColor,
                backgroundColor: `${activeColor}15`,
                padding: '3px 9px',
                borderRadius: 8,
                border: `1px solid ${activeColor}40`,
                transition: 'all 0.2s ease',
              }}
            >
              RAG FAITHFULNESS
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>• Multi-Vector Grounding</span>
          </div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: -0.5 }}>
            {title}
          </h2>
          <p style={{ margin: '3px 0 0 0', fontSize: 13, color: '#94a3b8' }}>{subtitle}</p>
        </div>

        {/* Dynamic Status Shield */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: `${activeColor}15`,
            border: `1px solid ${activeColor}55`,
            borderRadius: 16,
            padding: '8px 18px',
            boxShadow: `0 0 18px ${activeColor}25`,
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: activeColor,
              boxShadow: `0 0 10px ${activeColor}`,
            }}
          />
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: activeColor, letterSpacing: 0.5 }}>
              {riskLabel}
            </div>
            <div style={{ fontSize: 11, color: '#cbd5e1' }}>
              Score: {effectiveScore.toFixed(1)}% Grounded
            </div>
          </div>
        </div>
      </div>

      {/* Main Stage: Thermometer + Citation Stream */}
      <div style={{ display: 'flex', gap: 36, alignItems: 'center', flex: 1, marginTop: 14 }}>
        {/* Thermometer / Glass Gauge Column */}
        <div
          style={{
            width: 130,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Stem tube */}
          <div
            style={{
              width: 44,
              height: 290,
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '22px 22px 0 0',
              border: '2px solid rgba(255, 255, 255, 0.12)',
              borderBottom: 'none',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Zone Markers / Graduation Lines */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '14px 6px',
                zIndex: 4,
                pointerEvents: 'none',
              }}
            >
              {[100, 80, 60, 40, 20].map((val) => (
                <div
                  key={val}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ width: 6, height: 1.5, backgroundColor: 'rgba(255,255,255,0.4)' }} />
                  <div style={{ width: 6, height: 1.5, backgroundColor: 'rgba(255,255,255,0.4)' }} />
                </div>
              ))}
            </div>

            {/* Rising Liquid Column */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: `${liquidHeightPercent}%`,
                background: isGreen
                  ? 'linear-gradient(to top, #059669, #10b981)'
                  : isYellow
                  ? 'linear-gradient(to top, #d97706, #f59e0b)'
                  : 'linear-gradient(to top, #b91c1c, #ef4444)',
                boxShadow: `0 0 20px ${activeColor}cc`,
                transition: 'height 0.08s ease, background 0.2s ease',
              }}
            >
              {/* Meniscus wave top */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  backgroundColor: '#ffffff',
                  opacity: 0.7,
                  borderRadius: '50%',
                  filter: 'blur(0.5px)',
                }}
              />
            </div>
          </div>

          {/* Thermometer Bulb at Bottom */}
          <div
            style={{
              width: 74,
              height: 74,
              borderRadius: '50%',
              backgroundColor: activeColor,
              marginTop: -10,
              border: '3px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 ${20 + pulse}px ${activeColor}88, inset 0 0 15px rgba(0,0,0,0.3)`,
              zIndex: 5,
              transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
              {Math.round(effectiveScore)}%
            </span>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginTop: 6, letterSpacing: 1 }}>
            FAITHFULNESS
          </div>
        </div>

        {/* Right Pane: Query and Verified Citations */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Query Bar */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 14,
              padding: '12px 18px',
            }}
          >
            <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
              Prompt Query Verification
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', marginTop: 4 }}>
              "{queryText}"
            </div>
          </div>

          {/* Citations Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {citations.map((item, index) => {
              // Citation entrance staggered with spring
              const citSpring = spring({
                frame: Math.max(0, frame - 15 - index * 12),
                fps,
                config: { damping: 14, stiffness: 100 },
              });

              const isUnlocked = isGreen || frame > 30 + index * 10;

              return (
                <div
                  key={item.id}
                  style={{
                    background: isUnlocked
                      ? 'rgba(16, 185, 129, 0.06)'
                      : 'rgba(239, 68, 68, 0.06)',
                    border: isUnlocked
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: 12,
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: citSpring,
                    transform: `translateX(${(1 - citSpring) * 16}px)`,
                    boxShadow: isUnlocked ? '0 4px 14px rgba(16, 185, 129, 0.08)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Status Checkmark / Warning SVG */}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        backgroundColor: isUnlocked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isUnlocked ? '#10b981' : '#ef4444',
                      }}
                    >
                      {isUnlocked ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                        {item.source}
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                        {item.excerpt}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        color: isUnlocked ? '#10b981' : '#ef4444',
                      }}
                    >
                      {isUnlocked ? item.score : 'UNMATCHED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
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
        <span>Evaluation Standard: HaluEval 2.0 / RAG Triad Alignment</span>
        <span style={{ color: activeColor, fontWeight: 700 }}>
          {isGreen ? '✓ 0.00% False Attribution Rate' : '⚠ Caution: Unverified Claims Present'}
        </span>
      </div>
    </div>
  );
};
