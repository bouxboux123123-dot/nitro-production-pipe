import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FOSSAlternativeVersusProps {
  saasName?: string;
  saasPrice?: string;
  saasDrawbacks?: string[];
  fossName?: string;
  fossReleaseTag?: string;
  fossStars?: string;
  fossLicense?: string;
  fossHighlights?: string[];
  annualSavings?: number;
  accentRed?: string;
  accentGreen?: string;
}

export const FOSSAlternativeVersus: React.FC<FOSSAlternativeVersusProps> = ({
  saasName = 'Proprietary Cloud Converter',
  saasPrice = '$49 / mo',
  saasDrawbacks = [
    '25 File Daily Upload Cap',
    'Telemetry & User Tracking Active',
    'Recurring $588 / Year Lock-in',
    'Cloud Server Queue Delays',
  ],
  fossName = 'FOSS Community Engine',
  fossReleaseTag = 'v2.8.4 Stable',
  fossStars = '18.4k',
  fossLicense = 'GPL-3.0',
  fossHighlights = [
    '100% Unlimited Local Execution',
    'Zero Telemetry / No Tracking',
    '$0 Forever / No Credit Card',
    'Direct NVENC Hardware Accel',
  ],
  annualSavings = 588,
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

  // Stamp appearance for "REPLACED"
  const stampScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const stampOpacity = interpolate(frame, [25, 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Savings ticker animation
  const savingsProgress = interpolate(frame, [20, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentSavings = Math.round(savingsProgress * annualSavings);

  // Pulse effect on the FOSS card
  const pulseGlow = 0.4 + 0.2 * Math.sin((frame / 20) * Math.PI);

  return (
    <div
      style={{
        width: 900,
        height: 600,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 24,
        boxShadow: `0 24px 64px -12px rgba(0, 0, 0, 0.7), 0 0 32px -4px ${accentGreen}20`,
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
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentGreen,
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
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
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
              WORKFLOW_SOVEREIGNTY // SAAS vs FOSS
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              Eliminate Subscription Overhead With Local-First Tools
            </div>
          </div>
        </div>

        {/* Live Savings Counter Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 999,
            backgroundColor: `${accentGreen}18`,
            border: `1px solid ${accentGreen}50`,
          }}
        >
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 13,
              fontWeight: 800,
              color: accentGreen,
              textShadow: `0 0 10px ${accentGreen}80`,
            }}
          >
            +${currentSavings} / YR SAVED
          </span>
        </div>
      </div>

      {/* Main Dual Cards Comparison Pane */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 60px 1fr',
          padding: '20px 24px',
          gap: 12,
          alignItems: 'stretch',
          position: 'relative',
        }}
      >
        {/* LEFT CARD: Expensive SaaS Monopoly */}
        <div
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.35)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: 18,
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Card Top: Name & Price */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                  color: '#f87171',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                CLOSED PROPRIETARY
              </span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                  fontSize: 10,
                  fontFamily: '"JetBrains Mono", monospace',
                  color: '#f87171',
                  fontWeight: 700,
                }}
              >
                LOCKED
              </span>
            </div>

            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#e2e8f0',
                marginBottom: 4,
              }}
            >
              {saasName}
            </div>

            {/* Price tag */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '8px 0 16px 0' }}>
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 28,
                  fontWeight: 900,
                  color: '#f43f5e',
                  textDecoration: frame > 30 ? 'line-through' : 'none',
                  opacity: frame > 30 ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {saasPrice}
              </span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>billed monthly</span>
            </div>

            {/* Drawbacks List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {saasDrawbacks.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    color: '#94a3b8',
                  }}
                >
                  <span style={{ color: '#f43f5e', fontWeight: 800, fontSize: 13 }}>✕</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strikethrough Watermark Stamp */}
          {frame >= 25 && (
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(-14deg) scale(${stampScale})`,
                opacity: stampOpacity,
                padding: '6px 18px',
                border: '3px solid #ef4444',
                borderRadius: 8,
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                color: '#ef4444',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: '0.12em',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              CANCELLED
            </div>
          )}
        </div>

        {/* MIDDLE: Animated VS Center Divider */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Vertical subtle connector line */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              bottom: 10,
              width: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            }}
          />

          {/* VS Center Badge */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#0f172a',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
              zIndex: 3,
            }}
          >
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 12,
                fontWeight: 900,
                color: '#e2e8f0',
              }}
            >
              VS
            </span>
          </div>
        </div>

        {/* RIGHT CARD: 100% Free Open-Source Sovereign */}
        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.06)',
            border: `1px solid rgba(16, 185, 129, ${pulseGlow})`,
            borderRadius: 18,
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 0 24px -4px ${accentGreen}20`,
          }}
        >
          {/* Card Top: Release Badge & Free Price */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              {/* GitHub Stars Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '2px 8px',
                  borderRadius: 6,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  fontSize: 10,
                  fontFamily: '"JetBrains Mono", monospace',
                  color: '#f8fafc',
                  fontWeight: 600,
                }}
              >
                <span>⭐</span>
                <span>{fossStars} stars</span>
              </div>

              {/* License Badge */}
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontSize: 10,
                  fontFamily: '"JetBrains Mono", monospace',
                  color: accentGreen,
                  fontWeight: 700,
                }}
              >
                {fossLicense}
              </span>
            </div>

            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#f8fafc',
                marginBottom: 4,
              }}
            >
              {fossName}
            </div>

            {/* Price Hero Tag */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '8px 0 16px 0' }}>
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 28,
                  fontWeight: 900,
                  color: '#34d399',
                  textShadow: '0 0 16px rgba(52, 211, 153, 0.6)',
                }}
              >
                $0
              </span>
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 12,
                  fontWeight: 700,
                  color: accentGreen,
                  letterSpacing: '0.04em',
                }}
              >
                FOREVER FREE
              </span>
            </div>

            {/* Highlights List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {fossHighlights.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    color: '#e2e8f0',
                  }}
                >
                  <span style={{ color: accentGreen, fontWeight: 800, fontSize: 13 }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Release Pill */}
          <div
            style={{
              marginTop: 14,
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              borderRadius: 10,
              padding: '8px 12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* GitHub Octocat SVG */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#cbd5e1">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#94a3b8',
                }}
              >
                Release {fossReleaseTag}
              </span>
            </div>

            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                fontWeight: 700,
                color: accentGreen,
              }}
            >
              CLONE & RUN
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Action */}
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
          <span style={{ fontSize: 13, color: accentGreen }}>⚡</span>
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              color: '#94a3b8',
            }}
          >
            Digital Sovereignty: Zero vendor lock-in, zero cloud telemetry, infinite speed
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              fontSize: 11,
              fontFamily: '"JetBrains Mono", monospace',
              color: accentGreen,
              fontWeight: 700,
            }}
          >
            FREE SOFTWARE FOUNDATION
          </span>
        </div>
      </div>
    </div>
  );
};
