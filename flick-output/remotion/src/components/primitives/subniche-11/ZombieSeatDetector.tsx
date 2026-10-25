import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ZombieUserItem {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  app: string;
  appIconBg: string;
  costMonthly: number;
  lastLogin: string;
  daysInactive: number;
  isZombie: boolean;
  department: string;
}

export interface ZombieSeatDetectorProps {
  title?: string;
  subtitle?: string;
  users?: ZombieUserItem[];
  scanDurationFrames?: number;
  width?: number;
  height?: number;
}

const DEFAULT_USERS: ZombieUserItem[] = [
  {
    id: 'u1',
    name: 'Alex Thorne',
    role: 'Former Lead Architect',
    avatarColor: '#6366f1',
    app: 'Datadog Pro APM',
    appIconBg: '#7c3aed',
    costMonthly: 195,
    lastLogin: '184 days ago',
    daysInactive: 184,
    isZombie: true,
    department: 'Engineering',
  },
  {
    id: 'u2',
    name: 'Chloe Martin',
    role: 'Ex-VP Growth Marketing',
    avatarColor: '#ec4899',
    app: 'HubSpot Enterprise',
    appIconBg: '#f97316',
    costMonthly: 240,
    lastLogin: '128 days ago',
    daysInactive: 128,
    isZombie: true,
    department: 'Marketing',
  },
  {
    id: 'u3',
    name: 'Sarah Chen',
    role: 'Staff Product Designer',
    avatarColor: '#10b981',
    app: 'Figma Organization',
    appIconBg: '#0ea5e9',
    costMonthly: 75,
    lastLogin: 'Today, 09:14 AM',
    daysInactive: 0,
    isZombie: false,
    department: 'Design',
  },
  {
    id: 'u4',
    name: 'David Vance',
    role: 'Contract AE Sales',
    avatarColor: '#f59e0b',
    app: 'Salesforce Enterprise',
    appIconBg: '#0284c7',
    costMonthly: 165,
    lastLogin: '96 days ago',
    daysInactive: 96,
    isZombie: true,
    department: 'Sales',
  },
  {
    id: 'u5',
    name: 'Marcus Sterling',
    role: 'Consultant Analytics',
    avatarColor: '#a855f7',
    app: 'Looker / BI Seat',
    appIconBg: '#8b5cf6',
    costMonthly: 210,
    lastLogin: '155 days ago',
    daysInactive: 155,
    isZombie: true,
    department: 'Data & BI',
  },
];

