import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WelcomeDeckAutoPersonalizerProps {
  clientName?: string;
  brandColor?: string;
  kickoffDate?: string;
  deckTitle?: string;
  slideCount?: number;
  compilationSpeedSec?: number;
  agencyName?: string;
  width?: number;
  height?: number;
}

export const WelcomeDeckAutoPersonalizer: React.FC<WelcomeDeckAutoPersonalizerProps> = ({
  clientName = 'Apex Peak Ventures',
  brandColor = '#06b6d4',
  kickoffDate = 'Nov 02, 2026',
  deckTitle = 'Growth Architecture & Media Sprint Roadmap',
  slideCount = 36,
  compilationSpeedSec = 1.4,
  agencyName = 'Horizon Growth Systems',
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master card entrance
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const cardScale = interpolate(cardSpring, [0, 1], [0.88, 1]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  // Deck preview pop-in
  const deckSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const deckScale = interpolate(deckSpring, [0, 1], [0.9, 1]);
  const deckOpacity = interpolate(deckSpring, [0, 1], [0, 1]);

  // Variable injection pulse
  const variablePulse = (Math.sin((frame / fps) * Math.PI * 3) + 1) / 2;
  const glowStrength = interpolate(variablePulse, [0, 1], [10, 24]);

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
          'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(13, 20, 38, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(6, 182, 212, 0.35)',
        boxShadow:
          '0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 45px rgba(6, 182, 212, 0.16)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -40,
          width: 420,
          height: 260,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${brandColor}2b 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -70,
          left: -30,
          width: 380,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, transparent 70%)',
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
          paddingBottom: 14,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${brandColor}, #3b82f6)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 16px ${brandColor}66`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#ffffff' }}>
                Welcome Deck Dynamic Personalizer
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: brandColor,
                  background: `${brandColor}22`,
                  padding: '2px 8px',
                  borderRadius: 8,
                  border: `1px solid ${brandColor}55`,
                }}
              >
                TEMPLATE ENGINE 2.0
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
              Dynamic Token Injection • {slideCount} Master Slides Generated in {compilationSpeedSec}s
            </div>
          </div>
        </div>

        {/* Compile status */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 10,
            background: 'rgba(15, 23, 42, 0.75)',
            border: `1px solid ${brandColor}44`,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80' }}>
            {slideCount}/{slideCount} SLIDES COMPILED
          </span>
        </div>
      </div>

      {/* Main Layout: Left Variable Feed, Right Slide Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.35fr', gap: 16, flex: 1 }}>
        {/* Left Side: Dynamic Variable Injections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em' }}>
            VARIABLE INJECTION TOKENS
          </div>

          {/* Token 1: Client Name */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.55)',
              border: '1px solid rgba(148, 163, 184, 0.16)',
              borderRadius: 12,
              padding: '10px 14px',
            }}
          >
            <div style={{ fontSize: 10, color: '#06b6d4', fontWeight: 800, fontFamily: 'monospace' }}>
              {`{{CLIENT_NAME}}`}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>
              {clientName}
            </div>
          </div>

          {/* Token 2: Brand Color Hex */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.55)',
              border: '1px solid rgba(148, 163, 184, 0.16)',
              borderRadius: 12,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: '#06b6d4', fontWeight: 800, fontFamily: 'monospace' }}>
                {`{{BRAND_ACCENT_COLOR}}`}
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>
                {brandColor}
              </div>
            </div>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: brandColor,
                boxShadow: `0 0 ${glowStrength}px ${brandColor}`,
                border: '2px solid rgba(255, 255, 255, 0.8)',
              }}
            />
          </div>

          {/* Token 3: Kickoff Date */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.55)',
              border: '1px solid rgba(148, 163, 184, 0.16)',
              borderRadius: 12,
              padding: '10px 14px',
            }}
          >
            <div style={{ fontSize: 10, color: '#06b6d4', fontWeight: 800, fontFamily: 'monospace' }}>
              {`{{KICKOFF_SPRINT_DATE}}`}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>
              {kickoffDate}
            </div>
          </div>

          {/* Token 4: Deck Scope */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.55)',
              border: '1px solid rgba(148, 163, 184, 0.16)',
              borderRadius: 12,
              padding: '10px 14px',
            }}
          >
            <div style={{ fontSize: 10, color: '#06b6d4', fontWeight: 800, fontFamily: 'monospace' }}>
              {`{{DELIVERABLE_SCOPE}}`}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginTop: 2 }}>
              Paid Social, Search Restructure & Full Creative Suite
            </div>
          </div>
        </div>

        {/* Right Side: Live Deck Canvas Preview */}
        <div
          style={{
            opacity: deckOpacity,
            transform: `scale(${deckScale})`,
            background: 'rgba(15, 23, 42, 0.85)',
            border: `1.5px solid ${brandColor}66`,
            boxShadow: `0 15px 35px rgba(0, 0, 0, 0.7), 0 0 25px ${brandColor}22`,
            borderRadius: 16,
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle slide diagonal gradient accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${brandColor}, #6366f1, #ec4899)`,
            }}
          />

          {/* Deck Header */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: brandColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: 12,
                  }}
                >
                  ▲
                </span>
                <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.05em', color: '#ffffff' }}>
                  {clientName.toUpperCase()}
                </span>
              </div>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#94a3b8',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '3px 8px',
                  borderRadius: 6,
                }}
              >
                SLIDE 01 / {slideCount}
              </span>
            </div>

            {/* Slide Title */}
            <div style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', lineHeight: 1.25, marginBottom: 8 }}>
              {deckTitle}
            </div>

            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4, marginBottom: 16 }}>
              Prepared exclusively for the executive leadership of <strong style={{ color: '#f1f5f9' }}>{clientName}</strong> by {agencyName}.
            </div>

            {/* Injected Meta Row */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                background: 'rgba(30, 41, 59, 0.55)',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid rgba(148, 163, 184, 0.15)',
              }}
            >
              <div>
                <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>KICKOFF CALL</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: brandColor }}>{kickoffDate}</div>
              </div>
              <div style={{ width: 1, backgroundColor: 'rgba(148, 163, 184, 0.2)' }} />
              <div>
                <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>STRATEGY VERSION</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff' }}>v2.4 Final</div>
              </div>
            </div>
          </div>

          {/* Mini Slide Pager Strip */}
          <div
            style={{
              marginTop: 14,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: 10,
              display: 'flex',
              gap: 8,
            }}
          >
            {[
              { num: '01', title: 'Cover' },
              { num: '02', title: 'Audit' },
              { num: '03', title: 'Roadmap' },
              { num: '04', title: 'SLA' },
            ].map((slide, i) => (
              <div
                key={slide.num}
                style={{
                  flex: 1,
                  background: i === 0 ? `${brandColor}25` : 'rgba(30, 41, 59, 0.6)',
                  border: `1px solid ${i === 0 ? brandColor : 'rgba(148, 163, 184, 0.15)'}`,
                  borderRadius: 6,
                  padding: '6px 4px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 8, color: i === 0 ? brandColor : '#94a3b8', fontWeight: 800 }}>
                  {slide.num}
                </div>
                <div style={{ fontSize: 9, color: '#ffffff', fontWeight: 600 }}>
                  {slide.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
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
        <span>🎨 Deck PDF auto-generated and uploaded to Client Notion Portal</span>
        <span style={{ color: brandColor, fontWeight: 600 }}>Export Ready: PDF & Figma Link</span>
      </div>
    </div>
  );
};
