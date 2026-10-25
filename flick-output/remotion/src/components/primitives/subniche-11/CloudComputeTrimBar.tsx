import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CloudResourceItem {
  id: string;
  name: string;
  category: string;
  initialCost: number;
  optimizedCost: number;
  color: string;
  statusText: string;
}

export interface CloudComputeTrimBarProps {
  title?: string;
  subtitle?: string;
  cloudProvider?: 'AWS' | 'GCP' | 'MULTI-CLOUD';
  resources?: CloudResourceItem[];
  trimStartFrame?: number;
  width?: number;
  height?: number;
}

const DEFAULT_RESOURCES: CloudResourceItem[] = [
  {
    id: 'res-1',
    name: 'Oversized EC2 Instances (c5.9xlarge @ 2% CPU)',
    category: 'Compute Overprovision',
    initialCost: 17200,
    optimizedCost: 4100,
    color: '#ef4444',
    statusText: 'Right-sized to Graviton t4g',
  },
  {
    id: 'res-2',
    name: 'Unattached EBS gp3 Volumes (18.4 TB Orphaned)',
    category: 'Dead Storage',
    initialCost: 4800,
    optimizedCost: 0,
    color: '#f97316',
    statusText: 'Terminated 28 volumes',
  },
  {
    id: 'res-3',
    name: 'Idle Staging Clusters (Running 24/7 on Weekends)',
    category: 'Dev Environments',
    initialCost: 6400,
    optimizedCost: 1800,
    color: '#eab308',
    statusText: 'Auto-sleep cron enabled',
  },
  {
    id: 'res-4',
    name: 'Unallocated Elastic IPs & Idle Classic ALBs',
    category: 'Zombie Networking',
    initialCost: 2900,
    optimizedCost: 0,
    color: '#ec4899',
    statusText: 'Released 19 IPs + 4 ALBs',
  },
  {
    id: 'res-5',
    name: 'Active Core Production (Aurora RDS, CDN, EKS)',
    category: 'Protected Production',
    initialCost: 13500,
    optimizedCost: 13500,
    color: '#10b981',
    statusText: '100% SLA Maintained',
  },
];

