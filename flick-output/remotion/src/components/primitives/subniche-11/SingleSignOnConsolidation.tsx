import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DisparateTool {
  id: string;
  name: string;
  category: string;
  pricePerUser: number;
  iconBg: string;
  iconSvgText: string;
  gridCol: number;
  gridRow: number;
}

export interface SingleSignOnConsolidationProps {
  title?: string;
  subtitle?: string;
  tools?: DisparateTool[];
  consolidatedName?: string;
  consolidatedPrice?: number;
  teamSize?: number;
  mergeStartFrame?: number;
  width?: number;
  height?: number;
}

const DEFAULT_TOOLS: DisparateTool[] = [
  {
    id: 't1',
    name: 'Miro Board',
    category: 'Visual Whiteboard',
    pricePerUser: 16,
    iconBg: '#ffd02f',
    iconSvgText: 'M',
    gridCol: 0,
    gridRow: 0,
  },
  {
    id: 't2',
    name: 'Calendly Pro',
    category: 'Meeting Booking',
    pricePerUser: 15,
    iconBg: '#006bff',
    iconSvgText: 'C',
    gridCol: 1,
    gridRow: 0,
  },
  {
    id: 't3',
    name: 'Loom Video',
    category: 'Async Screen Record',
    pricePerUser: 20,
    iconBg: '#625df5',
    iconSvgText: 'L',
    gridCol: 2,
    gridRow: 0,
  },
  {
    id: 't4',
    name: 'Asana Premium',
    category: 'Project Tracking',
    pricePerUser: 30,
    iconBg: '#f06a6a',
    iconSvgText: 'A',
    gridCol: 3,
    gridRow: 0,
  },
  {
    id: 't5',
    name: 'Notion Teams',
    category: 'Docs & Company Wiki',
    pricePerUser: 18,
    iconBg: '#ffffff',
    iconSvgText: 'N',
    gridCol: 0,
    gridRow: 1,
  },
  {
    id: 't6',
    name: 'Typeform Pro',
    category: 'Forms & Surveys',
    pricePerUser: 35,
    iconBg: '#262627',
    iconSvgText: 'T',
    gridCol: 1,
    gridRow: 1,
  },
  {
    id: 't7',
    name: 'DocuSign eSign',
    category: 'Legal Agreements',
    pricePerUser: 40,
    iconBg: '#ff1a1a',
    iconSvgText: 'D',
    gridCol: 2,
    gridRow: 1,
  },
  {
    id: 't8',
    name: 'Zoom Pro',
    category: 'Video Conferencing',
    pricePerUser: 22,
    iconBg: '#2d8cff',
    iconSvgText: 'Z',
    gridCol: 3,
    gridRow: 1,
  },
];

