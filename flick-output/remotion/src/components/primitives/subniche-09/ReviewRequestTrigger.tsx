import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ReviewRequestTriggerProps {
  carrier?: string;
  trackingNumber?: string;
  customerName?: string;
  customerEmail?: string;
  productName?: string;
  deliveryLocation?: string;
  delayDays?: number;
  incentiveOffer?: string;
  currentRating?: string;
  totalReviews?: number;
  width?: number;
  height?: number;
}

export const ReviewRequestTrigger: React.FC<ReviewRequestTriggerProps> = ({
  carrier = 'USPS Priority Mail',
  trackingNumber = '9400 1118 9956 2014 8831 29',
  customerName = 'Sophia Chen',
  customerEmail = 'sophia.c***@gmail.com',
  productName = 'Custom Coiled Aviator Keyboard Cable',
  deliveryLocation = 'Front Porch • Seattle, WA',
  delayDays = 3,
  incentiveOffer = 'Get $10 Off Your Next Order',
  currentRating = '4.9/5.0',
  totalReviews = 482,
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Delivery ping wave
  const pingWave = (frame % 30) / 30;
  const pingScale = 1 + pingWave * 0.8;
  const pingOpacity = (1 - pingWave) * 0.7;

  // 72-Hour Buffer Progress (frame 20 to 65)
  const bufferProgress = interpolate(frame, [20, 65], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Staggered star pops (starting around frame 55)
  const star1 = spring({ frame: frame - 55, fps, config: { damping: 12, stiffness: 200 } });
  const star2 = spring({ frame: frame - 59, fps, config: { damping: 12, stiffness: 200 } });
  const star3 = spring({ frame: frame - 63, fps, config: { damping: 12, stiffness: 200 } });
  const star4 = spring({ frame: frame - 67, fps, config: { damping: 12, stiffness: 200 } });
  const star5 = spring({ frame: frame - 71, fps, config: { damping: 12, stiffness: 200 } });

  // Review card reveal spring
  const cardSpring = spring({
    frame: frame - 46,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const cardY = interpolate(cardSpring, [0, 1], [25, 0]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(2, 6, 23, 0.98) 100%)',
        borderRadius: 28,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(245, 158, 11, 0.12)',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        color: '#F8FAFC',
        padding: '28px 34px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        transform: `scale(${enterSpring})`,
        opacity: enterSpring,
      }}
    >
      {/* Background glow flares */}
      <div
        style={{
          position: 'absolute',
          top: -50,
          left: -40,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(45px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -50,
          right: -40,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(45px)',
        }}
      />

      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Star Icon Badge */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#FBBF24', fontWeight: 700 }}>
              Automated Social Proof Engine
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Post-Delivery Review Automation</div>
          </div>
        </div>

        {/* Rating Banner */}
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: 12,
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: '#FBBF24', fontSize: 14 }}>★</span>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#FDE68A' }}>{currentRating}</div>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>({totalReviews} Verified)</span>
        </div>
      </div>

      {/* Delivery Confirmation Ping Card */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.65)',
          backdropFilter: 'blur(16px)',
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '16px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Pulsing delivery radar icon */}
          <div style={{ position: 'relative', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                position: 'absolute',
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '2px solid rgba(16, 185, 129, 0.6)',
                transform: `scale(${pingScale})`,
                opacity: pingOpacity,
              }}
            />
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: 4 }}>
                PACKAGE DELIVERED
              </span>
              <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'monospace' }}>{trackingNumber}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginTop: 3 }}>
              {productName}
            </div>
            <div style={{ fontSize: 11, color: '#64748B' }}>
              Delivered to: <span style={{ color: '#E2E8F0' }}>{deliveryLocation}</span> ({carrier})
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#38BDF8', fontWeight: 600 }}>Webhook Handshake</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981', fontFamily: 'monospace' }}>
            Carrier Verified ✓
          </div>
        </div>
      </div>

      {/* 3-Day Buffer Countdown & Timeline Bar */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          padding: '14px 20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#FBBF24' }}>
              ⏱ Intelligent Buffer: Exactly {delayDays} Days (72 Hours)
            </span>
            <span style={{ fontSize: 11, background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', padding: '1px 8px', borderRadius: 4 }}>
              Optimal Review Window
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>
            {bufferProgress >= 100 ? 'Day 3 Reached: Triggering Dispatch' : `Buffer Elapsed: ${Math.round(bufferProgress)}%`}
          </div>
        </div>

        {/* Progress track */}
        <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${bufferProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #F59E0B 0%, #10B981 100%)',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.7)',
            }}
          />
        </div>

        {/* Day Milestone Markers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#64748B' }}>
          <span>Day 0: Delivered</span>
          <span>Day 1: Unboxing</span>
          <span>Day 2: Product Enjoyment</span>
          <span style={{ color: bufferProgress >= 100 ? '#10B981' : '#64748B', fontWeight: 700 }}>
            Day 3: Review Email Sent
          </span>
        </div>
      </div>

      {/* Review Request Card (Triggered at T+72h) */}
      <div
        style={{
          transform: `translateY(${cardY}px)`,
          opacity: cardOpacity,
          background: 'rgba(30, 41, 59, 0.85)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 20,
          padding: '18px 24px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(245, 158, 11, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>
              How is your new {productName}?
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>
              Automated message sent to <strong style={{ color: '#E2E8F0' }}>{customerName}</strong> ({customerEmail})
            </div>
          </div>

          {/* Incentive Pill */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 700,
              color: '#34D399',
            }}
          >
            🎁 {incentiveOffer}
          </div>
        </div>

        {/* 5-Star Interactive Preview */}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {[star1, star2, star3, star4, star5].map((starProgress, idx) => (
              <div
                key={idx}
                style={{
                  transform: `scale(${interpolate(starProgress, [0, 1], [0.3, 1])})`,
                  opacity: starProgress,
                  cursor: 'pointer',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#FBBF24" stroke="#D97706" strokeWidth="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            ))}
            <span style={{ fontSize: 12, fontWeight: 700, color: '#FBBF24', marginLeft: 6 }}>
              5.0 Exceptional!
            </span>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 12,
              padding: '8px 18px',
              borderRadius: 10,
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
              cursor: 'pointer',
            }}
          >
            Submit 1-Click Review →
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 10,
          fontSize: 12,
          color: '#64748B',
        }}
      >
        <span>
          Automate Your Side Hustle • <strong style={{ color: '#E2E8F0' }}>Post-Purchase Review Harvester</strong>
        </span>
        <span style={{ color: '#FBBF24', fontFamily: 'monospace' }}>+340% Review Velocity</span>
      </div>
    </div>
  );
};
