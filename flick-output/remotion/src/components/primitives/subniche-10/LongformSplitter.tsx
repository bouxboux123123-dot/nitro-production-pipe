import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ReelClip {
  id: string;
  timeRange: string;
  hookTitle: string;
  durationSec: number;
  viralScore: number;
  category: string;
  accentColor: string;
}

export interface LongformSplitterProps {
  title?: string;
  sourceEpisode?: string;
  totalDuration?: string;
  clips?: ReelClip[];
  width?: number;
  height?: number;
}

const DEFAULT_CLIPS: ReelClip[] = [
  {
    id: 'clip-1',
    timeRange: '02:14 - 03:12',
    hookTitle: 'The $10K AI Mistake Nobody Talks About',
    durationSec: 58,
    viralScore: 98,
    category: 'CONTRARIAN HOOK',
    accentColor: '#10b981', // Emerald
  },
  {
    id: 'clip-2',
    timeRange: '08:45 - 09:41',
    hookTitle: 'Zero-to-100K Automated Content Engine',
    durationSec: 56,
    viralScore: 95,
    category: 'FRAMEWORK',
    accentColor: '#06b6d4', // Cyan
  },
  {
    id: 'clip-3',
    timeRange: '15:20 - 16:18',
    hookTitle: 'Why 99% Of Creators Burn Out in 60 Days',
    durationSec: 58,
    viralScore: 99,
    category: 'RETENTION SPIKE',
    accentColor: '#8b5cf6', // Violet
  },
  {
    id: 'clip-4',
    timeRange: '22:05 - 23:04',
    hookTitle: 'Steal My Exact 3-App Publishing Stack',
    durationSec: 59,
    viralScore: 94,
    category: 'ACTIONABLE SOP',
    accentColor: '#f59e0b', // Amber
  },
  {
    id: 'clip-5',
    timeRange: '29:10 - 30:08',
    hookTitle: 'The 1-Person Media Empire Flywheel',
    durationSec: 58,
    viralScore: 97,
    category: 'VIRAL PAYOFF',
    accentColor: '#f43f5e', // Rose
  },
];

// Generate deterministic audio bar heights for the 30-min waveform
const WAVEFORM_BAR_HEIGHTS = [
  24, 45, 68, 32, 50, 75, 92, 84, 40, 62, 88, 96, 70, 52, 85, 95, 60, 42, 78,
  89, 65, 48, 82, 94, 76, 58, 88, 98, 80, 54, 72, 90, 68, 44, 80, 92, 74, 56,
  84, 96, 62, 46, 78, 88, 70, 52, 86, 94, 66, 48, 82, 90, 72, 55, 84, 96, 78,
  50, 64, 40,
];

