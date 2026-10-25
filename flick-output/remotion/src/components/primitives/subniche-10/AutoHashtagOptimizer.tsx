import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface HashtagItem {
  id: string;
  tag: string;
  sourceKeyword: string;
  volume: string;
  competition: string;
  compScorePct: number;
  viralScore: number;
  accentColor: string;
}

export interface AutoHashtagOptimizerProps {
  title?: string;
  subtitle?: string;
  scriptText?: string;
  tags?: HashtagItem[];
  width?: number;
  height?: number;
}

const DEFAULT_TAGS: HashtagItem[] = [
  {
    id: 'tag-1',
    tag: '#ContentAutomation',
    sourceKeyword: 'automated',
    volume: '540K/mo',
    competition: 'LOW (16%)',
    compScorePct: 16,
    viralScore: 98,
    accentColor: '#06b6d4', // Cyan
  },
  {
    id: 'tag-2',
    tag: '#RepurposeContent',
    sourceKeyword: 'content repurposing',
    volume: '380K/mo',
    competition: 'SWEET SPOT (22%)',
    compScorePct: 22,
    viralScore: 96,
    accentColor: '#8b5cf6', // Violet
  },
  {
    id: 'tag-3',
    tag: '#AIWorkflows',
    sourceKeyword: 'workflow',
    volume: '710K/mo',
    competition: 'LOW (18%)',
    compScorePct: 18,
    viralScore: 99,
    accentColor: '#10b981', // Emerald
  },
  {
    id: 'tag-4',
    tag: '#VideoEditingHacks',
    sourceKeyword: 'editing',
    volume: '920K/mo',
    competition: 'MODERATE (34%)',
    compScorePct: 34,
    viralScore: 94,
    accentColor: '#f59e0b', // Amber
  },
  {
    id: 'tag-5',
    tag: '#SideHustleFlywheel',
    sourceKeyword: 'side hustle',
    volume: '460K/mo',
    competition: 'VERY LOW (12%)',
    compScorePct: 12,
    viralScore: 97,
    accentColor: '#f43f5e', // Rose
  },
];

