import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface InspectedAsset {
  fileName: string;
  fileType: string;
  size: string;
  specs: string;
  status: 'passed' | 'warning' | 'processing';
  badgeLabel: string;
  resolutionInfo: string;
}

export interface AssetIntakeInspectorProps {
  clientBrand?: string;
  scanProgress?: number;
  assets?: InspectedAsset[];
  width?: number;
  height?: number;
}

export const AssetIntakeInspector: React.FC<AssetIntakeInspectorProps> = ({
  clientBrand = 'Apex Peak Ventures',
  scanProgress = 92,
  assets = [
    {
      fileName: 'Client Brand Guidelines & Assets',
      fileType: 'Vector SVG + Deck',
      size: '14.2 MB',
      specs: '12 Files Verified • Color Palettes & Fonts Sealed',
      status: 'passed',
      badgeLabel: 'ASSETS READY',
      resolutionInfo: '100% Validated',
    },
    {
      fileName: 'Meta Business Manager Admin Access',
      fileType: 'OAuth Admin Invite',
      size: '2FA Token',
      specs: '🛑 STALLED: 2FA Token Expired • Admin Rights Missing',
      status: 'warning',
      badgeLabel: 'ACCESS BLOCKED',
      resolutionInfo: 'Wrong Permissions',
    },
    {
      fileName: 'Shopify Staff Collaborator Account',
      fileType: 'Partner Token',
      size: 'API Key',
      specs: '⚠️ Pending Client Owner Acceptance • 4 Days Delay',
      status: 'warning',
      badgeLabel: 'CLIENT DELAY',
      resolutionInfo: 'Awaiting Auth',
    },
  ],
  width = 960,
  height = 760,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const cardScale = interpolate(cardSpring, [0, 1], [0.88, 1]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  // Laser scanner vertical sweep animation across the drop zone
  const scanSweep = (Math.sin((frame / fps) * Math.PI * 2.2) + 1) / 2;
  const laserY = interpolate(scanSweep, [0, 1], [15, 95]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
        borderRadius: 24,
        background:
          'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 24, 45, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(139, 92, 246, 0.35)',
        boxShadow:
          '0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 45px rgba(139, 92, 246, 0.16)',
        padding: '26px 30px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background violet/cyan glow */}
      <div
        style={{
          position: 'absolute',
          top: -90,
          right: -40,
          width: 440,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: -40,
          width: 380,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
          paddingBottom: 18,
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.55)',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: '#ffffff' }}>
                Asset Intake & Quality Inspector
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#c084fc',
                  background: 'rgba(168, 85, 247, 0.22)',
                  padding: '4px 10px',
                  borderRadius: 10,
                  border: '1.5px solid rgba(192, 132, 252, 0.45)',
                }}
              >
                AUTOMATED PRE-FLIGHT
              </span>
            </div>
            <div style={{ fontSize: 17, color: '#94a3b8', marginTop: 4, fontWeight: 600 }}>
              Intake for: <strong style={{ color: '#f1f5f9' }}>{clientBrand}</strong> • Resolving Vector Assets & Font Licenses
            </div>
          </div>
        </div>

        {/* Overall validation score badge */}
        <div
          style={{
            padding: '10px 20px',
            borderRadius: 16,
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1.5px solid rgba(139, 92, 246, 0.5)',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: '#a78bfa', letterSpacing: '0.06em' }}>
            QUALITY SCORE
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#4ade80' }}>
            {scanProgress}% Ready
          </div>
        </div>
      </div>

      {/* Dropzone with Laser Scanner simulation */}
      <div
        style={{
          position: 'relative',
          borderRadius: 14,
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1.5px dashed rgba(168, 85, 247, 0.5)',
          padding: '10px 16px',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        {/* Dynamic laser scan line */}
        <div
          style={{
            position: 'absolute',
            top: `${laserY}%`,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #a855f7, #38bdf8, transparent)',
            boxShadow: '0 0 10px #a855f7, 0 0 20px #38bdf8',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(168, 85, 247, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
              Dropzone Active: Real-Time Vector & Spec Pre-Flight
            </div>
            <div style={{ fontSize: 15, color: '#94a3b8' }}>
              Checks DPI, SVG XML validity, typography embedded glyphs, and color spaces
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: '#38bdf8',
            fontFamily: 'monospace',
            background: 'rgba(56, 189, 248, 0.15)',
            padding: '6px 14px',
            borderRadius: 8,
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
          }}
        >
          SCANNING 3/3
        </span>
      </div>

      {/* Asset Inspection Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {assets.slice(0, 3).map((asset, idx) => {
          // Progressive Disclosure: Each inspection item slams in timed with audio beats
          const rowDelay = 15 + idx * 42; // 0.5s, 1.9s, 3.3s
          const isRevealed = frame >= rowDelay;
          const rowSpring = spring({
            frame: Math.max(0, frame - rowDelay),
            fps,
            config: { damping: 12, stiffness: 150 },
          });
          const rowOpacity = isRevealed ? interpolate(rowSpring, [0, 1], [0.15, 1]) : 0.08;
          const rowY = isRevealed ? interpolate(rowSpring, [0, 1], [24, 0]) : 24;
          const rowScale = isRevealed ? interpolate(rowSpring, [0, 1], [0.92, 1]) : 0.95;

          const isPassed = asset.status === 'passed';
          const isWarning = asset.status === 'warning';

          return (
            <div
              key={asset.fileName}
              style={{
                opacity: rowOpacity,
                transform: `translateY(${rowY}px) scale(${rowScale})`,
                background: isRevealed ? 'rgba(30, 41, 59, 0.7)' : 'rgba(15, 23, 42, 0.4)',
                border: isRevealed
                  ? `1.5px solid ${isPassed ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.6)'}`
                  : '1px solid rgba(148, 163, 184, 0.1)',
                boxShadow: isRevealed && !isPassed ? '0 0 25px rgba(239, 68, 68, 0.2)' : 'none',
                borderRadius: 16,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'border 0.2s ease',
              }}
            >
              {/* File details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: isPassed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    border: `1.5px solid ${isPassed ? 'rgba(34, 197, 94, 0.5)' : 'rgba(245, 158, 11, 0.5)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isPassed ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#ffffff' }}>
                      {asset.fileName}
                    </span>
                    <span style={{ fontSize: 15, color: '#94a3b8', fontWeight: 600 }}>
                      ({asset.fileType} • {asset.size})
                    </span>
                  </div>
                  <div style={{ fontSize: 16, color: '#cbd5e1', marginTop: 4 }}>
                    {asset.specs}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    padding: '6px 14px',
                    borderRadius: 10,
                    background: isPassed ? 'rgba(34, 197, 94, 0.25)' : 'rgba(245, 158, 11, 0.25)',
                    color: isPassed ? '#4ade80' : '#fbbf24',
                    border: `1.5px solid ${isPassed ? 'rgba(34, 197, 94, 0.5)' : 'rgba(245, 158, 11, 0.5)'}`,
                  }}
                >
                  {asset.badgeLabel}
                </span>
                <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>
                  {asset.resolutionInfo}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div
        style={{
          marginTop: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 15,
          color: '#94a3b8',
          borderTop: '1px solid rgba(148, 163, 184, 0.18)',
          paddingTop: 12,
        }}
      >
        <span>📁 Assets auto-synced into Creative Figma Drive & Notion Asset Wiki</span>
        <span style={{ color: '#c084fc', fontWeight: 700 }}>AgencyFlow • Ready for Production</span>
      </div>
    </div>
  );
};
