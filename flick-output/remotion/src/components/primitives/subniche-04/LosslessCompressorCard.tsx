import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LosslessCompressorCardProps {
  originalFormat?: string;
  originalSize?: string;
  compressedFormat?: string;
  compressedSize?: string;
  reductionPercent?: number;
  ssimScore?: string;
  psnrScore?: string;
  accentColor?: string;
  successColor?: string;
}

export const LosslessCompressorCard: React.FC<LosslessCompressorCardProps> = ({
  originalFormat = 'RAW Uncompressed (PNG)',
  originalSize = '25.4 MB',
  compressedFormat = 'AVIF / WebP Lossless',
  compressedSize = '392 KB',
  reductionPercent = 98.4,
  ssimScore = '0.9998',
  psnrScore = '54.2 dB',
  accentColor = '#38bdf8',
  successColor = '#10b981',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const enterOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Slider position oscillating smoothly between 25% and 75%
  // Using smooth sine curve over 90 frames
  const sliderProgress = 0.5 + 0.3 * Math.sin((frame / 60) * Math.PI);
  const sliderPercent = Math.round(sliderProgress * 100);

  // File size counter tick down
  const sizeProgress = interpolate(frame, [15, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentMB = (25.4 - sizeProgress * (25.4 - 0.392)).toFixed(
    sizeProgress > 0.8 ? 2 : 1
  );

  return (
    <div
      style={{
        width: 880,
        height: 590,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 24,
        boxShadow: `0 24px 64px -12px rgba(0, 0, 0, 0.7), 0 0 32px -4px ${successColor}25`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: '#f8fafc',
        transform: `scale(${enterScale})`,
        opacity: enterOpacity,
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: '#f1f5f9',
              }}
            >
              LOSSLESS_COMPRESSOR // OXIPNG + LIBVIPS
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              Bit-Exact Raster Optimization & Chroma Subsampling
            </div>
          </div>
        </div>

        {/* Reduction Highlight Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 999,
            backgroundColor: `${successColor}18`,
            border: `1px solid ${successColor}50`,
          }}
        >
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 14,
              fontWeight: 800,
              color: successColor,
              textShadow: `0 0 12px ${successColor}80`,
            }}
          >
            -{reductionPercent}% PAYLOAD
          </span>
        </div>
      </div>

      {/* Interactive Split Comparison Viewport */}
      <div
        style={{
          flex: 1,
          margin: '18px 24px',
          borderRadius: 16,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(135deg, #090d16 0%, #111827 50%, #0b1329 100%)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)',
        }}
      >
        {/* Synthetic High-Frequency Image Content (Simulating 4K High Res Graphic) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Detailed Graphic Canvas / Grid */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `
                radial-gradient(circle at 35% 45%, rgba(56, 189, 248, 0.3) 0%, transparent 45%),
                radial-gradient(circle at 70% 60%, rgba(16, 185, 129, 0.25) 0%, transparent 50%),
                linear-gradient(45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%)
              `,
              backgroundSize: '100% 100%, 100% 100%, 30px 30px, 30px 30px, 30px 30px, 30px 30px',
              position: 'relative',
            }}
          >
            {/* Visual Subject: High Fidelity Cyber Camera Sensor Graphic */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 830 260"
              style={{ position: 'absolute', inset: 0 }}
            >
              <defs>
                <linearGradient id="lensGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Camera Lens Rings */}
              <circle
                cx="415"
                cy="130"
                r="110"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <circle
                cx="415"
                cy="130"
                r="85"
                fill="none"
                stroke="url(#lensGlow)"
                strokeWidth="2.5"
                strokeDasharray="4 6"
              />
              <circle
                cx="415"
                cy="130"
                r="55"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <circle
                cx="415"
                cy="130"
                r="28"
                fill="rgba(16, 185, 129, 0.2)"
                stroke="#10b981"
                strokeWidth="2"
              />

              {/* Crosshair & Sensor alignment marks */}
              <line
                x1="260"
                y1="130"
                x2="570"
                y2="130"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
              <line
                x1="415"
                y1="20"
                x2="415"
                y2="240"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />

              {/* Dynamic waveform trace */}
              <path
                d="M 120 130 Q 180 80 240 130 T 360 130 T 480 130 T 600 130 T 720 130"
                fill="none"
                stroke="rgba(56, 189, 248, 0.45)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Split Divider Vertical Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPercent}%`,
            width: 3,
            backgroundColor: '#ffffff',
            boxShadow: '0 0 14px 2px rgba(255, 255, 255, 0.8), 0 0 30px rgba(56, 189, 248, 0.6)',
            zIndex: 10,
          }}
        >
          {/* Slider Circular Handle */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: '#0f172a',
              border: '2px solid #ffffff',
              boxShadow: '0 4px 16px rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            <span>◀</span>
            <span>▶</span>
          </div>
        </div>

        {/* Left Side Label (Original File) */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 16,
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            backgroundColor: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(10px)',
            padding: '8px 14px',
            borderRadius: 10,
            border: '1px solid rgba(239, 68, 68, 0.35)',
          }}
        >
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: '#f87171',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            ORIGINAL SOURCE
          </div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 14,
              fontWeight: 800,
              color: '#f1f5f9',
            }}
          >
            {originalSize}
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8' }}>{originalFormat}</div>
        </div>

        {/* Right Side Label (Compressed Lossless) */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 16,
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 4,
            backgroundColor: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(10px)',
            padding: '8px 14px',
            borderRadius: 10,
            border: `1px solid ${successColor}50`,
          }}
        >
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: successColor,
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            AVIF LOSSLESS OUTPUT
          </div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 14,
              fontWeight: 800,
              color: '#34d399',
              textShadow: '0 0 10px rgba(52, 211, 153, 0.5)',
            }}
          >
            {compressedSize}
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8' }}>{compressedFormat}</div>
        </div>

        {/* Center Loupe / Pixel Diff Verification HUD */}
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            borderRadius: 999,
            padding: '6px 16px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: successColor,
              boxShadow: `0 0 8px ${successColor}`,
            }}
          />
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              fontWeight: 600,
              color: '#e2e8f0',
            }}
          >
            PIXEL DIFFERENCE: <strong style={{ color: successColor }}>0.000%</strong> (100% VISUAL
            PARITY)
          </span>
        </div>
      </div>

      {/* Bottom Telemetry & Fidelity Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
          gap: 14,
          padding: '0 24px 20px 24px',
        }}
      >
        {/* Metric 1: Bandwidth Reduction Meter */}
        <div
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderRadius: 14,
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              fontFamily: '"JetBrains Mono", monospace',
              color: '#94a3b8',
            }}
          >
            <span>LIVE SAVINGS TICKER</span>
            <span style={{ color: successColor, fontWeight: 700 }}>
              {currentMB} MB ➔ {compressedSize}
            </span>
          </div>
          {/* Comparison Bar */}
          <div
            style={{
              height: 8,
              width: '100%',
              backgroundColor: 'rgba(239, 68, 68, 0.25)',
              borderRadius: 999,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${100 - reductionPercent * sizeProgress}%`,
                backgroundColor: '#ef4444',
                borderRadius: 999,
                opacity: 0.8,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${Math.max(3, 100 - reductionPercent)}%`,
                backgroundColor: successColor,
                borderRadius: 999,
                boxShadow: `0 0 10px ${successColor}`,
              }}
            />
          </div>
        </div>

        {/* Metric 2: SSIM Fidelity */}
        <div
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderRadius: 14,
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontFamily: '"JetBrains Mono", monospace',
                color: '#94a3b8',
                fontWeight: 600,
              }}
            >
              SSIM FIDELITY
            </div>
            <div
              style={{
                fontSize: 18,
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 800,
                color: '#f8fafc',
                marginTop: 2,
              }}
            >
              {ssimScore}
            </div>
          </div>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              fontSize: 10,
              fontFamily: '"JetBrains Mono", monospace',
              color: successColor,
              fontWeight: 700,
            }}
          >
            PERFECT
          </div>
        </div>

        {/* Metric 3: PSNR Quality */}
        <div
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderRadius: 14,
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontFamily: '"JetBrains Mono", monospace',
                color: '#94a3b8',
                fontWeight: 600,
              }}
            >
              PSNR PEAK
            </div>
            <div
              style={{
                fontSize: 18,
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 800,
                color: '#f8fafc',
                marginTop: 2,
              }}
            >
              {psnrScore}
            </div>
          </div>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              fontSize: 10,
              fontFamily: '"JetBrains Mono", monospace',
              color: accentColor,
              fontWeight: 700,
            }}
          >
            LOSSLESS
          </div>
        </div>
      </div>
    </div>
  );
};
