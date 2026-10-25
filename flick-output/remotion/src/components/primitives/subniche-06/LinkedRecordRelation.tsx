import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface InvoiceItem {
  id: string;
  code: string;
  title: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'In Review';
  date: string;
}

export interface LinkedRecordRelationProps {
  title?: string;
  clientName?: string;
  clientTier?: string;
  clientId?: string;
  totalValue?: string;
  invoices?: InvoiceItem[];
  width?: number;
  height?: number;
}

const DEFAULT_INVOICES: InvoiceItem[] = [
  { id: 'inv-1', code: 'INV-2024-001', title: 'Web App Redesign', amount: '$14,200', status: 'Paid', date: 'Oct 04' },
  { id: 'inv-2', code: 'INV-2024-002', title: 'Cloud Infrastructure', amount: '$9,800', status: 'Paid', date: 'Oct 11' },
  { id: 'inv-3', code: 'INV-2024-003', title: 'API Integration Hub', amount: '$7,500', status: 'Paid', date: 'Oct 18' },
  { id: 'inv-4', code: 'INV-2024-004', title: 'Security Pentest Audit', amount: '$6,000', status: 'Pending', date: 'Oct 22' },
  { id: 'inv-5', code: 'INV-2024-005', title: 'Q4 Support Retainer', amount: '$11,000', status: 'In Review', date: 'Oct 25' },
];

