import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DiffLine {
  type: 'unchanged' | 'removed' | 'added' | 'header';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
  highlightCategory?: 'pricing' | 'privacy' | 'limits' | 'neutral';
}

export interface ChangelogDiffViewProps {
  serviceName?: string;
  documentTitle?: string;
  commitHash?: string;
  timestamp?: string;
  diffLines?: DiffLine[];
  alertBadgeText?: string;
  width?: number;
  height?: number;
}

const DEFAULT_DIFF_LINES: DiffLine[] = [
  {
    type: 'header',
    content: '@@ -142,6 +142,8 @@ Section 8.4: Data Rights & Subscription Tiers',
  },
  {
    type: 'unchanged',
    oldLineNumber: 142,
    newLineNumber: 142,
    content: '  8.4.1 Subscribers maintain full ownership of all uploaded assets.',
  },
  {
    type: 'removed',
    oldLineNumber: 143,
    content: '- Pro seat pricing fixed at $20/user/mo with unlimited API & webhooks.',
    highlightCategory: 'pricing',
  },
  {
    type: 'added',
    newLineNumber: 143,
    content: '+ Pro seat increases to $65/user/mo; webhook calls throttled to 500/day.',
    highlightCategory: 'pricing',
  },
  {
    type: 'removed',
    oldLineNumber: 144,
    content: '- Customer workspace data is strictly isolated and never used for model training.',
    highlightCategory: 'privacy',
  },
  {
    type: 'added',
    newLineNumber: 144,
    content: '+ Provider receives non-exclusive worldwide license to ingest data for AI model tuning.',
    highlightCategory: 'privacy',
  },
  {
    type: 'removed',
    oldLineNumber: 145,
    content: '- Free Tier accounts include perpetual export access with zero seat minimum.',
    highlightCategory: 'limits',
  },
  {
    type: 'added',
    newLineNumber: 145,
    content: '+ Free Tier sunset on Nov 1st; minimum 5-seat commitment required ($325/mo).',
    highlightCategory: 'limits',
  },
];

