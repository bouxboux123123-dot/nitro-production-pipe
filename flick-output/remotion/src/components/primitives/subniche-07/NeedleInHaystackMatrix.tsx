import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NeedleInHaystackMatrixProps {
  title?: string;
  subtitle?: string;
  accuracyPercent?: number;
  contextHorizon?: string;
  needleTokenIndex?: string;
  needleDepth?: string;
  needleSnippet?: string;
  style?: React.CSSProperties;
}

export const NeedleInHaystackMatrix: React.FC<NeedleInHaystackMatrixProps> = ({
  title = 'NEEDLE-IN-A-HAYSTACK RETRIEVAL MATRIX',
  subtitle = '10,000-Chunk Context Pressure Test Across 1,000,000 Tokens',
  accuracyPercent = 100,
  contextHorizon = '1M TOKENS',
  needleTokenIndex = '742,810',
  needleDepth = '74.2%',
  needleSnippet = "The secret activation code is: 'NEURAL-VECTOR-99'",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Radar sweep progress across grid (0 to 1)
  const sweepProgress = interpolate(frame, [10, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Dynamic accuracy counter
  const animatedAccuracy = (
    interpolate(sweepProgress, [0, 1], [0, accuracyPercent])
  ).toFixed(1);

  // Dynamic chunks scanned counter
  const scannedChunks = Math.round(interpolate(sweepProgress, [0, 1], [0, 10000]));

  // Grid dimensions: 20 columns x 10 rows = 200 high-res sectors (representing 10,000 data chunks)
  const cols = 22;
  const rows = 10;
  const totalCells = cols * rows;

  // Fixed needle coordinates in grid (approx 74% depth, 74% width)
  const needleRow = 7;
  const needleCol = 16;
  const needleCellIndex = needleRow * cols + needleCol;

  return (
    <div
      style={{
        width: 880,
        height: 600,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 24,
        padding: '28px 34px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(16, 185, 129, 0.12)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        opacity: enterSpring,
        transform: `translateY(${(1 - enterSpring) * 20}px)`,
        ...style,
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 2,
                color: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                padding: '3px 9px',
                borderRadius: 8,
                border: '1px solid rgba(16, 185, 129, 0.35)',
              }}
            >
              PRESSURE BENCHMARK
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>• NIAH Accuracy Grid</span>
          </div>
          <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, color: '#ffffff', letterSpacing: -0.5 }}>
            {title}
          </h2>
          <p style={{ margin: '3px 0 0 0', fontSize: 13, color: '#94a3b8' }}>{subtitle}</p>
        </div>

        {/* Live Accuracy Meter */}
        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 16,
            padding: '8px 18px',
            textAlign: 'right',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5 }}>
            RECALL ACCURACY
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              fontFamily: 'monospace',
              color: '#10b981',
              letterSpacing: -0.5,
            }}
          >
            {animatedAccuracy}%
            <span style={{ fontSize: 11, color: '#cbd5e1', marginLeft: 6 }}>
              ({scannedChunks.toLocaleString()} chunks)
            </span>
          </div>
        </div>
      </div>

      {/* Matrix Display Container */}
      <div style={{ position: 'relative', marginTop: 10, marginBottom: 8 }}>
        {/* Axis Labels */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: '#64748b',
            marginBottom: 6,
            padding: '0 4px',
            fontFamily: 'monospace',
          }}
        >
          <span>Context: 0K</span>
          <span>250K</span>
          <span>500K</span>
          <span>750K</span>
          <span style={{ color: '#10b981', fontWeight: 700 }}>{contextHorizon}</span>
        </div>

        {/* Grid Cells */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 18px)`,
            gap: 4,
            background: 'rgba(30, 41, 59, 0.4)',
            padding: 10,
            borderRadius: 14,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
          }}
        >
          {Array.from({ length: totalCells }).map((_, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);

            // Normalized position in sweep (combines col & row)
            const cellWeight = (col / cols) * 0.8 + (row / rows) * 0.2;
            const isLit = sweepProgress >= cellWeight;
            const isNeedle = idx === needleCellIndex;

            // Needle pulse
            const needlePulse = Math.sin(frame * 0.3) * 0.5 + 0.5;

            return (
              <div
                key={idx}
                style={{
                  borderRadius: 3,
                  backgroundColor: isNeedle
                    ? '#ffffff'
                    : isLit
                    ? '#10b981'
                    : 'rgba(30, 41, 59, 0.8)',
                  boxShadow: isNeedle
                    ? `0 0 ${12 + needlePulse * 10}px #ffffff, 0 0 20px #38bdf8`
                    : isLit
                    ? '0 0 5px rgba(16, 185, 129, 0.5)'
                    : 'none',
                  opacity: isNeedle ? 1 : isLit ? 0.9 : 0.35,
                  transition: 'background-color 0.15s ease, opacity 0.15s ease',
                  position: 'relative',
                }}
              />
            );
          })}
        </div>

        {/* Depth Axis Labels (Left & Right indicators) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            color: '#64748b',
            marginTop: 6,
            fontFamily: 'monospace',
          }}
        >
          <span>Depth: 0% (Start)</span>
          <span>Document Center: 50%</span>
          <span>Depth: 100% (End)</span>
        </div>
      </div>

      {/* Target Needle Callout Card */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.75)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: 14,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Target Reticle Icon */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: 'rgba(56, 189, 248, 0.18)',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="22" y1="12" x2="18" y2="12" />
              <line x1="6" y1="12" x2="2" y2="12" />
              <line x1="12" y1="6" x2="12" y2="2" />
              <line x1="12" y1="22" x2="12" y2="18" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>
                TARGET NEEDLE LOCATED
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#38bdf8',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                Depth: {needleDepth} • Token #{needleTokenIndex}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 3 }}>
              {needleSnippet}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#10b981', fontWeight: 800 }}>
            100% PERFECT RECALL
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Loss Rate: 0.00%
          </div>
        </div>
      </div>

      {/* Footer Info Ribbon */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 12,
          fontSize: 12,
          color: '#64748b',
        }}
      >
        <span>Test Suite: Synthetic Needle-in-a-Haystack (NIAH) Standard</span>
        <span style={{ color: '#10b981', fontWeight: 600 }}>Zero Context Degradation Verified</span>
      </div>
    </div>
  );
};
