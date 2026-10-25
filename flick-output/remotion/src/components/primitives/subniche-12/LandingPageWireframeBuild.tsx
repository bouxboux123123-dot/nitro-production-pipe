import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WireframeElement {
  id: string;
  name: string;
  type: 'nav' | 'headline' | 'subtext' | 'form' | 'button' | 'socialProof';
  order: number;
}

export interface LandingPageWireframeBuildProps {
  title?: string;
  subtitle?: string;
  headlineText?: string;
  subheadlineText?: string;
  ctaText?: string;
  placeholderText?: string;
  width?: number;
  height?: number;
}

export const LandingPageWireframeBuild: React.FC<LandingPageWireframeBuildProps> = ({
  title = 'RAPID MVP WIREFRAME BUILD',
  subtitle = 'Zero-code landing page auto-assembled in 3.0s',
  headlineText = 'Deploy AI Workflows In Minutes, Not Months',
  subheadlineText = 'Validate your value proposition with real customer intent signals before writing backend code.',
  ctaText = 'Claim Early Access ➔',
  placeholderText = 'founder@stealthstartup.io',
  width = 900,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master card entrance
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 110, mass: 0.8 },
  });
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(cardSpring, [0, 1], [0.94, 1]);

  // Stage 1: Blueprint Grid Scanning Line (frames 5 to 70)
  const scanProgress = interpolate(frame, [5, 65], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Stage 2: Elements assembly sequence
  // 1. Browser/Canvas Chrome & Grid
  const gridAlpha = interpolate(frame, [0, 20], [0, 0.4], { extrapolateRight: 'clamp' });

  // 2. Nav bar snap
  const navSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const navY = interpolate(navSpring, [0, 1], [-20, 0]);
  const navOpacity = interpolate(navSpring, [0, 1], [0, 1]);

  // 3. Category / Pill Tag snap
  const tagSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 13, stiffness: 150 },
  });
  const tagScale = interpolate(tagSpring, [0, 1], [0.6, 1]);
  const tagOpacity = interpolate(tagSpring, [0, 1], [0, 1]);

  // 4. Headline text assembling
  const headlineSpring = spring({
    frame: frame - 32,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const headlineY = interpolate(headlineSpring, [0, 1], [30, 0]);
  const headlineOpacity = interpolate(headlineSpring, [0, 1], [0, 1]);

  // 5. Subcopy
  const subcopySpring = spring({
    frame: frame - 42,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const subcopyY = interpolate(subcopySpring, [0, 1], [25, 0]);
  const subcopyOpacity = interpolate(subcopySpring, [0, 1], [0, 1]);

  // 6. Form input box assembly
  const formSpring = spring({
    frame: frame - 52,
    fps,
    config: { damping: 13, stiffness: 130 },
  });
  const formScale = interpolate(formSpring, [0, 1], [0.85, 1]);
  const formOpacity = interpolate(formSpring, [0, 1], [0, 1]);

  // 7. CTA button punch
  const ctaSpring = spring({
    frame: frame - 62,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.5, 1]);
  const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1]);

  // 8. Social proof & speed badge
  const footerSpring = spring({
    frame: frame - 72,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const footerOpacity = interpolate(footerSpring, [0, 1], [0, 1]);

  // Typing cursor blink
  const cursorBlink = Math.sin(frame * 0.3) > 0 ? 1 : 0;

  // Build time timer
  const buildElapsed = Math.min(3.0, Number((frame / fps).toFixed(1)));
  const buildStatus = frame < 65 ? 'GENERATING WIREFRAME...' : 'WIREFRAME READY FOR TRAFFIC';

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
        borderRadius: 20,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.88))',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.12)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        color: '#F8FAFC',
      }}
    >
      {/* Background blueprint subtle grid lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, ${gridAlpha * 0.15}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, ${gridAlpha * 0.15}) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }}
      />

      {/* Blueprint Laser Scan Ray */}
      {frame >= 5 && frame <= 75 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${scanProgress}%`,
            width: '3px',
            background: 'linear-gradient(to bottom, rgba(56, 189, 248, 0), #38BDF8 50%, rgba(56, 189, 248, 0))',
            boxShadow: '0 0 18px #38BDF8, 0 0 32px #0EA5E9',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}

      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.3))',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', color: '#38BDF8', textTransform: 'uppercase' }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>{subtitle}</div>
          </div>
        </div>

        {/* Live Build Clock */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 999,
            backgroundColor: frame >= 65 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.12)',
            border: `1px solid ${frame >= 65 ? 'rgba(34, 197, 94, 0.35)' : 'rgba(56, 189, 248, 0.3)'}`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: frame >= 65 ? '#22C55E' : '#38BDF8',
              boxShadow: `0 0 10px ${frame >= 65 ? '#22C55E' : '#38BDF8'}`,
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 700, color: frame >= 65 ? '#4ADE80' : '#7DD3FC' }}>
            {buildStatus} ({buildElapsed}s)
          </span>
        </div>
      </div>

      {/* Mock Browser / Wireframe Surface */}
      <div
        style={{
          flex: 1,
          borderRadius: 14,
          backgroundColor: 'rgba(2, 6, 23, 0.75)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        {/* Browser Top Bar */}
        <div
          style={{
            height: 38,
            borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>
          <div
            style={{
              padding: '3px 20px',
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: 11,
              color: '#64748B',
              letterSpacing: '0.04em',
            }}
          >
            https://mvp-quick-test.dev/preview
          </div>
          <div style={{ fontSize: 11, color: '#38BDF8', fontWeight: 600 }}>v0.1-alpha</div>
        </div>

        {/* Wireframe Body Content Area */}
        <div
          style={{
            flex: 1,
            padding: '24px 36px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Wireframe Mock Nav */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 28,
              right: 28,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: navOpacity,
              transform: `translateY(${navY}px)`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, #38BDF8, #6366F1)',
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>AeroPulse.ai</span>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ width: 50, height: 8, borderRadius: 4, backgroundColor: 'rgba(148, 163, 184, 0.25)' }} />
              <div style={{ width: 44, height: 8, borderRadius: 4, backgroundColor: 'rgba(148, 163, 184, 0.25)' }} />
              <div style={{ width: 62, height: 8, borderRadius: 4, backgroundColor: 'rgba(148, 163, 184, 0.25)' }} />
            </div>
            <div
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                fontSize: 11,
                color: '#38BDF8',
                fontWeight: 600,
              }}
            >
              Sign In
            </div>
          </div>

          {/* Value Prop Pill */}
          <div
            style={{
              opacity: tagOpacity,
              transform: `scale(${tagScale})`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 14px',
              borderRadius: 999,
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              color: '#A5B4FC',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.05em',
              marginBottom: 16,
              marginTop: 18,
            }}
          >
            <span>⚡</span>
            <span>HIGH-CONVERSION LEAN LANDING PAGE</span>
          </div>

          {/* Headline Text */}
          <h1
            style={{
              margin: 0,
              opacity: headlineOpacity,
              transform: `translateY(${headlineY}px)`,
              fontSize: 27,
              lineHeight: 1.25,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              maxWidth: 680,
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            {headlineText}
          </h1>

          {/* Subtext */}
          <p
            style={{
              margin: '12px 0 22px 0',
              opacity: subcopyOpacity,
              transform: `translateY(${subcopyY}px)`,
              fontSize: 13.5,
              lineHeight: 1.5,
              color: '#94A3B8',
              maxWidth: 580,
            }}
          >
            {subheadlineText}
          </p>

          {/* Input + CTA Form Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              maxWidth: 520,
              width: '100%',
              opacity: formOpacity,
              transform: `scale(${formScale})`,
            }}
          >
            {/* Input Field */}
            <div
              style={{
                flex: 1,
                height: 46,
                borderRadius: 10,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid rgba(56, 189, 248, 0.4)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
                gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span style={{ fontSize: 13, color: '#94A3B8' }}>{placeholderText}</span>
              <span
                style={{
                  display: 'inline-block',
                  width: 2,
                  height: 16,
                  backgroundColor: '#38BDF8',
                  opacity: cursorBlink,
                  marginLeft: 1,
                }}
              />
            </div>

            {/* CTA Button */}
            <div
              style={{
                opacity: ctaOpacity,
                transform: `scale(${ctaScale})`,
                height: 46,
                padding: '0 20px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 0 20px rgba(14, 165, 233, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13,
                color: '#FFFFFF',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {ctaText}
            </div>
          </div>

          {/* Micro Social Proof / Badges */}
          <div
            style={{
              opacity: footerOpacity,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginTop: 18,
              fontSize: 11.5,
              color: '#64748B',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#22C55E' }}>✓</span>
              <span>No Credit Card Required</span>
            </div>
            <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#475569' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#38BDF8' }}>⚡</span>
              <span>Stripe + Supabase Plugged</span>
            </div>
            <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#475569' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#F59E0B' }}>★</span>
              <span>Instant Viral Waitlist</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Technical Status Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 14,
          fontSize: 11.5,
          color: '#64748B',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <span>Framework: <strong style={{ color: '#94A3B8' }}>Next.js 14 App Router</strong></span>
          <span>Hosting: <strong style={{ color: '#94A3B8' }}>Edge Cloud</strong></span>
          <span>Analytics: <strong style={{ color: '#94A3B8' }}>PostHog Events Active</strong></span>
        </div>
        <div style={{ color: '#38BDF8', fontWeight: 600 }}>
          Sprint: Day 1 of 3
        </div>
      </div>
    </div>
  );
};
