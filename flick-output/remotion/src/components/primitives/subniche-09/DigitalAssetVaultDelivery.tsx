import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DigitalAssetVaultDeliveryProps {
  orderId?: string;
  customerEmail?: string;
  fileName?: string;
  fileSize?: string;
  vaultDomain?: string;
  tokenHash?: string;
  expiryHours?: number;
  maxDownloads?: number;
  productTitle?: string;
  width?: number;
  height?: number;
}

export const DigitalAssetVaultDelivery: React.FC<DigitalAssetVaultDeliveryProps> = ({
  orderId = 'ORD-98412-DX',
  customerEmail = 'claire.studio***@gmail.com',
  fileName = 'Design_System_Master_Tokens_v4.2.zip',
  fileSize = '1.42 GB',
  vaultDomain = 'vault.creatorberry.io',
  tokenHash = '9e7b-c38a-442f-8910',
  expiryHours = 24,
  maxDownloads = 3,
  productTitle = 'Design System Pro Toolkit',
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

  // Vault seal unlocking animation (frame 15 to 45)
  const unlockProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const lockShackleY = interpolate(unlockProgress, [0, 1], [0, -6]);
  const lockRotation = interpolate(unlockProgress, [0, 1], [0, -18]);
  const sealGlow = interpolate(unlockProgress, [0, 1], [0.2, 0.75]);

  // URL generation typewriter / typing effect
  const fullUrl = `https://${vaultDomain}/dl/token?sig=${tokenHash}&t=86400`;
  const urlRevealLength = Math.floor(
    interpolate(frame, [30, 65], [18, fullUrl.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const currentUrl = fullUrl.slice(0, urlRevealLength);

  // Download button reveal spring
  const buttonSpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Dynamic seconds countdown ticker
  const remainingSeconds = Math.max(0, expiryHours * 3600 - Math.floor(frame / (fps / 3)));
  const hrs = Math.floor(remainingSeconds / 3600);
  const mins = Math.floor((remainingSeconds % 3600) / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;

  // Watermark pulse
  const scanBeam = interpolate(frame % 60, [0, 60], [-100, 200]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(3, 7, 18, 0.98) 100%)',
        borderRadius: 28,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(14, 165, 233, 0.15)',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        color: '#F8FAFC',
        padding: '30px 36px',
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
          top: -60,
          left: -40,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(45px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -70,
          right: -50,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Security Shield Icon */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(14, 165, 233, 0.45)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 11 12 14 17 9" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#38BDF8', fontWeight: 700 }}>
              Encrypted Digital Asset Delivery
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>{productTitle}</div>
          </div>
        </div>

        {/* Order badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 8,
              padding: '4px 12px',
              fontSize: 12,
              fontFamily: 'monospace',
              color: '#94A3B8',
            }}
          >
            {orderId}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 600,
              color: '#34D399',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
            Payment Verified
          </div>
        </div>
      </div>

      {/* Center Security Vault Seal & Download Box */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.65)',
          backdropFilter: 'blur(16px)',
          borderRadius: 22,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '22px 26px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Shimmer light sweep across vault card */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${scanBeam}%`,
            width: '25%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent)',
            transform: 'skewX(-20deg)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Animated Vault Lock Icon */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                border: '1px solid rgba(14, 165, 233, 0.4)',
                boxShadow: `0 0 24px rgba(14, 165, 233, ${sealGlow})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {/* Shackle moves up/rotates */}
                <path
                  d="M7 11V7a5 5 0 0 1 10 0v4"
                  style={{
                    transformOrigin: '17px 11px',
                    transform: `translateY(${lockShackleY}px) rotate(${lockRotation}deg)`,
                    transition: 'transform 0.2s ease-out',
                  }}
                />
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <circle cx="12" cy="16.5" r="1.5" />
              </svg>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>{fileName}</span>
                <span
                  style={{
                    fontSize: 11,
                    background: 'rgba(14, 165, 233, 0.18)',
                    color: '#38BDF8',
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontWeight: 600,
                  }}
                >
                  {fileSize}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Licensed to:</span>
                <strong style={{ color: '#E2E8F0' }}>{customerEmail}</strong>
                <span style={{ color: '#64748B' }}>•</span>
                <span style={{ color: '#A855F7', fontWeight: 600 }}>Tamper-Evident SHA256</span>
              </div>
            </div>
          </div>

          {/* Expiring Countdown Clock Pill */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 14,
              padding: '8px 16px',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#F87171', fontWeight: 700 }}>
              Self-Destruct Timer
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#FCA5A5', fontFamily: 'monospace', marginTop: 2 }}>
              ⏱ {timeFormatted}
            </div>
          </div>
        </div>

        {/* Dynamic Single-Use Download URL Card */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', fontWeight: 600 }}>
              Dynamic One-Time Secure URL
            </span>
            <span style={{ fontSize: 11, color: '#38BDF8', fontFamily: 'monospace' }}>
              Downloads: 0 / {maxDownloads} attempts used
            </span>
          </div>

          <div
            style={{
              background: 'rgba(2, 6, 23, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 12,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'monospace',
              fontSize: 13,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <span style={{ color: '#10B981' }}>GET</span>
              <span style={{ color: '#E2E8F0', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {currentUrl}
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38BDF8',
                padding: '4px 8px',
                borderRadius: 6,
                marginLeft: 12,
                flexShrink: 0,
              }}
            >
              AES-256
            </span>
          </div>
        </div>

        {/* CTA Button & Security Guardrails */}
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              transform: `scale(${buttonSpring})`,
              opacity: buttonSpring,
              background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 14,
              padding: '12px 28px',
              borderRadius: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.45)',
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Decrypted Archive (.ZIP)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Anti-Piracy Watermark Baked In</span>
          </div>
        </div>
      </div>

      {/* Security Feature Pillars (3 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 14,
            padding: '12px 14px',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#38BDF8', marginBottom: 3 }}>
            🔒 EXPIRING ACCESS
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>
            Link automatically expires in 24 hours to prevent unauthorized link sharing.
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 14,
            padding: '12px 14px',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#A855F7', marginBottom: 3 }}>
            🛡 IP WATERMARKING
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>
            Buyer email & cryptographic signature embedded in asset metadata.
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 14,
            padding: '12px 14px',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', marginBottom: 3 }}>
            ⚡ AUTO-FULFILLMENT
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>
            Delivered 100% autonomously via Webhook without creator intervention.
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
          paddingTop: 12,
          fontSize: 12,
          color: '#64748B',
        }}
      >
        <span>
          Automate Your Side Hustle • <strong style={{ color: '#E2E8F0' }}>Digital Vault Delivery</strong>
        </span>
        <span style={{ color: '#38BDF8', fontFamily: 'monospace' }}>Cloudflare R2 Encrypted Pipeline</span>
      </div>
    </div>
  );
};
