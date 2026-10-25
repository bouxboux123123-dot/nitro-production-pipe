import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GumroadSaleNotificationProps {
  productName?: string;
  customerName?: string;
  customerEmail?: string;
  saleAmount?: string;
  currency?: string;
  timestamp?: string;
  licenseKey?: string;
  webhookSpeed?: string;
  tierName?: string;
  platform?: string;
  width?: number;
  height?: number;
}

export const GumroadSaleNotification: React.FC<GumroadSaleNotificationProps> = ({
  productName = 'Ultimate Notion Creator OS',
  customerName = 'Marcus Vance',
  customerEmail = 'm.vance***@gmail.com',
  saleAmount = '$149.00',
  currency = 'USD',
  timestamp = 'Just now',
  licenseKey = 'GUM-8924-VL7X-AUTO',
  webhookSpeed = '0.38s',
  tierName = 'Commercial Agency License',
  platform = 'Gumroad Auto-Fulfillment',
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

  // Top notification entrance (slides down from top)
  const notifSpring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const notifY = interpolate(notifSpring, [0, 1], [-50, 0]);
  const notifOpacity = interpolate(notifSpring, [0, 1], [0, 1]);

  // Audio/Ping radar wave expansion
  const pingWave = (frame % 30) / 30;
  const pingScale = 1 + pingWave * 0.9;
  const pingOpacity = (1 - pingWave) * 0.8;

  // Pipeline trigger progress (frame 24 -> 54)
  const pipelineProgress = interpolate(frame, [24, 52], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // License card entrance spring
  const cardSpring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 13, stiffness: 110 },
  });
  const cardScale = interpolate(cardSpring, [0, 1], [0.92, 1]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardY = interpolate(cardSpring, [0, 1], [30, 0]);

  // License key unmasking text simulation
  const revealedCharsCount = Math.floor(
    interpolate(frame, [46, 75], [4, licenseKey.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const displayedLicense =
    licenseKey.slice(0, revealedCharsCount) +
    '••••-••••'.slice(0, Math.max(0, licenseKey.length - revealedCharsCount));

  // Stamp badge spring
  const stampSpring = spring({
    frame: frame - 68,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const stampScale = interpolate(stampSpring, [0, 1], [1.8, 1]);
  const stampOpacity = interpolate(stampSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(2, 6, 23, 0.96) 100%)',
        borderRadius: 28,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(16, 185, 129, 0.12)',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        color: '#F8FAFC',
        padding: '32px 36px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        transform: `scale(${enterSpring})`,
        opacity: enterSpring,
      }}
    >
      {/* Background ambient neon glow */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(35px)',
        }}
      />

      {/* Top Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)',
            }}
          >
            {/* Shopping bag / cart icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#10B981', fontWeight: 700 }}>
              {platform}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#E2E8F0' }}>Instant Digital Fulfillment Engine</div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(16, 185, 129, 0.12)',
            padding: '6px 14px',
            borderRadius: 20,
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 8px #10B981',
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#34D399' }}>Zero-Touch Delivery</span>
        </div>
      </div>

      {/* Push Notification Banner */}
      <div
        style={{
          transform: `translateY(${notifY}px)`,
          opacity: notifOpacity,
          background: 'rgba(30, 41, 59, 0.75)',
          backdropFilter: 'blur(16px)',
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.16)',
          padding: '18px 22px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Pulsing Bell Icon with Radar Effect */}
          <div style={{ position: 'relative', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                position: 'absolute',
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: '2px solid rgba(16, 185, 129, 0.6)',
                transform: `scale(${pingScale})`,
                opacity: pingOpacity,
              }}
            />
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #FF6900 0%, #E056FD 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(255, 105, 0, 0.35)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#F43F5E', background: 'rgba(244, 63, 94, 0.15)', padding: '2px 8px', borderRadius: 6 }}>
                NEW SALE
              </span>
              <span style={{ fontSize: 13, color: '#94A3B8' }}>{timestamp}</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>{productName}</div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
              Buyer: <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{customerName}</span> ({customerEmail})
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#10B981', letterSpacing: '-0.02em', textShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
            +{saleAmount}
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{currency} • Paid in Full</div>
        </div>
      </div>

      {/* Pipeline Connecting Progress Line */}
      <div style={{ margin: '4px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#38BDF8', fontWeight: 600 }}>
              {pipelineProgress < 1 ? '⚙️ Webhook Pipeline Processing...' : '⚡ Webhook Dispatched Successfully'}
            </span>
            <span style={{ fontSize: 11, background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
              Latency: {webhookSpeed}
            </span>
          </div>
          <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'monospace' }}>
            {Math.round(pipelineProgress * 100)}%
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: 6,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${pipelineProgress * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #38BDF8 0%, #10B981 100%)',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>

      {/* Automatic License Key Card */}
      <div
        style={{
          transform: `translateY(${cardY}px) scale(${cardScale})`,
          opacity: cardOpacity,
          background: 'rgba(15, 23, 42, 0.88)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: 22,
          padding: '20px 26px',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.4), inset 0 0 24px rgba(16, 185, 129, 0.06)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Instant Cryptographic Key Generated
              </span>
              <span
                style={{
                  fontSize: 11,
                  background: 'rgba(16, 185, 129, 0.18)',
                  color: '#10B981',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontWeight: 600,
                }}
              >
                {tierName}
              </span>
            </div>

            {/* License Token Code Display */}
            <div
              style={{
                marginTop: 10,
                background: 'rgba(2, 6, 23, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: 14,
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                width: 'fit-content',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  color: '#FFFFFF',
                  textShadow: '0 0 12px rgba(255, 255, 255, 0.35)',
                }}
              >
                {displayedLicense}
              </span>
              <span
                style={{
                  fontSize: 11,
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#94A3B8',
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                COPY
              </span>
            </div>
          </div>

          {/* Stamp Badge */}
          {frame >= 68 && (
            <div
              style={{
                transform: `scale(${stampScale}) rotate(-6deg)`,
                opacity: stampOpacity,
                border: '2px solid #10B981',
                borderRadius: 12,
                padding: '8px 16px',
                background: 'rgba(16, 185, 129, 0.18)',
                color: '#10B981',
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: '0.12em',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
              }}
            >
              ✓ DELIVERED
              <div style={{ fontSize: 9, fontWeight: 600, color: '#6EE7B7', letterSpacing: '0.04em' }}>
                SENT TO INBOX
              </div>
            </div>
          )}
        </div>

        {/* Delivery Details Footer inside card */}
        <div
          style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#94A3B8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#10B981' }}>●</span> Automated Onboarding Email Dispatched
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#38BDF8' }}>●</span> Notion Workspace Duplicate Link Embedded
          </div>
          <div style={{ color: '#E2E8F0', fontWeight: 600 }}>0 Admin Clicks Required</div>
        </div>
      </div>

      {/* Bottom Summary Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          padding: '10px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94A3B8' }}>
          <span style={{ color: '#F59E0B' }}>★</span>
          <span>Automate Your Side Hustle: </span>
          <strong style={{ color: '#F8FAFC' }}>Digital Product Delivery (100% Passive)</strong>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, fontFamily: 'monospace' }}>
          <span style={{ color: '#64748B' }}>Fulfillment Latency: <strong style={{ color: '#10B981' }}>{webhookSpeed}</strong></span>
          <span style={{ color: '#64748B' }}>Success Rate: <strong style={{ color: '#38BDF8' }}>99.98%</strong></span>
        </div>
      </div>
    </div>
  );
};
