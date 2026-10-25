import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BatchedNotification {
  sender: string;
  avatarText: string;
  message: string;
  timeAgo: string;
  source: 'slack' | 'github' | 'jira';
}

export interface NotificationMuteScheduleProps {
  userName?: string;
  userRole?: string;
  statusEmoji?: string;
  statusText?: string;
  unmuteTime?: string;
  remainingMinutes?: number;
  totalDurationMinutes?: number;
  batchedNotifications?: BatchedNotification[];
}

export const NotificationMuteSchedule: React.FC<NotificationMuteScheduleProps> = ({
  userName = 'Devin K.',
  userRole = 'Staff Distributed Systems Engineer',
  statusEmoji = '🔕',
  statusText = 'Deep Work Protocol • Responding at 1:30 PM',
  unmuteTime = '01:30 PM CET',
  remainingMinutes = 108,
  totalDurationMinutes = 240,
  batchedNotifications = [
    {
      sender: 'Sarah Lin (Product)',
      avatarText: 'SL',
      message: 'Hey Devin, quick question on the Kafka cluster latency SLO for Q4 roadmap…',
      timeAgo: '12m ago',
      source: 'slack',
    },
    {
      sender: 'GitHub Enterprise',
      avatarText: 'GH',
      message: 'Elena tagged you for review on PR #1048: Stripe Checkout Failover v3',
      timeAgo: '24m ago',
      source: 'github',
    },
    {
      sender: 'Alex Chen (DevOps)',
      avatarText: 'AC',
      message: 'Canary container deployment completed in staging-us-east. Looking solid!',
      timeAgo: '38m ago',
      source: 'slack',
    },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });

  // Switch animation: Online (green) -> Muted (amber/purple) around frame 20
  const toggleProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Pulse effect on the DND bell
  const bellShake = interpolate(
    Math.sin(frame * 0.25),
    [-1, 1],
    [-6, 6]
  );

  // Progress of the current mute duration
  const progressPercent = ((totalDurationMinutes - remainingMinutes) / totalDurationMinutes) * 100;

  return (
    <div
      style={{
        width: 890,
        height: 640,
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        borderRadius: 24,
        border: '1px solid rgba(148, 163, 184, 0.18)',
        boxShadow:
          '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 50px rgba(245, 158, 11, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        transform: `scale(${entrance})`,
        opacity: entrance,
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 80% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Bar */}
      <div
        style={{
          height: 64,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          zIndex: 3,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(239, 68, 68, 0.25))',
              border: '1px solid rgba(245, 158, 11, 0.45)',
              fontSize: 11,
              fontWeight: 800,
              color: '#f59e0b',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>🔕</span> NOTIFICATION DEFENSE SHIELD
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
              Automated Focus State & Queue Batching
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              Slack & Communications DND Sync
            </div>
          </div>
        </div>

        {/* Status Mode Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            padding: '6px 14px',
            borderRadius: 20,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              transform: `rotate(${frame > 20 ? bellShake : 0}deg)`,
              fontSize: 14,
            }}
          >
            🔕
          </span>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fde68a' }}>
            DO NOT DISTURB ACTIVE
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div
        style={{
          flex: 1,
          padding: '20px 28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        {/* Profile Card & Automated Return-Time Indicator */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'rgba(30, 41, 59, 0.45)',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* User info & live status toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                DK
              </div>
              {/* Animated status icon bubble */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -3,
                  right: -3,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: frame > 20 ? '#f59e0b' : '#10b981',
                  border: '2px solid #0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  boxShadow: frame > 20 ? '0 0 8px #f59e0b' : '0 0 8px #10b981',
                }}
              >
                {frame > 20 ? '🔕' : '●'}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
                  {userName}
                </span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>({userRole})</span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#fbbf24',
                  fontWeight: 600,
                  marginTop: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{statusEmoji}</span>
                <span>{statusText}</span>
              </div>
            </div>
          </div>

          {/* Return-Time Countdown Dial / Meter */}
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              borderRadius: 12,
              border: '1px solid rgba(245, 158, 11, 0.3)',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Automated Unmute
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b', marginTop: 1 }}>
              {unmuteTime}
            </div>
            <div style={{ fontSize: 10, color: '#cbd5e1' }}>
              {Math.floor(remainingMinutes / 60)}h {remainingMinutes % 60}m remaining
            </div>
          </div>
        </div>

        {/* Focus Duration Timeline Scrubber */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 14,
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
            <span>Focus Block Started (09:30 AM)</span>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>55% Elapsed • Zero Interruptions</span>
            <span>Returns to Active (01:30 PM)</span>
          </div>

          <div
            style={{
              height: 8,
              backgroundColor: 'rgba(51, 65, 85, 0.5)',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
              }}
            />
          </div>
        </div>

        {/* Automated Auto-Responder Snippet */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderRadius: 12,
            border: '1px dashed rgba(129, 140, 248, 0.4)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 16 }}>🤖</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#c7d2fe', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Slack Auto-Responder Active:
            </div>
            <div style={{ fontSize: 11.5, color: '#e2e8f0', marginTop: 3, fontStyle: 'italic', lineHeight: 1.4 }}>
              "I'm heads-down in a 4-hour focus block until 13:30 CET. Your message has been saved in my batch queue. For critical P0 incidents, type <code style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: 3 }}>/pager</code>."
            </div>
          </div>
        </div>

        {/* Batched Notifications Queue (Held Safely) */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Batched Notification Vault
              </span>
              <span
                style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(52, 211, 153, 0.15)',
                  color: '#34d399',
                  fontWeight: 700,
                }}
              >
                14 HELD SILENTLY
              </span>
            </div>
            <div style={{ fontSize: 10, color: '#64748b' }}>
              Will deliver in one batch at 13:30
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {batchedNotifications.map((notif, idx) => {
              const notifEntrance = spring({
                frame: frame - 15 - idx * 6,
                fps,
                config: { damping: 15, stiffness: 100 },
              });

              return (
                <div
                  key={notif.sender}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: 'rgba(30, 41, 59, 0.4)',
                    borderRadius: 10,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: notifEntrance,
                    transform: `translateY(${(1 - notifEntrance) * 10}px)`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        backgroundColor: notif.source === 'slack' ? '#38bdf822' : '#818cf822',
                        border: `1px solid ${notif.source === 'slack' ? '#38bdf855' : '#818cf855'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 800,
                        color: notif.source === 'slack' ? '#38bdf8' : '#818cf8',
                        flexShrink: 0,
                      }}
                    >
                      {notif.avatarText}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9', marginRight: 6 }}>
                        {notif.sender}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: '#94a3b8',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'inline-block',
                          maxWidth: 420,
                          verticalAlign: 'bottom',
                        }}
                      >
                        {notif.message}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: '#64748b' }}>{notif.timeAgo}</span>
                    <span
                      style={{
                        fontSize: 9,
                        padding: '2px 6px',
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        color: '#cbd5e1',
                        fontWeight: 600,
                      }}
                    >
                      QUEUED
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div
        style={{
          height: 42,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          fontSize: 11,
          color: '#94a3b8',
          zIndex: 3,
        }}
      >
        <div>
          Interruption Shield: <span style={{ color: '#34d399', fontWeight: 600 }}>0 Audible Pings</span> • Uninterrupted Flow Maintained
        </div>
        <div style={{ color: '#64748b' }}>Slack DND Guard v2.8</div>
      </div>
    </div>
  );
};