export const LinkedRecordRelation: React.FC<LinkedRecordRelationProps> = ({
  title = 'RELATIONAL SCHEMA: 1-TO-MANY LINK',
  clientName = 'Acme Global Technologies',
  clientTier = 'Enterprise Tier 1',
  clientId = 'REC_CLM_9042',
  totalValue = '$48,500.00',
  invoices = DEFAULT_INVOICES,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation for container
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const containerOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const containerScale = interpolate(enterSpring, [0, 1], [0.93, 1]);

  // Client card entrance
  const clientSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 15, stiffness: 140 },
  });
  const clientX = interpolate(clientSpring, [0, 1], [-40, 0]);
  const clientOpacity = interpolate(clientSpring, [0, 1], [0, 1]);

  // Overall laser connector beam progress (frame 20 to 65)
  const beamProgress = interpolate(frame, [20, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse animation for active connection
  const pulse = Math.sin(frame * 0.18) * 0.5 + 0.5;

  // Invoice positions for bezier SVG paths
  // Left anchor point: X: 310, Y: 290 (center of client port)
  // Right anchor points for 5 invoices:
  // Each invoice is ~68px high with 10px gap, starting around Y: 130
  const invoiceYs = [154, 222, 290, 358, 426];

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: containerOpacity,
        transform: `scale(${containerScale})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.15)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background Matrix grid accents */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(59, 130, 246, 0.08) 1.5px, transparent 1.5px), radial-gradient(rgba(99, 102, 241, 0.04) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          marginBottom: 20,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.05em', color: '#60a5fa' }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Foreign Key: <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>clients.id ⇄ invoices.client_ref</span>
            </div>
          </div>
        </div>

        {/* Live Relation Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 999,
            background: beamProgress > 0.8 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)',
            border: `1px solid ${beamProgress > 0.8 ? 'rgba(34, 197, 94, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: beamProgress > 0.8 ? '#22c55e' : '#3b82f6',
              boxShadow: `0 0 8px ${beamProgress > 0.8 ? '#22c55e' : '#3b82f6'}`,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: beamProgress > 0.8 ? '#4ade80' : '#93c5fd',
              letterSpacing: '0.02em',
            }}
          >
            {beamProgress >= 1 ? '5/5 RECORDS LINKED' : 'RESOLVING RELATIONS...'}
          </span>
        </div>
      </div>

      {/* Main Relational Canvas Area */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', zIndex: 2 }}>
        {/* SVG Bezier Lines Connector Canvas */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <defs>
            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {invoiceYs.map((targetY, idx) => {
            const startX = 290;
            const startY = 230; // Client center anchor
            const endX = 490;
            const cX1 = startX + 90;
            const cY1 = startY;
            const cX2 = endX - 90;
            const cY2 = targetY;

            // Stagger beam per invoice
            const itemBeam = interpolate(
              frame,
              [20 + idx * 6, 45 + idx * 6],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            // Path string
            const pathData = `M ${startX} ${startY} C ${cX1} ${cY1}, ${cX2} ${cY2}, ${endX} ${targetY}`;
            const pathLength = 320; // approximate length

            return (
              <g key={`path-${idx}`}>
                {/* Background ghost wire */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Animated Glowing Laser Stream */}
                {itemBeam > 0 && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke="url(#beamGradient)"
                    strokeWidth={itemBeam > 0.9 ? 2.5 : 2}
                    strokeDasharray={pathLength}
                    strokeDashoffset={pathLength * (1 - itemBeam)}
                    filter="url(#glowEffect)"
                    opacity={itemBeam}
                  />
                )}
                {/* Traveling photon dot */}
                {itemBeam > 0 && itemBeam < 1 && (
                  <circle
                    cx={startX + (endX - startX) * itemBeam}
                    cy={startY + (targetY - startY) * itemBeam}
                    r={3.5}
                    fill="#ffffff"
                    filter="url(#glowEffect)"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* LEFT COLUMN: Client Database Record */}
        <div
          style={{
            width: 290,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            opacity: clientOpacity,
            transform: `translateX(${clientX}px)`,
            zIndex: 3,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#38bdf8',
              letterSpacing: '0.08em',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 14 }}>🏛️</span> PARENT TABLE: CLIENTS
          </div>

          <div
            style={{
              background: 'rgba(30, 41, 59, 0.75)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              borderRadius: 16,
              padding: '18px 20px',
              position: 'relative',
              boxShadow: `0 12px 30px rgba(0, 0, 0, 0.4), 0 0 25px rgba(59, 130, 246, ${0.1 + pulse * 0.15})`,
            }}
          >
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b' }}>{clientId}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#f8fafc', marginTop: 2 }}>{clientName}</div>
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#93c5fd',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                {clientTier}
              </div>
            </div>

            {/* Field breakdown */}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#94a3b8' }}>Relationship:</span>
                <span style={{ color: '#cbd5e1', fontWeight: 500 }}>Primary Sponsor</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#94a3b8' }}>Billing Currency:</span>
                <span style={{ color: '#cbd5e1', fontWeight: 500 }}>USD ($)</span>
              </div>
              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                  Cumulative Ledger
                </span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
                  {totalValue}
                </span>
              </div>
            </div>

            {/* Linking Outbound Port */}
            <div
              style={{
                position: 'absolute',
                right: -10,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#1d4ed8',
                border: '3px solid #60a5fa',
                boxShadow: `0 0 15px rgba(96, 165, 250, ${0.5 + pulse * 0.5})`,
                zIndex: 4,
              }}
            />
          </div>
        </div>

        {/* CENTER GAP (Where SVG wires criss-cross) */}
        <div style={{ width: 200 }} />

        {/* RIGHT COLUMN: 5 Invoices Child Database Records */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 10,
            zIndex: 3,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#a78bfa',
              letterSpacing: '0.08em',
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>🧾</span> CHILD TABLE: INVOICES (1:N)
            </div>
            <span style={{ fontSize: 11, color: '#64748b' }}>Foreign Key Matches: 5</span>
          </div>

          {invoices.map((inv, idx) => {
            const rowSpring = spring({
              frame: frame - (12 + idx * 4),
              fps,
              config: { damping: 14, stiffness: 130 },
            });
            const rowX = interpolate(rowSpring, [0, 1], [30, 0]);
            const rowOpacity = interpolate(rowSpring, [0, 1], [0, 1]);

            const isLinked = interpolate(frame, [25 + idx * 6, 35 + idx * 6], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={inv.id}
                style={{
                  height: 56,
                  background: isLinked > 0.5 ? 'rgba(30, 41, 59, 0.85)' : 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${isLinked > 0.5 ? 'rgba(129, 140, 248, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: 12,
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                  opacity: rowOpacity,
                  transform: `translateX(${rowX}px)`,
                  boxShadow: isLinked > 0.5 ? '0 4px 15px rgba(99, 102, 241, 0.15)' : 'none',
                  transition: 'background 0.2s',
                  boxSizing: 'border-box',
                }}
              >
                {/* Inbound target port on invoice */}
                <div
                  style={{
                    position: 'absolute',
                    left: -6,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: isLinked > 0.8 ? '#818cf8' : '#334155',
                    border: `2px solid ${isLinked > 0.8 ? '#c7d2fe' : '#475569'}`,
                    boxShadow: isLinked > 0.8 ? '0 0 10px rgba(129, 140, 248, 0.8)' : 'none',
                  }}
                />

                {/* Invoice ID and Name */}
                <div style={{ marginLeft: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#e2e8f0' }}>
                      {inv.code}
                    </span>
                    <span style={{ fontSize: 10, color: '#64748b' }}>• {inv.date}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{inv.title}</div>
                </div>

                {/* Amount & Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#38bdf8' }}>
                    {inv.amount}
                  </span>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background:
                        inv.status === 'Paid'
                          ? 'rgba(34, 197, 94, 0.2)'
                          : inv.status === 'Pending'
                          ? 'rgba(234, 179, 8, 0.2)'
                          : 'rgba(99, 102, 241, 0.2)',
                      color:
                        inv.status === 'Paid'
                          ? '#4ade80'
                          : inv.status === 'Pending'
                          ? '#facc15'
                          : '#a5b4fc',
                    }}
                  >
                    {inv.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info Strip */}
      <div
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          color: '#64748b',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#22c55e' }}>●</span>
          <span>Integrity constraint: CASCADE_LOOKUP enabled</span>
        </div>
        <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
          Query execution: 1.2ms • 5 rows bound to {clientId}
        </div>
      </div>
    </div>
  );
};
