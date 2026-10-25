import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ContractClause {
  id: string;
  section: string;
  title: string;
  snippet: string;
  highlightWords: string[];
  flagType: 'predatory' | 'safe';
  badgeText: string;
  explanation: string;
}

export interface ContractRedlineScannerProps {
  title?: string;
  contractSubtitle?: string;
  clauses?: ContractClause[];
  width?: number;
  height?: number;
  scanDurationFrames?: number;
}

const DEFAULT_CLAUSES: ContractClause[] = [
  {
    id: 'c1',
    section: 'SEC 3.2',
    title: 'Scope & Turnaround Limit',
    snippet: 'Deliverables capped at 2 formal revision rounds; turnaround requires 3 business days per milestone.',
    highlightWords: ['capped at 2 formal revision rounds', '3 business days'],
    flagType: 'safe',
    badgeText: 'FAIR TERMS (PROTECTED)',
    explanation: 'Clear revision boundaries prevent scope creep.',
  },
  {
    id: 'c2',
    section: 'SEC 7.1',
    title: 'Indemnity & Defense Clause',
    snippet: 'Contractor shall defend, hold harmless, and indemnify Client against ANY and ALL claims, losses, or legal fees without monetary cap.',
    highlightWords: ['indemnify Client against ANY and ALL claims', 'without monetary cap'],
    flagType: 'predatory',
    badgeText: 'CRITICAL: UNLIMITED LIABILITY',
    explanation: 'Predatory liability trap exposes personal assets to infinite legal risk.',
  },
  {
    id: 'c3',
    section: 'SEC 9.4',
    title: 'IP Ownership Transfer',
    snippet: 'All intellectual property and working files transfer irrevocably to Client upon creation, prior to invoice settlement.',
    highlightWords: ['prior to invoice settlement', 'irrevocably to Client upon creation'],
    flagType: 'predatory',
    badgeText: 'PREDATORY: IP BEFORE PAYMENT',
    explanation: 'Client acquires ownership even if invoice is never paid.',
  },
];

