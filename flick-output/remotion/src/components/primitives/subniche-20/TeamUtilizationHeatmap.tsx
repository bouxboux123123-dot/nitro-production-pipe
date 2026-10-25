import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccountManagerUtilization {
  id: string;
  name: string;
  avatarText: string;
  role: string;
  accountsCount: number;
  loggedHours: number;
  capacityHours: number;
  highlightBurnout?: boolean;
}

export interface TeamUtilizationHeatmapProps {
  title?: string;
  subtitle?: string;
  managers?: AccountManagerUtilization[];
  width?: number;
  height?: number;
}

const DEFAULT_MANAGERS: AccountManagerUtilization[] = [
  {
    id: 'am-1',
    name: 'Elena Rostova',
    avatarText: 'ER',
    role: 'Senior Lead AM',
    accountsCount: 6,
    loggedHours: 46,
    capacityHours: 40,
    highlightBurnout: true,
  },
  {
    id: 'am-2',
    name: 'Marcus Vance',
    avatarText: 'MV',
    role: 'Key Accounts AM',
    accountsCount: 5,
    loggedHours: 38,
    capacityHours: 40,
  },
  {
    id: 'am-3',
    name: 'Sophia Chen',
    avatarText: 'SC',
    role: 'Growth Accounts AM',
    accountsCount: 4,
    loggedHours: 32,
    capacityHours: 40,
  },
  {
    id: 'am-4',
    name: 'David Okafor',
    avatarText: 'DO',
    role: 'Junior AM',
    accountsCount: 3,
    loggedHours: 21,
    capacityHours: 40,
  },
];

