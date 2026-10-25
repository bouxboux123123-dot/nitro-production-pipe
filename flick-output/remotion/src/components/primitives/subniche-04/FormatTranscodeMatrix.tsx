import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FormatTranscodeMatrixProps {
  inputFileName?: string;
  inputFileSize?: string;
  inputCodec?: string;
  transcodeSpeed?: string;
  fpsThroughput?: number;
  engineName?: string;
  accentCyan?: string;
  accentPurple?: string;
  accentGreen?: string;
}

export const FormatTranscodeMatrix: React.FC<FormatTranscodeMatrixProps> = ({
  inputFileName = 'master_reel_4k_cut.mov',
  inputFileSize = '4.24 GB',
  inputCodec = 'Apple ProRes 422 HQ',
  transcodeSpeed = '6.2x',
  fpsThroughput = 186.4,
  engineName = 'FFMPEG 7.1 // HW_NVENC',
  accentCyan = '#06b6d4',
  accentPurple = '#8b5cf6',
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

  // Central wheel rotation animation
  const wheelRotation = (frame * 2.5) % 360;

  // Stream progress animations
  const pMp4 = Math.min(
    100,
    Math.round(
      interpolate(frame, [10, 75], [12, 100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    )
  );

  const pWebm = Math.min(
    100,
    Math.round(
      interpolate(frame, [15, 82], [8, 100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    )
  );

  const pGif = Math.min(
    100,
    Math.round(
      interpolate(frame, [8, 68], [15, 100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    )
  );

  // Flow pulse offset for SVG pipes
  const dashOffset = -frame * 3;

  return (
    <div
      style={{
        width: 890,
        height: 590,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 24,
        boxShadow: `0 24px 64px -12px rgba(0, 0, 0, 0.7), 0 0 32px -4px ${accentCyan}25`,
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
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentCyan,
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
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
              TRANSCODE_MATRIX // {engineName}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              Simultaneous Multi-Branch Fanout Encoding
            </div>
          </div>
        </div>

        {/* Live Encoding Speed Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 999,
            backgroundColor: `${accentCyan}18`,
            border: `1px solid ${accentCyan}50`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: accentCyan,
              boxShadow: `0 0 10px ${accentCyan}`,
            }}
          />
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 12,
              fontWeight: 700,
              color: accentCyan,
            }}
          >
            {fpsThroughput.toFixed(1)} FPS ({transcodeSpeed} REAL-TIME)
          </span>
        </div>
      </div>

      {/* Main Graph Area: Center Hub + Connecting Circuit + 3 Destination Nodes */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          padding: '16px 24px',
          overflow: 'hidden',
        }}
      >
        {/* SVG Connecting Flow Lines from Center (x=160, y=180) to 3 targets */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <defs>
            <linearGradient id="pipeGradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="pipeGradPurple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="pipeGradGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Pipe to MP4 (Top Branch) */}
          <path
            d="M 230 185 C 330 185, 380 75, 460 75"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="4"
          />
          <path
            d="M 230 185 C 330 185, 380 75, 460 75"
            fill="none"
            stroke="url(#pipeGradCyan)"
            strokeWidth="3"
            strokeDasharray="6 8"
            strokeDashoffset={dashOffset}
          />

          {/* Pipe to WebM (Middle Branch) */}
          <path
            d="M 230 185 C 330 185, 380 185, 460 185"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="4"
          />
          <path
            d="M 230 185 C 330 185, 380 185, 460 185"
            fill="none"
            stroke="url(#pipeGradPurple)"
            strokeWidth="3"
            strokeDasharray="6 8"
            strokeDashoffset={dashOffset}
          />

          {/* Pipe to GIF (Bottom Branch) */}
          <path
            d="M 230 185 C 330 185, 380 295, 460 295"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="4"
          />
          <path
            d="M 230 185 C 330 185, 380 295, 460 295"
            fill="none"
            stroke="url(#pipeGradGreen)"
            strokeWidth="3"
            strokeDasharray="6 8"
            strokeDashoffset={dashOffset}
          />
        </svg>

        {/* LEFT: Central Transcoding Master Wheel Node */}
        <div
          style={{
            width: 210,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Wheel Graphic */}
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '2px solid rgba(59, 130, 246, 0.5)',
              boxShadow: '0 0 24px rgba(59, 130, 246, 0.4), inset 0 0 16px rgba(59, 130, 246, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Outer Spinning Dashed Orbit */}
            <div
              style={{
                position: 'absolute',
                inset: -8,
                borderRadius: '50%',
                border: '2px dashed rgba(56, 189, 248, 0.6)',
                transform: `rotate(${wheelRotation}deg)`,
              }}
            />

            {/* Inner Content */}
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 18,
                fontWeight: 900,
                color: '#38bdf8',
                letterSpacing: '0.05em',
                textShadow: '0 0 10px rgba(56, 189, 248, 0.7)',
              }}
            >
              .MOV
            </div>
            <div
              style={{
                fontSize: 10,
                fontFamily: '"JetBrains Mono", monospace',
                color: '#cbd5e1',
                marginTop: 2,
              }}
            >
              PRORES 422
            </div>
            <div
              style={{
                fontSize: 11,
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                color: '#f43f5e',
                marginTop: 4,
              }}
            >
              {inputFileSize}
            </div>
          </div>

          {/* Master File Label */}
          <div
            style={{
              marginTop: 12,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                color: '#f8fafc',
              }}
            >
              {inputFileName}
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>Master Input Stream</div>
          </div>
        </div>

        {/* RIGHT: 3 Parallel Output Branches */}
        <div
          style={{
            flex: 1,
            marginLeft: 230,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Branch 1: MP4 */}
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.55)',
              borderRadius: 14,
              border: `1px solid ${pMp4 === 100 ? `${accentGreen}50` : `${accentCyan}40`}`,
              padding: '10px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 14,
                    fontWeight: 800,
                    color: accentCyan,
                  }}
                >
                  .MP4
                </span>
                <span style={{ fontSize: 11, color: '#cbd5e1' }}>
                  H.264 / AAC (Web Universal)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#34d399',
                  }}
                >
                  18.2 MB
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    fontSize: 10,
                    fontFamily: '"JetBrains Mono", monospace',
                    color: accentCyan,
                    fontWeight: 700,
                  }}
                >
                  {pMp4}%
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pMp4}%`,
                  backgroundColor: accentCyan,
                  borderRadius: 999,
                  boxShadow: `0 0 8px ${accentCyan}`,
                }}
              />
            </div>
          </div>

          {/* Branch 2: WebM */}
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.55)',
              borderRadius: 14,
              border: `1px solid ${pWebm === 100 ? `${accentGreen}50` : `${accentPurple}40`}`,
              padding: '10px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 14,
                    fontWeight: 800,
                    color: accentPurple,
                  }}
                >
                  .WEBM
                </span>
                <span style={{ fontSize: 11, color: '#cbd5e1' }}>
                  AV1 / Opus (Ultra-Low Bitrate)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#34d399',
                  }}
                >
                  8.4 MB
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    fontSize: 10,
                    fontFamily: '"JetBrains Mono", monospace',
                    color: accentPurple,
                    fontWeight: 700,
                  }}
                >
                  {pWebm}%
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pWebm}%`,
                  backgroundColor: accentPurple,
                  borderRadius: 999,
                  boxShadow: `0 0 8px ${accentPurple}`,
                }}
              />
            </div>
          </div>

          {/* Branch 3: GIF */}
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.55)',
              borderRadius: 14,
              border: `1px solid ${pGif === 100 ? `${accentGreen}50` : `${accentGreen}40`}`,
              padding: '10px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 14,
                    fontWeight: 800,
                    color: accentGreen,
                  }}
                >
                  .GIF
                </span>
                <span style={{ fontSize: 11, color: '#cbd5e1' }}>
                  PaletteGen 60fps Loop
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#34d399',
                  }}
                >
                  4.1 MB
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    fontSize: 10,
                    fontFamily: '"JetBrains Mono", monospace',
                    color: accentGreen,
                    fontWeight: 700,
                  }}
                >
                  {pGif}%
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pGif}%`,
                  backgroundColor: accentGreen,
                  borderRadius: 999,
                  boxShadow: `0 0 8px ${accentGreen}`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar */}
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
        <div style={{ display: 'flex', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: '"JetBrains Mono", monospace',
              color: '#94a3b8',
            }}
          >
            <span style={{ color: '#38bdf8' }}>⚡</span>
            <span>GPU Load: 28%</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: '"JetBrains Mono", monospace',
              color: '#94a3b8',
            }}
          >
            <span style={{ color: accentGreen }}>💾</span>
            <span>Saved: 4.21 GB (-99.3%)</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              fontSize: 11,
              fontFamily: '"JetBrains Mono", monospace',
              color: '#cbd5e1',
            }}
          >
            Zero Cloud Latency
          </span>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              fontSize: 11,
              fontFamily: '"JetBrains Mono", monospace',
              color: accentCyan,
              fontWeight: 600,
            }}
          >
            Open-Source FFmpeg
          </span>
        </div>
      </div>
    </div>
  );
};
