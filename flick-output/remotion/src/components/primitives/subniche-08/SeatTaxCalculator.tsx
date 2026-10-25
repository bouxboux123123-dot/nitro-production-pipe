import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PricingTier {
  id: string;
  name: string;
  pricePerSeat: number;
  highlightFeature: string;
  isEnterpriseSSO?: boolean;
  color: string;
}

export interface SeatTaxCalculatorProps {
  toolName?: string;
  seatCount?: number;
  tiers?: PricingTier[];
  taxMultiplier?: number;
  securityStandard?: string;
  width?: number;
  height?: number;
}

const DEFAULT_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Standard Pro',
    pricePerSeat: 15,
    highlightFeature: 'Google Login & Core Workflows',
    color: '#38bdf8',
  },
  {
    id: 'business',
    name: 'Business Growth',
    pricePerSeat: 30,
    highlightFeature: 'Audit Logs & Unlimited History',
    color: '#a855f7',
  },
  {
    id: 'enterprise',
    name: 'Enterprise (The SSO Wall)',
    pricePerSeat: 60,
    highlightFeature: 'SAML 2.0 / Okta SSO & SCIM Sync',
    isEnterpriseSSO: true,
    color: '#ef4444',
  },
];

export const SeatTaxCalculator: React.FC<SeatTaxCalculatorProps> = ({
  toolName = 'Enterprise Workspace SaaS',
  seatCount = 25,
  tiers = DEFAULT_TIERS,
  taxMultiplier = 4.0,
  securityStandard = 'SAML 2.0 / Okta / Azure AD',
  width = 900,
  height = 630,
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
  const cardScale = interpolate(enterSpring, [0, 1], [0.93, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [25, 0]);

  // Animated elevation highlighting the SSO Enterprise Tier
  const tierElevateProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15, stiffness: 110 },
  });

  // Base tier and Enterprise tier
  const baseTier = tiers[0];
  const enterpriseTier = tiers.find((t) => t.isEnterpriseSSO) || tiers[tiers.length - 1];

  const baseMonthly = seatCount * baseTier.pricePerSeat;
  const enterpriseMonthly = seatCount * enterpriseTier.pricePerSeat;
  const annualSsoTaxPenalty = (enterpriseMonthly - baseMonthly) * 12;

  // Animated animated number counters
  const animatedMultiplier = interpolate(tierElevateProgress, [0, 1], [1.0, taxMultiplier]).toFixed(1);
  const animatedMonthly = Math.round(interpolate(tierElevateProgress, [0, 1], [baseMonthly, enterpriseMonthly]));

  // Glowing pulse on the enterprise tier
  const glowPulse = interpolate(Math.sin(frame * 0.16), [-1, 1], [0.35, 0.75]);
  const lockShake = Math.sin(frame * 0.2) * 2;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 16, 35, 0.94) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(239, 68, 68, ${glowPulse * 0.4})`,
        padding: '24px 30px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient gradient glow */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          left: '30%',
          width: 360,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: 16,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Padlock / Security Wall Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 18px rgba(239, 68, 68, 0.5)',
              transform: `rotate(${lockShake}deg)`,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 19, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                THE ENTERPRISE SSO TAX
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                }}
              >
                SECURITY PENALTY WALL
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              {toolName} • Calculating impact across <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{seatCount} employee seats</span>
            </div>
          </div>
        </div>

        {/* 4.0x Multiplier Hero Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.15) 100%)',
            border: '1.5px solid rgba(239, 68, 68, 0.65)',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.25)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase' }}>
              Per-Seat Tax
            </span>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#ffffff' }}>
              {animatedMultiplier}x Cost
            </span>
          </div>
        </div>
      </div>

      {/* Tiered Pyramid / Ascending Stack Visualization */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        {tiers.map((tier, idx) => {
          const isSSO = !!tier.isEnterpriseSSO;
          const tierTotal = seatCount * tier.pricePerSeat;
          const tierProgress = spring({
            frame: frame - (10 + idx * 8),
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          return (
            <div
              key={tier.id}
              style={{
                opacity: interpolate(tierProgress, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(tierProgress, [0, 1], [-20, 0])}px)`,
                borderRadius: 14,
                padding: '12px 18px',
                background: isSSO
                  ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.22) 0%, rgba(185, 28, 28, 0.12) 100%)'
                  : 'rgba(2, 6, 23, 0.6)',
                border: isSSO
                  ? '1.5px solid rgba(239, 68, 68, 0.6)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isSSO ? '0 0 25px rgba(239, 68, 68, 0.2)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: isSSO ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    color: tier.color,
                  }}
                >
                  T{idx + 1}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: isSSO ? '#ffffff' : '#e2e8f0' }}>
                      {tier.name}
                    </span>
                    {isSSO && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: '#ef4444',
                          color: '#ffffff',
                          letterSpacing: '0.04em',
                        }}
                      >
                        MANDATORY FOR SSO
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: isSSO ? '#fca5a5' : '#94a3b8', marginTop: 2 }}>
                    {tier.highlightFeature}
                  </div>
                </div>
              </div>

              {/* Price Calculation Column */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: isSSO ? '#ef4444' : '#cbd5e1' }}>
                    ${tier.pricePerSeat}
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8' }}>/seat/mo</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    ${tierTotal.toLocaleString()} /mo team total
                  </div>
                </div>

                {isSSO && (
                  <div
                    style={{
                      padding: '4px 8px',
                      borderRadius: 6,
                      background: 'rgba(239, 68, 68, 0.25)',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#f87171',
                    }}
                  >
                    +300% SURCHARGE
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Impact Bar */}
      <div
        style={{
          borderRadius: 14,
          background: 'rgba(2, 6, 23, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Base Cost vs SSO Forced Cost
          </span>
          <span style={{ fontSize: 13, color: '#cbd5e1' }}>
            Standard Pro: <span style={{ color: '#38bdf8', fontWeight: 700 }}>${baseMonthly}/mo</span> → SSO Required: <span style={{ color: '#ef4444', fontWeight: 800 }}>${animatedMonthly}/mo</span>
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase' }}>
            Annual SSO Security Surcharge
          </span>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#ef4444' }}>
            +${annualSsoTaxPenalty.toLocaleString()} / year
          </div>
        </div>
      </div>

      {/* Bottom Explanatory Strip */}
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderRadius: 10,
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          fontSize: 12,
          color: '#cbd5e1',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>
            Required standard: <span style={{ color: '#ffffff', fontWeight: 600 }}>{securityStandard}</span> is gatekept behind top enterprise contracts.
          </span>
        </div>

        <div style={{ color: '#fbbf24', fontWeight: 700 }}>
          SSO.TAX AUDIT
        </div>
      </div>
    </div>
  );
};
