import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface IndemnityTrapCardProps {
  clauseTitle?: string;
  clauseReference?: string;
  contractSnippet?: string;
  highlightedPhrase?: string;
  maxLiabilityExposure?: string;
  recommendedCap?: string;
  stampText?: string;
  width?: number;
  height?: number;
}

export const IndemnityTrapCard: React.FC<IndemnityTrapCardProps> = ({
  clauseTitle = 'LEGAL INDEMNITY TRAP',
  clauseReference = 'MSA Clause 11.2 - Defense & Indemnification',
  contractSnippet = 'Contractor shall defend, indemnify, and hold harmless Client, its officers, partners, and affiliates against ANY AND ALL third-party claims, liabilities, judgments, and legal defense expenses WITHOUT MONETARY LIMITATION, regardless of fault.',
  highlightedPhrase = 'ANY AND ALL third-party claims... WITHOUT MONETARY LIMITATION',
  maxLiabilityExposure = 'UNLIMITED ($1,000,000+)',
  recommendedCap = 'Capped at 100% of Fee ($3,500)',
  stampText = 'PREDATORY CLAUSE',
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pop-out card entrance spring
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 130, mass: 0.9 },
  });

  const cardScale = interpolate(cardSpring, [0, 1], [0.85, 1]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  // Pulsing hazard alert rhythm
  const pulseIntensity = (Math.sin((frame / fps) * Math.PI * 4) + 1) / 2; // oscillates 0 to 1
  const badgeGlow = interpolate(pulseIntensity, [0, 1], [10, 26]);

  // Stamp slam entrance delayed at frame 25
  const stampSpring = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 10, stiffness: 220, mass: 1 },
  });

  const stampScale = interpolate(stampSpring, [0, 1], [3.2, 1]);
  const stampOpacity = interpolate(stampSpring, [0, 1], [0, 0.95]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(24, 15, 23, 0.95) 0%, rgba(15, 23, 42, 0.92) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(239, 68, 68, 0.45)',
        boxShadow: `0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 50px rgba(239, 68, 68, 0.22)`,
        padding: '26px 30px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Red warning aura in background */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 500,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.28) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Banner with Flashing Hazard Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(239, 68, 68, 0.25)',
          paddingBottom: 16,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Hazard flashing badge */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 ${badgeGlow}px rgba(239, 68, 68, 0.8)`,
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                  textShadow: '0 0 12px rgba(239, 68, 68, 0.5)',
                }}
              >
                {clauseTitle}
              </span>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 9999,
                  background: 'rgba(239, 68, 68, 0.3)',
                  border: '1px solid #ef4444',
                  color: '#fca5a5',
                  letterSpacing: '0.05em',
                }}
              >
                CRITICAL THREAT
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{clauseReference}</div>
          </div>
        </div>

        {/* Severity indicator */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Legal Risk Score</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#ef4444', fontFamily: 'monospace' }}>
            10/10 EXTREME
          </div>
        </div>
      </div>

      {/* Zoomed-in Contract View Container */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          borderRadius: 16,
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 1,
        }}
      >
        {/* Loupe / Zoom Magnification Accent */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 700,
              color: '#f87171',
              marginBottom: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            2.5x Zoom In on Predatory Language
          </div>

          <div
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: '#e2e8f0',
              fontStyle: 'italic',
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '16px 18px',
              borderRadius: 12,
              borderLeft: '4px solid #ef4444',
            }}
          >
            &ldquo;{contractSnippet.split('ANY AND ALL').map((part, i, arr) => {
              if (i === arr.length - 1) return part;
              return (
                <React.Fragment key={i}>
                  {part}
                  <span
                    style={{
                      background: 'rgba(239, 68, 68, 0.35)',
                      color: '#ffffff',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      borderBottom: '2px solid #ef4444',
                      textDecoration: 'underline wavy #ef4444',
                    }}
                  >
                    ANY AND ALL third-party claims... WITHOUT MONETARY LIMITATION
                  </span>
                </React.Fragment>
              );
            })}&rdquo;
          </div>
        </div>

        {/* Slamming Rejection Stamp */}
        {frame >= 25 && (
          <div
            style={{
              position: 'absolute',
              top: '32%',
              right: '8%',
              transform: `scale(${stampScale}) rotate(-14deg)`,
              opacity: stampOpacity,
              border: '4px solid #ef4444',
              borderRadius: 12,
              padding: '8px 24px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.6)',
              zIndex: 10,
              pointerEvents: 'none',
              fontFamily: 'monospace',
            }}
          >
            {stampText}
          </div>
        )}

        {/* Financial Exposure Comparison Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
            marginTop: 14,
          }}
        >
          {/* Danger Column */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', textTransform: 'uppercase' }}>
              Your Maximum Liability
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#ef4444', marginTop: 4 }}>
              {maxLiabilityExposure}
            </div>
            <div style={{ fontSize: 11, color: '#fca5a5', marginTop: 2 }}>
              Personal assets & savings vulnerable to lawsuits.
            </div>
          </div>

          {/* Safe Column */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
              Industry Standard Cap
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#38bdf8', marginTop: 4 }}>
              {recommendedCap}
            </div>
            <div style={{ fontSize: 11, color: '#7dd3fc', marginTop: 2 }}>
              Strictly limited to the exact project fee received.
            </div>
          </div>
        </div>
      </div>

      {/* Action Recommendation Banner */}
      <div
        style={{
          marginTop: 14,
          padding: '10px 18px',
          borderRadius: 12,
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#cbd5e1' }}>
          <span style={{ fontWeight: 800, color: '#f59e0b' }}>AI REDLINE ACTION:</span>
          <span>Replace with Mutual Indemnity + Cap liability at 100% of fees paid.</span>
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 6,
            background: '#0284c7',
            color: '#ffffff',
          }}
        >
          INSERT FIX
        </div>
      </div>
    </div>
  );
};