export const LongformSplitter: React.FC<LongformSplitterProps> = ({
  title = 'AI LONGFORM EPISODE SPLITTER',
  sourceEpisode = 'Master Podcast Ep. #48 (32:45 Runtime • 4K 60fps)',
  totalDuration = '32:45',
  clips = DEFAULT_CLIPS,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master card entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.93, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [24, 0]);

  // Slicing laser animation (moves across timeline from frame 12 to 50)
  const sliceProgress = interpolate(frame, [12, 52], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
          '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.15)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background radial accent glow */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
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
          {/* Wave splitter icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
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
              <path d="M4 12h2" />
              <path d="M8 8v8" />
              <path d="M12 4v16" />
              <path d="M16 7v10" />
              <path d="M20 12h-2" />
              <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  background: 'linear-gradient(90deg, #a78bfa, #38bdf8)',
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
                  background:
                    sliceProgress < 100
                      ? 'rgba(139, 92, 246, 0.25)'
                      : 'rgba(16, 185, 129, 0.25)',
                  color: sliceProgress < 100 ? '#c4b5fd' : '#34d399',
                  border: `1px solid ${
                    sliceProgress < 100
                      ? 'rgba(139, 92, 246, 0.4)'
                      : 'rgba(16, 185, 129, 0.4)'
                  }`,
                }}
              >
                {sliceProgress < 100
                  ? `AI SLICING ${Math.round(sliceProgress)}%`
                  : '5 VIRAL REELS EXTRACTED'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              {sourceEpisode}
            </div>
          </div>
        </div>

        {/* Master Runtime & Output summary badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '6px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
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
              Conversion Yield
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>
              1 Master → 5 Shorts
            </div>
          </div>
          <div
            style={{
              width: 1,
              height: 24,
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: 10,
                color: '#94a3b8',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Podcast Length
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
              {totalDuration}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: MASTER LONGFORM TIMELINE & WAVEFORM */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: 16,
          padding: '12px 18px 14px 18px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          marginBottom: 16,
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)',
        }}
      >
        {/* Top timeline markers */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 10,
            fontWeight: 600,
            color: '#64748b',
            marginBottom: 8,
          }}
        >
          <span>00:00:00</span>
          <span>08:00</span>
          <span>16:00 (Midpoint)</span>
          <span>24:00</span>
          <span>{totalDuration}</span>
        </div>

        {/* Audio Waveform visualization with slice intervals */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            position: 'relative',
          }}
        >
          {WAVEFORM_BAR_HEIGHTS.map((heightPct, idx) => {
            const barRatio = (idx / WAVEFORM_BAR_HEIGHTS.length) * 100;
            const isSliced = sliceProgress >= barRatio;

            // Highlight clip zones across the waveform
            let clipMatch: ReelClip | undefined = undefined;
            if (idx >= 4 && idx <= 12) clipMatch = clips[0];
            else if (idx >= 16 && idx <= 24) clipMatch = clips[1];
            else if (idx >= 28 && idx <= 36) clipMatch = clips[2];
            else if (idx >= 40 && idx <= 48) clipMatch = clips[3];
            else if (idx >= 51 && idx <= 58) clipMatch = clips[4];

            const barColor = clipMatch
              ? clipMatch.accentColor
              : isSliced
              ? '#64748b'
              : '#334155';

            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: `${heightPct}%`,
                  borderRadius: 3,
                  backgroundColor: barColor,
                  opacity: clipMatch ? 0.95 : 0.45,
                  boxShadow:
                    clipMatch && isSliced
                      ? `0 0 8px ${clipMatch.accentColor}88`
                      : 'none',
                  transition: 'background-color 0.1s ease',
                }}
              />
            );
          })}

          {/* Slicing Laser Beam Sweep */}
          <div
            style={{
              position: 'absolute',
              top: -6,
              bottom: -6,
              left: `${sliceProgress}%`,
              width: 3,
              backgroundColor: '#38bdf8',
              boxShadow:
                '0 0 16px #38bdf8, 0 0 30px #818cf8, 0 0 4px #ffffff',
              zIndex: 10,
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}
          >
            {/* Scissor / Blade head */}
            <div
              style={{
                position: 'absolute',
                top: -12,
                left: -10,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px #38bdf8',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#0f172a">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line
                  x1="20"
                  y1="4"
                  x2="8.12"
                  y2="15.88"
                  stroke="#0f172a"
                  strokeWidth="2.5"
                />
                <line
                  x1="14.47"
                  y1="14.48"
                  x2="20"
                  y2="20"
                  stroke="#0f172a"
                  strokeWidth="2.5"
                />
                <line
                  x1="8.12"
                  y1="8.12"
                  x2="12"
                  y2="12"
                  stroke="#0f172a"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Slice zone brackets along the timeline */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 6,
            paddingTop: 4,
            borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
          }}
        >
          {clips.map((clip, idx) => {
            return (
              <div
                key={clip.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 10,
                  color: clip.accentColor,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: clip.accentColor,
                    boxShadow: `0 0 6px ${clip.accentColor}`,
                  }}
                />
                <span>CLIP 0{idx + 1} ({clip.timeRange})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: 5 EXTRACTED 9:16 VERTICAL VIDEO REEL CARDS */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 12,
          zIndex: 2,
        }}
      >
        {clips.map((clip, idx) => {
          // Staggered entrance for each sliced reel card
          const clipStartFrame = 16 + idx * 8;
          const reelSpring = spring({
            frame: frame - clipStartFrame,
            fps,
            config: { damping: 13, stiffness: 130, mass: 0.7 },
          });

          const reelOpacity = interpolate(reelSpring, [0, 1], [0, 1]);
          const reelY = interpolate(reelSpring, [0, 1], [30, 0]);
          const reelScale = interpolate(reelSpring, [0, 1], [0.88, 1]);

          // Subtle pulse on the viral score
          const pulseScore = 1 + Math.sin((frame + idx * 10) / 10) * 0.03;

          return (
            <div
              key={clip.id}
              style={{
                opacity: reelOpacity,
                transform: `translateY(${reelY}px) scale(${reelScale})`,
                borderRadius: 16,
                background:
                  'linear-gradient(180deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: `1px solid ${clip.accentColor}55`,
                boxShadow: `0 10px 25px -8px rgba(0,0,0,0.7), 0 0 16px ${clip.accentColor}25`,
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top ambient color edge */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: clip.accentColor,
                  boxShadow: `0 0 10px ${clip.accentColor}`,
                }}
              />

              {/* Reel Header: Number & 9:16 tag */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: clip.accentColor,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    REEL #{idx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '2px 5px',
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#cbd5e1',
                    }}
                  >
                    9:16 • {clip.durationSec}s
                  </span>
                </div>

                {/* Simulated 9:16 video thumbnail area */}
                <div
                  style={{
                    height: 140,
                    borderRadius: 10,
                    background:
                      'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.6) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                    textAlign: 'center',
                  }}
                >
                  {/* Subtle video speaker silhouette / play indicator */}
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: `${clip.accentColor}25`,
                      border: `1.5px solid ${clip.accentColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                      boxShadow: `0 0 12px ${clip.accentColor}55`,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={clip.accentColor}
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>

                  {/* Dynamic caption overlay mockup */}
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      lineHeight: 1.25,
                      color: '#f8fafc',
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    }}
                  >
                    "{clip.hookTitle}"
                  </div>

                  {/* Soundwave animation indicator inside card */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    {[0.6, 1.0, 0.4, 0.8, 0.5, 0.9, 0.3].map((barScale, bIdx) => (
                      <div
                        key={bIdx}
                        style={{
                          width: 2.5,
                          height: 10 * barScale,
                          backgroundColor: clip.accentColor,
                          borderRadius: 2,
                          transform: `scaleY(${
                            0.5 + 0.5 * Math.sin((frame + bIdx * 5) / 5)
                          })`,
                          transformOrigin: 'bottom',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Metrics */}
              <div style={{ marginTop: 8 }}>
                {/* Category tag */}
                <div
                  style={{
                    fontSize: 8.5,
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  {clip.category}
                </div>

                {/* Virality Predictor badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: `${clip.accentColor}18`,
                    border: `1px solid ${clip.accentColor}40`,
                    padding: '4px 6px',
                    borderRadius: 6,
                    transform: `scale(${pulseScore})`,
                    transformOrigin: 'center',
                  }}
                >
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#f8fafc' }}>
                    VIRAL POTENTIAL
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: clip.accentColor,
                    }}
                  >
                    {clip.viralScore}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
          <span>Auto-Framing AI: Speaker tracking centered for 9:16 mobile feeds</span>
        </div>
        <div style={{ color: '#38bdf8', fontWeight: 600 }}>
          Export Queue: 5 Vertical Reels Ready
        </div>
      </div>
    </div>
  );
};
