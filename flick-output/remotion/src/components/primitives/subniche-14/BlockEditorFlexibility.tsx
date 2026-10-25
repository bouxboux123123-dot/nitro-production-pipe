import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BlockEditorFlexibilityProps {
  title?: string;
  subtitle?: string;
  blockTitle?: string;
  width?: number;
  height?: number;
}

export const BlockEditorFlexibility: React.FC<BlockEditorFlexibilityProps> = ({
  title = 'MODULAR BLOCK FLEXIBILITY',
  subtitle = 'Polymorphic Block Architecture • Markdown ➔ Kanban ➔ Database ➔ Toggle',
  blockTitle = 'Personal Knowledge Graph Architecture',
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

  // Phase calculation (4 distinct representations)
  // Phase 0: 0 -> 45 (Markdown)
  // Phase 1: 45 -> 90 (Kanban Board Card)
  // Phase 2: 90 -> 135 (Database Table Row)
  // Phase 3: 135+ (Toggle Tree)
  const currentPhaseIndex = frame < 45 ? 0 : frame < 90 ? 1 : frame < 135 ? 2 : 3;

  const modeNames = [
    { label: 'MARKDOWN BLOCK', icon: '📝', color: '#38bdf8' },
    { label: 'KANBAN CARD', icon: '📋', color: '#a855f7' },
    { label: 'DATABASE ROW', icon: '🗄️', color: '#10b981' },
    { label: 'NESTED TOGGLE', icon: '🔽', color: '#f59e0b' },
  ];

  // Morph transition spring for each phase trigger
  const morphProgress01 = spring({ frame: frame - 45, fps, config: { damping: 13, stiffness: 140 } });
  const morphProgress12 = spring({ frame: frame - 90, fps, config: { damping: 13, stiffness: 140 } });
  const morphProgress23 = spring({ frame: frame - 135, fps, config: { damping: 13, stiffness: 140 } });

  // Floating indicator pulse
  const pulse = (Math.sin(frame * 0.1) + 1) / 2;

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
        boxShadow: '0 25px 65px -15px rgba(0, 0, 0, 0.75), 0 0 40px rgba(168, 85, 247, 0.12)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background Grid Accent */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            'radial-gradient(#c084fc 1.2px, transparent 1.2px), radial-gradient(#38bdf8 1px, transparent 1px)',
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
          {/* Polymorphic Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.45)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  background: 'linear-gradient(90deg, #c084fc, #38bdf8)',
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
                  background: 'rgba(168, 85, 247, 0.25)',
                  color: '#d8b4fe',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  letterSpacing: '0.05em',
                }}
              >
                SINGLE SOURCE OF TRUTH
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>

        {/* Phase Pill Stepper */}
        <div style={{ display: 'flex', gap: 6 }}>
          {modeNames.map((mode, i) => {
            const isActive = currentPhaseIndex === i;
            return (
              <div
                key={mode.label}
                style={{
                  padding: '6px 10px',
                  borderRadius: 10,
                  background: isActive ? `${mode.color}25` : 'rgba(30, 41, 59, 0.6)',
                  border: `1px solid ${isActive ? mode.color : 'rgba(255, 255, 255, 0.08)'}`,
                  color: isActive ? '#f8fafc' : '#64748b',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? `0 0 12px ${mode.color}33` : 'none',
                }}
              >
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block Stage Container */}
      <div
        style={{
          flex: 1,
          marginTop: 18,
          background: 'rgba(15, 23, 42, 0.7)',
          borderRadius: 18,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          justifyContent: 'center',
        }}
      >
        {/* Block Drag Handle and Command Menu Pill */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#64748b',
          }}
        >
          <div
            style={{
              cursor: 'grab',
              display: 'flex',
              gap: 2,
              padding: '2px 4px',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <span style={{ fontSize: 13, letterSpacing: -1 }}>⋮⋮</span>
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: 'monospace',
              color: '#a855f7',
              background: 'rgba(168, 85, 247, 0.15)',
              padding: '2px 8px',
              borderRadius: 6,
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}
          >
            /turn-into ➔ {modeNames[currentPhaseIndex].label}
          </div>
        </div>

        {/* ---------------- PHASE 0: RAW MARKDOWN BLOCK ---------------- */}
        {currentPhaseIndex === 0 && (
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.75)',
              borderRadius: 14,
              border: '1px solid rgba(56, 189, 248, 0.35)',
              padding: '20px 24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: 18 }}>###</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc' }}>{blockTitle}</span>
            </div>
            <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: '1.7', fontFamily: 'monospace' }}>
              <div>- [x] Configure bi-directional linking graph indexer</div>
              <div>- [x] Map atomic markdown notes to Zettelkasten slipbox</div>
              <div>- [ ] Export zero-vendor portable offline archive</div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              {['#architecture', '#second-brain', '#offline-first'].map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- PHASE 1: KANBAN BOARD CARD ---------------- */}
        {currentPhaseIndex === 1 && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
              borderRadius: 16,
              border: '1px solid rgba(168, 85, 247, 0.45)',
              padding: '22px 26px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.4), 0 0 25px rgba(168, 85, 247, 0.15)',
              maxWidth: 580,
              margin: '0 auto',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '3px 9px',
                  borderRadius: 6,
                  background: 'rgba(168, 85, 247, 0.25)',
                  color: '#d8b4fe',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                }}
              >
                KANBAN • IN PROGRESS
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                }}
              >
                P1 CRITICAL
              </span>
            </div>

            <div style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
              {blockTitle}
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
                <span>Sub-tasks progress</span>
                <span style={{ fontWeight: 700, color: '#c084fc' }}>67% (2 of 3 completed)</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '67%', height: '100%', background: 'linear-gradient(90deg, #a855f7, #38bdf8)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                  CB
                </div>
                <span style={{ fontSize: 11, color: '#cbd5e1' }}>Assigned: Lead Architect</span>
              </div>
              <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>📅 Due Tomorrow</span>
            </div>
          </div>
        )}

        {/* ---------------- PHASE 2: DATABASE TABLE ROW ---------------- */}
        {currentPhaseIndex === 2 && (
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.85)',
              borderRadius: 14,
              border: '1px solid rgba(16, 185, 129, 0.4)',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '10px 18px',
                background: 'rgba(15, 23, 42, 0.9)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.05em',
                color: '#64748b',
              }}
            >
              <div>PAGE / RECORD NAME</div>
              <div>STATUS</div>
              <div>STORAGE</div>
              <div>BACKLINKS</div>
            </div>

            {/* Table Row 1 (Target Morphed Block) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '14px 18px',
                alignItems: 'center',
                background: 'rgba(16, 185, 129, 0.08)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: 12,
              }}
            >
              <div style={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📄</span>
                <span>{blockTitle}</span>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 9999, background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  ● Active
                </span>
              </div>
              <div style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: 11 }}>Plaintext .md</div>
              <div style={{ fontWeight: 800, color: '#38bdf8' }}>38 References</div>
            </div>

            {/* Table Row 2 (Neighbor Record) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '12px 18px',
                alignItems: 'center',
                fontSize: 12,
                color: '#94a3b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📄</span>
                <span>Zettelkasten Atomic Index</span>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 9999, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                  Indexed
                </span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 11 }}>Local SQLite</div>
              <div style={{ fontWeight: 700, color: '#94a3b8' }}>14 References</div>
            </div>
          </div>
        )}

        {/* ---------------- PHASE 3: NESTED TOGGLE LIST ---------------- */}
        {currentPhaseIndex === 3 && (
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              borderRadius: 14,
              border: '1px solid rgba(245, 158, 11, 0.4)',
              padding: '20px 24px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
            }}
          >
            {/* Toggle Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 900,
                }}
              >
                ▼
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc' }}>
                {blockTitle}
              </div>
              <span style={{ fontSize: 10, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: 4 }}>
                3 Nested Children
              </span>
            </div>

            {/* Nested Items with tree lines */}
            <div style={{ marginLeft: 24, paddingLeft: 16, borderLeft: '2px solid rgba(245, 158, 11, 0.3)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 13, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span>Zero vendor lock-in with standard CommonMark specifications</span>
              </div>
              <div style={{ fontSize: 13, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span>Bi-directional graph traversal using local file-system links</span>
              </div>
              <div style={{ fontSize: 13, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#fbbf24' }}>●</span>
                <span>Infinite nested blocks without relational database query overhead</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Summary Ribbon */}
      <div
        style={{
          marginTop: 14,
          padding: '12px 18px',
          borderRadius: 14,
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: modeNames[currentPhaseIndex].color,
              boxShadow: `0 0 10px ${modeNames[currentPhaseIndex].color}`,
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1' }}>
            Current View Engine: <span style={{ color: modeNames[currentPhaseIndex].color }}>{modeNames[currentPhaseIndex].label}</span>
          </span>
        </div>

        <div style={{ fontSize: 11, color: '#94a3b8' }}>
          Zero data mutation • Rendered dynamically from 1 AST node
        </div>
      </div>
    </div>
  );
};
