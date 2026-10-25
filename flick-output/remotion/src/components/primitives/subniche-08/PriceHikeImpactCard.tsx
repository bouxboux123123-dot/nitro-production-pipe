import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PriceHikeImpactCardProps {
  appName?: string;
  planName?: string;
  renewalCycle?: string;
  seatCount?: number;
  oldPricePerSeat?: number;
  newPricePerSeat?: number;
  effectiveDate?: string;
  reasons?: string[];
  width?: number;
  height?: number;
}

export const PriceHikeImpactCard: React.FC<PriceHikeImpactCardProps> = ({
  appName = 'OmniCollab Suite',
  planName = 'Team Workspace Tier',
  renewalCycle = 'Monthly Auto-Renewal',
  seatCount = 10,
  oldPricePerSeat = 20,
  newPricePerSeat = 65,
  effectiveDate = 'Billing begins December 1st',
  reasons = [
    'Legacy grandfathered plans deprecated',
    'Mandatory bundled generative AI copilot (+$15/seat)',
    '10-seat minimum tier commitment enforced',
  ],
  width = 900,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.8 },
  });

  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.93, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [25, 0]);

  // Price transition animation triggered after entrance
  const priceSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 16, stiffness: 85 },
  });

  const oldTotal = seatCount * oldPricePerSeat;
  const newTotal = seatCount * newPricePerSeat;
  const monthlyDelta = newTotal - oldTotal;
  const percentageIncrease = Math.round(((newPricePerSeat - oldPricePerSeat) / oldPricePerSeat) * 100);

  // Animated displayed new total
  const displayedTotal = Math.round(interpolate(priceSpring, [0, 1], [oldTotal, newTotal]));
  const displayedSeatPrice = Math.round(interpolate(priceSpring, [0, 1], [oldPricePerSeat, newPricePerSeat]));

  // Alarm pulse
  const alarmPulse = interpolate(Math.sin(frame * 0.18), [-1, 1], [0.3, 0.75]);
  const pillScale = 1 + Math.sin(frame * 0.15) * 0.03;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 24,
        background: 'linear-gradient(140deg, rgba(15, 23, 42, 0.95) 0%, rgba(26, 16, 28, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(239, 68, 68, ${alarmPulse})`,
        padding: '26px 32px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background radial gradient splash */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Banner Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: 16,
          marginBottom: 20,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Flame / Price Hike Alert Icon */}
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                {appName}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 9999,
                  background: 'rgba(239, 68, 68, 0.22)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  transform: `scale(${pillScale})`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    boxShadow: '0 0 8px #ef4444',
                  }}
                />
                SUBSCRIPTION PRICE HIKE
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              {planName} • <span style={{ color: '#cbd5e1' }}>{renewalCycle}</span>
            </div>
          </div>
        </div>

        {/* Delta Callout Badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            padding: '8px 16px',
            borderRadius: 14,
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.45)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Rate Escalation
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#ef4444', letterSpacing: '-0.01em' }}>
            +{percentageIncrease}% Jump
          </div>
        </div>
      </div>

      {/* Main Seat Multiplier Matrix */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 16,
          alignItems: 'center',
          marginBottom: 20,
          zIndex: 2,
        }}
      >
        {/* Previous Cost Card */}
        <div
          style={{
            borderRadius: 16,
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Previous Monthly Bill
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 38, fontWeight: 800, color: '#94a3b8', textDecoration: priceSpring > 0.6 ? 'line-through' : 'none' }}>
              ${oldTotal}
            </span>
            <span style={{ fontSize: 14, color: '#64748b' }}>/ month</span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{seatCount} active seats</span>
            <span>×</span>
            <span>${oldPricePerSeat}/seat</span>
          </div>
        </div>

        {/* Multiplier Transition Arrow */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#fca5a5' }}>+{percentageIncrease}%</span>
        </div>

        {/* New Revised Cost Card */}
        <div
          style={{
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.18) 100%)',
            border: '1.5px solid rgba(239, 68, 68, 0.6)',
            boxShadow: '0 8px 30px rgba(239, 68, 68, 0.2)',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle glowing pill */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 12,
              fontSize: 10,
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 6,
              background: '#ef4444',
              color: '#ffffff',
              letterSpacing: '0.04em',
            }}
          >
            NEW MANDATORY RATE
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Revised Monthly Bill
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: '#ffffff',
                textShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
              }}
            >
              ${displayedTotal}
            </span>
            <span style={{ fontSize: 14, color: '#fca5a5' }}>/ month</span>
          </div>
          <div style={{ fontSize: 12, color: '#fecaca', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
            <span>{seatCount} team seats</span>
            <span>×</span>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>${displayedSeatPrice}/seat</span>
            <span style={{ color: '#f87171' }}>(was ${oldPricePerSeat})</span>
          </div>
        </div>
      </div>

      {/* Breakdown Justifications & Hidden Fine-print */}
      <div
        style={{
          borderRadius: 14,
          background: 'rgba(2, 6, 23, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '14px 18px',
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 2,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Vendor Justifications / Policy Changes:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {reasons.map((reason, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#e2e8f0' }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  boxShadow: '0 0 6px #ef4444',
                  flexShrink: 0,
                }}
              />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Annualized Damage Callout */}
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          borderRadius: 12,
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <div style={{ fontSize: 13, color: '#cbd5e1' }}>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>Annual Budget Hit:</span> +${(monthlyDelta * 12).toLocaleString()} / year in unexpected software licensing
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24' }}>
          {effectiveDate}
        </div>
      </div>
    </div>
  );
};