export const ChangelogDiffView: React.FC<ChangelogDiffViewProps> = ({
  serviceName = 'CloudFlow Studio',
  documentTitle = 'Terms of Service & Fair Use Policy (v4.2-stealth)',
  commitHash = 'commit: 7f9c402b',
  timestamp = 'Pushed 4 hours ago (No email alert)',
  diffLines = DEFAULT_DIFF_LINES,
  alertBadgeText = 'STEALTH CLAUSE DETECTED',
  width = 900,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance physics
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.93, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [24, 0]);

  // Diff inspection scanline
  const scanProgress = interpolate(frame, [15, 80], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse effect for critical warning pill
  const pulseScale = 1 + Math.sin(frame * 0.18) * 0.03;
  const glowPulse = interpolate(Math.sin(frame * 0.16), [-1, 1], [0.25, 0.65]);

  const removedCount = diffLines.filter((l) => l.type === 'removed').length;
  const addedCount = diffLines.filter((l) => l.type === 'added').length;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(244, 63, 94, 0.35)',
        boxShadow: `0 25px 65px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(244, 63, 94, ${glowPulse})`,
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, Consolas, monospace",
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background Matrix/Grid Accent */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            'radial-gradient(#f43f5e 1px, transparent 1px), radial-gradient(#f43f5e 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header / Git Meta Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: 16,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Git Branch / Alert Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 18px rgba(225, 29, 72, 0.45)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="6" y1="3" x2="6" y2="15" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M18 9a9 9 0 0 1-9 9" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  background: 'linear-gradient(90deg, #f43f5e, #fbbf24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {serviceName}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 9999,
                  background: 'rgba(244, 63, 94, 0.2)',
                  color: '#fda4af',
                  border: '1px solid rgba(244, 63, 94, 0.5)',
                  transform: `scale(${pulseScale})`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#f43f5e',
                    boxShadow: '0 0 8px #f43f5e',
                  }}
                />
                {alertBadgeText}
              </span>
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#94a3b8',
                marginTop: 3,
                fontFamily: 'Inter, system-ui, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>{documentTitle}</span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{commitHash}</span>
            </div>
          </div>
        </div>

        {/* Diff Stats Counter Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '6px 14px',
            borderRadius: 12,
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#f43f5e' }}>
            <span>-{removedCount}</span>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>removed</span>
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>
            <span>+{addedCount}</span>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>injected</span>
          </div>
        </div>
      </div>

      {/* Sub-header status bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          color: '#cbd5e1',
          marginBottom: 12,
          padding: '6px 12px',
          background: 'rgba(244, 63, 94, 0.08)',
          borderRadius: 8,
          borderLeft: '3px solid #f43f5e',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Quiet ToS modification: no customer notifications dispatched.</span>
        </div>
        <span style={{ color: '#94a3b8' }}>{timestamp}</span>
      </div>

      {/* Main Diff Code Block Container */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          borderRadius: 14,
          background: 'rgba(2, 6, 23, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '10px 0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Animated laser horizontal scan bar */}
        {scanProgress > 0 && scanProgress < 100 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${scanProgress}%`,
              transform: 'translateY(-50%)',
              height: 2,
              background: 'linear-gradient(90deg, transparent 0%, #f43f5e 20%, #fbbf24 50%, #f43f5e 80%, transparent 100%)',
              boxShadow: '0 0 16px 2px rgba(244, 63, 94, 0.8), 0 0 8px #fbbf24',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {diffLines.map((line, idx) => {
            // Stagger reveal animation per line
            const lineRevealFrame = 12 + idx * 6;
            const lineProgress = spring({
              frame: frame - lineRevealFrame,
              fps,
              config: { damping: 15, stiffness: 140 },
            });
            const lineOpacity = interpolate(lineProgress, [0, 1], [0, 1]);
            const lineSlide = interpolate(lineProgress, [0, 1], [10, 0]);

            const isHeader = line.type === 'header';
            const isRemoved = line.type === 'removed';
            const isAdded = line.type === 'added';

            let bgColor = 'transparent';
            let textColor = '#94a3b8';
            let borderLeft = '3px solid transparent';
            let marker = ' ';

            if (isHeader) {
              bgColor = 'rgba(56, 189, 248, 0.08)';
              textColor = '#38bdf8';
              borderLeft = '3px solid #38bdf8';
            } else if (isRemoved) {
              bgColor = 'rgba(244, 63, 94, 0.16)';
              textColor = '#fca5a5';
              borderLeft = '3px solid #f43f5e';
              marker = '-';
            } else if (isAdded) {
              bgColor = 'rgba(251, 191, 36, 0.16)';
              textColor = '#fde68a';
              borderLeft = '3px solid #fbbf24';
              marker = '+';
            }

            return (
              <div
                key={idx}
                style={{
                  opacity: lineOpacity,
                  transform: `translateX(${lineSlide}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '7px 14px',
                  background: bgColor,
                  borderLeft,
                  fontSize: 12.5,
                  lineHeight: 1.45,
                  transition: 'background 0.2s ease',
                }}
              >
                {/* Old line number */}
                <div
                  style={{
                    width: 38,
                    textAlign: 'right',
                    color: isRemoved ? '#f43f5e' : '#475569',
                    userSelect: 'none',
                    paddingRight: 10,
                    fontSize: 11,
                  }}
                >
                  {line.oldLineNumber || ''}
                </div>

                {/* New line number */}
                <div
                  style={{
                    width: 38,
                    textAlign: 'right',
                    color: isAdded ? '#fbbf24' : '#475569',
                    userSelect: 'none',
                    paddingRight: 12,
                    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: 11,
                  }}
                >
                  {line.newLineNumber || ''}
                </div>

                {/* Diff Line Marker */}
                <div
                  style={{
                    width: 20,
                    textAlign: 'center',
                    fontWeight: 700,
                    color: isRemoved ? '#f43f5e' : isAdded ? '#fbbf24' : '#64748b',
                    userSelect: 'none',
                  }}
                >
                  {marker}
                </div>

                {/* Content */}
                <div
                  style={{
                    flex: 1,
                    color: textColor,
                    fontWeight: isAdded || isRemoved ? 600 : 400,
                    wordBreak: 'break-word',
                  }}
                >
                  {line.content}
                </div>

                {/* Category indicator tag */}
                {line.highlightCategory && (
                  <span
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: 6,
                      background:
                        line.highlightCategory === 'pricing'
                          ? 'rgba(239, 68, 68, 0.25)'
                          : line.highlightCategory === 'privacy'
                          ? 'rgba(217, 70, 239, 0.25)'
                          : 'rgba(245, 158, 11, 0.25)',
                      color:
                        line.highlightCategory === 'pricing'
                          ? '#f87171'
                          : line.highlightCategory === 'privacy'
                          ? '#e879f9'
                          : '#fbbf24',
                      border: `1px solid ${
                        line.highlightCategory === 'pricing'
                          ? 'rgba(239, 68, 68, 0.5)'
                          : line.highlightCategory === 'privacy'
                          ? 'rgba(217, 70, 239, 0.5)'
                          : 'rgba(245, 158, 11, 0.5)'
                      }`,
                    }}
                  >
                    {line.highlightCategory}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Warning Prompt */}
        <div
          style={{
            marginTop: 10,
            padding: '8px 16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 12,
            color: '#94a3b8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#fbbf24', fontWeight: 600 }}>Action Required:</span>
            <span>Explicit opt-out expires in 14 days before automated renewal billing.</span>
          </div>
          <span style={{ color: '#f43f5e', fontWeight: 700 }}>VERIFIED REGULATORY DIFF</span>
        </div>
      </div>
    </div>
  );
};
