import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ScopeCreepItem {
  id: string;
  sender: string;
  avatarText: string;
  timeAgo: string;
  subject: string;
  message: string;
  addedCost: number;
  triggerFrame: number;
}

export interface ScopeCreepMeterProps {
  title?: string;
  baseContractAmount?: number;
  clientName?: string;
  clientCompany?: string;
  requests?: ScopeCreepItem[];
  width?: number;
  height?: number;
}

const DEFAULT_REQUESTS: ScopeCreepItem[] = [
  {
    id: 'req-1',
    sender: 'Sarah (Marketing VP)',
    avatarText: 'SM',
    timeAgo: '9:14 AM',
    subject: 'Quick quick favor!! 🎨',
    message: 'Can we also get 3D rendered animated versions for TikTok and LinkedIn ads?',
    addedCost: 450,
    triggerFrame: 15,
  },
  {
    id: 'req-2',
    sender: 'Sarah (Marketing VP)',
    avatarText: 'SM',
    timeAgo: '11:02 AM',
    subject: 'One tiny add-on',
    message: 'Oh, and the CEO wants 6 alternative color palettes before tomorrow morning!',
    addedCost: 400,
    triggerFrame: 36,
  },
  {
    id: 'req-3',
    sender: 'Sarah (Marketing VP)',
    avatarText: 'SM',
    timeAgo: '1:45 PM',
    subject: 'Just one more tiny tweak!',
    message: 'Actually let’s completely restructure the checkout flow and user onboarding!',
    addedCost: 600,
    triggerFrame: 56,
  },
];

export const ScopeCreepMeter: React.FC<ScopeCreepMeterProps> = ({
  title = 'SCOPE CREEP AUDIT RADAR',
  baseContractAmount = 3000,
  clientName = 'Acme Corp Marketing',
  clientCompany = 'External Client Thread',
  requests = DEFAULT_REQUESTS,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Calculate live cumulative overage based on animated triggers
  const totalPossibleOverage = requests.reduce((acc, curr) => acc + curr.addedCost, 0);

  // Progressive amount calculation
  let currentOverage = 0;
  requests.forEach((req) => {
    if (frame >= req.triggerFrame) {
      const itemProgress = spring({
        frame: frame - req.triggerFrame,
        fps,
        config: { damping: 12, stiffness: 100 },
      });
      currentOverage += interpolate(itemProgress, [0, 1], [0, req.addedCost]);
    }
  });

  const roundedOverage = Math.round(currentOverage);
  const fillPercentage = Math.min(100, (currentOverage / totalPossibleOverage) * 100);

  // Color transitions as creep increases
  const isDanger = roundedOverage >= 850;
  const isHigh = roundedOverage >= 450;
  const accentColor = isDanger ? '#ef4444' : isHigh ? '#f59e0b' : '#10b981';

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardSpring,
        transform: `translateY(${interpolate(cardSpring, [0, 1], [25, 0])}px) scale(${interpolate(
          cardSpring,
          [0, 1],
          [0.92, 1]
        )})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.90) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px ${isDanger ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.1)'}`,
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: isDanger
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Bar */}
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
          {/* Inbox Alert Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {title}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                }}
              >
                LIVE FEED
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              {clientName} &bull; {clientCompany}
            </div>
          </div>
        </div>

        {/* Base vs Inflated Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '8px 16px',
            borderRadius: 14,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Agreed Scope</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8' }}>${baseContractAmount.toLocaleString()}</div>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255, 255, 255, 0.1)' }} />
          <div>
            <div style={{ fontSize: 10, color: '#ef4444', textTransform: 'uppercase', fontWeight: 800 }}>Unbilled Creep</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f87171' }}>+${roundedOverage.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Live Email Request Stream */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 1,
        }}
      >
        {requests.map((item) => {
          const isTriggered = frame >= item.triggerFrame;
          const itemSpring = spring({
            frame: Math.max(0, frame - item.triggerFrame),
            fps,
            config: { damping: 13, stiffness: 150 },
          });

          const itemY = interpolate(itemSpring, [0, 1], [30, 0]);
          const itemScale = interpolate(itemSpring, [0, 1], [0.88, 1]);
          const itemOpacity = interpolate(itemSpring, [0, 1], [0, 1]);

          if (!isTriggered) {
            return (
              <div
                key={item.id}
                style={{
                  height: 64,
                  borderRadius: 14,
                  border: '1px dashed rgba(255, 255, 255, 0.06)',
                  background: 'rgba(15, 23, 42, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  fontSize: 12,
                }}
              >
                Waiting for incoming request...
              </div>
            );
          }

          return (
            <div
              key={item.id}
              style={{
                opacity: itemOpacity,
                transform: `translateY(${itemY}px) scale(${itemScale})`,
                borderRadius: 14,
                padding: '12px 16px',
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 14,
              }}
            >
              {/* Left: Avatar + Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  {item.avatarText}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{item.sender}</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{item.timeAgo}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#f87171',
                      }}
                    >
                      Out of Scope
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#cbd5e1',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginTop: 2,
                    }}
                  >
                    &ldquo;{item.message}&rdquo;
                  </div>
                </div>
              </div>

              {/* Right: Added Cost Badge */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#ef4444',
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  <span>+${item.addedCost}</span>
                </div>
                <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>unpaid work</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent Odometer Inflation Bar */}
      <div
        style={{
          marginTop: 16,
          padding: '16px 20px',
          borderRadius: 18,
          background: 'rgba(15, 23, 42, 0.85)',
          border: `1px solid ${isDanger ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: isDanger ? '0 0 30px rgba(239, 68, 68, 0.25)' : 'none',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em' }}>
              UNBILLED SCOPE ODOMETER
            </span>
            {isDanger && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#ffffff',
                  background: '#ef4444',
                  padding: '2px 8px',
                  borderRadius: 6,
                  boxShadow: '0 0 10px #ef4444',
                }}
              >
                LIMIT EXCEEDED
              </span>
            )}
          </div>

          {/* Large Odometer Readout */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 14, color: '#ef4444', fontWeight: 800 }}>+</span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 900,
                fontFamily: 'monospace',
                letterSpacing: '-0.02em',
                color: accentColor,
                textShadow: `0 0 20px ${accentColor}`,
              }}
            >
              ${roundedOverage.toLocaleString()}
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>/ ${totalPossibleOverage}</span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div
          style={{
            height: 12,
            width: '100%',
            borderRadius: 9999,
            background: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${fillPercentage}%`,
              borderRadius: 9999,
              background: `linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)`,
              boxShadow: `0 0 16px ${accentColor}`,
              transition: 'width 0.1s linear',
            }}
          />
        </div>

        {/* Subtext info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: '#64748b',
            marginTop: 8,
          }}
        >
          <span>Contract Scope Cap: $0 extra</span>
          <span style={{ color: isDanger ? '#f87171' : '#94a3b8', fontWeight: 600 }}>
            {roundedOverage > 0 ? `Unbilled Overage Ratio: +${Math.round((roundedOverage / baseContractAmount) * 100)}%` : 'Zero Creep'}
          </span>
        </div>
      </div>
    </div>
  );
};
