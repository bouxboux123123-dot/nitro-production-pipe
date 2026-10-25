import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DeveloperNode {
  name: string;
  location: string;
  timezone: string;
  localTime: string;
  role: string;
  avatarText: string;
  flag: string;
  action: string;
  statusColor: string;
}

export interface HandoffRelayBatonProps {
  sender?: DeveloperNode;
  receiver?: DeveloperNode;
  ticketId?: string;
  ticketTitle?: string;
  branchName?: string;
  prNumber?: string;
  loomDuration?: string;
  pipelineVelocity?: string;
}

export const HandoffRelayBaton: React.FC<HandoffRelayBatonProps> = ({
  sender = {
    name: 'Elena Rostova',
    location: 'Berlin, DE',
    timezone: 'CET (UTC+1)',
    localTime: '18:00 EOD',
    role: 'Senior Backend Engineer',
    avatarText: 'ER',
    flag: '🇩🇪',
    action: 'End-of-Day Baton Pass',
    statusColor: '#38bdf8',
  },
  receiver = {
    name: 'Marcus Vance',
    location: 'Austin, TX',
    timezone: 'CST (UTC-6)',
    localTime: '09:00 AM',
    role: 'Lead Systems Architect',
    avatarText: 'MV',
    flag: '🇺🇸',
    action: 'Morning Queue Pickup',
    statusColor: '#34d399',
  },
  ticketId = 'CORE-1429',
  ticketTitle = 'Stripe Checkout v3 & Multi-Currency Failover',
  branchName = 'feature/pay-failover-v3',
  prNumber = 'PR #1048',
  loomDuration = '3m 12s',
  pipelineVelocity = '2.4x Continuous Velocity',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master entrance
  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });

  // Relay baton progress: smoothly travels across from frame 15 to 65
  const batonProgress = interpolate(frame, [15, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Handoff status text transition
  const isReceived = frame >= 65;

  // Pulse glow on receiver node once baton arrives
  const receiverGlow = isReceived
    ? interpolate(Math.sin((frame - 65) * 0.15), [-1, 1], [0.3, 0.7])
    : 0.15;

  // Floating baton bobbing animation
  const bobbing = Math.sin(frame * 0.15) * 3;

  return (
    <div
      style={{
        width: 890,
        height: 630,
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        borderRadius: 24,
        border: '1px solid rgba(148, 163, 184, 0.18)',
        boxShadow:
          '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 50px rgba(56, 189, 248, 0.1)',
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
      {/* Background ambient beam */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 20%, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header bar */}
      <div
        style={{
          height: 64,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          zIndex: 3,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(52, 211, 153, 0.25))',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              fontSize: 11,
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>🏃‍♂️💨</span> TIMEZONE RELAY BATON
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
              Zero-Downtime Async Hand-off
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              Continuous Follow-the-Sun Engineering
            </div>
          </div>
        </div>

        {/* Velocity Pill */}
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
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#34d399',
              boxShadow: '0 0 8px #34d399',
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 800, color: '#a7f3d0' }}>
            {pipelineVelocity}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        {/* Developer Nodes & Relay Track */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            padding: '16px 20px',
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            borderRadius: 18,
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* SENDER NODE (Europe / Elena) */}
          <div
            style={{
              width: 250,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              zIndex: 3,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: 'rgba(56, 189, 248, 0.18)',
                border: '2px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 16,
                color: '#38bdf8',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.25)',
              }}
            >
              {sender.avatarText}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
                  {sender.name}
                </span>
                <span style={{ fontSize: 13 }}>{sender.flag}</span>
              </div>
              <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600 }}>
                {sender.localTime} • {sender.timezone}
              </div>
              <div
                style={{
                  fontSize: 10,
                  marginTop: 3,
                  padding: '2px 8px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#bae6fd',
                  display: 'inline-block',
                  fontWeight: 700,
                }}
              >
                ✓ BATON DISPATCHED
              </div>
            </div>
          </div>

          {/* Central Track & Flying Baton */}
          <div
            style={{
              flex: 1,
              margin: '0 20px',
              height: 48,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Background Conduit Track */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: 6,
                backgroundColor: 'rgba(51, 65, 85, 0.6)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              {/* Progress fill */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${batonProgress * 100}%`,
                  background: 'linear-gradient(90deg, #38bdf8, #34d399)',
                  boxShadow: '0 0 12px #34d399',
                }}
              />
            </div>

            {/* Glowing Baton Token gliding */}
            <div
              style={{
                position: 'absolute',
                left: `calc(${batonProgress * 92}% + 4%)`,
                transform: `translate(-50%, calc(-50% + ${bobbing}px))`,
                top: '50%',
                zIndex: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.8), 0 4px 10px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  border: '1.5px solid #ffffff',
                }}
              >
                <span style={{ fontSize: 13 }}>🪄</span>
                <span style={{ fontSize: 10, fontWeight: 900, color: '#0f172a', letterSpacing: '0.04em' }}>
                  BATON PASS {Math.round(batonProgress * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* RECEIVER NODE (America / Marcus) */}
          <div
            style={{
              width: 250,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 12,
              zIndex: 3,
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                <span style={{ fontSize: 13 }}>{receiver.flag}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
                  {receiver.name}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>
                {receiver.localTime} • {receiver.timezone}
              </div>
              <div
                style={{
                  fontSize: 10,
                  marginTop: 3,
                  padding: '2px 8px',
                  borderRadius: 10,
                  backgroundColor: isReceived ? 'rgba(52, 211, 153, 0.25)' : 'rgba(100, 116, 139, 0.2)',
                  color: isReceived ? '#a7f3d0' : '#94a3b8',
                  display: 'inline-block',
                  fontWeight: 700,
                  border: isReceived ? '1px solid rgba(52, 211, 153, 0.5)' : '1px solid transparent',
                }}
              >
                {isReceived ? '⚡ QUEUE ACTIVE' : '⏳ QUEUE STANDBY'}
              </div>
            </div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: 'rgba(52, 211, 153, 0.18)',
                border: `2px solid rgba(52, 211, 153, ${isReceived ? 1 : 0.4})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 16,
                color: '#34d399',
                boxShadow: `0 0 20px rgba(52, 211, 153, ${receiverGlow})`,
              }}
            >
              {receiver.avatarText}
            </div>
          </div>
        </div>

        {/* The Traveling Ticket & Artifact Details Card */}
        <div
          style={{
            padding: '18px 22px',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Ticket Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 6,
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  color: '#818cf8',
                  fontSize: 11,
                  fontWeight: 800,
                  fontFamily: 'monospace',
                }}
              >
                {ticketId}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
                {ticketTitle}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 6,
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              >
                git: {branchName}
              </span>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 6,
                  backgroundColor: 'rgba(52, 211, 153, 0.15)',
                  color: '#34d399',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {prNumber}
              </span>
            </div>
          </div>

          {/* Context Artifacts: Loom Video + Test Suite */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            {/* Loom video card */}
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f43f5e',
                  fontWeight: 900,
                  fontSize: 12,
                }}
              >
                ▶
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>
                  Async Video Walkthrough ({loomDuration})
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>
                  Elena walks through mock test coverage & edge cases
                </div>
              </div>
            </div>

            {/* CI/CD Test Status */}
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: 'rgba(52, 211, 153, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34d399',
                  fontWeight: 900,
                  fontSize: 14,
                }}
              >
                ✓
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>
                  24/24 Test Suites Passing
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>
                  Docker compose image pre-warmed for Marcus
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Next Steps Checklist */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 10,
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Relay Next Steps (Assigned to Marcus):
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#94a3b8' }}>
              <span style={{ color: '#34d399' }}>✓ Review Loom & verify local seed</span>
              <span style={{ color: isReceived ? '#38bdf8' : '#64748b', fontWeight: isReceived ? 700 : 400 }}>
                {isReceived ? '▶ Load test simulation in progress' : '○ Load test simulation (Pending pickup)'}
              </span>
              <span style={{ color: '#64748b' }}>○ Deploy canary at 15:00 CST</span>
            </div>
          </div>
        </div>

        {/* Relay Velocity Benchmark Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            backgroundColor: 'rgba(30, 41, 59, 0.45)',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>⏱️</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>
                Zero Engineering Downtime
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>
                While Europe sleeps, Austin ships. While Austin sleeps, Tokyo monitors.
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8' }}>
              0 Hours Idle Time
            </div>
            <div style={{ fontSize: 10, color: '#64748b' }}>
              Standard sync company: 16 hrs idle
            </div>
          </div>
        </div>
      </div>

      {/* Footer Audit Bar */}
      <div
        style={{
          height: 42,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          fontSize: 11,
          color: '#94a3b8',
          zIndex: 3,
        }}
      >
        <div>
          Handoff Protocol: <span style={{ color: '#34d399', fontWeight: 600 }}>Async Relay Complete</span> • Loom walkthrough indexed
        </div>
        <div style={{ color: '#64748b' }}>Pipeline Relay v3.6</div>
      </div>
    </div>
  );
};
