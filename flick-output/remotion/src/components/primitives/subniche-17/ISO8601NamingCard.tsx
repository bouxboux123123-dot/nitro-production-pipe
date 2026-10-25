import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ISO8601NamingCardProps {
  title?: string;
  subtitle?: string;
  legacyFileName?: string;
  cleanDate?: string;
  projectName?: string;
  descriptor?: string;
  version?: string;
  extension?: string;
  width?: number;
  height?: number;
}

export const ISO8601NamingCard: React.FC<ISO8601NamingCardProps> = ({
  title = 'FILE STANDARDIZATION ENGINE',
  subtitle = 'Transforming Chaotic File Names into ISO 8601 Deterministic Standards',
  legacyFileName = 'final_draft_v2_EDIT_FINAL_last(1).pdf',
  cleanDate = '2026-10-25',
  projectName = 'ApexRebrand',
  descriptor = 'Contract',
  version = 'v01',
  extension = 'pdf',
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for main card container
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });

  // Strikethrough & warning flash on bad name
  const strikeSpring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  // Scanning laser beam progression
  const scanProgress = interpolate(frame, [20, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Reveal spring for clean ISO name
  const cleanSpring = spring({
    frame: Math.max(0, frame - 32),
    fps,
    config: { damping: 11, stiffness: 140, mass: 0.95 },
  });

  // Glow pulse for the verified badges
  const pulse = (Math.sin((frame / fps) * Math.PI * 3) + 1) / 2;
  const verifiedGlow = interpolate(pulse, [0, 1], [0.2, 0.6]);

  const fullCleanName = `${cleanDate}_${projectName}_${descriptor}_${version}.${extension}`;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: 24,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 25px 65px -15px rgba(0, 0, 0, 0.85), 0 0 45px rgba(16, 185, 129, 0.1)',
        padding: '24px 30px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
        transform: `scale(${interpolate(cardSpring, [0, 1], [0.9, 1])})`,
        opacity: interpolate(cardSpring, [0, 1], [0, 1]),
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          left: '30%',
          width: 360,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(56, 189, 248, 0.3) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            🏷️
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.04em', color: '#ffffff' }}>
              {title}
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>

        {/* Standard Badge */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.06em' }}>
            ISO 8601 COMPLIANT
          </span>
        </div>
      </div>

      {/* Top Section: The Chaotic Legacy Name (Before) */}
      <div
        style={{
          borderRadius: 16,
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          padding: '16px 20px',
          marginBottom: 14,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#f87171',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>⚠️</span> CHAOTIC LEGACY FORMAT (DO NOT USE)
          </span>
          <span
            style={{
              fontSize: 11,
              color: '#ef4444',
              fontFamily: 'monospace',
              fontWeight: 700,
              background: 'rgba(239, 68, 68, 0.18)',
              padding: '2px 8px',
              borderRadius: 6,
            }}
          >
            STATUS: INVALID TAXONOMY
          </span>
        </div>

        {/* Bad Name Display with dynamic red strike */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div
            style={{
              fontSize: 19,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: '#fca5a5',
              letterSpacing: '0.02em',
              opacity: interpolate(strikeSpring, [0, 1], [1, 0.65]),
            }}
          >
            {legacyFileName}
          </div>
          {/* Animated Strikethrough line */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              height: 3,
              backgroundColor: '#ef4444',
              borderRadius: 2,
              boxShadow: '0 0 10px #ef4444',
              width: `${interpolate(strikeSpring, [0, 1], [0, 100])}%`,
            }}
          />
        </div>

        {/* Flaw tags */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <span
            style={{
              fontSize: 11,
              padding: '3px 8px',
              borderRadius: 6,
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.25)',
            }}
          >
            ❌ Ambiguous Date
          </span>
          <span
            style={{
              fontSize: 11,
              padding: '3px 8px',
              borderRadius: 6,
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.25)',
            }}
          >
            ❌ False Final Versioning
          </span>
          <span
            style={{
              fontSize: 11,
              padding: '3px 8px',
              borderRadius: 6,
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.25)',
            }}
          >
            ❌ OS Collision (1)
          </span>
        </div>
      </div>

      {/* Middle Section: Transformation Scanning Beam */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '4px 0',
          marginBottom: 14,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.5) 50%, transparent 100%)',
          }}
        />
        <div
          style={{
            padding: '5px 16px',
            borderRadius: 20,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            zIndex: 2,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: `rotate(${scanProgress * 180}deg)` }}
          >
            <polyline points="7 13 12 18 17 13" />
            <polyline points="7 6 12 11 17 6" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.04em' }}>
            CONVERTING TO ISO 8601 DETERMINISTIC SYNTAX
          </span>
        </div>
      </div>

      {/* Bottom Section: Standardized Master Output (After) */}
      <div
        style={{
          flex: 1,
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 78, 59, 0.15) 100%)',
          border: '1.5px solid rgba(16, 185, 129, 0.45)',
          boxShadow: `0 0 30px rgba(16, 185, 129, ${verifiedGlow})`,
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transform: `scale(${interpolate(cleanSpring, [0, 1], [0.96, 1])})`,
          opacity: cleanSpring,
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#34d399',
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>✅</span> CANONICAL PRODUCTION SYNTAX
            </span>
            <span
              style={{
                fontSize: 11,
                color: '#10b981',
                fontFamily: 'monospace',
                fontWeight: 700,
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '3px 10px',
                borderRadius: 6,
                border: '1px solid rgba(16, 185, 129, 0.35)',
              }}
            >
              ORDER: CHRONOLOGICAL
            </span>
          </div>

          {/* Tokenized Anatomy Pills */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {/* Date token */}
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.18)',
                border: '1px solid #38bdf8',
                borderRadius: 8,
                padding: '6px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800 }}>[YYYY-MM-DD]</span>
              <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'monospace', color: '#f0f9ff' }}>
                {cleanDate}
              </span>
            </div>

            <span style={{ fontSize: 16, color: '#64748b', fontWeight: 800 }}>_</span>

            {/* Project token */}
            <div
              style={{
                background: 'rgba(168, 85, 247, 0.18)',
                border: '1px solid #a855f7',
                borderRadius: 8,
                padding: '6px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 9, color: '#c084fc', fontWeight: 800 }}>[PROJECT]</span>
              <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'monospace', color: '#faf5ff' }}>
                {projectName}
              </span>
            </div>

            <span style={{ fontSize: 16, color: '#64748b', fontWeight: 800 }}>_</span>

            {/* Descriptor token */}
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.18)',
                border: '1px solid #f59e0b',
                borderRadius: 8,
                padding: '6px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 9, color: '#fbbf24', fontWeight: 800 }}>[DESCRIPTOR]</span>
              <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'monospace', color: '#fffbeb' }}>
                {descriptor}
              </span>
            </div>

            <span style={{ fontSize: 16, color: '#64748b', fontWeight: 800 }}>_</span>

            {/* Version token */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.22)',
                border: '1px solid #10b981',
                borderRadius: 8,
                padding: '6px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 9, color: '#34d399', fontWeight: 800 }}>[VERSION]</span>
              <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'monospace', color: '#ecfdf5' }}>
                {version}
              </span>
            </div>

            <span style={{ fontSize: 16, color: '#64748b', fontWeight: 800 }}>.</span>

            {/* Extension */}
            <div
              style={{
                background: 'rgba(148, 163, 184, 0.18)',
                border: '1px solid #94a3b8',
                borderRadius: 8,
                padding: '6px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 9, color: '#cbd5e1', fontWeight: 800 }}>[EXT]</span>
              <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'monospace', color: '#f8fafc' }}>
                {extension}
              </span>
            </div>
          </div>

          {/* Unified Final String */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontFamily: 'monospace',
              fontSize: 16,
              fontWeight: 700,
              color: '#6ee7b7',
              letterSpacing: '0.03em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>📁</span>
            <span>{fullCleanName}</span>
          </div>
        </div>

        {/* Benefits bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 10 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#10b981' }}>✓</span> Chronological Auto-Sort
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#10b981' }}>✓</span> Universal OS Safe
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#10b981' }}>✓</span> Zero Search Ambiguity
          </span>
        </div>
      </div>
    </div>
  );
};
