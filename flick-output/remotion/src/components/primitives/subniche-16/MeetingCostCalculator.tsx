import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MeetingAttendee {
  id: string;
  name: string;
  role: string;
  ratePerHour: number;
  avatarColor: string;
  initials: string;
}

export interface MeetingCostCalculatorProps {
  title?: string;
  meetingName?: string;
  attendees?: MeetingAttendee[];
  initialSeconds?: number;
  width?: number;
  height?: number;
}

const DEFAULT_ATTENDEES: MeetingAttendee[] = [
  {
    id: 'att-1',
    name: 'Sarah M.',
    role: 'VP Product',
    ratePerHour: 220,
    avatarColor: 'linear-gradient(135deg, #f43f5e, #be123c)',
    initials: 'SM',
  },
  {
    id: 'att-2',
    name: 'David K.',
    role: 'Principal Arch',
    ratePerHour: 190,
    avatarColor: 'linear-gradient(135deg, #6366f1, #4338ca)',
    initials: 'DK',
  },
  {
    id: 'att-3',
    name: 'Elena R.',
    role: 'Staff Eng',
    ratePerHour: 165,
    avatarColor: 'linear-gradient(135deg, #06b6d4, #0e7490)',
    initials: 'ER',
  },
  {
    id: 'att-4',
    name: 'Liam C.',
    role: 'Sr Designer',
    ratePerHour: 135,
    avatarColor: 'linear-gradient(135deg, #ec4899, #be185d)',
    initials: 'LC',
  },
  {
    id: 'att-5',
    name: 'Anya P.',
    role: 'DevOps Lead',
    ratePerHour: 150,
    avatarColor: 'linear-gradient(135deg, #10b981, #047857)',
    initials: 'AP',
  },
  {
    id: 'att-6',
    name: 'Marcus T.',
    role: 'Eng Manager',
    ratePerHour: 180,
    avatarColor: 'linear-gradient(135deg, #f59e0b, #b45309)',
    initials: 'MT',
  },
];

export const MeetingCostCalculator: React.FC<MeetingCostCalculatorProps> = ({
  title = 'SYNCHRONOUS CALL BURN RADAR',
  meetingName = 'Weekly "Status Alignment" Sync (6 Attendees)',
  attendees = DEFAULT_ATTENDEES,
  initialSeconds = 2520, // 42 minutes into the call
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.9 },
  });

  // Calculate burn rates
  const totalHourlyRate = attendees.reduce((sum, a) => sum + a.ratePerHour, 0);
  const costPerSecond = totalHourlyRate / 3600;

  // Realistic simulation: elapsed meeting seconds ticking forward + accelerated demonstration
  const simulatedElapsedSeconds = initialSeconds + Math.floor(frame * 1.5);
  const totalCost = simulatedElapsedSeconds * costPerSecond;

  // Format timer HH:MM:SS
  const hours = Math.floor(simulatedElapsedSeconds / 3600);
  const minutes = Math.floor((simulatedElapsedSeconds % 3600) / 60);
  const seconds = simulatedElapsedSeconds % 60;
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Blinking live indicator
  const blinkOpacity = interpolate(Math.sin(frame * 0.2), [-1, 1], [0.3, 1]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardEntrance,
        transform: `translateY(${interpolate(cardEntrance, [0, 1], [30, 0])}px) scale(${interpolate(
          cardEntrance,
          [0, 1],
          [0.94, 1]
        )})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        boxShadow:
          '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(239, 68, 68, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        color: '#f8fafc',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Background danger glow */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          left: '30%',
          width: 320,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 999,
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  boxShadow: '0 0 8px #ef4444',
                  opacity: blinkOpacity,
                }}
              />
              {title}
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
              6 HIGH-SALARY ATTENDEES ACTIVE
            </span>
          </div>
          <h2
            style={{
              margin: '6px 0 0 0',
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            {meetingName}
          </h2>
        </div>

        {/* Live Elapsed Time Pill */}
        <div
          style={{
            padding: '8px 14px',
            borderRadius: 12,
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.06em' }}>
            ELAPSED TIME
          </div>
          <div style={{ fontSize: 18, color: '#f1f5f9', fontWeight: 800, fontFamily: 'monospace' }}>
            ⏱ {timeFormatted}
          </div>
        </div>
      </div>

      {/* Hero Dollar Burn Display */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.85) 100%)',
          borderRadius: 18,
          border: '1.5px solid rgba(239, 68, 68, 0.3)',
          padding: '16px 24px',
          margin: '12px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1,
          boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.15)',
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#fca5a5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Cumulative Company Cash Burned
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: '#ef4444',
              fontFamily: 'monospace',
              letterSpacing: '-0.03em',
              marginTop: 2,
              lineHeight: 1,
              textShadow: '0 0 25px rgba(239, 68, 68, 0.5)',
            }}
          >
            ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
            COMBINED BURN RATE
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', fontFamily: 'monospace', marginTop: 2 }}>
            ${totalHourlyRate.toLocaleString()}<span style={{ fontSize: 14, color: '#94a3b8' }}>/hr</span>
          </div>
          <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, marginTop: 4 }}>
            = ${(totalHourlyRate / 60).toFixed(2)} / minute
          </div>
        </div>
      </div>

      {/* 6 Attendees Rate Grid */}
      <div style={{ zIndex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
          Active Call Participants & Billing Weight
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {attendees.map((attendee, idx) => {
            const attendeeSpring = spring({
              frame: frame - idx * 4,
              fps,
              config: { damping: 14, stiffness: 120 },
            });
            const individualCost = (simulatedElapsedSeconds / 3600) * attendee.ratePerHour;

            return (
              <div
                key={attendee.id}
                style={{
                  opacity: attendeeSpring,
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: attendee.avatarColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  {attendee.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {attendee.name}
                    </span>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                      ${attendee.ratePerHour}/h
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                    <span style={{ fontSize: 10, color: '#64748b' }}>{attendee.role}</span>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#fca5a5' }}>
                      ${individualCost.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Solution Alert */}
      <div
        style={{
          marginTop: 10,
          padding: '10px 14px',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#e0f2fe' }}>
          <span style={{ fontSize: 14 }}>💡</span>
          <span>
            <strong>Async Alternative:</strong> A 5-minute Loom + Notion RFC would achieve consensus for <span style={{ color: '#34d399', fontWeight: 800 }}>$0 sync cost</span>.
          </span>
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#38bdf8',
            background: 'rgba(56, 189, 248, 0.15)',
            padding: '4px 8px',
            borderRadius: 6,
          }}
        >
          Cancel Recurring Sync →
        </div>
      </div>
    </div>
  );
};