export const ContractRedlineScanner: React.FC<ContractRedlineScannerProps> = ({
  title = 'AI CONTRACT REDLINE AUDIT',
  contractSubtitle = 'Standard Master Services Agreement (MSA_v3.docx)',
  clauses = DEFAULT_CLAUSES,
  width = 880,
  height = 640,
  scanDurationFrames = 75,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const cardOpacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const cardScale = interpolate(enterProgress, [0, 1], [0.92, 1]);
  const cardY = interpolate(enterProgress, [0, 1], [25, 0]);

  // Laser scan progress (0% to 100% across container)
  const laserProgress = interpolate(frame, [10, 10 + scanDurationFrames], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Calculate flagged count up to current laser position
  const laserRatio = laserProgress / 100;
  const redFlagsTotal = clauses.filter((c) => c.flagType === 'predatory').length;
  const redFlagsDetected = clauses.filter((c, idx) => {
    const clauseTriggerRatio = (idx + 0.3) / clauses.length;
    return c.flagType === 'predatory' && laserRatio >= clauseTriggerRatio;
  }).length;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.90) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.12)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background grid accent */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Document scanner icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(2, 132, 199, 0.4)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
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
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  background: laserProgress < 100 ? 'rgba(56, 189, 248, 0.2)' : 'rgba(239, 68, 68, 0.25)',
                  color: laserProgress < 100 ? '#38bdf8' : '#f87171',
                  border: `1px solid ${laserProgress < 100 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(239, 68, 68, 0.5)'}`,
                }}
              >
                {laserProgress < 100 ? 'SCANNING...' : 'ANALYSIS COMPLETE'}
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{contractSubtitle}</div>
          </div>
        </div>

        {/* Flag counter pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: 12,
            background: redFlagsDetected > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(15, 23, 42, 0.6)',
            border: `1px solid ${redFlagsDetected > 0 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: redFlagsDetected > 0 ? '#ef4444' : '#38bdf8',
              boxShadow: redFlagsDetected > 0 ? '0 0 10px #ef4444' : '0 0 8px #38bdf8',
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: redFlagsDetected > 0 ? '#fca5a5' : '#94a3b8' }}>
            {redFlagsDetected}/{redFlagsTotal} Predatory Clauses
          </span>
        </div>
      </div>

      {/* Contract Clauses Container with Laser Sweeper */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          zIndex: 1,
        }}
      >
        {/* Moving Laser Beam */}
        {laserProgress > 0 && laserProgress < 100 && (
          <div
            style={{
              position: 'absolute',
              left: -28,
              right: -28,
              top: `${laserProgress}%`,
              transform: 'translateY(-50%)',
              height: 3,
              background: 'linear-gradient(90deg, transparent 0%, #38bdf8 20%, #ffffff 50%, #38bdf8 80%, transparent 100%)',
              boxShadow: '0 0 20px 4px rgba(56, 189, 248, 0.9), 0 0 8px 2px #ffffff',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            {/* Laser radar glow aura */}
            <div
              style={{
                position: 'absolute',
                top: -30,
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.15) 0%, transparent 100%)',
                filter: 'blur(4px)',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}

        {/* Clauses List */}
        {clauses.map((clause, idx) => {
          const triggerRatio = (idx + 0.3) / clauses.length;
          const isAudited = laserRatio >= triggerRatio;
          const isPredatory = clause.flagType === 'predatory';

          const clauseSpring = spring({
            frame: Math.max(0, frame - 10 - idx * 16),
            fps,
            config: { damping: 13, stiffness: 140 },
          });

          return (
            <div
              key={clause.id}
              style={{
                position: 'relative',
                borderRadius: 14,
                padding: '14px 18px',
                background: isAudited
                  ? isPredatory
                    ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)'
                    : 'linear-gradient(90deg, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)'
                  : 'rgba(30, 41, 59, 0.3)',
                border: isAudited
                  ? isPredatory
                    ? '1px solid rgba(239, 68, 68, 0.45)'
                    : '1px solid rgba(6, 182, 212, 0.45)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: isAudited
                  ? isPredatory
                    ? '0 0 20px -3px rgba(239, 68, 68, 0.25)'
                    : '0 0 20px -3px rgba(6, 182, 212, 0.25)'
                  : 'none',
                opacity: isAudited ? 1 : 0.4,
                transform: `scale(${isAudited ? 1 : 0.98})`,
                transition: 'border 0.3s ease, background 0.3s ease, opacity 0.3s ease',
              }}
            >
              {/* Top row of clause */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 11,
                      fontWeight: 700,
                      color: isAudited ? (isPredatory ? '#f87171' : '#38bdf8') : '#64748b',
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '2px 8px',
                      borderRadius: 6,
                    }}
                  >
                    {clause.section}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
                    {clause.title}
                  </span>
                </div>

                {/* Status Badge */}
                {isAudited && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      padding: '3px 10px',
                      borderRadius: 9999,
                      background: isPredatory ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                      color: isPredatory ? '#ef4444' : '#22d3ee',
                      border: `1px solid ${isPredatory ? 'rgba(239, 68, 68, 0.6)' : 'rgba(6, 182, 212, 0.6)'}`,
                      transform: `scale(${interpolate(clauseSpring, [0, 1], [0.8, 1])})`,
                    }}
                  >
                    {isPredatory ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {clause.badgeText}
                  </div>
                )}
              </div>

              {/* Snippet text */}
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: isAudited ? '#e2e8f0' : '#64748b',
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{clause.snippet}&rdquo;
              </div>

              {/* Explanation Note */}
              {isAudited && (
                <div
                  style={{
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 500,
                    color: isPredatory ? '#fca5a5' : '#67e8f9',
                  }}
                >
                  <span style={{ fontWeight: 700 }}>AI Audit:</span>
                  <span>{clause.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          color: '#64748b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
          <span>Real-time Neural Contract Defense Layer</span>
        </div>
        <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
          Confidence: 99.4% &bull; Latency: 42ms
        </div>
      </div>
    </div>
  );
};