export const ZombieSeatDetector: React.FC<ZombieSeatDetectorProps> = ({
  title = 'ZOMBIE SEAT RADAR & PURGE',
  subtitle = 'Scanning Inactive Employee Accounts Incurring Monthly Charges',
  users = DEFAULT_USERS,
  scanDurationFrames = 80,
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.94, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [24, 0]);

  // Laser scanner progress: sweeps down from 0 to 100%
  const scanProgress = interpolate(frame, [15, 15 + scanDurationFrames], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scanRatio = scanProgress / 100;

  // Calculate stats based on laser sweep
  const totalZombieMonthlyWaste = users.reduce((acc, u) => (u.isZombie ? acc + u.costMonthly : acc), 0);
  
  // Count how many zombies have been swept and reclaimed
  const reclaimedZombies = users.filter((u, index) => {
    const triggerThreshold = (index + 0.6) / users.length;
    return u.isZombie && scanRatio >= triggerThreshold;
  });

  const currentReclaimedMonthly = reclaimedZombies.reduce((acc, u) => acc + u.costMonthly, 0);
  const currentReclaimedAnnual = currentReclaimedMonthly * 12;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(17, 24, 39, 0.98) 100%)',
        borderRadius: 24,
        border: '1px solid rgba(239, 68, 68, 0.35)',
        boxShadow: '0 24px 50px -12px rgba(0, 0, 0, 0.75), 0 0 40px rgba(239, 68, 68, 0.12)',
        backdropFilter: 'blur(16px)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      {/* Background cyber radial glow */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 340,
          height: 340,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.18) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 10px #ef4444',
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#ef4444',
              }}
            >
              {title}
            </span>
            <span
              style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 12,
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              GHOST SEATS DISCOVERED
            </span>
          </div>
          <h2
            style={{
              margin: '6px 0 0 0',
              fontSize: 21,
              fontWeight: 700,
              color: '#f1f5f9',
              letterSpacing: '-0.02em',
            }}
          >
            {subtitle}
          </h2>
        </div>

        {/* Live Reclaimed Savings Banner */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 16,
            padding: '8px 16px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase' }}>
            Burn Reclaimed Instantly
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#10b981' }}>
              +${currentReclaimedMonthly.toLocaleString()}
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>/mo</span>
          </div>
          <div style={{ fontSize: 10, color: '#34d399', fontWeight: 600 }}>
            +${currentReclaimedAnnual.toLocaleString()} / year saved
          </div>
        </div>
      </div>

      {/* Main Table / User List Container */}
      <div
        style={{
          position: 'relative',
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          overflow: 'hidden',
        }}
      >
        {/* Animated Laser Scanning Beam */}
        <div
          style={{
            position: 'absolute',
            top: `${scanProgress}%`,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, #ef4444 20%, #ff8080 50%, #ef4444 80%, transparent 100%)',
            boxShadow: '0 0 12px 3px rgba(239, 68, 68, 0.8), 0 0 25px 6px rgba(239, 68, 68, 0.4)',
            zIndex: 10,
            pointerEvents: 'none',
            opacity: scanProgress > 0 && scanProgress < 100 ? 1 : 0,
          }}
        />

        {/* Table Column Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2.4fr 1.6fr 1.6fr 1.2fr 1.8fr',
            padding: '4px 10px',
            fontSize: 11,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <span>Employee / Role</span>
          <span>SaaS Platform</span>
          <span>Last Activity</span>
          <span>Seat Cost</span>
          <span style={{ textAlign: 'right' }}>Audit Action</span>
        </div>

        {/* User Rows */}
        {users.map((user, idx) => {
          const userTriggerRatio = (idx + 0.6) / users.length;
          const isScanned = scanRatio >= userTriggerRatio;
          const isRevoked = user.isZombie && isScanned;

          return (
            <div
              key={user.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2.4fr 1.6fr 1.6fr 1.2fr 1.8fr',
                alignItems: 'center',
                padding: '9px 10px',
                borderRadius: 10,
                background: isRevoked
                  ? 'rgba(16, 185, 129, 0.08)'
                  : user.isZombie && !isScanned
                  ? 'rgba(239, 68, 68, 0.06)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: isRevoked
                  ? '1px solid rgba(16, 185, 129, 0.25)'
                  : user.isZombie && !isScanned
                  ? '1px solid rgba(239, 68, 68, 0.2)'
                  : '1px solid transparent',
                transition: 'all 0.3s ease',
              }}
            >
              {/* User info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: user.avatarColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    {user.role}
                  </div>
                </div>
              </div>

              {/* SaaS Platform */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: user.appIconBg,
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>
                  {user.app}
                </span>
              </div>

              {/* Last Activity */}
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: user.isZombie ? '#f87171' : '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {user.isZombie && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                  {user.lastLogin}
                </span>
              </div>

              {/* Monthly Cost */}
              <div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: isRevoked ? '#94a3b8' : '#f8fafc',
                    textDecoration: isRevoked ? 'line-through' : 'none',
                  }}
                >
                  ${user.costMonthly}/mo
                </span>
              </div>

              {/* Action / Deprovision Status */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {user.isZombie ? (
                  isRevoked ? (
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: 'rgba(16, 185, 129, 0.18)',
                        border: '1px solid #10b981',
                        fontSize: 11,
                        fontWeight: 800,
                        color: '#34d399',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      REVOKED (-${user.costMonthly})
                    </span>
                  ) : (
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: 'rgba(239, 68, 68, 0.18)',
                        border: '1px solid #ef4444',
                        fontSize: 11,
                        fontWeight: 800,
                        color: '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      ZOMBIE SEAT
                    </span>
                  )
                ) : (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#94a3b8',
                    }}
                  >
                    ACTIVE USER
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 14,
          padding: '12px 18px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontSize: 12,
              fontWeight: 800,
              color: '#38bdf8',
            }}
          >
            AUTO-KILL PROTOCOL
          </div>
          <span style={{ fontSize: 12, color: '#cbd5e1' }}>
            Deprovisioned <strong>{reclaimedZombies.length}</strong> of{' '}
            {users.filter((u) => u.isZombie).length} dormant licenses detected
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' }}>
              Deprovisioning Status
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: reclaimedZombies.length > 0 ? '#34d399' : '#f87171' }}>
              {reclaimedZombies.length === users.filter((u) => u.isZombie).length
                ? 'COMPLETED • 100% RECLAIMED'
                : 'PURGE SCANNING IN PROGRESS...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
