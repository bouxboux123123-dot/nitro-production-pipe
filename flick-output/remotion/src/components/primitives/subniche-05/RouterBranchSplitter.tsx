import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BranchDefinition {
  id: string;
  name: string;
  condition: string;
  destination: string;
  badge: string;
  iconType: 'email' | 'crm' | 'slack';
  accentColor: string;
}

export interface RouterBranchSplitterProps {
  dealName?: string;
  dealValue?: number;
  branches?: BranchDefinition[];
  companyName?: string;
}

export const RouterBranchSplitter: React.FC<RouterBranchSplitterProps> = ({
  dealName = 'Enterprise Tier Subscription',
  dealValue = 75000,
  companyName = 'HyperScale AI',
  branches = [
    {
      id: 'small',
      name: 'Branch A: Self-Serve Flow',
      condition: 'deal_value < $10k',
      destination: 'Customer.io Automation',
      badge: 'SELF-SERVE',
      iconType: 'email',
      accentColor: '#94a3b8',
    },
    {
      id: 'mid',
      name: 'Branch B: Inbound Sales',
      condition: '$10k ≤ deal_value < $50k',
      destination: 'HubSpot Deal Pipeline',
      badge: 'MID-MARKET',
      iconType: 'crm',
      accentColor: '#f59e0b',
    },
    {
      id: 'large',
      name: 'Branch C: VIP Alert Bot',
      condition: 'deal_value ≥ $50k',
      destination: '#vip-deals Slack Channel',
      badge: 'ENTERPRISE VIP',
      iconType: 'slack',
      accentColor: '#10b981',
    },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animations
  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });

  // Decision progress: 0 to 1 over first 35 frames
  const evaluateProgress = interpolate(frame, [10, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Active branch logic
  const isLargeDeal = dealValue >= 50000;
  const isMidDeal = dealValue >= 10000 && dealValue < 50000;
  const activeBranchIndex = isLargeDeal ? 2 : isMidDeal ? 1 : 0;

  // Signal pulse running through active branch
  const signalPulse = interpolate((frame - 35) % 45, [0, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Destination ping animation
  const pingAnim = interpolate((frame - 50) % 45, [0, 15, 35], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const renderIcon = (type: string) => {
    switch (type) {
      case 'email':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        );
      case 'crm':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'slack':
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
            <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
            <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        width: 900,
        height: 590,
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        borderRadius: 24,
        border: '1px solid rgba(148, 163, 184, 0.18)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(16, 185, 129, 0.08)',
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
      {/* Subtle background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 80% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header bar */}
      <div
        style={{
          height: 60,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              fontSize: 11,
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '0.05em',
            }}
          >
            ROUTER NODE
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
            Multi-Branch Conditional Filter (3 Paths)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Evaluated in:</span>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 12,
              background: 'rgba(30, 41, 59, 0.8)',
              padding: '3px 8px',
              borderRadius: 6,
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)',
            }}
          >
            3.2ms
          </span>
        </div>
      </div>

      {/* Central Pipeline Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          padding: '24px 28px',
          gap: 20,
          position: 'relative',
          alignItems: 'center',
        }}
      >
        {/* Left Side: Incoming Deal Card & Decision Diamond */}
        <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Incoming Payload Card */}
          <div
            style={{
              padding: 16,
              borderRadius: 16,
              background: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>
              INCOMING PAYLOAD
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginBottom: 2 }}>
              {companyName}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{dealName}</div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Deal Value:</span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#38bdf8',
                }}
              >
                ${dealValue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Router Decision Evaluator Node */}
          <div
            style={{
              padding: 14,
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.15)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24',
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                ?
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fde68a' }}>
                Rule: Branch By Deal Size
              </span>
            </div>

            {/* Evaluation progress bar */}
            <div
              style={{
                height: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${evaluateProgress * 100}%`,
                  backgroundColor: '#34d399',
                  boxShadow: '0 0 8px #34d399',
                }}
              />
            </div>
          </div>
        </div>

        {/* Middle Branching Connecting Lines SVG */}
        <div style={{ width: 70, height: 380, position: 'relative' }}>
          <svg
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
            viewBox="0 0 70 380"
          >
            {/* Branch 0 curve (Top) */}
            <path
              d="M 0 190 C 35 190, 35 60, 70 60"
              fill="none"
              stroke={activeBranchIndex === 0 ? '#38bdf8' : 'rgba(148, 163, 184, 0.2)'}
              strokeWidth={activeBranchIndex === 0 ? 3 : 1.5}
              strokeDasharray={activeBranchIndex === 0 ? 'none' : '4 4'}
            />

            {/* Branch 1 curve (Mid) */}
            <path
              d="M 0 190 C 35 190, 35 190, 70 190"
              fill="none"
              stroke={activeBranchIndex === 1 ? '#f59e0b' : 'rgba(148, 163, 184, 0.2)'}
              strokeWidth={activeBranchIndex === 1 ? 3 : 1.5}
              strokeDasharray={activeBranchIndex === 1 ? 'none' : '4 4'}
            />

            {/* Branch 2 curve (Bottom - VIP) */}
            <path
              d="M 0 190 C 35 190, 35 320, 70 320"
              fill="none"
              stroke={activeBranchIndex === 2 ? '#10b981' : 'rgba(148, 163, 184, 0.2)'}
              strokeWidth={activeBranchIndex === 2 ? 3.5 : 1.5}
            />

            {/* Glowing Traveling Pulse along Active Branch */}
            {activeBranchIndex === 2 && frame > 35 && (
              <circle
                cx={70 * signalPulse}
                cy={190 + (320 - 190) * Math.sin((signalPulse * Math.PI) / 2)}
                r="4.5"
                fill="#34d399"
                filter="drop-shadow(0 0 8px #10b981)"
              />
            )}
          </svg>
        </div>

        {/* Right Side: 3 Destination Branch Cards */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            justifyContent: 'center',
          }}
        >
          {branches.map((branch, idx) => {
            const isActive = idx === activeBranchIndex;
            return (
              <div
                key={branch.id}
                style={{
                  padding: '14px 18px',
                  borderRadius: 16,
                  backgroundColor: isActive
                    ? 'rgba(16, 185, 129, 0.12)'
                    : 'rgba(30, 41, 59, 0.45)',
                  border: isActive
                    ? '1.5px solid #10b981'
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: isActive
                    ? '0 10px 30px rgba(16, 185, 129, 0.2), 0 0 20px rgba(16, 185, 129, 0.15)'
                    : 'none',
                  opacity: isActive ? 1 : 0.45,
                  transform: isActive ? `scale(${1 + pingAnim * 0.015})` : 'scale(0.98)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        backgroundColor: isActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        color: isActive ? '#34d399' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {renderIcon(branch.iconType)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#f8fafc' : '#94a3b8' }}>
                        {branch.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>
                        IF {branch.condition}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 10,
                      fontWeight: 800,
                      backgroundColor: isActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(100, 116, 139, 0.2)',
                      color: isActive ? '#34d399' : '#64748b',
                      border: isActive ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid transparent',
                    }}
                  >
                    {isActive ? '✓ MATCHED & ROUTED' : 'BYPASSED'}
                  </div>
                </div>

                {/* Sub details */}
                <div
                  style={{
                    fontSize: 11,
                    color: isActive ? '#a7f3d0' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    paddingLeft: 42,
                  }}
                >
                  <span>→ Target:</span>
                  <span style={{ fontWeight: 600 }}>{branch.destination}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Audit Trail */}
      <div
        style={{
          height: 44,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          fontSize: 11,
          color: '#94a3b8',
          zIndex: 2,
        }}
      >
        <div>
          Execution Log: <span style={{ color: '#34d399', fontWeight: 600 }}>Branch C triggered</span> • Message dispatched to Slack Webhook
        </div>
        <div style={{ color: '#64748b' }}>Deterministic Router v2.4</div>
      </div>
    </div>
  );
};
