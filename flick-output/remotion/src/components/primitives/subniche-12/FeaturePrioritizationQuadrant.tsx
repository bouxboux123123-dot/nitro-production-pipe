import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FeatureItem {
  id: string;
  name: string;
  impact: 'High' | 'Low';
  effort: 'Low' | 'High';
  quadrant: 'must-build' | 'strategic' | 'quick-wins' | 'deprioritize';
  score: string;
  icon: string;
  targetPos: { x: number; y: number }; // Percentage offsets within quadrant
}

export interface FeaturePrioritizationQuadrantProps {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
  width?: number;
  height?: number;
}

const DEFAULT_FEATURES: FeatureItem[] = [
  // 4 Must Build First (Top-Left)
  { id: 'f1', name: 'Magic Link Auth', impact: 'High', effort: 'Low', quadrant: 'must-build', score: '⚡ Priority #1', icon: '🔑', targetPos: { x: 12, y: 16 } },
  { id: 'f2', name: '1-Click Stripe Pay', impact: 'High', effort: 'Low', quadrant: 'must-build', score: '⚡ Priority #2', icon: '💳', targetPos: { x: 55, y: 16 } },
  { id: 'f3', name: 'Core AI Workflow', impact: 'High', effort: 'Low', quadrant: 'must-build', score: '⚡ Priority #3', icon: '🤖', targetPos: { x: 12, y: 56 } },
  { id: 'f4', name: 'Instant Export', impact: 'High', effort: 'Low', quadrant: 'must-build', score: '⚡ Priority #4', icon: '🚀', targetPos: { x: 55, y: 56 } },
  
  // 2 Strategic Bets (Top-Right)
  { id: 'f5', name: 'Custom Domain CNAME', impact: 'High', effort: 'High', quadrant: 'strategic', score: 'Phase 2', icon: '🌐', targetPos: { x: 15, y: 22 } },
  { id: 'f6', name: 'Fine-Tuned LLM Model', impact: 'High', effort: 'High', quadrant: 'strategic', score: 'Phase 2', icon: '🧠', targetPos: { x: 15, y: 58 } },

  // 2 Quick Polish (Bottom-Left)
  { id: 'f7', name: 'Dark Mode Switcher', impact: 'Low', effort: 'Low', quadrant: 'quick-wins', score: 'Nice-to-have', icon: '🌙', targetPos: { x: 15, y: 22 } },
  { id: 'f8', name: 'Keyboard Shortcuts', impact: 'Low', effort: 'Low', quadrant: 'quick-wins', score: 'Nice-to-have', icon: '⌨️', targetPos: { x: 15, y: 58 } },

  // 2 Deprioritize / Cut (Bottom-Right)
  { id: 'f9', name: 'Multi-Org SSO (SAML)', impact: 'Low', effort: 'High', quadrant: 'deprioritize', score: '🚫 Cut from MVP', icon: '🏢', targetPos: { x: 15, y: 22 } },
  { id: 'f10', name: 'Drag & Drop Builder', impact: 'Low', effort: 'High', quadrant: 'deprioritize', score: '🚫 Cut from MVP', icon: '🧱', targetPos: { x: 15, y: 58 } },
];

