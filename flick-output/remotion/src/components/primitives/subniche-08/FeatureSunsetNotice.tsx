import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DeprecationTimelineItem {
  date: string;
  milestone: string;
  status: 'passed' | 'current' | 'future';
}

export interface FeatureSunsetNoticeProps {
  featureName?: string;
  categoryTag?: string;
  sunsetDate?: string;
  daysRemaining?: number;
  newRequirement?: string;
  recommendedAction?: string;
  timeline?: DeprecationTimelineItem[];
  stampText?: string;
  width?: number;
  height?: number;
}

const DEFAULT_TIMELINE: DeprecationTimelineItem[] = [
  { date: 'Oct 01', milestone: 'Deprecation banner added to settings', status: 'passed' },
  { date: 'Oct 24', milestone: 'Free webhook frequency throttled to 1/hr', status: 'current' },
  { date: 'Nov 01', milestone: 'Complete feature shutdown (HTTP 402 Paywall)', status: 'future' },
];

export const FeatureSunsetNotice: React.FC<FeatureSunsetNoticeProps> = ({
  featureName = 'Automated Webhooks & Real-Time Sync',
  categoryTag = 'CORE PLATFORM CAPABILITY',
  sunsetDate = 'November 1, 2026',
  daysRemaining = 7,
  newRequirement = 'Enterprise Plan Tier Required ($499/mo min)',
  recommendedAction = 'Migrate payloads to self-hosted webhook listener or upgrade account',
  timeline = DEFAULT_TIMELINE,
  stampText = 'OFFICIALLY SUNSET',
  width = 900,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.92, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [25, 0]);

  // Grayscale desaturation transition for the feature icon & card
  // Starts vibrant, then drains color around frame 20-50
  const grayscaleFactor = interpolate(frame, [18, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const iconVibrance = interpolate(grayscaleFactor, [0, 1], [1, 0.25]);

  // Rubber stamp animation: slams down at frame 42
  const stampSpring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.9 },
  });

  const stampScale = interpolate(stampSpring, [0, 1], [2.6, 1]);
  const stampOpacity = interpolate(stampSpring, [0, 0.3, 1], [0, 0.9, 1]);
  const stampShake = Math.sin(stampSpring * Math.PI * 4) * (1 - stampSpring) * 6;

  // Pulse alert for the days remaining badge
  const pulseAlert = 1 + Math.sin(frame * 0.18) * 0.04;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 27, 40, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 25px 65px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(220, 38, 38, 0.15)',
        padding: '24px 30px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background subtle diagonal warning stripes */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background:
            'repeating-linear-gradient(45deg, #ef4444, #ef4444 12px, #b91c1c 12px, #b91c1c 24px)',
        }}
      />

      {/* Top Banner Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          marginTop: 6,
          marginBottom: 18,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.18)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              fontSize: 11,
              fontWeight: 800,
              color: '#f87171',
              letterSpacing: '0.06em',
            }}
          >
            END-OF-LIFE NOTICE
          </div>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>
            Official SaaS Lifecycle Deprecation Advisory
          </span>
        </div>

        {/* Days Remaining Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 9999,
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            transform: `scale(${pulseAlert})`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              boxShadow: '0 0 8px #ef4444',
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#fca5a5' }}>
            {daysRemaining} DAYS UNTIL RETIREMENT
          </span>
        </div>
      </div>

      {/* Hero Feature Deprecation Showcase Box */}
      <div
        style={{
          position: 'relative',
          borderRadius: 18,
          background: 'rgba(2, 6, 23, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '22px 26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Animated Vibrant-to-Grayscale Feature Icon */}
          <div
            style={{
              position: 'relative',
              width: 76,
              height: 76,
              borderRadius: 20,
              background: `linear-gradient(135deg, hsl(${interpolate(
                grayscaleFactor,
                [0, 1],
                [210, 0]
              )}, ${interpolate(grayscaleFactor, [0, 1], [100, 0])}%, 50%) 0%, hsl(${interpolate(
                grayscaleFactor,
                [0, 1],
                [270, 0]
              )}, ${interpolate(grayscaleFactor, [0, 1], [90, 0])}%, 40%) 100%)`,
              filter: `grayscale(${grayscaleFactor * 100}%) contrast(${interpolate(
                grayscaleFactor,
                [0, 1],
                [1.1, 0.8]
              )})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 ${interpolate(grayscaleFactor, [0, 1], [25, 0])}px rgba(56, 189, 248, ${iconVibrance * 0.5})`,
              transition: 'all 0.1s ease',
            }}
          >
            {/* Webhook / Lightning Bolt SVG */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>

          {/* Feature Titles */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {categoryTag}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: interpolate(grayscaleFactor, [0, 1], [1, 0]) > 0.5 ? '#ffffff' : '#94a3b8',
                marginTop: 3,
                textDecoration: grayscaleFactor > 0.8 ? 'line-through' : 'none',
                textDecorationColor: '#ef4444',
                textDecorationThickness: '3px',
              }}
            >
              {featureName}
            </div>
            <div style={{ fontSize: 13, color: '#f87171', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>{newRequirement}</span>
            </div>
          </div>
        </div>

        {/* Big Official Rubber Stamp Slam */}
        {stampSpring > 0 && (
          <div
            style={{
              position: 'absolute',
              right: 32,
              top: '50%',
              transform: `translateY(-50%) rotate(${-12 + stampShake}deg) scale(${stampScale})`,
              opacity: stampOpacity,
              padding: '10px 22px',
              border: '4px dashed #ef4444',
              borderRadius: 12,
              color: '#ef4444',
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              fontSize: 28,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: 'rgba(239, 68, 68, 0.14)',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 15px rgba(239, 68, 68, 0.2)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            {stampText}
            <div
              style={{
                fontSize: 10,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                letterSpacing: '0.15em',
                textAlign: 'center',
                marginTop: 2,
                color: '#fca5a5',
              }}
            >
              EFFECTIVE: {sunsetDate.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Deprecation Stage Timeline */}
      <div
        style={{
          borderRadius: 14,
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 20px',
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          zIndex: 2,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Retirement Phasing Schedule:
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {timeline.map((item, idx) => {
            const isPassed = item.status === 'passed';
            const isCurrent = item.status === 'current';

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: isCurrent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(2, 6, 23, 0.4)',
                  border: isCurrent
                    ? '1px solid rgba(239, 68, 68, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: isCurrent ? '#f87171' : isPassed ? '#64748b' : '#38bdf8' }}>
                    {item.date}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: isCurrent ? '#ef4444' : isPassed ? 'rgba(100, 116, 139, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                      color: isCurrent ? '#ffffff' : isPassed ? '#94a3b8' : '#38bdf8',
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: isCurrent ? '#ffffff' : '#cbd5e1', lineHeight: 1.35 }}>
                  {item.milestone}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Next Steps / Migration Callout */}
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          borderRadius: 12,
          background: 'rgba(2, 6, 23, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: 12,
          color: '#cbd5e1',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <div>
            <span style={{ color: '#fbbf24', fontWeight: 600 }}>Fallback Recommendation: </span>
            <span>{recommendedAction}</span>
          </div>
        </div>

        <div style={{ color: '#ef4444', fontWeight: 700 }}>
          CODE 402 READY
        </div>
      </div>
    </div>
  );
};