export const SingleSignOnConsolidation: React.FC<SingleSignOnConsolidationProps> = ({
  title = 'SSO CONSOLIDATION MATRIX',
  subtitle = '8 Disparate SaaS Sprawl Tools Merged Into 1 Unified Workspace',
  tools = DEFAULT_TOOLS,
  consolidatedName = 'Unified All-in-One Enterprise Hub',
  consolidatedPrice = 39,
  teamSize = 50,
  mergeStartFrame = 35,
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

  // Convergence spring (8 cards implode towards center)
  const convergeSpring = spring({
    frame: Math.max(0, frame - mergeStartFrame),
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.9 },
  });

  // Unified card arrival spring (appears shortly after collapse starts)
  const unifiedSpring = spring({
    frame: Math.max(0, frame - (mergeStartFrame + 18)),
    fps,
    config: { damping: 13, stiffness: 105, mass: 0.85 },
  });

  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.94, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [24, 0]);

  // Calculations
  const totalSeparatePrice = tools.reduce((sum, t) => sum + t.pricePerUser, 0);
  const monthlySavingsPerUser = totalSeparatePrice - consolidatedPrice;
  const percentageCut = Math.round((monthlySavingsPerUser / totalSeparatePrice) * 100);

  const annualSprawlSpend = totalSeparatePrice * teamSize * 12;
  const annualConsolidatedSpend = consolidatedPrice * teamSize * 12;
  const annualCompanySavings = annualSprawlSpend - annualConsolidatedSpend;

  // Tools fade and collapse inward
  const toolOpacity = interpolate(convergeSpring, [0, 0.7, 1], [1, 0.4, 0]);
  const toolCollapseScale = interpolate(convergeSpring, [0, 1], [1, 0.2]);

  // Center unified card animation
  const unifiedOpacity = interpolate(unifiedSpring, [0, 1], [0, 1]);
  const unifiedScale = interpolate(unifiedSpring, [0, 1], [0.8, 1]);
  const unifiedY = interpolate(unifiedSpring, [0, 1], [30, 0]);

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
        border: '1px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 24px 50px -12px rgba(0, 0, 0, 0.75), 0 0 35px rgba(56, 189, 248, 0.12)',
        backdropFilter: 'blur(16px)',
        padding: '24px 30px',
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
          top: -100,
          right: -80,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, transparent 70%)',
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
                background: '#38bdf8',
                boxShadow: '0 0 10px #38bdf8',
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#38bdf8',
              }}
            >
              {title}
            </span>
            <span
              style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 12,
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#7dd3fc',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              SAML 2.0 COMPLIANT
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

        {/* Live Status Pill */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 100,
            background: frame > mergeStartFrame + 25 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${frame > mergeStartFrame + 25 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: frame > mergeStartFrame + 25 ? '#34d399' : '#f87171',
            }}
          >
            {frame > mergeStartFrame + 25 ? '⚡ 8 LICENSES MERGED INTO 1' : '⚠️ 8 SEPARATE VENDOR INVOICES'}
          </span>
        </div>
      </div>

      {/* Main Interactive Stage Area */}
      <div
        style={{
          position: 'relative',
          height: 330,
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: 18,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Converging 8 Tool Sprawl Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: 12,
            opacity: toolOpacity,
            pointerEvents: convergeSpring > 0.9 ? 'none' : 'auto',
          }}
        >
          {tools.map((tool) => {
            // Calculate translation vector towards center of 4x2 grid
            // Grid center is between col 1.5 and row 0.5
            const deltaX = (1.5 - tool.gridCol) * 160 * convergeSpring;
            const deltaY = (0.5 - tool.gridRow) * 120 * convergeSpring;

            return (
              <div
                key={tool.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transform: `translate(${deltaX}px, ${deltaY}px) scale(${toolCollapseScale})`,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: tool.iconBg,
                      color: tool.iconBg === '#ffffff' ? '#000000' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 900,
                    }}
                  >
                    {tool.iconSvgText}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                      {tool.name}
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>
                      {tool.category}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#f87171' }}>
                    ${tool.pricePerUser}/mo
                  </span>
                  <span style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>
                    Separate Bill
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Emerged Unified Enterprise Hero Card */}
        {frame >= mergeStartFrame && (
          <div
            style={{
              position: 'relative',
              width: 580,
              padding: '24px 28px',
              borderRadius: 20,
              background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.18) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '2px solid rgba(16, 185, 129, 0.6)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(16, 185, 129, 0.25)',
              opacity: unifiedOpacity,
              transform: `translateY(${unifiedY}px) scale(${unifiedScale})`,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              zIndex: 20,
            }}
          >
            {/* Top unified badge header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc' }}>
                    {consolidatedName}
                  </div>
                  <div style={{ fontSize: 11, color: '#6ee7b7' }}>
                    All 8 Tool Capabilities in 1 Centralized SAML SSO Hub
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10b981',
                  borderRadius: 100,
                  padding: '4px 12px',
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#34d399',
                }}
              >
                SAVE -{percentageCut}%
              </div>
            </div>

            {/* Price comparison breakdown inside unified card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
                background: 'rgba(0, 0, 0, 0.35)',
                padding: '14px 18px',
                borderRadius: 14,
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Previous 8-Tool Sprawl
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#f87171', textDecoration: 'line-through' }}>
                  ${totalSeparatePrice}
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>/user/mo</span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  8 logins, 8 renewals, high IT risk
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>
                  Unified Enterprise License
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#34d399' }}>
                  ${consolidatedPrice}
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>/user/mo</span>
                </div>
                <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>
                  1 single bill • Reclaims ${monthlySavingsPerUser}/seat/mo
                </div>
              </div>
            </div>

            {/* Security and IT perks line */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: '#94a3b8' }}>
                ✓ Instant Okta / Google Workspace Deprovisioning
              </span>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                ✓ Zero Shadow IT Leakage
              </span>
            </div>
          </div>
        )}
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
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Per Seat Savings
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#34d399', marginTop: 2 }}>
            -${monthlySavingsPerUser} /mo
          </div>
          <div style={{ fontSize: 10, color: '#64748b' }}>
            Cut from ${totalSeparatePrice} to ${consolidatedPrice}
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 14,
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Annual Team Savings (50 Seats)
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>
            ${annualCompanySavings.toLocaleString()} /year
          </div>
          <div style={{ fontSize: 10, color: '#64748b' }}>
            Pure bottom-line runway capital
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 14,
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Vendor Sprawl Reduction
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>
            8 Vendors → 1 Master
          </div>
          <div style={{ fontSize: 10, color: '#64748b' }}>
            100% centralized IT management
          </div>
        </div>
      </div>
    </div>
  );
};
