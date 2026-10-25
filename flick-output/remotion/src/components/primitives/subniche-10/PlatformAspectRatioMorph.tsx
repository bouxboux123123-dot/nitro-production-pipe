import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AspectFormat {
  id: 'landscape' | 'vertical' | 'square';
  label: string;
  ratio: string;
  resolution: string;
  destinations: string;
  iconType: string;
}

export interface PlatformAspectRatioMorphProps {
  title?: string;
  subtitle?: string;
  speakerName?: string;
  captionText?: string;
  width?: number;
  height?: number;
}

const FORMATS: AspectFormat[] = [
  {
    id: 'landscape',
    label: '16:9 Landscape',
    ratio: '1.78:1',
    resolution: '1920 × 1080',
    destinations: 'YouTube, Web, Vimeo',
    iconType: 'rect-wide',
  },
  {
    id: 'vertical',
    label: '9:16 Vertical',
    ratio: '0.56:1',
    resolution: '1080 × 1920',
    destinations: 'TikTok, IG Reels, YT Shorts',
    iconType: 'rect-tall',
  },
  {
    id: 'square',
    label: '1:1 Square',
    ratio: '1.00:1',
    resolution: '1080 × 1080',
    destinations: 'LinkedIn, X / Twitter Feed',
    iconType: 'rect-square',
  },
];

