import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MetadataScrubberProps {
  fileName?: string;
  fileDimensions?: string;
  authorTag?: string;
  gpsCoordinates?: string;
  serialNumber?: string;
  cameraModel?: string;
  accentRed?: string;
  accentGreen?: string;
}

export const MetadataScrubber: React.FC<MetadataScrubberProps> = ({
  fileName = 'IMG_20261024_174022.HEIC',
  fileDimensions = '4032 × 3024 (12.2 MP)',
  authorTag = 'Alex Mercer (alex@workstation-mac)',
  gpsCoordinates = '37.7749° N, 122.4194° W (Home Area)',
  serialNumber = 'EOS-R5-9924-A82F (Registered Body)',
  cameraModel = 'Canon EOS R5 • RF 24-70mm F2.8L',
  accentRed = '#f43f5e',
  accentGreen = '#10b981',
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

  // Sweep animation: sweeps from frame 20 to frame 75
  const sweepProgress = interpolate(frame, [20, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Calculate row purge states
  const isRow1Purged = sweepProgress >= 0.25;
  const isRow2Purged = sweepProgress >= 0.5;
  const isRow3Purged = sweepProgress >= 0.75;
  const isRow4Purged = sweepProgress >= 0.95;

  const totalPurgedCount =
    (isRow1Purged ? 1 : 0) +
    (isRow2Purged ? 1 : 0) +
    (isRow3Purged ? 1 : 0) +
    (isRow4Purged ? 1 : 0);

  const isFullySanitized = sweepProgress >= 0.95;

  // Sweep laser bar position in pixels (relative to the inspector container)
  const laserTop = interpolate(sweepProgress, [0, 1], [0, 290]);

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
        boxShadow: `0 24px 64px -12px rgba(0, 0, 0, 0.7), 0 0 32px -4px ${
          isFullySanitized ? accentGreen : accentRed
        }25`,
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
      {/* Top Header */}
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
              backgroundColor: isFullySanitized
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${isFullySanitized ? accentGreen : accentRed}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isFullySanitized ? accentGreen : accentRed,
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
              METADATA_SCRUBBER // MAT2 & EXIFTOOL
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              Zero-Trace Forensics Stripper & GPS Scrubber
            </div>
          </div>
        </div>

        {/* Dynamic Security Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 999,
            backgroundColor: isFullySanitized ? `${accentGreen}18` : `${accentRed}18`,
            border: `1px solid ${isFullySanitized ? accentGreen : accentRed}50`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isFullySanitized ? accentGreen : accentRed,
              boxShadow: `0 0 10px ${isFullySanitized ? accentGreen : accentRed}`,
            }}
          />
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 12,
              fontWeight: 700,
              color: isFullySanitized ? accentGreen : accentRed,
            }}
          >
            {isFullySanitized
              ? '100% SANITIZED // ANONYMOUS'
              : `${4 - totalPurgedCount} PRIVACY LEAKS DETECTED`}
          </span>
        </div>
      </div>

      {/* Main Content Area (Two Columns: Asset Preview + Inspector List) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: 20,
          padding: '20px 24px',
          overflow: 'hidden',
        }}
      >
        {/* Left Column: Asset Card Preview */}
        <div
          style={{
            width: 260,
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Simulated Image Thumbnail with Cyber HUD Overlay */}
          <div
            style={{
              height: 160,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* SVG Visual Graphic in Photo Window */}
            <svg width="100%" height="100%" viewBox="0 0 240 150">
              <defs>
                <linearGradient id="photoSky" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="60%" stopColor="#4338ca" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
              <rect width="240" height="150" fill="url(#photoSky)" />
              {/* Sun / Moon */}
              <circle cx="120" cy="85" r="28" fill="#fbbf24" opacity="0.85" />
              {/* Mountain silhouettes */}
              <polygon points="0,150 70,80 140,150" fill="#0f172a" opacity="0.9" />
              <polygon points="90,150 170,95 240,150" fill="#090d16" />
              <polygon points="40,150 120,110 200,150" fill="#1e293b" opacity="0.6" />
            </svg>

            {/* Privacy Badge overlay */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                padding: '3px 8px',
                borderRadius: 6,
                backgroundColor: isFullySanitized
                  ? 'rgba(16, 185, 129, 0.9)'
                  : 'rgba(244, 63, 94, 0.9)',
                color: '#ffffff',
                fontSize: 10,
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              {isFullySanitized ? 'SAFE' : 'UNSAFE'}
            </div>
          </div>

          {/* File Metadata Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 12,
                fontWeight: 700,
                color: '#f8fafc',
                wordBreak: 'break-all',
              }}
            >
              {fileName}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{fileDimensions}</div>
          </div>

          {/* Sanitizer Progress Indicator */}
          <div
            style={{
              marginTop: 'auto',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 10,
              padding: '10px 12px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10,
                fontFamily: '"JetBrains Mono", monospace',
                color: '#94a3b8',
              }}
            >
              <span>CLEANING PROGRESS</span>
              <span style={{ color: isFullySanitized ? accentGreen : '#38bdf8' }}>
                {totalPurgedCount} / 4
              </span>
            </div>
            <div
              style={{
                height: 5,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(totalPurgedCount / 4) * 100}%`,
                  backgroundColor: isFullySanitized ? accentGreen : '#38bdf8',
                  borderRadius: 999,
                  transition: 'all 0.2s',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: EXIF Inspector List with Laser Trash Sweeper */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            overflow: 'hidden',
          }}
        >
          {/* Laser Scanner Sweep Line */}
          {sweepProgress > 0 && sweepProgress < 1 && (
            <div
              style={{
                position: 'absolute',
                top: laserTop,
                left: 0,
                right: 0,
                height: 3,
                backgroundColor: '#38bdf8',
                boxShadow:
                  '0 0 16px 3px rgba(56, 189, 248, 0.8), 0 0 32px 6px rgba(16, 185, 129, 0.5)',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              {/* Trash icon broom badge riding laser */}
              <div
                style={{
                  position: 'absolute',
                  right: 14,
                  top: -12,
                  backgroundColor: '#0f172a',
                  border: '1px solid #38bdf8',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 10,
                  fontFamily: '"JetBrains Mono", monospace',
                  color: '#38bdf8',
                  fontWeight: 700,
                }}
              >
                SWEEPING EXIF...
              </div>
            </div>
          )}

          {/* Row 1: GPS Coordinates */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              backgroundColor: isRow1Purged
                ? 'rgba(16, 185, 129, 0.04)'
                : 'rgba(244, 63, 94, 0.08)',
              border: `1px solid ${isRow1Purged ? `${accentGreen}30` : `${accentRed}40`}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                  color: isRow1Purged ? '#94a3b8' : '#f87171',
                }}
              >
                GPS_GEOLOCATION // EXIF TAG 0x8825
              </div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 13,
                  fontWeight: 600,
                  color: isRow1Purged ? '#475569' : '#f1f5f9',
                  textDecoration: isRow1Purged ? 'line-through' : 'none',
                }}
              >
                {isRow1Purged ? '0.0000° N, 0.0000° E [STRIPPED]' : gpsCoordinates}
              </div>
            </div>
            <div
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: isRow1Purged
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(244, 63, 94, 0.2)',
                border: `1px solid ${isRow1Purged ? accentGreen : accentRed}`,
                fontSize: 10,
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                color: isRow1Purged ? accentGreen : accentRed,
              }}
            >
              {isRow1Purged ? 'WIPED' : 'EXPOSED'}
            </div>
          </div>

          {/* Row 2: Camera Serial Number */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              backgroundColor: isRow2Purged
                ? 'rgba(16, 185, 129, 0.04)'
                : 'rgba(244, 63, 94, 0.08)',
              border: `1px solid ${isRow2Purged ? `${accentGreen}30` : `${accentRed}40`}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                  color: isRow2Purged ? '#94a3b8' : '#f87171',
                }}
              >
                HARDWARE_BODY_SERIAL // EXIF TAG 0xA431
              </div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 13,
                  fontWeight: 600,
                  color: isRow2Purged ? '#475569' : '#f1f5f9',
                  textDecoration: isRow2Purged ? 'line-through' : 'none',
                }}
              >
                {isRow2Purged ? '[PURGED FROM MAKERNOTE]' : serialNumber}
              </div>
            </div>
            <div
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: isRow2Purged
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(244, 63, 94, 0.2)',
                border: `1px solid ${isRow2Purged ? accentGreen : accentRed}`,
                fontSize: 10,
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                color: isRow2Purged ? accentGreen : accentRed,
              }}
            >
              {isRow2Purged ? 'WIPED' : 'EXPOSED'}
            </div>
          </div>

          {/* Row 3: Author / Username Tag */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              backgroundColor: isRow3Purged
                ? 'rgba(16, 185, 129, 0.04)'
                : 'rgba(244, 63, 94, 0.08)',
              border: `1px solid ${isRow3Purged ? `${accentGreen}30` : `${accentRed}40`}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                  color: isRow3Purged ? '#94a3b8' : '#f87171',
                }}
              >
                OWNER_IDENTIFIER // IPTC BY-LINE & USER
              </div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 13,
                  fontWeight: 600,
                  color: isRow3Purged ? '#475569' : '#f1f5f9',
                  textDecoration: isRow3Purged ? 'line-through' : 'none',
                }}
              >
                {isRow3Purged ? '[ANONYMOUS ENTITY]' : authorTag}
              </div>
            </div>
            <div
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: isRow3Purged
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(244, 63, 94, 0.2)',
                border: `1px solid ${isRow3Purged ? accentGreen : accentRed}`,
                fontSize: 10,
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                color: isRow3Purged ? accentGreen : accentRed,
              }}
            >
              {isRow3Purged ? 'WIPED' : 'EXPOSED'}
            </div>
          </div>

          {/* Row 4: Camera Model & Lens Timestamp */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              backgroundColor: isRow4Purged
                ? 'rgba(16, 185, 129, 0.04)'
                : 'rgba(244, 63, 94, 0.08)',
              border: `1px solid ${isRow4Purged ? `${accentGreen}30` : `${accentRed}40`}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                  color: isRow4Purged ? '#94a3b8' : '#f87171',
                }}
              >
                TIMESTAMP & LENS PROFILE // XMP BLOCK
              </div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 13,
                  fontWeight: 600,
                  color: isRow4Purged ? '#475569' : '#f1f5f9',
                  textDecoration: isRow4Purged ? 'line-through' : 'none',
                }}
              >
                {isRow4Purged ? '1970-01-01 00:00:00 UTC [ZEROED]' : cameraModel}
              </div>
            </div>
            <div
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: isRow4Purged
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(244, 63, 94, 0.2)',
                border: `1px solid ${isRow4Purged ? accentGreen : accentRed}`,
                fontSize: 10,
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                color: isRow4Purged ? accentGreen : accentRed,
              }}
            >
              {isRow4Purged ? 'WIPED' : 'EXPOSED'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Status */}
      <div
        style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#38bdf8' }}>🛡️</span>
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              color: '#94a3b8',
            }}
          >
            Zero-Knowledge In-Memory Scrubbing: 4,188 bytes stripped safely
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              fontSize: 11,
              fontFamily: '"JetBrains Mono", monospace',
              color: '#cbd5e1',
            }}
          >
            100% Local / No Cloud
          </span>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: 11,
              fontFamily: '"JetBrains Mono", monospace',
              color: accentGreen,
              fontWeight: 600,
            }}
          >
            FOSS GPLv3
          </span>
        </div>
      </div>
    </div>
  );
};
