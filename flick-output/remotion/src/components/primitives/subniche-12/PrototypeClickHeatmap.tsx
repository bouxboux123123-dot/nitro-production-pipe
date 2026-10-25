import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface HeatmapHotspot {
  id: string;
  name: string;
  x: number; // Percentage from left of mobile frame
  y: number; // Percentage from top of mobile frame
  radius: number;
  tapCount: number;
  percentage: number;
  intensity: 'critical' | 'high' | 'medium' | 'dead-tap';
}

export interface PrototypeClickHeatmapProps {
  title?: string;
  subtitle?: string;
  totalSessions?: number;
  hotspots?: HeatmapHotspot[];
  width?: number;
  height?: number;
}

const DEFAULT_HOTSPOTS: HeatmapHotspot[] = [
  { id: 'h1', name: 'Primary CTA: "Generate Leads"', x: 50, y: 58, radius: 48, tapCount: 842, percentage: 62.8, intensity: 'critical' },
  { id: 'h2', name: 'Search Prompt Input Field', x: 50, y: 44, radius: 36, tapCount: 310, percentage: 23.1, intensity: 'high' },
  { id: 'h3', name: 'Filter Button: "Niche Select"', x: 30, y: 51, radius: 26, tapCount: 145, percentage: 10.8, intensity: 'medium' },
  { id: 'h4', name: 'Rage Tap: Static Graphic (Dead Click)', x: 74, y: 32, radius: 22, tapCount: 43, percentage: 3.3, intensity: 'dead-tap' },
];