export const PlatformAspectRatioMorph: React.FC<PlatformAspectRatioMorphProps> = ({
  title = 'AI DYNAMIC ASPECT RATIO MORPH',
  subtitle = 'Zero-Black-Bar Auto-Framing & Active Subject Tracking',
  speakerName = 'Alex Rivera • Tech Founder',
  captionText = 'Here is how to automate your content engine with AI in 60 seconds.',
  width = 880,
  height = 640,
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
  const cardScale = interpolate(enterSpring, [0, 1], [0.93, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [24, 0]);

  // Morph timeline:
  // 0 - 38 frames: 16:9 Landscape
  // 38 - 62 frames: Transition to 9:16
  // 62 - 100 frames: 9:16 Vertical
  // 100 - 124 frames: Transition to 1:1 Square
  // 124+ frames: 1:1 Square

  // Active format calculation
  let activeFormatIndex = 0;
  if (frame >= 48 && frame < 110) {
    activeFormatIndex = 1;
  } else if (frame >= 110) {
    activeFormatIndex = 2;
  }
  const currentFormat = FORMATS[activeFormatIndex];

  // Dynamic preview box dimensions
  // 16:9 Landscape: 560 x 315
  // 9:16 Vertical: 190 x 338
  // 1:1 Square: 320 x 320
  const previewWidth = interpolate(
    frame,
    [0, 38, 62, 100, 124, 180],
    [560, 560, 200, 200, 320, 320],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const previewHeight = interpolate(
    frame,
    [0, 38, 62, 100, 124, 180],
    [315, 315, 340, 340, 320, 320],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Subject scale & zoom inside crop
  const subjectScale = interpolate(
    frame,
    [0, 38, 62, 100, 124, 180],
    [1.0, 1.0, 1.45, 1.45, 1.2, 1.2],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Face tracker pulse
  const faceTrackerPulse = 1 + Math.sin(frame / 6) * 0.05;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 24,
        background:
          'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.90) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow:
          '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.15)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient light */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          left: '35%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
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
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Morph icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="10" y1="4" x2="10" y2="20" strokeDasharray="2 2" />
              <line x1="14" y1="4" x2="14" y2="20" strokeDasharray="2 2" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {title}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                }}
              >
                ACTIVE FORMAT: {currentFormat.ratio}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              {subtitle}
            </div>
          </div>
        </div>

        {/* Live Resolution Readout Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '6px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: 10,
                color: '#94a3b8',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Resolution Matrix
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#38bdf8',
                fontFamily: 'monospace',
              }}
            >
              {currentFormat.resolution}
            </div>
          </div>
        </div>
      </div>

      {/* FORMAT SELECTOR TABS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        {FORMATS.map((fmt, idx) => {
          const isActive = idx === activeFormatIndex;
          return (
            <div
              key={fmt.id}
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                background: isActive
                  ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%)'
                  : 'rgba(15, 23, 42, 0.5)',
                border: isActive
                  ? '1.5px solid #38bdf8'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isActive ? '0 0 16px rgba(56, 189, 248, 0.2)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Mini shape indicator */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: isActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {fmt.id === 'landscape' && (
                    <div
                      style={{
                        width: 14,
                        height: 9,
                        border: `1.5px solid ${isActive ? '#0f172a' : '#94a3b8'}`,
                        borderRadius: 2,
                      }}
                    />
                  )}
                  {fmt.id === 'vertical' && (
                    <div
                      style={{
                        width: 9,
                        height: 14,
                        border: `1.5px solid ${isActive ? '#0f172a' : '#94a3b8'}`,
                        borderRadius: 2,
                      }}
                    />
                  )}
                  {fmt.id === 'square' && (
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        border: `1.5px solid ${isActive ? '#0f172a' : '#94a3b8'}`,
                        borderRadius: 2,
                      }}
                    />
                  )}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: isActive ? '#f8fafc' : '#94a3b8',
                    }}
                  >
                    {fmt.label}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>
                    {fmt.destinations}
                  </div>
                </div>
              </div>

              {isActive && (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.15)',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  ACTIVE
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* CENTRAL MORPHING VIEWPORT STAGE */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(10, 15, 30, 0.85)',
          borderRadius: 18,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          overflow: 'hidden',
          padding: 12,
        }}
      >
        {/* Stage Grid Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
          }}
        />

        {/* Outer 16:9 ghost container reference line */}
        <div
          style={{
            position: 'absolute',
            width: 560,
            height: 315,
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            borderRadius: 14,
            pointerEvents: 'none',
          }}
        />

        {/* Dynamic Morphing Frame */}
        <div
          style={{
            width: previewWidth,
            height: previewHeight,
            borderRadius: 14,
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid #38bdf8',
            boxShadow:
              '0 0 25px rgba(56, 189, 248, 0.35), inset 0 0 20px rgba(0,0,0,0.6)',
            background:
              'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 0.2s ease',
          }}
        >
          {/* Top Live Aspect watermark */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              padding: '3px 8px',
              borderRadius: 6,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 10,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                boxShadow: '0 0 6px #ef4444',
              }}
            />
            <span style={{ fontSize: 9, fontWeight: 700, color: '#f8fafc' }}>
              REC • {currentFormat.ratio}
            </span>
          </div>

          {/* Safe-zone overlays for 9:16 vertical mode */}
          {activeFormatIndex === 1 && (
            <>
              {/* Right rail TikTok/Shorts UI safe zone */}
              <div
                style={{
                  position: 'absolute',
                  top: 40,
                  right: 8,
                  bottom: 60,
                  width: 28,
                  border: '1px dashed rgba(244, 63, 94, 0.4)',
                  borderRadius: 6,
                  background: 'rgba(244, 63, 94, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  padding: '4px 0',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(244, 63, 94, 0.3)' }} />
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(244, 63, 94, 0.3)' }} />
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(244, 63, 94, 0.3)' }} />
              </div>
            </>
          )}

          {/* Speaker / Subject Avatar (Auto-Framed) */}
          <div
            style={{
              transform: `scale(${subjectScale})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              transition: 'transform 0.15s ease-out',
            }}
          >
            {/* Subject Face Tracking Bounding Box */}
            <div
              style={{
                position: 'relative',
                padding: 6,
                transform: `scale(${faceTrackerPulse})`,
              }}
            >
              {/* Corner crosshairs */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 8,
                  height: 8,
                  borderTop: '2px solid #38bdf8',
                  borderLeft: '2px solid #38bdf8',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 8,
                  height: 8,
                  borderTop: '2px solid #38bdf8',
                  borderRight: '2px solid #38bdf8',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 8,
                  height: 8,
                  borderBottom: '2px solid #38bdf8',
                  borderLeft: '2px solid #38bdf8',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 8,
                  height: 8,
                  borderBottom: '2px solid #38bdf8',
                  borderRight: '2px solid #38bdf8',
                }}
              />

              {/* Speaker Face Icon / Avatar */}
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)',
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              {/* Tracking HUD Tag */}
              <div
                style={{
                  position: 'absolute',
                  top: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: 7.5,
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: 3,
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.04em',
                }}
              >
                TRACKED [99.8%]
              </div>
            </div>

            {/* Speaker Name Tag */}
            <div
              style={{
                marginTop: 6,
                fontSize: 10,
                fontWeight: 700,
                color: '#e2e8f0',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {speakerName}
            </div>

            {/* Audio Waves Under Speaker */}
            <div
              style={{
                display: 'flex',
                gap: 2,
                marginTop: 4,
                alignItems: 'center',
              }}
            >
              {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((val, idx) => {
                const waveH = 4 + Math.sin((frame + idx * 4) / 4) * 6;
                return (
                  <div
                    key={idx}
                    style={{
                      width: 2,
                      height: waveH,
                      backgroundColor: '#38bdf8',
                      borderRadius: 1,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Dynamic Captions at bottom of video preview */}
          <div
            style={{
              position: 'absolute',
              bottom: 14,
              left: 12,
              right: 12,
              textAlign: 'center',
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span
              style={{
                fontSize: activeFormatIndex === 1 ? 9 : 10.5,
                fontWeight: 800,
                color: '#facc15',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              }}
            >
              {captionText}
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM CAPABILITIES BAR */}
      <div
        style={{
          marginTop: 14,
          paddingTop: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 11,
          color: '#94a3b8',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Subject Re-centering Engine</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Safe-Zone Safe Margins Preserved</span>
          </div>
        </div>
        <div style={{ color: '#818cf8', fontWeight: 600 }}>
          Export Resolution: Lossless Auto-Refit
        </div>
      </div>
    </div>
  );
};
