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
      fileName: 'apex_logo_primary_mark.svg',
      fileType: 'Vector SVG',
      size: '240 KB',
      specs: 'Infinite Scalability • CMYK & RGB Paths Verified',
      status: 'passed',
      badgeLabel: 'VECTOR CERTIFIED',
      resolutionInfo: 'Vector Infinite',
    },
    {
      fileName: 'brand_type_display_bold.otf',
      fileType: 'OpenType Font',
      size: '1.2 MB',
      specs: 'Web & Desktop Font License Validated',
      status: 'passed',
      badgeLabel: 'FONTS READY',
      resolutionInfo: 'Typography OTF',
    },
    {
      fileName: 'hero_ad_master_raw.png',
      fileType: 'PNG Image',
      size: '14.8 MB',
      specs: '3840 x 2160 • 300 DPI • Ultra-Wide Color Gamut',
      status: 'passed',
      badgeLabel: '4K RETINAPROOF',
      resolutionInfo: '300 DPI High-Res',
    },
    {
      fileName: 'legacy_icon_draft.jpg',
      fileType: 'JPEG 72 DPI',
      size: '88 KB',
      specs: 'Low-res detected: Auto-vectorizing via AI Engine',
      status: 'warning',
      badgeLabel: 'AI VECTORIZING',
      resolutionInfo: 'Auto-Upscaled to SVG',
    },
  ],
  width = 880,
  height = 620,
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
          borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
          paddingBottom: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(168, 85, 247, 0.45)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
                Asset Intake & Quality Inspector
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#c084fc',
                  background: 'rgba(168, 85, 247, 0.18)',
                  padding: '2px 8px',
                  borderRadius: 8,
                  border: '1px solid rgba(192, 132, 252, 0.35)',
                }}
              >
                AUTOMATED PRE-FLIGHT
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Intake for: <strong style={{ color: '#f1f5f9' }}>{clientBrand}</strong> • Resolving Vector Assets & Font Licenses
            </div>
          </div>
        </div>

        {/* Overall validation score badge */}
        <div
          style={{
            padding: '8px 16px',
            borderRadius: 14,
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.06em' }}>
            QUALITY SCORE
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#4ade80' }}>
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
            <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>
              Dropzone Active: Real-Time Vector & Spec Pre-Flight
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              Checks DPI, SVG XML validity, typography embedded glyphs, and color spaces
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#38bdf8',
            fontFamily: 'monospace',
            background: 'rgba(56, 189, 248, 0.1)',
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid rgba(56, 189, 248, 0.25)',
          }}
        >
          SCANNING 4/4
        </span>
      </div>

      {/* Asset Inspection Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {assets.map((asset, idx) => {
          const rowSpring = spring({
            frame: Math.max(0, frame - (10 + idx * 6)),
            fps,
            config: { damping: 13, stiffness: 130 },
          });
          const rowOpacity = interpolate(rowSpring, [0, 1], [0, 1]);
          const rowY = interpolate(rowSpring, [0, 1], [15, 0]);

          const isPassed = asset.status === 'passed';
          const isWarning = asset.status === 'warning';

          return (
            <div
              key={asset.fileName}
              style={{
                opacity: rowOpacity,
                transform: `translateY(${rowY}px)`,
                background: 'rgba(30, 41, 59, 0.55)',
                border: `1px solid ${isPassed ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.35)'}`,
                borderRadius: 14,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* File details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: isPassed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    border: `1px solid ${isPassed ? 'rgba(34, 197, 94, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isPassed ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                      {asset.fileName}
                    </span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>
                      ({asset.fileType} • {asset.size})
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 2 }}>
                    {asset.specs}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: isPassed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: isPassed ? '#4ade80' : '#fbbf24',
                    border: `1px solid ${isPassed ? 'rgba(34, 197, 94, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                  }}
                >
                  {asset.badgeLabel}
                </span>
                <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>
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
          marginTop: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#64748b',
          borderTop: '1px solid rgba(148, 163, 184, 0.14)',
          paddingTop: 10,
        }}
      >
        <span>📁 Assets auto-synced into Creative Figma Drive & Notion Asset Wiki</span>
        <span style={{ color: '#a855f7', fontWeight: 600 }}>AgencyFlow • Ready for Production</span>
      </div>
    </div>
  );
};
