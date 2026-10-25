import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AutomatedStatusPipelineProps {
  title?: string;
  dealName?: string;
  clientCompany?: string;
  dealAmount?: string;
  dealOwner?: string;
  width?: number;
  height?: number;
}

export const AutomatedStatusPipeline: React.FC<AutomatedStatusPipelineProps> = ({
  title = 'EVENT-DRIVEN CRM PIPELINE AUTOMATION',
  dealName = 'Enterprise AI Integration Hub',
  clientCompany = 'Aether Dynamic Corp',
  dealAmount = '$128,000 ARR',
  dealOwner = 'Sarah Chen (Lead Solutions)',
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Timeline for transitions:
  // Phase 1: Frame 0 to 24 -> In Column 0 (Prospect)
  // Phase 2: Frame 25 to 52 -> Moves to Column 1 (Proposal Sent)
  // Phase 3: Frame 53 to 85 -> Moves to Column 2 (Won)

  // Spring from Column 0 to Column 1
  const move1Spring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 13, stiffness: 100 },
  });

  // Spring from Column 1 to Column 2
  const move2Spring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 12, stiffness: 95 },
  });

  // Calculate current X position offset for the deal card:
  // Column width is approx 250px with 16px gap = ~266px per step
  const stepDistance = 268;
  const currentStageIndex =
    frame < 25 ? 0 : frame < 55 ? 1 : 2;

  const cardTranslateX =
    interpolate(move1Spring, [0, 1], [0, stepDistance]) +
    interpolate(move2Spring, [0, 1], [0, stepDistance]);

  // Card lift effect when moving
  const isMoving = (frame >= 24 && frame <= 42) || (frame >= 54 && frame <= 72);
  const liftElevation = isMoving ? 10 : 0;
  const liftScale = isMoving ? 1.03 : 1;

  // Trigger banner contents and colors
  let triggerText = 'Awaiting Inbound Webhook Event...';
  let triggerBadge = 'LISTENER ACTIVE';
  let triggerBadgeColor = '#38bdf8';
  let triggerBorder = 'rgba(56, 189, 248, 0.2)';
  let triggerBg = 'rgba(56, 189, 248, 0.08)';

  if (frame >= 25 && frame < 55) {
    triggerText = '⚡ TRIGGER: Inbound Email Webhook ("Proposal v2 Reviewed & Approved")';
    triggerBadge = 'EMAIL FIRED';
    triggerBadgeColor = '#fbbf24';
    triggerBorder = 'rgba(251, 191, 36, 0.4)';
    triggerBg = 'rgba(251, 191, 36, 0.12)';
  } else if (frame >= 55) {
    triggerText = '🎉 TRIGGER: DocuSign API ("Contract Executed by CFO") ➔ PROVISIONING';
    triggerBadge = 'DEAL WON';
    triggerBadgeColor = '#34d399';
    triggerBorder = 'rgba(52, 211, 153, 0.4)';
    triggerBg = 'rgba(52, 211, 153, 0.12)';
  }

  // Particle sparkle burst when reaching Won (frame 55+)
  const sparklePhase = Math.max(0, frame - 55);
  const showSparkles = sparklePhase > 0 && sparklePhase < 40;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: enterSpring,
        transform: `scale(${interpolate(enterSpring, [0, 1], [0.93, 1])})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(147, 51, 234, 0.15)',
        padding: '22px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background Matrix grid accents */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(147, 51, 234, 0.08) 1.5px, transparent 1.5px), radial-gradient(rgba(59, 130, 246, 0.05) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 12,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(139, 92, 246, 0.5)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="5" height="18" rx="1" />
              <rect x="10" y="3" width="5" height="12" rx="1" />
              <rect x="17" y="3" width="5" height="8" rx="1" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', color: '#c084fc' }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
              Automation Rule: <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>ON EmailOpened(DocuSign) ➔ AdvanceStage()</span>
            </div>
          </div>
        </div>

        {/* Live Stage Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 14px',
            borderRadius: 999,
            background:
              currentStageIndex === 2
                ? 'rgba(34, 197, 94, 0.15)'
                : currentStageIndex === 1
                ? 'rgba(234, 179, 8, 0.15)'
                : 'rgba(56, 189, 248, 0.15)',
            border: `1px solid ${
              currentStageIndex === 2
                ? 'rgba(34, 197, 94, 0.4)'
                : currentStageIndex === 1
                ? 'rgba(234, 179, 8, 0.4)'
                : 'rgba(56, 189, 248, 0.4)'
            }`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background:
                currentStageIndex === 2 ? '#22c55e' : currentStageIndex === 1 ? '#eab308' : '#38bdf8',
              boxShadow: `0 0 8px ${
                currentStageIndex === 2 ? '#22c55e' : currentStageIndex === 1 ? '#eab308' : '#38bdf8'
              }`,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color:
                currentStageIndex === 2 ? '#4ade80' : currentStageIndex === 1 ? '#facc15' : '#7dd3fc',
              letterSpacing: '0.04em',
            }}
          >
            STAGE {currentStageIndex + 1} OF 3
          </span>
        </div>
      </div>

      {/* EVENT TRIGGER BANNER */}
      <div
        style={{
          background: triggerBg,
          border: `1px solid ${triggerBorder}`,
          borderRadius: 12,
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          zIndex: 2,
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: triggerBadgeColor,
              boxShadow: `0 0 10px ${triggerBadgeColor}`,
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{triggerText}</span>
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 6,
            background: 'rgba(255, 255, 255, 0.1)',
            color: triggerBadgeColor,
            fontFamily: 'monospace',
          }}
        >
          {triggerBadge}
        </div>
      </div>

      {/* 3 KANBAN COLUMNS TRACK */}
      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          flex: 1,
          zIndex: 2,
        }}
      >
        {/* Column 1: Prospect */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em' }}>
              PROSPECT
            </span>
            <span style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: 4, color: '#64748b' }}>
              Score: 92
            </span>
          </div>
          {/* Ghost placeholder when card has migrated */}
          {frame >= 25 && (
            <div
              style={{
                border: '1px dashed rgba(255, 255, 255, 0.15)',
                borderRadius: 12,
                height: 180,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                fontSize: 11,
              }}
            >
              Moved to Proposal Sent
            </div>
          )}
        </div>

        {/* Column 2: Proposal Sent */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#facc15', letterSpacing: '0.05em' }}>
              PROPOSAL SENT
            </span>
            <span style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(234, 179, 8, 0.15)', borderRadius: 4, color: '#fde047' }}>
              Active Doc
            </span>
          </div>
          {/* Ghost placeholder when card moves to Won */}
          {frame >= 55 && (
            <div
              style={{
                border: '1px dashed rgba(255, 255, 255, 0.15)',
                borderRadius: 12,
                height: 180,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                fontSize: 11,
              }}
            >
              Moved to Closed Won
            </div>
          )}
        </div>

        {/* Column 3: Closed Won */}
        <div
          style={{
            background:
              currentStageIndex === 2 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.6)',
            border:
              currentStageIndex === 2
                ? '1px solid rgba(52, 211, 153, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', letterSpacing: '0.05em' }}>
              CLOSED WON 🏆
            </span>
            <span style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: 4, color: '#86efac' }}>
              Executed
            </span>
          </div>
        </div>

        {/* THE ANIMATING PROJECT DEAL CARD (Absolute across the columns) */}
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 14,
            width: 236,
            transform: `translateX(${cardTranslateX}px) translateY(-${liftElevation}px) scale(${liftScale})`,
            background:
              currentStageIndex === 2
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(6, 78, 59, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border:
              currentStageIndex === 2
                ? '1px solid rgba(52, 211, 153, 0.6)'
                : currentStageIndex === 1
                ? '1px solid rgba(251, 191, 36, 0.5)'
                : '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: 14,
            padding: '16px',
            boxShadow: isMoving
              ? '0 25px 40px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(147, 51, 234, 0.4)'
              : currentStageIndex === 2
              ? '0 15px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(52, 211, 153, 0.3)'
              : '0 10px 25px rgba(0, 0, 0, 0.4)',
            zIndex: 10,
            boxSizing: 'border-box',
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.06em',
                padding: '2px 6px',
                borderRadius: 4,
                background:
                  currentStageIndex === 2
                    ? 'rgba(34, 197, 94, 0.2)'
                    : currentStageIndex === 1
                    ? 'rgba(234, 179, 8, 0.2)'
                    : 'rgba(56, 189, 248, 0.2)',
                color:
                  currentStageIndex === 2 ? '#4ade80' : currentStageIndex === 1 ? '#facc15' : '#7dd3fc',
              }}
            >
              {currentStageIndex === 2 ? 'CONFIRMED' : currentStageIndex === 1 ? 'SENT' : 'ACTIVE LEAD'}
            </span>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748b' }}>#DL-4091</span>
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginTop: 8 }}>
            {dealName}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{clientCompany}</div>

          <div
            style={{
              margin: '12px 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <span style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Contract ARR
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
              {dealAmount}
            </span>
          </div>

          {/* Owner info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#94a3b8' }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              SC
            </div>
            <span>{dealOwner}</span>
          </div>
        </div>

        {/* CELEBRATION SPARKLES when arriving at WON stage */}
        {showSparkles && (
          <div
            style={{
              position: 'absolute',
              right: 40,
              top: 80,
              width: 180,
              height: 180,
              pointerEvents: 'none',
              zIndex: 20,
            }}
          >
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const dist = 30 + (sparklePhase * 2.5);
              const x = 90 + Math.cos(angle) * dist;
              const y = 90 + Math.sin(angle) * dist;
              const opacity = Math.max(0, 1 - sparklePhase / 35);
              return (
                <div
                  key={`sparkle-${i}`}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: i % 2 === 0 ? 6 : 4,
                    height: i % 2 === 0 ? 6 : 4,
                    borderRadius: '50%',
                    background: i % 3 === 0 ? '#34d399' : i % 3 === 1 ? '#facc15' : '#38bdf8',
                    boxShadow: '0 0 8px #34d399',
                    opacity,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER AUTOMATION LOG STRIP */}
      <div
        style={{
          marginTop: 14,
          paddingTop: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#64748b',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: currentStageIndex === 2 ? '#34d399' : '#38bdf8' }}>✓</span>
          <span>Dispatched downstream: Linear Onboarding project created • Slack #sales-wins pinged</span>
        </div>
        <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
          State Machine: {currentStageIndex === 2 ? 'COMPLETED (200 OK)' : 'LISTENING'}
        </div>
      </div>
    </div>
  );
};