export const FeaturePrioritizationQuadrant: React.FC<FeaturePrioritizationQuadrantProps> = ({
  title = 'LEAN MVP FEATURE MATRIX (IMPACT vs EFFORT)',
  subtitle = 'Ruthlessly isolate the 20% of features driving 80% of customer value',
  features = DEFAULT_FEATURES,
  width = 900,
  height = 630,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master card entrance
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(cardSpring, [0, 1], [0.94, 1]);

  // Quadrant 1 (Must Build First) highlight glow at frame 50+
  const mustBuildGlow = interpolate(frame, [45, 75], [0.15, 0.45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
        borderRadius: 20,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.90))',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(56, 189, 248, 0.1)',
        padding: '22px 26px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        color: '#F8FAFC',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(56, 189, 248, 0.3))',
              border: '1px solid rgba(34, 197, 94, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', color: '#38BDF8', textTransform: 'uppercase' }}>
              {title}
            </div>
            <div style={{ fontSize: 11.5, color: '#94A3B8' }}>{subtitle}</div>
          </div>
        </div>

        {/* Sprint status badge */}
        <div
          style={{
            padding: '5px 12px',
            borderRadius: 8,
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            fontSize: 11.5,
            fontWeight: 700,
            color: '#4ADE80',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>✓</span>
          <span>MVP SCOPE: 4 FEATURES ONLY (72h SPRINT)</span>
        </div>
      </div>

      {/* Axis Labels & 2x2 Matrix Grid Container */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '30px 1fr 1fr',
          gridTemplateRows: '1fr 1fr 28px',
          gap: '8px 10px',
          position: 'relative',
        }}
      >
        {/* Y-Axis Label (High Impact -> Low Impact) */}
        <div
          style={{
            gridRow: '1 / 3',
            gridColumn: '1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: '#64748B',
          }}
        >
          <span style={{ color: '#22C55E' }}>▲ HIGH IMPACT</span>
          <div
            style={{
              width: 2,
              flex: 1,
              background: 'linear-gradient(to bottom, #22C55E, #64748B, #EF4444)',
              margin: '8px 0',
              opacity: 0.5,
            }}
          />
          <span style={{ color: '#EF4444' }}>▼ LOW IMPACT</span>
        </div>

        {/* Quadrant 1: Top-Left (MUST BUILD FIRST) */}
        <div
          style={{
            gridRow: '1',
            gridColumn: '2',
            position: 'relative',
            borderRadius: 14,
            backgroundColor: `rgba(16, 185, 129, ${mustBuildGlow * 0.25})`,
            border: `1.5px solid rgba(34, 197, 94, ${mustBuildGlow + 0.3})`,
            boxShadow: `0 0 25px rgba(34, 197, 94, ${mustBuildGlow * 0.4})`,
            padding: 12,
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#4ADE80', letterSpacing: '0.04em' }}>
              ⚡ MUST BUILD FIRST (MVP CORE)
            </span>
            <span style={{ fontSize: 10, color: '#86EFAC', fontWeight: 700, backgroundColor: 'rgba(34, 197, 94, 0.2)', padding: '2px 8px', borderRadius: 4 }}>
              DO NOW (WEEK 1)
            </span>
          </div>

          {/* Cards for Must Build */}
          <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 24px)' }}>
            {features.filter(f => f.quadrant === 'must-build').map((feat, idx) => {
              const cardSpringAnim = spring({
                frame: frame - (15 + idx * 8),
                fps,
                config: { damping: 13, stiffness: 140 },
              });
              const cOpacity = interpolate(cardSpringAnim, [0, 1], [0, 1]);
              const cScale = interpolate(cardSpringAnim, [0, 1], [0.6, 1]);
              const cY = interpolate(cardSpringAnim, [0, 1], [40, 0]);

              return (
                <div
                  key={feat.id}
                  style={{
                    position: 'absolute',
                    left: `${feat.targetPos.x}%`,
                    top: `${feat.targetPos.y}%`,
                    width: '42%',
                    opacity: cOpacity,
                    transform: `translateY(${cY}px) scale(${cScale})`,
                    padding: '8px 10px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(6, 78, 59, 0.75)',
                    border: '1px solid rgba(52, 211, 153, 0.5)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: '#FFFFFF' }}>
                    <span>{feat.icon}</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{feat.name}</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#A7F3D0', marginTop: 2, fontWeight: 600 }}>{feat.score}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quadrant 2: Top-Right (STRATEGIC BETS - Phase 2) */}
        <div
          style={{
            gridRow: '1',
            gridColumn: '3',
            position: 'relative',
            borderRadius: 14,
            backgroundColor: 'rgba(30, 41, 59, 0.45)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            padding: 12,
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#93C5FD', letterSpacing: '0.04em' }}>
              🎯 STRATEGIC BETS
            </span>
            <span style={{ fontSize: 10, color: '#64748B' }}>POST-PMF (v2.0)</span>
          </div>

          <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 24px)' }}>
            {features.filter(f => f.quadrant === 'strategic').map((feat, idx) => {
              const cardSpringAnim = spring({
                frame: frame - (28 + idx * 8),
                fps,
                config: { damping: 13, stiffness: 140 },
              });
              const cOpacity = interpolate(cardSpringAnim, [0, 1], [0, 1]);
              const cScale = interpolate(cardSpringAnim, [0, 1], [0.6, 1]);

              return (
                <div
                  key={feat.id}
                  style={{
                    position: 'absolute',
                    left: `${feat.targetPos.x}%`,
                    top: `${feat.targetPos.y}%`,
                    width: '78%',
                    opacity: cOpacity,
                    transform: `scale(${cScale})`,
                    padding: '8px 10px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(30, 41, 59, 0.75)',
                    border: '1px solid rgba(147, 197, 253, 0.3)',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: '#E2E8F0' }}>
                    <span>{feat.icon}</span>
                    <span>{feat.name}</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{feat.score}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quadrant 3: Bottom-Left (QUICK WINS - Nice-to-have) */}
        <div
          style={{
            gridRow: '2',
            gridColumn: '2',
            position: 'relative',
            borderRadius: 14,
            backgroundColor: 'rgba(30, 41, 59, 0.35)',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            padding: 12,
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#FDE047', letterSpacing: '0.04em' }}>
              ✨ QUICK POLISH
            </span>
            <span style={{ fontSize: 10, color: '#64748B' }}>BACKLOG SPRINT</span>
          </div>

          <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 24px)' }}>
            {features.filter(f => f.quadrant === 'quick-wins').map((feat, idx) => {
              const cardSpringAnim = spring({
                frame: frame - (35 + idx * 8),
                fps,
                config: { damping: 13, stiffness: 140 },
              });
              const cOpacity = interpolate(cardSpringAnim, [0, 1], [0, 1]);
              const cScale = interpolate(cardSpringAnim, [0, 1], [0.6, 1]);

              return (
                <div
                  key={feat.id}
                  style={{
                    position: 'absolute',
                    left: `${feat.targetPos.x}%`,
                    top: `${feat.targetPos.y}%`,
                    width: '78%',
                    opacity: cOpacity,
                    transform: `scale(${cScale})`,
                    padding: '8px 10px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(30, 41, 59, 0.75)',
                    border: '1px solid rgba(253, 224, 71, 0.25)',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: '#E2E8F0' }}>
                    <span>{feat.icon}</span>
                    <span>{feat.name}</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{feat.score}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quadrant 4: Bottom-Right (CUT / DEPRIORITIZE) */}
        <div
          style={{
            gridRow: '2',
            gridColumn: '3',
            position: 'relative',
            borderRadius: 14,
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px dashed rgba(239, 68, 68, 0.35)',
            padding: 12,
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#F87171', letterSpacing: '0.04em' }}>
              🚫 TIME TRAPS (CUT)
            </span>
            <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 700 }}>DO NOT CODE</span>
          </div>

          <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 24px)' }}>
            {features.filter(f => f.quadrant === 'deprioritize').map((feat, idx) => {
              const cardSpringAnim = spring({
                frame: frame - (42 + idx * 8),
                fps,
                config: { damping: 13, stiffness: 140 },
              });
              const cOpacity = interpolate(cardSpringAnim, [0, 1], [0, 1]);
              const cScale = interpolate(cardSpringAnim, [0, 1], [0.6, 1]);

              return (
                <div
                  key={feat.id}
                  style={{
                    position: 'absolute',
                    left: `${feat.targetPos.x}%`,
                    top: `${feat.targetPos.y}%`,
                    width: '78%',
                    opacity: cOpacity,
                    transform: `scale(${cScale})`,
                    padding: '8px 10px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(69, 10, 10, 0.45)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, color: '#FECACA' }}>
                    <span>{feat.icon}</span>
                    <span style={{ textDecoration: 'line-through' }}>{feat.name}</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#FCA5A5', marginTop: 2 }}>{feat.score}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X-Axis Label (Low Effort -> High Effort) */}
        <div
          style={{
            gridRow: '3',
            gridColumn: '2 / 4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 10px 0 10px',
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: '#64748B',
          }}
        >
          <span style={{ color: '#22C55E' }}>◀ LOW EFFORT (HOURS)</span>
          <div
            style={{
              height: 2,
              flex: 1,
              background: 'linear-gradient(to right, #22C55E, #64748B, #EF4444)',
              margin: '0 16px',
              opacity: 0.5,
            }}
          />
          <span style={{ color: '#EF4444' }}>HIGH EFFORT (WEEKS) ▶</span>
        </div>
      </div>
    </div>
  );
};
