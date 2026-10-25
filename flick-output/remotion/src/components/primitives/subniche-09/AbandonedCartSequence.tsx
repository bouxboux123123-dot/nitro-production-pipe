import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AbandonedCartSequenceProps {
  cartValue?: string;
  customerName?: string;
  customerEmail?: string;
  itemTitle?: string;
  discountCode?: string;
  discountPercentage?: number;
  delayMinutes?: number;
  recoveredValue?: string;
  recoveryRate?: string;
  width?: number;
  height?: number;
}

export const AbandonedCartSequence: React.FC<AbandonedCartSequenceProps> = ({
  cartValue = '$129.00',
  customerName = 'Alex Rivera',
  customerEmail = 'alex.rivera***@gmail.com',
  itemTitle = 'Vintage Film Lightroom Presets (Master Pack)',
  discountCode = 'COMEBACK-15-ALEX',
  discountPercentage = 15,
  delayMinutes = 60,
  recoveredValue = '$3,840/mo',
  recoveryRate = '+28.4%',
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

  // Timeline progress across 4 nodes (0 to 100%)
  const timelineProgress = interpolate(frame, [15, 60], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Active steps based on progress
  const step1Active = true;
  const step2Active = frame >= 28;
  const step3Active = frame >= 44;
  const step4Active = frame >= 56;

  // Email Card Entrance Spring
  const emailSpring = spring({
    frame: frame - 48,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const emailY = interpolate(emailSpring, [0, 1], [30, 0]);
  const emailOpacity = interpolate(emailSpring, [0, 1], [0, 1]);

  // Discount token badge pulsing effect
  const tokenPulse = interpolate(Math.sin((frame / fps) * 6), [-1, 1], [0.95, 1.05]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(2, 6, 23, 0.98) 100%)',
        borderRadius: 28,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(244, 63, 94, 0.12)',
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
      {/* Background glowing ambience */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.16) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(45px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -50,
          left: -40,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234, 179, 8, 0.14) 0%, transparent 70%)',
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
          {/* Recovery Icon */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(244, 63, 94, 0.4)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#FB7185', fontWeight: 700 }}>
              Automated Abandoned Cart Winback
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>1-Hour High-Converting Recovery Sequence</div>
          </div>
        </div>

        {/* Revenue Impact Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 12,
              padding: '6px 14px',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#34D399', fontWeight: 700 }}>
              Recovered Revenue
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#10B981', fontFamily: 'monospace' }}>
              {recoveredValue} <span style={{ fontSize: 11, color: '#6EE7B7' }}>({recoveryRate})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Automation Pipeline */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.55)',
          backdropFilter: 'blur(14px)',
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Event Execution Pipeline
          </div>
          <div style={{ fontSize: 12, color: '#E2E8F0', fontFamily: 'monospace' }}>
            Buyer: <strong style={{ color: '#F43F5E' }}>{customerName}</strong> ({cartValue})
          </div>
        </div>

        {/* 4-Step Interactive Horizontal Pipeline */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Background Track Line */}
          <div
            style={{
              position: 'absolute',
              top: 18,
              left: 40,
              right: 40,
              height: 4,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              zIndex: 0,
            }}
          />
          {/* Animated Filled Track Line */}
          <div
            style={{
              position: 'absolute',
              top: 18,
              left: 40,
              width: `calc(${timelineProgress}% - 80px)`,
              maxWidth: 'calc(100% - 80px)',
              height: 4,
              background: 'linear-gradient(90deg, #F43F5E 0%, #EAB308 50%, #10B981 100%)',
              boxShadow: '0 0 10px rgba(244, 63, 94, 0.8)',
              borderRadius: 2,
              zIndex: 1,
            }}
          />

          {/* Node 1: Abandoned */}
          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 140 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#F43F5E',
                border: '3px solid rgba(15, 23, 42, 0.95)',
                boxShadow: '0 0 14px rgba(244, 63, 94, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 800,
                color: '#FFFFFF',
              }}
            >
              1
            </div>
            <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: '#FFFFFF', textAlign: 'center' }}>
              T = 0m
            </div>
            <div style={{ fontSize: 10, color: '#FDA4AF', textAlign: 'center' }}>Cart Abandoned</div>
          </div>

          {/* Node 2: Buffer */}
          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 140 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: step2Active ? '#F59E0B' : 'rgba(51, 65, 85, 0.9)',
                border: '3px solid rgba(15, 23, 42, 0.95)',
                boxShadow: step2Active ? '0 0 14px rgba(245, 158, 11, 0.6)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 800,
                color: '#FFFFFF',
                transition: 'all 0.3s ease',
              }}
            >
              2
            </div>
            <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: '#FFFFFF', textAlign: 'center' }}>
              T + 15m
            </div>
            <div style={{ fontSize: 10, color: step2Active ? '#FCD34D' : '#64748B', textAlign: 'center' }}>
              Silence Buffer
            </div>
          </div>

          {/* Node 3: Dynamic Token */}
          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 140 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: step3Active ? '#8B5CF6' : 'rgba(51, 65, 85, 0.9)',
                border: '3px solid rgba(15, 23, 42, 0.95)',
                boxShadow: step3Active ? '0 0 14px rgba(139, 92, 246, 0.6)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 800,
                color: '#FFFFFF',
                transition: 'all 0.3s ease',
              }}
            >
              3
            </div>
            <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: '#FFFFFF', textAlign: 'center' }}>
              T + {delayMinutes}m
            </div>
            <div style={{ fontSize: 10, color: step3Active ? '#C4B5FD' : '#64748B', textAlign: 'center' }}>
              Gen 15% VIP Token
            </div>
          </div>

          {/* Node 4: Send Email */}
          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 140 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: step4Active ? '#10B981' : 'rgba(51, 65, 85, 0.9)',
                border: '3px solid rgba(15, 23, 42, 0.95)',
                boxShadow: step4Active ? '0 0 14px rgba(16, 185, 129, 0.6)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 800,
                color: '#FFFFFF',
                transition: 'all 0.3s ease',
              }}
            >
              ✓
            </div>
            <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: '#FFFFFF', textAlign: 'center' }}>
              Dispatched
            </div>
            <div style={{ fontSize: 10, color: step4Active ? '#6EE7B7' : '#64748B', textAlign: 'center' }}>
              Personalized Email
            </div>
          </div>
        </div>
      </div>

      {/* Email Mockup Card Reveal */}
      <div
        style={{
          transform: `translateY(${emailY}px)`,
          opacity: emailOpacity,
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: 20,
          padding: '18px 24px',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 8 }}>
              To: <strong style={{ color: '#E2E8F0' }}>{customerEmail}</strong>
            </span>
          </div>

          <div
            style={{
              transform: `scale(${tokenPulse})`,
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              borderRadius: 8,
              padding: '3px 10px',
              fontFamily: 'monospace',
              fontSize: 12,
              fontWeight: 700,
              color: '#F472B6',
            }}
          >
            🏷️ TOKEN: {discountCode} (-{discountPercentage}%)
          </div>
        </div>

        {/* Email Content Body */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
              Hey {customerName}, did you forget something?
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: '1.4' }}>
              Your cart with <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{itemTitle}</span> is waiting.
              We saved your items and applied an instant {discountPercentage}% discount token.
            </div>

            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 12, color: '#64748B' }}>
                Original: <span style={{ textDecoration: 'line-through' }}>{cartValue}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981', fontFamily: 'monospace' }}>
                $109.65 <span style={{ fontSize: 11, color: '#34D399', fontWeight: 600 }}>(Save $19.35)</span>
              </div>
            </div>
          </div>

          {/* 1-Click Recovery CTA */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 13,
                padding: '10px 20px',
                borderRadius: 10,
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                cursor: 'pointer',
              }}
            >
              Complete Checkout & Save 15% →
            </div>
            <div style={{ fontSize: 10, color: '#64748B', marginTop: 4 }}>
              Single-use 1-click auto-apply link
            </div>
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
          Automate Your Side Hustle • <strong style={{ color: '#E2E8F0' }}>Abandoned Cart Recovery Flow</strong>
        </span>
        <span style={{ color: '#34D399', fontFamily: 'monospace' }}>Avg ROI: 18.4x per Campaign</span>
      </div>
    </div>
  );
};