export const TeamUtilizationHeatmap: React.FC<TeamUtilizationHeatmapProps> = ({
  title = 'TEAM UTILIZATION HEATMAP',
  subtitle = 'Account Management Workload & Burnout Radar',
  managers = DEFAULT_MANAGERS,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Root container spring
  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.9 },
  });

  const totalLogged = managers.reduce((acc, m) => acc + m.loggedHours, 0);
  const totalCapacity = managers.reduce((acc, m) => acc + m.capacityHours, 0);
  const aggregateRatio = totalCapacity > 0 ? (totalLogged / totalCapacity) * 100 : 0;

  // Header metric animated counter
  const headerProgress = spring({
    frame: frame - 6,
    fps,
    config: { damping: 16, stiffness: 90 },
  });
  const animatedAggregate = Math.round(interpolate(headerProgress, [0, 1], [0, aggregateRatio]));

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: containerSpring,
        transform: `translateY(${interpolate(containerSpring, [0, 1], [30, 0])}px) scale(${interpolate(
          containerSpring,
          [0, 1],
          [0.93, 1]
        )})`,
        borderRadius: 24,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(56, 189, 248, 0.12)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Radar icon badge */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(239, 68, 68, 0.45)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(90deg, #f8fafc 30%, #94a3b8 100%)',
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
                  background: 'rgba(239, 68, 68, 0.18)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                }}
              >
                CAPACITY ALERT
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>

        {/* Aggregate Utilization Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '8px 16px',
            borderRadius: 14,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Team Average
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace' }}>
              {animatedAggregate}%
            </div>
          </div>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: animatedAggregate > 85 ? '#ef4444' : '#10b981',
              boxShadow: animatedAggregate > 85 ? '0 0 12px #ef4444' : '0 0 12px #10b981',
            }}
          />
        </div>
      </div>

      {/* Grid of Account Managers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 14,
          flex: 1,
          zIndex: 2,
        }}
      >
        {managers.map((manager, index) => {
          // Staggered entrance animation per AM
          const itemSpring = spring({
            frame: frame - index * 6,
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          const utilizationPct = (manager.loggedHours / manager.capacityHours) * 100;
          const isBurnout = utilizationPct > 105;
          const isWarning = utilizationPct >= 85 && utilizationPct <= 105;
          const isOptimal = utilizationPct >= 70 && utilizationPct < 85;
          const isAvailable = utilizationPct < 70;

          // Theme colors based on capacity load
          const statusColor = isBurnout
            ? '#ef4444'
            : isWarning
            ? '#f59e0b'
            : isOptimal
            ? '#10b981'
            : '#38bdf8';

          const statusLabel = isBurnout
            ? 'BURNOUT DANGER'
            : isWarning
            ? 'NEAR CAP'
            : isOptimal
            ? 'OPTIMAL'
            : 'AVAILABLE';

          const availableHours = manager.capacityHours - manager.loggedHours;

          // Dynamic fill width spring
          const barProgress = spring({
            frame: frame - (10 + index * 6),
            fps,
            config: { damping: 15, stiffness: 85 },
          });

          const animatedLogged = interpolate(
            barProgress,
            [0, 1],
            [0, manager.loggedHours]
          );
          const currentPct = Math.min(130, Math.round((animatedLogged / manager.capacityHours) * 100));

          return (
            <div
              key={manager.id}
              style={{
                opacity: itemSpring,
                transform: `scale(${interpolate(itemSpring, [0, 1], [0.92, 1])}) translateY(${interpolate(
                  itemSpring,
                  [0, 1],
                  [15, 0]
                )}px)`,
                background: isBurnout
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)'
                  : 'rgba(15, 23, 42, 0.65)',
                border: `1px solid ${isBurnout ? 'rgba(239, 68, 68, 0.45)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: 16,
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isBurnout ? '0 0 20px rgba(239, 68, 68, 0.2)' : 'none',
              }}
            >
              {/* Member Top Info */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${statusColor} 0%, rgba(15, 23, 42, 0.9) 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 13,
                      border: `1.5px solid ${statusColor}`,
                      color: '#ffffff',
                    }}
                  >
                    {manager.avatarText}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>{manager.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>
                      {manager.role} &bull; {manager.accountsCount} Retainers
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 9999,
                    backgroundColor: `${statusColor}22`,
                    color: statusColor,
                    border: `1px solid ${statusColor}55`,
                    letterSpacing: '0.04em',
                  }}
                >
                  {statusLabel}
                </div>
              </div>

              {/* Middle Metric: Hours & Percent */}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    <span style={{ color: '#f8fafc', fontWeight: 700, fontFamily: 'monospace', fontSize: 14 }}>
                      {animatedLogged.toFixed(1)}h
                    </span>{' '}
                    / {manager.capacityHours}h cap
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: statusColor, fontFamily: 'monospace' }}>
                    {currentPct}%
                  </div>
                </div>

                {/* Bar Track */}
                <div
                  style={{
                    width: '100%',
                    height: 9,
                    borderRadius: 9999,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Safe threshold mark at 85% */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '85%',
                      top: 0,
                      bottom: 0,
                      width: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.35)',
                      zIndex: 3,
                    }}
                  />

                  {/* Fill bar */}
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, (currentPct / 100) * 100)}%`,
                      borderRadius: 9999,
                      background: isBurnout
                        ? 'linear-gradient(90deg, #f97316 0%, #ef4444 100%)'
                        : isWarning
                        ? 'linear-gradient(90deg, #38bdf8 0%, #f59e0b 100%)'
                        : isOptimal
                        ? 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)'
                        : 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)',
                      boxShadow: `0 0 10px ${statusColor}`,
                    }}
                  />
                </div>
              </div>

              {/* Bottom Capacity Delta */}
              <div
                style={{
                  marginTop: 10,
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#64748b',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingTop: 8,
                }}
              >
                <span>Remaining Bandwidth:</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: availableHours < 0 ? '#ef4444' : availableHours < 6 ? '#f59e0b' : '#38bdf8',
                  }}
                >
                  {availableHours < 0
                    ? `Overloaded by ${Math.abs(availableHours)}h`
                    : `+${availableHours}h available`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Insight Banner */}
      <div
        style={{
          marginTop: 14,
          padding: '10px 16px',
          borderRadius: 12,
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <span>Burnout risk threshold (&gt;100%) exceeded on key tier</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>
          Reallocation Needed: +6h to David
        </div>
      </div>
    </div>
  );
};
