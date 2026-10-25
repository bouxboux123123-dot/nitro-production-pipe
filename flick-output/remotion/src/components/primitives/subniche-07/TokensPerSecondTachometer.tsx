import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TachometerModel {
  name: string;
  provider: string;
  tps: number;
  maxTps: number;
  color: string;
  badge: string;
  isLeader?: boolean;
}

export interface TokensPerSecondTachometerProps {
  title?: string;
  subtitle?: string;
  models?: TachometerModel[];
  style?: React.CSSProperties;
}

const DEFAULT_MODELS: TachometerModel[] = [
  {
    name: 'GPT-4o',
    provider: 'OpenAI Cloud',
    tps: 76,
    maxTps: 400,
    color: '#f59e0b',
    badge: 'API STANDARD',
  },
  {
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic Cloud',
    tps: 88,
    maxTps: 400,
    color: '#a855f7',
    badge: 'DEEP THINKING',
  },
  {
    name: 'Llama 3 (vLLM / Groq)',
    provider: 'Local / LPUs',
    tps: 342,
    maxTps: 400,
    color: '#10b981',
    badge: 'HYPER-VELOCITY',
    isLeader: true,
  },
];

export const TokensPerSecondTachometer: React.FC<TokensPerSecondTachometerProps> = ({
  title = 'GENERATION VELOCITY TACHOMETER',
  subtitle = 'Real-Time Inference Throughput & Latency Benchmarks',
  models = DEFAULT_MODELS,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const containerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div
      style={{
        width: 880,
        height: 600,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(56, 189, 248, 0.22)',
        borderRadius: 24,
        padding: '30px 34px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(16, 185, 129, 0.1)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        opacity: containerEntrance,
        transform: `translateY(${(1 - containerEntrance) * 20}px)`,
        ...style,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 2,
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '3px 9px',
                borderRadius: 8,
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              THROUGHPUT CLOCK
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>• Streaming Output Tok/s</span>
          </div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: -0.5 }}>
            {title}
          </h2>
          <p style={{ margin: '3px 0 0 0', fontSize: 13, color: '#94a3b8' }}>{subtitle}</p>
        </div>

        {/* Live status badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 20,
            padding: '6px 14px',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981', letterSpacing: 0.5 }}>
            LIVE TEST RUNNING
          </span>
        </div>
      </div>

      {/* Speedometer Dials Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginTop: 10,
        }}
      >
        {models.map((item, idx) => {
          // Staggered needle spring
          const needleSpring = spring({
            frame: Math.max(0, frame - 10 - idx * 8),
            fps,
            config: { damping: 11, stiffness: 85, mass: 0.9 },
          });

          // Engine idle vibration micro-jitter
          const jitter = Math.sin((frame + idx * 25) * 0.4) * (item.isLeader ? 3.5 : 1.2);

          // Value from 0 to target tps
          const currentTps = Math.round(
            interpolate(needleSpring, [0, 1], [0, item.tps]) + (frame > 35 ? jitter : 0)
          );

          // Tachometer angle: 180 degree semi-circle (-90 to +90 deg)
          const ratio = Math.min(1, Math.max(0, currentTps / item.maxTps));
          const needleAngle = -90 + ratio * 180;

          // Arc path parameters
          const radius = 64;
          const strokeWidth = 9;
          const arcLength = Math.PI * radius; // semi-circle circumference
          const strokeDashoffset = arcLength * (1 - ratio);

          return (
            <div
              key={item.name}
              style={{
                backgroundColor: item.isLeader
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'rgba(30, 41, 59, 0.5)',
                border: item.isLeader
                  ? '1px solid rgba(16, 185, 129, 0.45)'
                  : '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: 20,
                padding: '18px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                boxShadow: item.isLeader
                  ? '0 8px 30px rgba(16, 185, 129, 0.15), inset 0 0 20px rgba(16, 185, 129, 0.08)'
                  : 'none',
              }}
            >
              {/* Leader Badge */}
              {item.isLeader && (
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    backgroundColor: '#10b981',
                    color: '#0f172a',
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: 1,
                    padding: '2px 10px',
                    borderRadius: 10,
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
                  }}
                >
                  ⚡ FASTEST MODEL
                </div>
              )}

              {/* Model Info */}
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: item.color,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  {item.badge}
                </span>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{item.provider}</div>
              </div>

              {/* Gauge SVG */}
              <div style={{ position: 'relative', width: 160, height: 105, overflow: 'visible' }}>
                <svg
                  width="160"
                  height="110"
                  viewBox="0 0 160 110"
                  style={{ overflow: 'visible' }}
                >
                  {/* Background Track Arc */}
                  <path
                    d="M 16 95 A 64 64 0 0 1 144 95"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                  />

                  {/* Redline Warning Zone (Far right arc) */}
                  <path
                    d="M 125 45 A 64 64 0 0 1 144 95"
                    fill="none"
                    stroke="rgba(239, 68, 68, 0.25)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                  />

                  {/* Dynamic Colored Progress Arc */}
                  <path
                    d="M 16 95 A 64 64 0 0 1 144 95"
                    fill="none"
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={arcLength}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                      filter: `drop-shadow(0 0 6px ${item.color}aa)`,
                      transition: 'stroke-dashoffset 0.05s ease',
                    }}
                  />

                  {/* Pivot center circle */}
                  <circle cx="80" cy="95" r="7" fill="#1e293b" stroke={item.color} strokeWidth="2.5" />

                  {/* Needle */}
                  <g transform={`rotate(${needleAngle}, 80, 95)`}>
                    <line
                      x1="80"
                      y1="95"
                      x2="80"
                      y2="36"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      style={{ filter: `drop-shadow(0 0 4px ${item.color})` }}
                    />
                    <polygon points="77,50 83,50 80,32" fill="#ffffff" />
                  </g>
                </svg>

                {/* Min/Max indicators */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 8px',
                    boxSizing: 'border-box',
                    fontSize: 10,
                    color: '#64748b',
                    fontFamily: 'monospace',
                  }}
                >
                  <span>0</span>
                  <span>400</span>
                </div>
              </div>

              {/* Digital Speedometer Readout */}
              <div
                style={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    fontFamily: 'monospace',
                    color: item.color,
                    letterSpacing: -1,
                    textShadow: `0 0 16px ${item.color}66`,
                  }}
                >
                  {Math.max(0, currentTps)}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 1 }}>
                  TOKENS / SEC
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Bottom Banner */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 14,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 13,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{ color: '#cbd5e1' }}>
            Local LPUs deliver{' '}
            <strong style={{ color: '#10b981' }}>4.5x faster streaming latency</strong> compared to
            frontier cloud models.
          </span>
        </div>
        <div style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>
          TIME-TO-FIRST-TOKEN: 82ms
        </div>
      </div>
    </div>
  );
};
