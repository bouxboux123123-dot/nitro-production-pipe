import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DataLockInWarningCardProps {
  title?: string;
  subtitle?: string;
  cloudNotesCount?: number;
  localNotesCount?: number;
  width?: number;
  height?: number;
}

export const DataLockInWarningCard: React.FC<DataLockInWarningCardProps> = ({
  title = 'DATA LOCK-IN & SOVEREIGNTY AUDIT',
  subtitle = 'Proprietary Cloud Walled Garden vs Open Local Plaintext Vault',
  cloudNotesCount = 5420,
  localNotesCount = 5420,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.93, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [25, 0]);

  // Lock pulse animation
  const lockPulse = (Math.sin(frame * 0.15) + 1) / 2;
  const lockGlow = interpolate(lockPulse, [0, 1], [15, 30]);

  // Tree items reveal stagger
  const treeItem0 = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 120 } });
  const treeItem1 = spring({ frame: frame - 22, fps, config: { damping: 14, stiffness: 120 } });
  const treeItem2 = spring({ frame: frame - 29, fps, config: { damping: 14, stiffness: 120 } });
  const treeItem3 = spring({ frame: frame - 36, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 65px -15px rgba(0, 0, 0, 0.75), 0 0 40px rgba(239, 68, 68, 0.12)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background hazard subtle grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            'radial-gradient(#ef4444 1px, transparent 1px), radial-gradient(#10b981 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Padlock / Shield Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(220, 38, 38, 0.45)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  background: 'linear-gradient(90deg, #f87171, #fbbf24, #34d399)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {title}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 9999,
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  letterSpacing: '0.05em',
                }}
              >
                SECURITY PROTOCOL: DATA FREEDOM
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>

        {/* Risk Dial Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(30, 41, 59, 0.65)',
            padding: '6px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: '#f87171', fontWeight: 800 }}>LOCK-IN RISK</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#ef4444' }}>94% CRITICAL</div>
          </div>
          <div style={{ width: 1, height: 20, background: 'rgba(255, 255, 255, 0.1)' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: '#34d399', fontWeight: 800 }}>LOCAL FREEDOM</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#10b981' }}>100% SECURE</div>
          </div>
        </div>
      </div>

      {/* Split Comparison Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 18,
          marginTop: 18,
          flex: 1,
          zIndex: 2,
        }}
      >
        {/* LEFT CARD: PROPRIETARY CLOUD TRAP */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%)',
            borderRadius: 18,
            border: '1px solid rgba(239, 68, 68, 0.4)',
            boxShadow: `0 10px 30px rgba(0, 0, 0, 0.5), 0 0 ${lockGlow}px rgba(239, 68, 68, 0.15)`,
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Cloud Trap Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(239, 68, 68, 0.25)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 16 }}>🔒</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f87171' }}>
                  PROPRIETARY CLOUD SILO
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>Remote Encrypted Blob</div>
              </div>
            </div>

            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 6,
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.4)',
              }}
            >
              HOSTAGE STATE
            </div>
          </div>

          {/* Database Card Behind Cage Bars */}
          <div
            style={{
              flex: 1,
              background: 'rgba(15, 23, 42, 0.9)',
              borderRadius: 12,
              border: '1px solid rgba(239, 68, 68, 0.25)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Caution Hatching Overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background:
                  'repeating-linear-gradient(45deg, #ef4444, #ef4444 10px, #0f172a 10px, #0f172a 20px)',
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fca5a5' }}>
                  {cloudNotesCount.toLocaleString()} Knowledge Records
                </span>
                <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 800 }}>UNEXPORTABLE</span>
              </div>

              {/* Trap warning checklist */}
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11, color: '#cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <span style={{ color: '#ef4444' }}>✕</span>
                  <span>Proprietary block schema prevents direct raw export</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <span style={{ color: '#ef4444' }}>✕</span>
                  <span>Backlinks break when exported to standard PDF/HTML</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <span style={{ color: '#ef4444' }}>✕</span>
                  <span>Subscription canceled = read-only database lock</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <span style={{ color: '#ef4444' }}>✕</span>
                  <span>Zero offline access during remote API downtime</span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 10,
                padding: '8px 10px',
                borderRadius: 8,
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontSize: 10,
                fontWeight: 700,
                color: '#f87171',
                textAlign: 'center',
              }}
            >
              ⚠️ VENDOR LOCK: HIGH SWITCHING BARRIER
            </div>
          </div>
        </div>

        {/* RIGHT CARD: OPEN LOCAL MARKDOWN VAULT */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%)',
            borderRadius: 18,
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(16, 185, 129, 0.15)',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(16, 185, 129, 0.25)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 16 }}>📂</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#34d399' }}>
                  OPEN .MD VAULT TREE
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>Native File System</div>
              </div>
            </div>

            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 6,
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#6ee7b7',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
            >
              100% SOVEREIGN
            </div>
          </div>

          {/* Directory Tree Sandbox */}
          <div
            style={{
              flex: 1,
              background: 'rgba(15, 23, 42, 0.9)',
              borderRadius: 12,
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontFamily: 'monospace',
              fontSize: 11,
              color: '#f8fafc',
            }}
          >
            <div>
              <div style={{ color: '#34d399', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>📁</span>
                <span>/Users/vault/knowledge-base/</span>
              </div>

              {/* Animated Tree Nodes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: 12, borderLeft: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ opacity: treeItem0, transform: `translateX(${(1 - treeItem0) * -10}px)` }}>
                  <span style={{ color: '#64748b' }}>├── 📄</span> <span style={{ color: '#f1f5f9' }}>00-Index.md</span> <span style={{ color: '#34d399', fontSize: 9 }}>(CommonMark)</span>
                </div>
                <div style={{ opacity: treeItem1, transform: `translateX(${(1 - treeItem1) * -10}px)` }}>
                  <span style={{ color: '#64748b' }}>├── 📁</span> <span style={{ color: '#38bdf8' }}>Daily Notes/</span>
                </div>
                <div style={{ opacity: treeItem2, transform: `translateX(${(1 - treeItem2) * -10}px)`, paddingLeft: 14 }}>
                  <span style={{ color: '#64748b' }}>└── 📄</span> <span style={{ color: '#cbd5e1' }}>2026-10-25.md</span>
                </div>
                <div style={{ opacity: treeItem3, transform: `translateX(${(1 - treeItem3) * -10}px)` }}>
                  <span style={{ color: '#64748b' }}>├── 📁</span> <span style={{ color: '#c084fc' }}>Mental-Models/</span>
                </div>
                <div style={{ opacity: treeItem3, transform: `translateX(${(1 - treeItem3) * -10}px)` }}>
                  <span style={{ color: '#64748b' }}>└── 📄</span> <span style={{ color: '#f1f5f9' }}>Zettelkasten-Slipbox.md</span>
                </div>
              </div>
            </div>

            {/* Sovereignty perks */}
            <div
              style={{
                marginTop: 10,
                padding: '8px 10px',
                borderRadius: 8,
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: 10,
                fontWeight: 700,
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>✓ FUTURE-PROOF (READABLE IN 2050)</span>
              <span style={{ color: '#6ee7b7' }}>GIT VERSIONED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Verdict Ribbon */}
      <div
        style={{
          marginTop: 18,
          padding: '14px 20px',
          borderRadius: 16,
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 10,
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            CORE ARCHITECTURAL RULE
          </div>
          <div style={{ fontSize: 12, color: '#cbd5e1' }}>
            Never entrust your lifelong second brain to a proprietary database you can't open in a text editor.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 10, padding: '4px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.15)', color: '#34d399', fontWeight: 700 }}>
            Obsidian
          </span>
          <span style={{ fontSize: 10, padding: '4px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.15)', color: '#34d399', fontWeight: 700 }}>
            Logseq
          </span>
          <span style={{ fontSize: 10, padding: '4px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.15)', color: '#34d399', fontWeight: 700 }}>
            Neovim
          </span>
        </div>
      </div>
    </div>
  );
};
