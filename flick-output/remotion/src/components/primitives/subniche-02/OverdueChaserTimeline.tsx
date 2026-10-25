import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export interface MilestoneItem {
  day: number;
  stageName: string;
  badge: string;
  actionText: string;
  previewMessage: string;
  color: string;
  icon: string;
}

export interface OverdueChaserTimelineProps {
  invoiceAmount?: number;
  clientName?: string;
  invoiceNumber?: string;
  milestones?: MilestoneItem[];
}

export const OverdueChaserTimeline: React.FC<OverdueChaserTimelineProps> = ({
  invoiceAmount = 4200,
  clientName = 'Apex Ventures',
  invoiceNumber = 'INV-504',
  milestones = [
    {
      day: 1,
      stageName: 'Gentle Nudge',
      badge: 'Automated Slack Ping',
      actionText: 'Friendly payment link reminder',
      previewMessage: '“Hey team! Just dropping invoice INV-504 here for your AP review. 1-click Pay ready.”',
      color: '#38bdf8',
      icon: '💬',
    },
    {
      day: 7,
      stageName: 'Firm Escalation',
      badge: 'Finance Lead CC’d',
      actionText: 'Late fee notice & warning',
      previewMessage: '“Notice: Invoice INV-504 is past due. 1.5% statutory late fee takes effect in 48h.”',
      color: '#f59e0b',
      icon: '⚠️',
    },
    {
      day: 14,
      stageName: 'Service Lockdown',
      badge: 'Auto-Pause Triggered',
      actionText: 'API keys & staging suspended',
      previewMessage: '“Production access temporarily on hold until invoice reconciliation completes.”',
      color: '#f43f5e',
      icon: '🔒',
    },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 180-frame looping sequence
  const loopDuration = 180;
  const cycleFrame = frame % loopDuration;

  // Active step calculation based on cycle frame:
  // 0 - 55: Step 1 active
  // 55 - 115: Step 2 active
  // 115 - 180: Step 3 active
  const activeIndex = cycleFrame < 55 ? 0 : cycleFrame < 115 ? 1 : 2;

  // Track progress line fill
  const trackProgress = interpolate(cycleFrame, [0, 55, 115, 160], [15, 50, 85, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: 890,
        minHeight: 570,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(26, 21, 38, 0.92) 100%)',
        border: '1px solid rgba(244, 63, 94, 0.25)',
        borderRadius: 28,
        padding: '30px 34px',
        boxShadow:
          '0 25px 65px -15px rgba(0, 0, 0, 0.7), 0 0 45px -10px rgba(244, 63, 94, 0.15)',
        backdropFilter: 'blur(20px)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(244, 63, 94, 0.4)',
            }}
          >
            {/* Clock / Shield Icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
              Overdue Chaser & Auto-Lockdown
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Zero Awkward Calls · Autonomous Accounts Receivable
            </div>
          </div>
        </div>

        {/* Invoice Meta Pill */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 14,
            padding: '8px 16px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8' }}>
            {invoiceNumber} · {clientName}
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
              color: '#f87171',
            }}
          >
            ${invoiceAmount.toLocaleString()} Pending
          </div>
        </div>
      </div>

      {/* Progress Line Track */}
      <div style={{ position: 'relative', margin: '8px 20px 24px 20px' }}>
        <div
          style={{
            height: 4,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 4,
            width: `${trackProgress}%`,
            background: 'linear-gradient(90deg, #38bdf8 0%, #f59e0b 50%, #f43f5e 100%)',
            borderRadius: 2,
            boxShadow: '0 0 12px rgba(244, 63, 94, 0.6)',
            transition: 'width 0.2s ease',
          }}
        />
      </div>

      {/* 3 Step Sequence Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          flex: 1,
        }}
      >
        {milestones.map((milestone, idx) => {
          const isActive = activeIndex === idx;
          const isPassed = activeIndex > idx;

          // Subtle pulsing effect for current active stage
          const activeGlow = isActive
            ? interpolate(Math.sin(cycleFrame * 0.15), [-1, 1], [0.35, 0.7])
            : 0;

          return (
            <div
              key={idx}
              style={{
                background: isActive
                  ? `linear-gradient(180deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)`
                  : 'rgba(30, 41, 59, 0.45)',
                border: isActive
                  ? `1px solid ${milestone.color}`
                  : isPassed
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 18,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isActive
                  ? `0 12px 30px rgba(0, 0, 0, 0.5), 0 0 25px ${milestone.color}${Math.round(activeGlow * 100).toString(16).padStart(2, '0')}`
                  : 'none',
                position: 'relative',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.3s ease',
              }}
            >
              <div>
                {/* Step Top Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 800,
                      color: milestone.color,
                    }}
                  >
                    <span>{milestone.icon}</span>
                    <span>DAY {milestone.day}</span>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: milestone.color,
                      background: `${milestone.color}1a`,
                      border: `1px solid ${milestone.color}40`,
                      padding: '2px 8px',
                      borderRadius: 6,
                    }}
                  >
                    {milestone.stageName}
                  </span>
                </div>

                {/* Action summary */}
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>
                  {milestone.actionText}
                </div>

                {/* Simulated Notification Message Bubble */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 10,
                    padding: '10px 12px',
                    fontSize: 11,
                    fontStyle: 'italic',
                    color: '#94a3b8',
                    lineHeight: 1.4,
                  }}
                >
                  {milestone.previewMessage}
                </div>
              </div>

              {/* Status Indicator */}
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 10,
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 11,
                }}
              >
                <span style={{ color: '#64748b' }}>Status</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: isActive ? milestone.color : isPassed ? '#10b981' : '#64748b',
                  }}
                >
                  {isActive ? '● IN PROGRESS' : isPassed ? '✓ COMPLETED' : 'PENDING'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Retention & Recovery Guarantee */}
      <div
        style={{
          marginTop: 18,
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 14,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#10b981' }}>🛡️</span>
          <span style={{ color: '#cbd5e1' }}>Recovery Success Rate:</span>
          <span style={{ fontWeight: 800, color: '#34d399' }}>98.4% On-Time Resolution</span>
        </div>
        <div style={{ color: '#94a3b8', fontSize: 11 }}>
          Never chase late invoices manually again
        </div>
      </div>
    </div>
  );
};
