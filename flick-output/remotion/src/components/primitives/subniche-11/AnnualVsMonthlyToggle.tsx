import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AnnualVsMonthlyToggleProps {
  title?: string;
  subtitle?: string;
  toolName?: string;
  monthlyRate?: number;
  discountPercent?: number;
  seatsCount?: number;
  toggleFrame?: number;
  width?: number;
  height?: number;
}

export const AnnualVsMonthlyToggle: React.FC<AnnualVsMonthlyToggleProps> = ({
  title = 'BILLING FREQUENCY ARBITRAGE',
  subtitle = 'Converting Disjointed Monthly Billings Into Discounted Annual Tiers',
  toolName = 'Enterprise AI & Workflow Suite',
  monthlyRate = 2850,
  discountPercent = 20,
  seatsCount = 35,
  toggleFrame = 35,
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

  // Switch flip spring
  const switchSpring = spring({
    frame: Math.max(0, frame - toggleFrame),
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.7 },
  });

  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.94, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [24, 0]);

  // Calculations
  const isAnnual = frame >= toggleFrame;
  const annualDiscountedMonthlyRate = Math.round(monthlyRate * (1 - discountPercent / 100));
  const fullAnnualIfMonthly = monthlyRate * 12;
  const fullAnnualDiscounted = annualDiscountedMonthlyRate * 12;
  const totalAnnualSavings = fullAnnualIfMonthly - fullAnnualDiscounted;

  // Toggle thumb translation (track width: 84px, thumb: 36px => translate: 40px)
  const thumbTranslateX = interpolate(switchSpring, [0, 1], [4, 44]);
  const toggleGlowColor = isAnnual ? '#10b981' : '#38bdf8';

  // Badge explosion spring on toggle flip
  const badgeSpring = spring({
    frame: Math.max(0, frame - (toggleFrame + 6)),
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.6 },
  });

  const badgeScale = interpolate(badgeSpring, [0, 1], [0.5, 1]);
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);

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
        border: `1px solid ${isAnnual ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.3)'}`,
        boxShadow: `0 24px 50px -12px rgba(0, 0, 0, 0.75), 0 0 40px ${isAnnual ? 'rgba(16, 185, 129, 0.16)' : 'rgba(56, 189, 248, 0.12)'}`,
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
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${isAnnual ? 'rgba(16, 185, 129, 0.18)' : 'rgba(56, 189, 248, 0.15)'} 0%, transparent 70%)`,
          filter: 'blur(50px)',
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
                background: toggleGlowColor,
                boxShadow: `0 0 10px ${toggleGlowColor}`,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: toggleGlowColor,
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
              {toolName} ({seatsCount} Seats)
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

        {/* Live Arbitrage Badge */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 100,
            background: isAnnual ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${isAnnual ? '#10b981' : 'rgba(239, 68, 68, 0.4)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: isAnnual ? '#34d399' : '#f87171',
            }}
          >
            {isAnnual ? '⚡ ANNUAL DISCOUNT APPLIED' : '⚠️ MONTHLY CONVENIENCE SURCHARGE'}
          </span>
        </div>
      </div>

      {/* Central Interactive Switch Control */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: '12px 24px',
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: 18,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: isAnnual ? '#64748b' : '#38bdf8',
            transition: 'color 0.2s ease',
          }}
        >
          Monthly Billing (No Commitment)
        </div>

        {/* The Toggle Track */}
        <div
          style={{
            width: 86,
            height: 44,
            borderRadius: 22,
            background: isAnnual
              ? 'linear-gradient(90deg, #059669 0%, #10b981 100%)'
              : 'rgba(255, 255, 255, 0.12)',
            border: `2px solid ${isAnnual ? '#34d399' : 'rgba(255, 255, 255, 0.2)'}`,
            boxShadow: isAnnual ? '0 0 16px rgba(16, 185, 129, 0.5)' : 'none',
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Moving Knob */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
              transform: `translateX(${thumbTranslateX}px)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isAnnual ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#94a3b8' }} />
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: isAnnual ? '#34d399' : '#64748b',
              transition: 'color 0.2s ease',
            }}
          >
            Annual Upfront Billing
          </div>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 6,
              background: isAnnual ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${isAnnual ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}`,
              fontSize: 11,
              fontWeight: 800,
              color: isAnnual ? '#34d399' : '#94a3b8',
            }}
          >
            SAVE {discountPercent}%
          </span>
        </div>
      </div>

      {/* Dual Pricing Comparison Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 18,
        }}
      >
        {/* Card 1: Monthly Option */}
        <div
          style={{
            background: !isAnnual ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            borderRadius: 18,
            padding: '20px 22px',
            border: !isAnnual ? '2px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255, 255, 255, 0.06)',
            opacity: !isAnnual ? 1 : 0.45,
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                Standard Monthly Tier
              </span>
              <span style={{ fontSize: 11, color: '#f87171', fontWeight: 700 }}>
                +25% Overhead
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 10 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#f8fafc' }}>
                ${monthlyRate.toLocaleString()}
              </span>
              <span style={{ fontSize: 14, color: '#94a3b8' }}>/ month</span>
            </div>

            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Annual Outlay: <strong style={{ color: '#f87171' }}>${fullAnnualIfMonthly.toLocaleString()}</strong>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontSize: 11,
              color: '#f87171',
              fontWeight: 600,
            }}
          >
            ⚠️ Wasting ${totalAnnualSavings.toLocaleString()}/yr on flexible rate penalty
          </div>
        </div>

        {/* Card 2: Annual Discounted Option */}
        <div
          style={{
            background: isAnnual
              ? 'linear-gradient(145deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)'
              : 'rgba(255, 255, 255, 0.02)',
            borderRadius: 18,
            padding: '20px 22px',
            border: isAnnual ? '2px solid rgba(16, 185, 129, 0.6)' : '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: isAnnual ? '0 12px 30px rgba(16, 185, 129, 0.2)' : 'none',
            opacity: isAnnual ? 1 : 0.6,
            transition: 'all 0.3s ease',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Animated 20% Discount Ribbon Badge */}
          {isAnnual && (
            <div
              style={{
                position: 'absolute',
                top: -14,
                right: 18,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                padding: '4px 14px',
                borderRadius: 100,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.04em',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                transform: `scale(${badgeScale})`,
                opacity: badgeOpacity,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>⭐</span>
              <span>20% CASH SAVED</span>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase' }}>
                Annual Upfront Contract
              </span>
              <span style={{ fontSize: 11, color: '#34d399', fontWeight: 800 }}>
                Instant ROI
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 10 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#34d399' }}>
                ${annualDiscountedMonthlyRate.toLocaleString()}
              </span>
              <span style={{ fontSize: 14, color: '#94a3b8' }}>/ month</span>
            </div>

            <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
              Billed Annually: <strong>${fullAnnualDiscounted.toLocaleString()}</strong>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.18)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              fontSize: 11,
              color: '#34d399',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>✓ Net Annual Cash Reclaimed</span>
            <span style={{ fontSize: 13, fontWeight: 900 }}>+${totalAnnualSavings.toLocaleString()}</span>
          </div>
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
            Immediate Cash Savings
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#34d399', marginTop: 2 }}>
            ${totalAnnualSavings.toLocaleString()} /year
          </div>
          <div style={{ fontSize: 10, color: '#64748b' }}>
            {discountPercent}% pure discount margin
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
            Runway Equivalent
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>
            +0.8 Months
          </div>
          <div style={{ fontSize: 10, color: '#64748b' }}>
            Additional runway preserved
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
            Procurement Advantage
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>
            Fixed Rate Lock
          </div>
          <div style={{ fontSize: 10, color: '#64748b' }}>
            Guaranteed against mid-year price hikes
          </div>
        </div>
      </div>
    </div>
  );
};
