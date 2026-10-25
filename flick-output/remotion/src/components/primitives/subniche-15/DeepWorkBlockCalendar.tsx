import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CalendarTimeSlot {
  hour: number;
  label: string;
  type: 'buffer' | 'deep_work' | 'lunch' | 'collab';
  eventTitle?: string;
  eventSubtitle?: string;
  badge?: string;
}

export interface DeepWorkBlockCalendarProps {
  userName?: string;
  teamName?: string;
  deepWorkStartHour?: number; // e.g. 9
  deepWorkDurationHours?: number; // e.g. 4
  incomingMeetingTitle?: string;
  incomingMeetingTime?: string;
  rescheduledTime?: string;
  focusScore?: number;
}

export const DeepWorkBlockCalendar: React.FC<DeepWorkBlockCalendarProps> = ({
  userName = 'Sarah Jenkins (Principal Architect)',
  teamName = 'Core Platform & Scalability',
  deepWorkStartHour = 9,
  deepWorkDurationHours = 4,
  incomingMeetingTitle = 'Quick Sync: Q4 Roadmap Alignment',
  incomingMeetingTime = '10:30 AM (45 min)',
  rescheduledTime = '3:30 PM (Collab Window)',
  focusScore = 94,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });

  // Shield glow animation
  const shieldGlow = interpolate(
    Math.sin(frame * 0.12),
    [-1, 1],
    [0.15, 0.35]
  );

  // Incoming meeting animation: flies down towards 10:30, hits the shield at frame 35, gets deflected away
  const meetingAttemptY = interpolate(frame, [15, 35], [-30, 95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Deflection bounce & flip at frame 35+
  const deflectionProgress = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const deflectionX = interpolate(frame, [35, 55], [0, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const deflectionOpacity = interpolate(frame, [45, 60], [1, 0.1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Shield deflection impact flash
  const shieldImpactFlash = interpolate(frame, [34, 38, 48], [0, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: 890,
        height: 640,
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        borderRadius: 24,
        border: '1px solid rgba(148, 163, 184, 0.18)',
        boxShadow:
          '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 50px rgba(129, 140, 248, 0.1)',
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
            'radial-gradient(ellipse at 30% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)',
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
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25))',
              border: '1px solid rgba(129, 140, 248, 0.45)',
              fontSize: 11,
              fontWeight: 800,
              color: '#818cf8',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>🛡️</span> DEEP WORK FIREWALL
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
              Autonomous Focus Architecture
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              {userName} • {teamName}
            </div>
          </div>
        </div>

        {/* Focus Score Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.4)',
            padding: '6px 14px',
            borderRadius: 20,
          }}
        >
          <span style={{ fontSize: 12 }}>⚡</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#34d399' }}>
            {focusScore}% FLOW STATE EFFICIENCY
          </span>
        </div>
      </div>

      {/* Calendar Grid Body */}
      <div
        style={{
          flex: 1,
          padding: '20px 28px',
          display: 'flex',
          gap: 20,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Left: Time labels column */}
        <div
          style={{
            width: 70,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '10px 0',
            fontSize: 11,
            fontWeight: 700,
            color: '#64748b',
            fontFamily: 'monospace',
          }}
        >
          <div>08:00 AM</div>
          <div style={{ color: '#818cf8' }}>09:00 AM</div>
          <div style={{ color: '#818cf8' }}>11:00 AM</div>
          <div style={{ color: '#818cf8' }}>01:00 PM</div>
          <div style={{ color: '#38bdf8' }}>02:00 PM</div>
          <div style={{ color: '#38bdf8' }}>05:00 PM</div>
        </div>

        {/* Right: Calendar timeline canvas */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            position: 'relative',
          }}
        >
          {/* Buffer / Morning Prep (08:00 - 09:00) */}
          <div
            style={{
              height: 48,
              backgroundColor: 'rgba(30, 41, 59, 0.35)',
              borderRadius: 10,
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12 }}>☕</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>
                Async Standup Review & PR Triage
              </span>
            </div>
            <span style={{ fontSize: 10, color: '#64748b' }}>60 mins • Low energy</span>
          </div>

          {/* 4-HOUR DEEP WORK ZONE (09:00 - 13:00) */}
          <div
            style={{
              height: 220,
              backgroundColor: `rgba(99, 102, 241, ${shieldGlow})`,
              borderRadius: 16,
              border: '2px solid rgba(129, 140, 248, 0.65)',
              boxShadow: `0 0 35px rgba(99, 102, 241, 0.25), inset 0 0 20px rgba(99, 102, 241, 0.15)`,
              padding: '16px 20px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
            }}
          >
            {/* Impact Flash Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#818cf8',
                opacity: shieldImpactFlash,
                pointerEvents: 'none',
                transition: 'opacity 0.1s ease',
              }}
            />

            {/* Shield Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    fontSize: 11,
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '0.08em',
                  }}
                >
                  🔒 4-HOUR LOCKED FOCUS BLOCK
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                  No Meetings Allowed • Slack DND Active
                </span>
              </div>

              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#c7d2fe',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  padding: '4px 10px',
                  borderRadius: 20,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                AUTODEFLECT: ACTIVE
              </div>
            </div>

            {/* Active Code / System Architecture Progress */}
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                borderRadius: 10,
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                zIndex: 2,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc' }}>
                  Current Task: Distributed Consensus Layer (Raft / Paxos)
                </span>
                <span style={{ fontSize: 10, color: '#34d399', fontWeight: 700 }}>
                  ⚡ In The Zone (128 min uninterrupted)
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  marginTop: 8,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '68%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #818cf8, #34d399)',
                  }}
                />
              </div>
            </div>

            {/* Shield Policy Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 10,
                color: '#c7d2fe',
                zIndex: 2,
              }}
            >
              <span>Auto-Decline Response: "In Deep Work Block. Rescheduled to 15:30."</span>
              <span style={{ fontFamily: 'monospace' }}>P0 Incident Bypass: None</span>
            </div>

            {/* INCOMING MEETING INTRUDER (Deflected Animation) */}
            <div
              style={{
                position: 'absolute',
                top: meetingAttemptY,
                right: 30,
                transform: `translateX(${deflectionX}px) rotate(${deflectionProgress * 25}deg)`,
                opacity: deflectionOpacity,
                zIndex: 5,
                backgroundColor: '#ef4444',
                borderRadius: 10,
                padding: '10px 14px',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.5)',
                border: '1.5px solid #fee2e2',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                minWidth: 260,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#ffffff' }}>
                  {incomingMeetingTitle}
                </span>
                <span style={{ fontSize: 10, color: '#fee2e2', fontWeight: 700 }}>
                  {incomingMeetingTime}
                </span>
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: '#fee2e2',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  padding: '2px 6px',
                  borderRadius: 4,
                  marginTop: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>🚫 BLOCKED BY FIREWALL</span>
                <span>➔ {rescheduledTime}</span>
              </div>
            </div>
          </div>

          {/* Collaborative Window (14:00 - 17:00) */}
          <div
            style={{
              height: 72,
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              borderRadius: 12,
              border: '1.5px dashed rgba(56, 189, 248, 0.4)',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>🤝</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>
                  Collaborative Sync Window (02:00 PM – 05:00 PM)
                </span>
                <span
                  style={{
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    color: '#bae6fd',
                    fontWeight: 700,
                  }}
                >
                  OPEN FOR BOOKING
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                Pair programming, system RFC discussions, and rescheduled cross-functional syncs
              </div>
            </div>

            <div
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                fontSize: 10,
                color: '#cbd5e1',
                textAlign: 'right',
              }}
            >
              <div>Slot 15:30: Available</div>
              <div style={{ color: '#34d399', fontWeight: 700 }}>Auto-Redirect Target</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Metrics Banner */}
      <div
        style={{
          height: 48,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>
            Interruptions Prevented:{' '}
            <strong style={{ color: '#34d399' }}>7 Meeting Requests</strong>
          </span>
          <span>•</span>
          <span>
            Context Switching Cost Avoided:{' '}
            <strong style={{ color: '#38bdf8' }}>$2,850/week</strong>
          </span>
        </div>
        <div style={{ color: '#64748b' }}>Clockwise / Motion Integration Engine</div>
      </div>
    </div>
  );
};