export const AutoHashtagOptimizer: React.FC<AutoHashtagOptimizerProps> = ({
  title = 'AI CAPTION & HASHTAG OPTIMIZER',
  subtitle = 'Semantic NLP Keyword Extraction & Low-Competition Viral Ranker',
  scriptText = 'How to build an automated content repurposing workflow without spending 20 hours editing every single week for your side hustle.',
  tags = DEFAULT_TAGS,
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

  // Scan progress across caption text (frame 10 to 45)
  const scanProgress = interpolate(frame, [10, 48], [0, 100], {
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
          '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.15)',
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
          right: -80,
          width: 340,
          height: 340,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
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
          {/* Hashtag spark icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="9" x2="20" y2="9" />
              <line x1="4" y1="15" x2="20" y2="15" />
              <line x1="10" y1="3" x2="8" y2="21" />
              <line x1="16" y1="3" x2="14" y2="21" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  background: 'linear-gradient(90deg, #34d399, #38bdf8)',
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
                    scanProgress < 100
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(56, 189, 248, 0.25)',
                  color: scanProgress < 100 ? '#34d399' : '#38bdf8',
                  border: `1px solid ${
                    scanProgress < 100
                      ? 'rgba(16, 185, 129, 0.4)'
                      : 'rgba(56, 189, 248, 0.4)'
                  }`,
                }}
              >
                {scanProgress < 100
                  ? `NLP SCANNING ${Math.round(scanProgress)}%`
                  : '5 VIRAL TAGS RANKED'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              {subtitle}
            </div>
          </div>
        </div>

        {/* Algo Match Score */}
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
              Virality Index
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#34d399' }}>
              98.4 / 100 (Optimal)
            </div>
          </div>
        </div>
      </div>

      {/* TOP: SCRIPT SCANNING BOX */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: 16,
          padding: '16px 20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          marginBottom: 16,
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
        }}
      >
        {/* Caption header label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
            fontSize: 11,
            color: '#64748b',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#38bdf8',
              }}
            />
            <span>TRANSCRIPT / CAPTION PROMPT SCANNER</span>
          </div>
          <span>SEMANTIC ENTITY DETECTOR ACTIVE</span>
        </div>

        {/* Script text with illuminated keyword spans */}
        <div
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: '#cbd5e1',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <span>How to build an </span>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: 6,
              background:
                scanProgress >= 20 ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: scanProgress >= 20 ? '#22d3ee' : '#cbd5e1',
              border:
                scanProgress >= 20
                  ? '1px solid rgba(6, 182, 212, 0.5)'
                  : '1px solid transparent',
              fontWeight: scanProgress >= 20 ? 800 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            automated
          </span>
          <span> </span>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: 6,
              background:
                scanProgress >= 40 ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              color: scanProgress >= 40 ? '#c084fc' : '#cbd5e1',
              border:
                scanProgress >= 40
                  ? '1px solid rgba(139, 92, 246, 0.5)'
                  : '1px solid transparent',
              fontWeight: scanProgress >= 40 ? 800 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            content repurposing
          </span>
          <span> </span>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: 6,
              background:
                scanProgress >= 55 ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: scanProgress >= 55 ? '#34d399' : '#cbd5e1',
              border:
                scanProgress >= 55
                  ? '1px solid rgba(16, 185, 129, 0.5)'
                  : '1px solid transparent',
              fontWeight: scanProgress >= 55 ? 800 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            workflow
          </span>
          <span> without spending 20 hours </span>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: 6,
              background:
                scanProgress >= 70 ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
              color: scanProgress >= 70 ? '#fbbf24' : '#cbd5e1',
              border:
                scanProgress >= 70
                  ? '1px solid rgba(245, 158, 11, 0.5)'
                  : '1px solid transparent',
              fontWeight: scanProgress >= 70 ? 800 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            editing
          </span>
          <span> every single week for your </span>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: 6,
              background:
                scanProgress >= 88 ? 'rgba(244, 63, 94, 0.25)' : 'transparent',
              color: scanProgress >= 88 ? '#fb7185' : '#cbd5e1',
              border:
                scanProgress >= 88
                  ? '1px solid rgba(244, 63, 94, 0.5)'
                  : '1px solid transparent',
              fontWeight: scanProgress >= 88 ? 800 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            side hustle
          </span>
          <span>.</span>
        </div>

        {/* Laser scan line sweeping horizontally */}
        {scanProgress < 100 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${scanProgress}%`,
              width: 2,
              background: '#34d399',
              boxShadow:
                '0 0 14px #34d399, 0 0 25px #38bdf8, 0 0 4px #ffffff',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />
        )}
      </div>

      {/* SECTION LABEL: AUTO-FILLED VIRAL TAGS */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
          fontSize: 12,
          fontWeight: 700,
          color: '#94a3b8',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          zIndex: 2,
        }}
      >
        <span>5 AUTO-DISCOVERED LOW-COMPETITION HASHTAGS</span>
        <span style={{ color: '#34d399' }}>✓ AUTO-APPENDED TO METADATA</span>
      </div>

      {/* 5 HASHTAG CARDS LIST */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 2,
        }}
      >
        {tags.map((item, idx) => {
          // Staggered spring entrance
          const startFrame = 22 + idx * 7;
          const tagSpring = spring({
            frame: frame - startFrame,
            fps,
            config: { damping: 13, stiffness: 140, mass: 0.7 },
          });

          const tagOpacity = interpolate(tagSpring, [0, 1], [0, 1]);
          const tagX = interpolate(tagSpring, [0, 1], [-20, 0]);

          return (
            <div
              key={item.id}
              style={{
                opacity: tagOpacity,
                transform: `translateX(${tagX}px)`,
                borderRadius: 12,
                background:
                  'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.85) 100%)',
                border: `1px solid ${item.accentColor}40`,
                boxShadow: `0 4px 15px -4px ${item.accentColor}25`,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Left: Tag name & Source Keyword */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Ranking number */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: `${item.accentColor}20`,
                    color: item.accentColor,
                    fontSize: 11,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${item.accentColor}40`,
                  }}
                >
                  #{idx + 1}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: '#f8fafc',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {item.tag}
                  </div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>
                    Extracted from keyword: "{item.sourceKeyword}"
                  </div>
                </div>
              </div>

              {/* Middle: Monthly Volume & Competition score */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                }}
              >
                {/* Volume */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>
                    SEARCH VOLUME
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1' }}>
                    {item.volume}
                  </div>
                </div>

                {/* Competition */}
                <div style={{ textAlign: 'right', minWidth: 120 }}>
                  <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>
                    COMPETITION
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: item.accentColor,
                    }}
                  >
                    {item.competition}
                  </div>
                </div>

                {/* Viral score pill */}
                <div
                  style={{
                    background: `${item.accentColor}18`,
                    border: `1px solid ${item.accentColor}50`,
                    padding: '4px 10px',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={item.accentColor}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: item.accentColor,
                    }}
                  >
                    {item.viralScore}/100
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM DISCOVERY PREDICTOR BAR */}
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
          <span>Estimated Algorithmic Lift: +340% Explore & Suggested Feed Placements</span>
        </div>
        <div style={{ color: '#34d399', fontWeight: 600 }}>
          High-Intent Search Indexed
        </div>
      </div>
    </div>
  );
};
