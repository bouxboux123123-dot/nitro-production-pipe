import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MilestoneStage {
  day: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'upcoming';
  itemsCount?: string;
  badge?: string;
}

export interface OnboardingMilestoneRoadmapProps {
  clientName?: string;
  contractTier?: string;
  currentStageIndex?: number;
  slaHoursRemaining?: number;
  stages?: MilestoneStage[];
  width?: number;
  height?: number;
}

export const OnboardingMilestoneRoadmap: React.FC<OnboardingMilestoneRoadmapProps> = ({
  clientName = 'Apex Peak Ventures',
  contractTier = '$18,500/mo Dedicated Growth Retainer',
  currentStageIndex = 1,
  slaHoursRemaining = 38,
  stages = [
    {
      day: 'Day 1',
      title: 'VIP Welcome & Portal',
      subtitle: 'Client hub provisioned, Slack synced, NDA sealed',
      status: 'completed',
      badge: '100% COMPLETE',
      itemsCount: '4/4 Tasks Done',
    },
    {
      day: 'Day 2',
      title: 'Asset & Credential Vault',
      subtitle: 'Meta MCC, Shopify token, brand guidelines intake',
      status: 'active',
      badge: 'IN PROGRESS',
      itemsCount: '3/4 Received',
    },
    {
      day: 'Day 3',
      title: 'Final Strategy Kickoff',
      subtitle: 'KPI alignment, sprint roadmap, campaign architecture',
      status: 'upcoming',
      badge: 'OCT 28 SLA',
      itemsCount: 'Launch Ready',
    },
  ],
  width = 960,
  height = 760,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Root container spring
  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });
  const containerScale = interpolate(containerSpring, [0, 1], [0.88, 1]);
  const containerOpacity = interpolate(containerSpring, [0, 1], [0, 1]);

  // Pulsing glow for the active stage
  const pulse = (Math.sin((frame / fps) * Math.PI * 3.5) + 1) / 2;
  const activeGlow = interpolate(pulse, [0, 1], [10, 24]);

  // Overall pipeline progress percentage calculation
  const totalStages = stages.length;
  const completedStages = stages.filter((s) => s.status === 'completed').length;
  const targetProgress = Math.min(
    100,
    Math.round(((completedStages + 0.65) / totalStages) * 100)
  );

  const progressSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 18, stiffness: 80 },
  });
  const animatedProgress = interpolate(progressSpring, [0, 1], [0, targetProgress]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: containerOpacity,
        transform: `scale(${containerScale})`,
        borderRadius: 24,
        background:
          'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(11, 15, 25, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(56, 189, 248, 0.35)',
        boxShadow:
          '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 45px rgba(14, 165, 233, 0.18)',
        padding: '28px 32px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background radial gradient glow */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -50,
          width: 480,
          height: 300,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: -40,
          width: 420,
          height: 260,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
          paddingBottom: 18,
          marginBottom: 22,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.6)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#38bdf8',
              }}
            >
              AGENCY WORKFLOW SYSTEMS • PAGE 10
            </span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
            {clientName}
          </div>
          <div style={{ fontSize: 18, color: '#94a3b8', marginTop: 4, fontWeight: 600 }}>
            {contractTier}
          </div>
        </div>

        {/* SLA Status Pill */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 20px',
              borderRadius: 30,
              background: 'rgba(34, 197, 94, 0.16)',
              border: '1.5px solid rgba(34, 197, 94, 0.5)',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 10px #22c55e',
              }}
            />
            <span style={{ fontSize: 16, fontWeight: 800, color: '#4ade80', letterSpacing: '0.04em' }}>
              ON-TRACK (72-HR SLA)
            </span>
          </div>
          <span style={{ fontSize: 16, color: '#cbd5e1', fontWeight: 600 }}>
            ⏱ {slaHoursRemaining}h remaining to Strategy Launch
          </span>
        </div>
      </div>

      {/* High-level progress tracker bar */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.65)',
          borderRadius: 16,
          padding: '16px 22px',
          marginBottom: 24,
          border: '1px solid rgba(148, 163, 184, 0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 18,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            <span style={{ color: '#cbd5e1' }}>4-Day Rapid Onboarding Pipeline</span>
            <span style={{ color: '#38bdf8' }}>{Math.round(animatedProgress)}% Completed</span>
          </div>
          <div
            style={{
              width: '100%',
              height: 12,
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div
              style={{
                width: `${animatedProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #06b6d4, #38bdf8)',
                borderRadius: 8,
                boxShadow: '0 0 14px rgba(56, 189, 248, 0.8)',
              }}
            />
          </div>
        </div>
      </div>

      {/* 3-Stage High-Impact Pipeline Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          flex: 1,
          alignItems: 'stretch',
        }}
      >
        {stages.map((stage, idx) => {
          // Progressive Disclosure: Each stage reveals sequentially with the narration
          const stageDelay = 10 + idx * 38;
          const isRevealed = frame >= stageDelay;
          const itemSpring = spring({
            frame: Math.max(0, frame - stageDelay),
            fps,
            config: { damping: 12, stiffness: 140 },
          });
          const itemScale = isRevealed ? interpolate(itemSpring, [0, 1], [0.85, 1]) : 0.92;
          const itemOpacity = isRevealed ? interpolate(itemSpring, [0, 1], [0.3, 1]) : 0.2;

          const isCompleted = stage.status === 'completed';
          const isActive = stage.status === 'active';
          const isUpcoming = stage.status === 'upcoming';

          let borderColor = isRevealed ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.08)';
          let bgColor = isRevealed ? 'rgba(30, 41, 59, 0.55)' : 'rgba(15, 23, 42, 0.4)';
          let accentColor = '#94a3b8';
          let glowShadow = 'none';

          if (isRevealed && isCompleted) {
            borderColor = 'rgba(34, 197, 94, 0.5)';
            bgColor = 'rgba(16, 185, 129, 0.12)';
            accentColor = '#22c55e';
            glowShadow = '0 0 20px rgba(34, 197, 94, 0.25)';
          } else if (isRevealed && isActive) {
            borderColor = 'rgba(56, 189, 248, 0.8)';
            bgColor = 'rgba(14, 165, 233, 0.18)';
            accentColor = '#38bdf8';
            glowShadow = `0 0 ${activeGlow}px rgba(56, 189, 248, 0.45)`;
          }

          return (
            <div
              key={stage.day}
              style={{
                position: 'relative',
                opacity: itemOpacity,
                transform: `scale(${itemScale})`,
                borderRadius: 16,
                background: bgColor,
                border: `1.5px solid ${borderColor}`,
                boxShadow: glowShadow,
                padding: '16px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border 0.2s ease',
              }}
            >
              {/* Top Tag & Stage Node */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: accentColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {stage.day}
                  </span>

                  {/* Status Indicator Pill */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '5px 12px',
                      borderRadius: 14,
                      fontSize: 15,
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      backgroundColor: isCompleted
                        ? 'rgba(34, 197, 94, 0.2)'
                        : isActive
                        ? 'rgba(56, 189, 248, 0.25)'
                        : 'rgba(148, 163, 184, 0.15)',
                      color: isCompleted ? '#4ade80' : isActive ? '#7dd3fc' : '#94a3b8',
                      border: `1.5px solid ${
                        isCompleted
                          ? 'rgba(34, 197, 94, 0.4)'
                          : isActive
                          ? 'rgba(56, 189, 248, 0.5)'
                          : 'rgba(148, 163, 184, 0.2)'
                      }`,
                    }}
                  >
                    {isCompleted && '✓ '}
                    {isActive && '● '}
                    {stage.badge}
                  </span>
                </div>

                {/* Node icon + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isCompleted
                        ? 'rgba(34, 197, 94, 0.25)'
                        : isActive
                        ? 'rgba(56, 189, 248, 0.3)'
                        : 'rgba(51, 65, 85, 0.5)',
                      border: `1.5px solid ${accentColor}`,
                    }}
                  >
                    {isCompleted && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {isActive && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    )}
                    {isUpcoming && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: isUpcoming ? '#cbd5e1' : '#ffffff',
                      lineHeight: 1.25,
                    }}
                  >
                    {stage.title}
                  </div>
                </div>

                {/* Subtitle description */}
                <div
                  style={{
                    fontSize: 16,
                    color: '#94a3b8',
                    lineHeight: 1.4,
                    marginTop: 4,
                  }}
                >
                  {stage.subtitle}
                </div>
              </div>

              {/* Bottom item count badge */}
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 10,
                  borderTop: '1px dashed rgba(148, 163, 184, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 16,
                  fontWeight: 700,
                  color: isCompleted ? '#4ade80' : isActive ? '#38bdf8' : '#94a3b8',
                }}
              >
                <span>{stage.itemsCount}</span>
                {isActive && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#38bdf8',
                      boxShadow: '0 0 8px #38bdf8',
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer SLA Guarantee */}
      <div
        style={{
          marginTop: 18,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#64748b',
          borderTop: '1px solid rgba(148, 163, 184, 0.12)',
          paddingTop: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span style={{ color: '#94a3b8', fontWeight: 500 }}>
            Guaranteed Time-to-First-Value: <strong>72 Hours SLA</strong>
          </span>
        </div>
        <div style={{ color: '#0ea5e9', fontWeight: 600 }}>AgencyFlow OS • Auto-Orchestrated</div>
      </div>
    </div>
  );
};
