import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WaterfallStage {
  step: number;
  sourceName: string;
  badge: string;
  sourceIcon: string;
  unlockedFields: { key: string; val: string }[];
  status: 'PENDING' | 'RESOLVING' | 'RESOLVED';
  confidence: number;
}

export interface LeadWaterfallEnricherProps {
  title?: string;
  subtitle?: string;
  seedEmail?: string;
  stages?: WaterfallStage[];
  verifiedScore?: string;
  costBadge?: string;
  accentColor?: string;
}

export const LeadWaterfallEnricher: React.FC<LeadWaterfallEnricherProps> = ({
  title = 'WATERFALL ENRICHMENT PIPELINE',
  subtitle = 'Zero-Cost Cascading Data Resolution',
  seedEmail = 'elena.vance@vertexcloud.io',
  stages = [
    {
      step: 1,
      sourceName: 'Public Git & PGP Keys',
      badge: 'FREE REPO COMMITS',
      sourceIcon: '⚡',
      unlockedFields: [
        { key: 'Full Name', val: 'Elena Vance' },
        { key: 'GitHub Handle', val: '@elena-vance-dev' },
      ],
      status: 'RESOLVED',
      confidence: 99,
    },
    {
      step: 2,
      sourceName: 'OpenCorporates & Free SEC',
      badge: 'OPEN ENTITY REGISTRY',
      sourceIcon: '🏛️',
      unlockedFields: [
        { key: 'Company', val: 'Vertex Cloud Inc.' },
        { key: 'Headquarters', val: 'Austin, TX (HQ)' },
      ],
      status: 'RESOLVED',
      confidence: 96,
    },
    {
      step: 3,
      sourceName: 'MX Routing & Hunter Free API',
      badge: 'SMTP DIRECT PING',
      sourceIcon: '📡',
      unlockedFields: [
        { key: 'Seniority & Role', val: 'VP of Platform Eng.' },
        { key: 'Direct Phone', val: '+1 (512) 803-9124' },
      ],
      status: 'RESOLVED',
      confidence: 98,
    },
  ],
  verifiedScore = '98.8%',
  costBadge = '$0.00 / QUERY',
  accentColor = '#818cf8', // Indigo 400
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master entrance spring
  const rootScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  return (
    <div
      style={{
        width: 880,
        height: 640,
        borderRadius: 20,
        background: 'linear-gradient(150deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 28, 0.98) 100%)',
        border: '1px solid rgba(129, 140, 248, 0.28)',
        boxShadow: `0 24px 60px -12px rgba(0, 0, 0, 0.75), 0 0 40px rgba(99, 102, 241, 0.15)`,
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'SF Pro Display', -apple-system, 'Segoe UI', Roboto, sans-serif",
        color: '#f8fafc',
        transform: `scale(${rootScale})`,
        opacity: rootScale,
        boxSizing: 'border-box',
        padding: 24,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 14,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(99, 102, 241, 0.5)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.04em', color: '#f8fafc' }}>{title}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{subtitle}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.06em',
            }}
          >
            {costBadge}
          </div>
          <div
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            ACCURACY: {verifiedScore}
          </div>
        </div>
      </div>

      {/* Main Waterfall Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 14, gap: 10 }}>
        {/* Step 0: Input Seed Node */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.65)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            borderRadius: 12,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                padding: '3px 8px',
                borderRadius: 6,
                fontSize: 10,
                fontWeight: 800,
              }}
            >
              SEED INPUT
            </span>
            <span style={{ fontSize: 13, fontFamily: "'Fira Code', monospace", color: '#e2e8f0' }}>{seedEmail}</span>
          </div>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>Only Single Parameter Required</span>
        </div>

        {/* Cascading 3 Stages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
          {/* Vertical Connecting Neon Line */}
          <div
            style={{
              position: 'absolute',
              left: 28,
              top: 10,
              bottom: 10,
              width: 2,
              background: 'linear-gradient(to bottom, #6366f1, #38bdf8, #10b981)',
              opacity: 0.6,
              zIndex: 1,
            }}
          />

          {stages.map((stg, i) => {
            const delay = 12 + i * 16;
            const stageSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 13, stiffness: 120 },
            });

            const isActive = frame >= delay;
            const flowGlow = interpolate(Math.sin((frame - delay) * 0.2), [-1, 1], [0.1, 0.4]);

            return (
              <div
                key={stg.step}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  marginLeft: 12,
                  borderRadius: 12,
                  background: isActive ? 'rgba(15, 23, 42, 0.8)' : 'rgba(15, 23, 42, 0.4)',
                  border: isActive
                    ? `1px solid rgba(56, 189, 248, ${0.3 + flowGlow})`
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transform: `translateY(${(1 - stageSpring) * 16}px)`,
                  opacity: stageSpring,
                  boxShadow: isActive ? `0 4px 20px rgba(56, 189, 248, ${flowGlow})` : 'none',
                }}
              >
                {/* Node icon pill */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {stg.sourceIcon}
                </div>

                {/* Stage Info */}
                <div style={{ width: 220 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{stg.sourceName}</span>
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: '#38bdf8',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {stg.badge}
                  </span>
                </div>

                {/* Arrow indicator */}
                <div style={{ color: '#64748b', fontSize: 16 }}>➔</div>

                {/* Discovered attributes */}
                <div style={{ flex: 1, display: 'flex', gap: 12 }}>
                  {stg.unlockedFields.map((fld) => (
                    <div
                      key={fld.key}
                      style={{
                        background: 'rgba(2, 6, 23, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 8,
                        padding: '6px 10px',
                        flex: 1,
                      }}
                    >
                      <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>{fld.key}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#34d399', marginTop: 2 }}>{fld.val}</div>
                    </div>
                  ))}
                </div>

                {/* Confidence chip */}
                <div
                  style={{
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "'Fira Code', monospace",
                  }}
                >
                  {stg.confidence}% MATCH
                </div>
              </div>
            );
          })}
        </div>

        {/* Master Output Card (The fully synthesized B2B lead) */}
        <div
          style={{
            marginTop: 'auto',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 14,
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 800,
                color: '#ffffff',
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>
                Elena Vance • VP of Platform Eng.
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                Vertex Cloud Inc. • Austin, TX • Direct Phone & Public GitHub Confirmed
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              background: '#10b981',
              color: '#020617',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.04em',
            }}
          >
            EXPORT READY (.CSV)
          </div>
        </div>
      </div>
    </div>
  );
};
