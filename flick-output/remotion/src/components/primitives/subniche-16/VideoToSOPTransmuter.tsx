import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SOPStep {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
}

export interface VideoToSOPTransmuterProps {
  title?: string;
  subtitle?: string;
  videoTitle?: string;
  videoDuration?: string;
  author?: string;
  steps?: SOPStep[];
  timeSavedMinutes?: number;
  width?: number;
  height?: number;
}

const DEFAULT_STEPS: SOPStep[] = [
  {
    id: 'step-1',
    timestamp: '00:24',
    title: '1. Access Cloud Console & Auth',
    description: 'Navigate to Security > API Credentials and generate a scoped token.',
    tag: 'SECURITY',
    tagColor: '#38bdf8',
  },
  {
    id: 'step-2',
    timestamp: '01:12',
    title: '2. Rotate Webhook HMAC Secret',
    description: 'Paste the newly generated key into the staging vault environment.',
    tag: 'VAULT',
    tagColor: '#a855f7',
  },
  {
    id: 'step-3',
    timestamp: '02:05',
    title: '3. Execute Smoke Test Suite',
    description: 'Trigger the synthetic ping pipeline to confirm 200 OK responses.',
    tag: 'CI/CD',
    tagColor: '#10b981',
  },
  {
    id: 'step-4',
    timestamp: '02:58',
    title: '4. Update Team Notion Knowledgebase',
    description: 'Doc auto-synced with timestamped keyframes and copyable shell commands.',
    tag: 'NOTION',
    tagColor: '#f59e0b',
  },
];

export const VideoToSOPTransmuter: React.FC<VideoToSOPTransmuterProps> = ({
  title = 'AI ASYNC TRANSMUTER',
  subtitle = 'Converting 3-minute screen recording into standard operating procedure',
  videoTitle = 'Production Secret Rotation & Canary Release',
  videoDuration = '03:14',
  author = 'Marcus T. • Senior SRE',
  steps = DEFAULT_STEPS,
  timeSavedMinutes = 45,
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.9 },
  });

  // Laser transmuter scanning beam across the video thumbnail
  const scanProgress = interpolate(frame % 90, [0, 90], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Video progress scrubber animation
  const videoProgress = interpolate(frame, [0, 150], [12, 98], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardEntrance,
        transform: `translateY(${interpolate(cardEntrance, [0, 1], [30, 0])}px) scale(${interpolate(
          cardEntrance,
          [0, 1],
          [0.94, 1]
        )})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.88) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow:
          '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        color: '#f8fafc',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Background glow orbs */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -40,
          left: 40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 999,
                background: 'rgba(139, 92, 246, 0.18)',
                color: '#c084fc',
                border: '1px solid rgba(192, 132, 252, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              {title}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#34d399',
                  boxShadow: '0 0 8px #34d399',
                }}
              />
              EXTRACTING SOP
            </span>
          </div>
          <h2
            style={{
              margin: '6px 0 0 0',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            {subtitle}
          </h2>
        </div>

        {/* Time saved badge */}
        <div
          style={{
            padding: '8px 14px',
            borderRadius: 12,
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 600, textTransform: 'uppercase' }}>
            Meeting Avoided
          </div>
          <div style={{ fontSize: 18, color: '#34d399', fontWeight: 800 }}>
            ⚡ {timeSavedMinutes} MIN SAVED
          </div>
        </div>
      </div>

      {/* Main split content: Left Video preview -> Right SOP steps */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '310px 1fr',
          gap: 20,
          margin: '16px 0',
          zIndex: 1,
          flex: 1,
        }}
      >
        {/* Left Video Card */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Simulated Loom Thumbnail */}
          <div
            style={{
              height: 190,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Background UI lines simulating screen recording */}
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                right: 14,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: 0.6,
              }}
            >
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontFamily: 'monospace',
                  color: '#94a3b8',
                  background: 'rgba(0,0,0,0.5)',
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                bash --canary-prod.sh
              </div>
            </div>

            {/* Loom Avatar Circle in corner */}
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                border: '2px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.5)',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>MT</span>
            </div>

            {/* Center Play Button & Pulsing Audio */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)',
                zIndex: 2,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            </div>

            {/* Transmute Scanning Laser Line */}
            <div
              style={{
                position: 'absolute',
                top: `${scanProgress}%`,
                left: 0,
                right: 0,
                height: 2,
                background: 'linear-gradient(90deg, transparent 0%, #38bdf8 50%, transparent 100%)',
                boxShadow: '0 0 14px 2px #38bdf8',
                pointerEvents: 'none',
              }}
            />

            {/* Video Duration Pill */}
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                background: 'rgba(0, 0, 0, 0.75)',
                padding: '3px 8px',
                borderRadius: 6,
                fontSize: 10,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {videoDuration}
            </div>
          </div>

          {/* Video Metadata & Scrubber */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {videoTitle}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{author}</div>

            {/* Scrubber Bar */}
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  width: '100%',
                  height: 4,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: `${videoProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #8b5cf6, #38bdf8)',
                    borderRadius: 2,
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 10,
                  fontFamily: 'monospace',
                  color: '#64748b',
                  marginTop: 4,
                }}
              >
                <span>02:18</span>
                <span>{videoDuration}</span>
              </div>
            </div>
          </div>

          {/* Extraction status indicator */}
          <div
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              color: '#d8b4fe',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#a855f7',
                boxShadow: '0 0 8px #a855f7',
              }}
            />
            <span>AI generating code blocks & snapshots</span>
          </div>
        </div>

        {/* Right SOP Step Checklist */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 9,
            justifyContent: 'center',
          }}
        >
          {steps.map((step, index) => {
            const stepDelay = 12 + index * 10;
            const stepSpring = spring({
              frame: frame - stepDelay,
              fps,
              config: { damping: 15, stiffness: 120 },
            });
            const isVisible = frame >= stepDelay;

            return (
              <div
                key={step.id}
                style={{
                  opacity: isVisible ? stepSpring : 0,
                  transform: `translateX(${interpolate(stepSpring, [0, 1], [30, 0])}px)`,
                  background: 'rgba(30, 41, 59, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                }}
              >
                {/* Checkbox Icon */}
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1.5px solid #10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                {/* Step Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'monospace',
                        color: '#64748b',
                        background: 'rgba(15, 23, 42, 0.6)',
                        padding: '1px 6px',
                        borderRadius: 4,
                      }}
                    >
                      {step.timestamp}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                      {step.title}
                    </span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: 9,
                        fontWeight: 700,
                        color: step.tagColor,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: `${step.tagColor}18`,
                        border: `1px solid ${step.tagColor}35`,
                      }}
                    >
                      {step.tag}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#94a3b8',
                      marginTop: 3,
                      lineHeight: 1.3,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#94a3b8' }}>
          <span style={{ color: '#10b981' }}>✔</span>
          <span>4 reproducible steps extracted</span>
          <span style={{ color: '#475569' }}>•</span>
          <span>Zero follow-up call needed</span>
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#a855f7',
            background: 'rgba(168, 85, 247, 0.1)',
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid rgba(168, 85, 247, 0.25)',
          }}
        >
          Exported to Team Handbook →
        </div>
      </div>
    </div>
  );
};
