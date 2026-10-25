import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ClauseComparisonSliderProps {
  title?: string;
  category?: string;
  clientVersionTitle?: string;
  clientClauseText?: string;
  clientKeyTakeaway?: string;
  protectedVersionTitle?: string;
  protectedClauseText?: string;
  protectedBenefitTakeaway?: string;
  width?: number;
  height?: number;
}

export const ClauseComparisonSlider: React.FC<ClauseComparisonSliderProps> = ({
  title = 'CLAUSE COMPARISON SLIDER',
  category = 'INTELLECTUAL PROPERTY & PAYMENT TERMS',
  clientVersionTitle = "CLIENT'S PROPOSED DRAFT",
  clientClauseText = 'Contractor agrees that all deliverables, concepts, source files, and patents become exclusive Client property upon inception, regardless of project completion or unpaid invoice status. Revisions are unlimited until Client satisfaction.',
  clientKeyTakeaway = 'HIGH RISK: Handing over all rights before getting paid a single dollar.',
  protectedVersionTitle = 'FREELANCER SHIELD CLAUSE',
  protectedClauseText = 'Conditional Assignment: Full title and copyright transfer solely upon 100% settlement of final invoice. Contract includes up to 2 revision rounds. Late payments incur 2.5% monthly compound fee.',
  protectedBenefitTakeaway = '100% PROTECTED: Client cannot legally deploy work without paying in full.',
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance card spring
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Slider wipe motion: sweeps smoothly from 15% across to 72%
  const wipeSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 18, stiffness: 60, mass: 1 },
  });

  const sliderPercent = interpolate(wipeSpring, [0, 1], [20, 68]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardSpring,
        transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.94) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 40px rgba(56, 189, 248, 0.15)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 14,
          marginBottom: 16,
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Dual Split Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <polyline points="4 8 4 3 9 3" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
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
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.5)',
                }}
              >
                AI REDLINE REWRITE
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{category}</div>
          </div>
        </div>

        {/* Legend Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              color: '#f87171',
              padding: '4px 10px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
            Original Draft
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              color: '#34d399',
              padding: '4px 10px',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
            Protected Shield
          </div>
        </div>
      </div>

      {/* Interactive Split View Area */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Layer 1: CLIENT'S DRAFT (Full width, underneath) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(30, 15, 20, 0.98) 0%, rgba(20, 24, 38, 0.95) 100%)',
            padding: '24px 28px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {/* Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#ef4444',
                  letterSpacing: '0.06em',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {clientVersionTitle}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#ef4444',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  padding: '3px 10px',
                  borderRadius: 6,
                }}
              >
                PREDATORY TERMS
              </span>
            </div>

            {/* Clause Text */}
            <div
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: '#fca5a5',
                fontStyle: 'italic',
                background: 'rgba(239, 68, 68, 0.08)',
                padding: '16px 20px',
                borderRadius: 12,
                borderLeft: '4px solid #ef4444',
              }}
            >
              &ldquo;{clientClauseText}&rdquo;
            </div>
          </div>

          {/* Risk Callout */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 13,
              fontWeight: 700,
              color: '#fecaca',
            }}
          >
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span>{clientKeyTakeaway}</span>
          </div>
        </div>

        {/* Layer 2: PROTECTED VERSION (Clipped based on slider position) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(8, 28, 36, 0.98) 0%, rgba(15, 30, 48, 0.95) 100%)',
            padding: '24px 28px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            clipPath: `polygon(${sliderPercent}% 0, 100% 0, 100% 100%, ${sliderPercent}% 100%)`,
            zIndex: 10,
          }}
        >
          <div>
            {/* Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 14 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#10b981',
                  letterSpacing: '0.06em',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                {protectedVersionTitle}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#34d399',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.5)',
                    padding: '3px 10px',
                    borderRadius: 6,
                    marginLeft: 8,
                  }}
                >
                  VERIFIED SAFE &bull; 100% ENFORCEABLE
                </span>
              </div>
            </div>

            {/* Clause Text */}
            <div
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: '#67e8f9',
                fontStyle: 'italic',
                background: 'rgba(6, 182, 212, 0.1)',
                padding: '16px 20px',
                borderRadius: 12,
                borderRight: '4px solid #06b6d4',
              }}
            >
              &ldquo;{protectedClauseText}&rdquo;
            </div>
          </div>

          {/* Safe Callout */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 10,
              fontSize: 13,
              fontWeight: 700,
              color: '#a7f3d0',
            }}
          >
            <span>{protectedBenefitTakeaway}</span>
            <span style={{ fontSize: 16 }}>🛡️</span>
          </div>
        </div>

        {/* Divider Slider Line & Handle */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPercent}%`,
            width: 3,
            background: '#ffffff',
            boxShadow: '0 0 16px 3px rgba(56, 189, 248, 0.9), 0 0 6px 1px #ffffff',
            transform: 'translateX(-50%)',
            zIndex: 30,
            pointerEvents: 'none',
          }}
        >
          {/* Circular Split Knob Handle */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              border: '2px solid #38bdf8',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="3">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <div style={{ width: 2, height: 14, background: '#38bdf8', borderRadius: 1 }} />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="3">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div
        style={{
          marginTop: 14,
          paddingTop: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          color: '#64748b',
          zIndex: 20,
        }}
      >
        <span>Drag / wipe to compare predator risk vs protected shield terms.</span>
        <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>Wipe Ratio: {Math.round(sliderPercent)}%</span>
      </div>
    </div>
  );
};