export const CloudComputeTrimBar: React.FC<CloudComputeTrimBarProps> = ({
  title = 'CLOUD COMPUTE TRIM PROTOCOL',
  subtitle = 'AWS / GCP Zombie Volume Termination & Instance Right-Sizing',
  cloudProvider = 'AWS',
  resources = DEFAULT_RESOURCES,
  trimStartFrame = 35,
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

  // Trim progress spring
  const trimSpring = spring({
    frame: Math.max(0, frame - trimStartFrame),
    fps,
    config: { damping: 14, stiffness: 85, mass: 1 },
  });

  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.94, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [24, 0]);

  // Aggregate costs
  const initialTotal = resources.reduce((sum, r) => sum + r.initialCost, 0);
  const optimizedTotal = resources.reduce((sum, r) => sum + r.optimizedCost, 0);
  const currentTotal = Math.round(interpolate(trimSpring, [0, 1], [initialTotal, optimizedTotal]));
  const currentSavings = initialTotal - currentTotal;
  const percentageCut = Math.round(((initialTotal - optimizedTotal) / initialTotal) * 100);

  // Is trim active
  const isTrimmed = frame > trimStartFrame + 30;

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
        border: `1px solid ${isTrimmed ? 'rgba(16, 185, 129, 0.35)' : 'rgba(249, 115, 22, 0.35)'}`,
        boxShadow: `0 24px 50px -12px rgba(0, 0, 0, 0.75), 0 0 35px ${isTrimmed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(249, 115, 22, 0.12)'}`,
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
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${isTrimmed ? 'rgba(16, 185, 129, 0.16)' : 'rgba(249, 115, 22, 0.16)'} 0%, transparent 70%)`,
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: isTrimmed ? '#10b981' : '#f97316',
                boxShadow: `0 0 10px ${isTrimmed ? '#10b981' : '#f97316'}`,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isTrimmed ? '#34d399' : '#fb923c',
              }}
            >
              {title}
            </span>
            <span
              style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {cloudProvider} FINOPS
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

        {/* Live Monthly Bill Readout */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 16,
            border: `1px solid ${isTrimmed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            padding: '8px 16px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Current Monthly Cloud Bill
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'flex-end' }}>
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: isTrimmed ? '#34d399' : '#f87171',
              }}
            >
              ${currentTotal.toLocaleString()}
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>/mo</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>
            {currentSavings > 0 ? `-$${currentSavings.toLocaleString()}/mo (-${percentageCut}%)` : 'AUDIT RUNNING'}
          </div>
        </div>
      </div>

      {/* Stacked Breakdown Trim Bar */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Live Infrastructure Spend Distribution
          </span>
          <span style={{ fontSize: 11, color: isTrimmed ? '#34d399' : '#f59e0b', fontWeight: 600 }}>
            {isTrimmed ? '✓ 42 Orphaned Cloud Assets Purged' : 'Analyzing idle IOPS and dead CPU...'}
          </span>
        </div>

        {/* The Stacked Bar */}
        <div
          style={{
            height: 28,
            width: '100%',
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.06)',
            display: 'flex',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {resources.map((res) => {
            const currentResCost = interpolate(trimSpring, [0, 1], [res.initialCost, res.optimizedCost]);
            const widthPct = (currentResCost / initialTotal) * 100;

            if (widthPct <= 0.5) return null;

            return (
              <div
                key={res.id}
                style={{
                  width: `${widthPct}%`,
                  height: '100%',
                  background: res.color,
                  transition: 'width 0.1s linear',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title={`${res.name}: $${Math.round(currentResCost)}`}
              >
                {widthPct > 8 && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: '#ffffff',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      padding: '0 4px',
                    }}
                  >
                    ${Math.round(currentResCost).toLocaleString()}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Resource Items Legend / Checklist */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px 16px',
            marginTop: 14,
          }}
        >
          {resources.map((res, idx) => {
            const isEliminated = res.optimizedCost === 0 && isTrimmed;
            const isDownscaled = res.optimizedCost < res.initialCost && res.optimizedCost > 0 && isTrimmed;

            return (
              <div
                key={res.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  borderRadius: 8,
                  background: isEliminated
                    ? 'rgba(239, 68, 68, 0.08)'
                    : isDownscaled
                    ? 'rgba(16, 185, 129, 0.08)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isEliminated ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: res.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#e2e8f0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {res.name}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: isEliminated ? '#94a3b8' : '#f8fafc',
                      textDecoration: isEliminated ? 'line-through' : 'none',
                    }}
                  >
                    ${res.initialCost.toLocaleString()}
                  </span>
                  {isTrimmed && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: isEliminated ? '#ef4444' : isDownscaled ? '#10b981' : '#94a3b8',
                      }}
                    >
                      {isEliminated ? '→ PURGED' : isDownscaled ? `→ $${res.optimizedCost.toLocaleString()}` : 'KEPT'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal FinOps Action Log */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.45)',
          borderRadius: 14,
          padding: '10px 16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontFamily: 'Consolas, Monaco, monospace',
          fontSize: 11,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8', fontWeight: 700 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span>AUTOTERMINATOR DAEMON EXECUTION LOG</span>
        </div>
        <div style={{ color: '#94a3b8' }}>
          {frame < trimStartFrame
            ? '> Scanning AWS us-east-1 & eu-central-1 clusters for orphaned volumes...'
            : frame < trimStartFrame + 25
            ? '> [EXEC] Detaching and destroying 28 dead EBS volumes... Save $4,800/mo'
            : '> [SUCCESS] Pruned 42 orphaned cloud objects. Total annualized run-rate savings: $340,800'}
        </div>
      </div>

      {/* Bottom KPI Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 14,
            padding: '10px 14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Monthly Cloud Reduction
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#34d399', marginTop: 2 }}>
            -${currentSavings.toLocaleString()} /mo
          </div>
          <div style={{ fontSize: 10, color: '#64748b' }}>
            -{percentageCut}% Infrastructure Burn
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 14,
            padding: '10px 14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Annualized Runway Preserved
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>
            +${(currentSavings * 12).toLocaleString()} /yr
          </div>
          <div style={{ fontSize: 10, color: '#64748b' }}>
            Equivalent to 3 Senior Engineers
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 14,
            padding: '10px 14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Production Impact
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981', marginTop: 2 }}>
            0% Downtime (99.99%)
          </div>
          <div style={{ fontSize: 10, color: '#64748b' }}>
            Only unattached & idle nodes killed
          </div>
        </div>
      </div>
    </div>
  );
};