export const PrototypeClickHeatmap: React.FC<PrototypeClickHeatmapProps> = ({
  title = 'PROTOTYPE CLICK HEATMAP AUDIT',
  subtitle = 'PostHog / Hotjar telemetry showing user tap density on Mobile MVP',
  totalSessions = 1340,
  hotspots = DEFAULT_HOTSPOTS,
  width = 920,
  height = 630,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master card entrance
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(cardSpring, [0, 1], [0.94, 1]);

  // Heatmap intensity thermal bloom (frames 15 to 60)
  const heatmapBloom = interpolate(frame, [15, 60], [0.1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Tap ripple pulses
  const ripple1 = (frame * 2.5) % 60;
  const ripple1Scale = interpolate(ripple1, [0, 60], [0.4, 2.2]);
  const ripple1Opacity = interpolate(ripple1, [0, 60], [0.8, 0]);

  // Finger tap cursor simulation
  const cursorPulse = Math.sin(frame * 0.15) * 5;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
        borderRadius: 20,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.92))',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(239, 68, 68, 0.12)',
        padding: '22px 26px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        color: '#F8FAFC',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(249, 115, 22, 0.35))',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M4.93 4.93l2.83 2.83" />
              <path d="M16.24 16.24l2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="M4.93 19.07l2.83-2.83" />
              <path d="M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', color: '#EF4444', textTransform: 'uppercase' }}>
              {title}
            </div>
            <div style={{ fontSize: 11.5, color: '#94A3B8' }}>{subtitle}</div>
          </div>
        </div>

        {/* Heatmap Mode Toggle Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 12px',
            borderRadius: 8,
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              boxShadow: '0 0 10px #EF4444',
            }}
          />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#FCA5A5' }}>
            THERMAL SPECTRUM ACTIVE ({totalSessions} SESSIONS)
          </span>
        </div>
      </div>

      {/* Main Content Area: Phone Mockup on Left + Analytics Telemetry on Right */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: 20,
          alignItems: 'stretch',
        }}
      >
        {/* Left: Mobile Phone Mockup Screen with Heatmap Overlay */}
        <div
          style={{
            borderRadius: 24,
            backgroundColor: 'rgba(2, 6, 23, 0.9)',
            border: '2.5px solid rgba(148, 163, 184, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.6)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Phone Status Bar Notch */}
          <div
            style={{
              height: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 16px',
              fontSize: 10,
              color: '#94A3B8',
              fontWeight: 600,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <span>9:41</span>
            <div style={{ width: 44, height: 10, borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.8)' }} />
            <span>5G 100%</span>
          </div>

          {/* Simulated App UI Inside Phone */}
          <div
            style={{
              flex: 1,
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              position: 'relative',
            }}
          >
            {/* App Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: 18, height: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ height: 2, backgroundColor: '#94A3B8', borderRadius: 1 }} />
                <div style={{ height: 2, backgroundColor: '#94A3B8', borderRadius: 1 }} />
                <div style={{ height: 2, backgroundColor: '#94A3B8', borderRadius: 1 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#F1F5F9' }}>ProspectAI</span>
              <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#38BDF8' }} />
            </div>

            {/* App Hero Copy */}
            <div style={{ textAlign: 'center', marginTop: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF' }}>Find 100 Verified B2B Leads</div>
              <div style={{ fontSize: 9.5, color: '#94A3B8', marginTop: 2 }}>Zero manual scraping required</div>
            </div>

            {/* Static Graphic (Rage Tap Zone) */}
            <div
              style={{
                height: 48,
                borderRadius: 8,
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontSize: 10,
                color: '#64748B',
              }}
            >
              <span>📊</span>
              <span>Sample Graph Preview</span>
            </div>

            {/* Input Box */}
            <div
              style={{
                height: 36,
                borderRadius: 8,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                padding: '0 10px',
                display: 'flex',
                alignItems: 'center',
                fontSize: 10,
                color: '#CBD5E1',
                gap: 6,
              }}
            >
              <span>🔍</span>
              <span>"Fintech CTOs in London"</span>
            </div>

            {/* Filters Row */}
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ padding: '4px 8px', borderRadius: 6, backgroundColor: 'rgba(56, 189, 248, 0.15)', fontSize: 9, color: '#38BDF8' }}>
                + Seed Funded
              </div>
              <div style={{ padding: '4px 8px', borderRadius: 6, backgroundColor: 'rgba(148, 163, 184, 0.15)', fontSize: 9, color: '#94A3B8' }}>
                + 11-50 Empl.
              </div>
            </div>

            {/* Primary CTA Button */}
            <div
              style={{
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: 11.5,
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                marginTop: 2,
              }}
            >
              ⚡ Instant Generate Leads
            </div>

            {/* Phone Bottom Tab Bar */}
            <div
              style={{
                marginTop: 'auto',
                height: 34,
                borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                fontSize: 9,
                color: '#64748B',
              }}
            >
              <span style={{ color: '#38BDF8' }}>🏠 Home</span>
              <span>📦 Leads</span>
              <span>⚙️ Settings</span>
            </div>
          </div>

          {/* HEATMAP GLOW OVERLAY LAYER */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              opacity: heatmapBloom,
              mixBlendMode: 'screen',
            }}
          >
            {hotspots.map((spot) => {
              let gradColors = '';
              let glowShadow = '';

              if (spot.intensity === 'critical') {
                gradColors = 'radial-gradient(circle, rgba(239, 68, 68, 0.9) 0%, rgba(249, 115, 22, 0.75) 30%, rgba(234, 179, 8, 0.45) 60%, rgba(34, 197, 94, 0.15) 85%, transparent 100%)';
                glowShadow = '0 0 25px rgba(239, 68, 68, 0.8)';
              } else if (spot.intensity === 'high') {
                gradColors = 'radial-gradient(circle, rgba(245, 158, 11, 0.85) 0%, rgba(234, 179, 8, 0.6) 35%, rgba(56, 189, 248, 0.25) 75%, transparent 100%)';
                glowShadow = '0 0 18px rgba(245, 158, 11, 0.7)';
              } else if (spot.intensity === 'medium') {
                gradColors = 'radial-gradient(circle, rgba(56, 189, 248, 0.8) 0%, rgba(99, 102, 241, 0.4) 60%, transparent 100%)';
                glowShadow = '0 0 14px rgba(56, 189, 248, 0.6)';
              } else {
                // dead-tap rage zone
                gradColors = 'radial-gradient(circle, rgba(220, 38, 38, 0.85) 0%, rgba(153, 27, 27, 0.5) 60%, transparent 100%)';
                glowShadow = '0 0 16px rgba(220, 38, 38, 0.9)';
              }

              return (
                <div
                  key={spot.id}
                  style={{
                    position: 'absolute',
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    width: spot.radius * 2,
                    height: spot.radius * 2,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: gradColors,
                    boxShadow: glowShadow,
                    filter: 'blur(4px)',
                  }}
                />
              );
            })}

            {/* Ripple Pulse on Primary CTA */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '58%',
                width: 70,
                height: 70,
                borderRadius: '50%',
                border: '2px solid rgba(239, 68, 68, 0.9)',
                transform: `translate(-50%, -50%) scale(${ripple1Scale})`,
                opacity: ripple1Opacity,
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Floating Tap Cursor Finger */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: `${58 + cursorPulse * 0.4}%`,
              transform: 'translate(-50%, -50%)',
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.35)',
              border: '2px solid #FFFFFF',
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Right Side: Telemetry Diagnostics & Key Findings */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Hotspot Breakdown Table */}
          <div
            style={{
              padding: '16px 18px',
              borderRadius: 14,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: '#38BDF8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
              ZONE CLICK CONCENTRATION
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {hotspots.map((spot) => (
                <div key={spot.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                    <span style={{ fontWeight: 600, color: '#F1F5F9' }}>{spot.name}</span>
                    <span style={{ fontWeight: 800, color: spot.intensity === 'critical' ? '#EF4444' : spot.intensity === 'high' ? '#F59E0B' : spot.intensity === 'dead-tap' ? '#F87171' : '#38BDF8' }}>
                      {spot.percentage}% ({spot.tapCount} taps)
                    </span>
                  </div>
                  {/* Mini progress bar */}
                  <div style={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: 'rgba(148, 163, 184, 0.15)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${spot.percentage}%`,
                        height: '100%',
                        backgroundColor: spot.intensity === 'critical' ? '#EF4444' : spot.intensity === 'high' ? '#F59E0B' : spot.intensity === 'dead-tap' ? '#DC2626' : '#38BDF8',
                        boxShadow: `0 0 8px ${spot.intensity === 'critical' ? '#EF4444' : '#38BDF8'}`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              marginTop: 10,
            }}
          >
            <div style={{ padding: '10px 12px', borderRadius: 10, backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
              <div style={{ fontSize: 10.5, color: '#64748B' }}>Time to First Tap</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#4ADE80', marginTop: 2 }}>2.4s</div>
              <div style={{ fontSize: 9.5, color: '#86EFAC' }}>Fast intent capture</div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 10, backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
              <div style={{ fontSize: 10.5, color: '#64748B' }}>Rage Click Rate</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#F87171', marginTop: 2 }}>3.3%</div>
              <div style={{ fontSize: 9.5, color: '#FCA5A5' }}>Static preview tapped</div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 10, backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
              <div style={{ fontSize: 10.5, color: '#64748B' }}>Primary CTA Share</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#38BDF8', marginTop: 2 }}>62.8%</div>
              <div style={{ fontSize: 9.5, color: '#7DD3FC' }}>Clear visual hierarchy</div>
            </div>
          </div>

          {/* UX Optimization Recommendation */}
          <div
            style={{
              marginTop: 10,
              padding: '12px 16px',
              borderRadius: 12,
              background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15), rgba(30, 41, 59, 0.8))',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 20 }}>💡</div>
            <div style={{ fontSize: 11.5, color: '#CBD5E1', lineHeight: 1.4 }}>
              <strong style={{ color: '#F87171' }}>LEAN UX FIX:</strong> Remove the static graph preview (causes 43 rage clicks) and make the search input auto-focus on page load to accelerate funnel velocity!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
