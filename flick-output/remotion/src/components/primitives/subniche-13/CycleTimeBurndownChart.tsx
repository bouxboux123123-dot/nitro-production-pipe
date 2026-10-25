import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BurndownDataPoint {
  day: number;
  actualPoints: number;
  label?: string;
}

export interface CycleTimeBurndownChartProps {
  title?: string;
  subtitle?: string;
  sprintName?: string;
  totalPoints?: number;
  currentDay?: number;
  totalDays?: number;
  dataPoints?: BurndownDataPoint[];
  avgCycleTime?: string;
  completionRate?: string;
  width?: number;
  height?: number;
}

const DEFAULT_BURNDOWN_POINTS: BurndownDataPoint[] = [
  { day: 0, actualPoints: 64, label: 'Sprint Start' },
  { day: 2, actualPoints: 62 },
  { day: 4, actualPoints: 54, label: 'Auth V2 Shipped' },
  { day: 6, actualPoints: 46 },
  { day: 8, actualPoints: 35, label: 'Mid-Sprint Sync' },
  { day: 10, actualPoints: 24 },
  { day: 12, actualPoints: 12, label: 'Code Freeze' },
  { day: 14, actualPoints: 6, label: '91% Done' },
];

export const CycleTimeBurndownChart: React.FC<CycleTimeBurndownChartProps> = ({
  title = 'SPRINT VELOCITY BURNDOWN',
  subtitle = 'Team Cycle Time & Issue Burn Rate Trajectory',
  sprintName = 'Sprint 42 (Core Engine v2)',
  totalPoints = 64,
  currentDay = 14,
  totalDays = 14,
  dataPoints = DEFAULT_BURNDOWN_POINTS,
  avgCycleTime = '1.8 Days',
  completionRate = '91%',
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Animated line draw progress (0 to 1 over 60 frames)
  const lineProgress = interpolate(frame, [10, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 270;
  const padLeft = 50;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 35;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  // Scale functions
  const getX = (day: number) => padLeft + (day / totalDays) * chartW;
  const getY = (pts: number) => padTop + chartH - (pts / totalPoints) * chartH;

  // Ideal guide line coordinates: (0, totalPoints) to (totalDays, 0)
  const idealX1 = getX(0);
  const idealY1 = getY(totalPoints);
  const idealX2 = getX(totalDays);
  const idealY2 = getY(0);

  // Generate SVG path for actual burndown points
  const pointsCoords = dataPoints.map((pt) => ({
    x: getX(pt.day),
    y: getY(pt.actualPoints),
    ...pt,
  }));

  // Build SVG path string
  let actualPathD = '';
  if (pointsCoords.length > 0) {
    actualPathD = `M ${pointsCoords[0].x} ${pointsCoords[0].y}`;
    for (let i = 1; i < pointsCoords.length; i++) {
      // Smooth cubic curve between points
      const prev = pointsCoords[i - 1];
      const curr = pointsCoords[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      actualPathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }
  }

  // Closed area for gradient fill
  const areaPathD = `${actualPathD} L ${pointsCoords[pointsCoords.length - 1].x} ${padTop + chartH} L ${pointsCoords[0].x} ${padTop + chartH} Z`;

  // Estimate total curve length for strokeDashoffset animation
  const estimatedPathLength = 1000;
  const strokeDashoffset = interpolate(lineProgress, [0, 1], [estimatedPathLength, 0]);

  // Current active points remaining based on lineProgress
  const currentActualPoints = Math.round(
    interpolate(lineProgress, [0, 1], [totalPoints, dataPoints[dataPoints.length - 1].actualPoints])
  );

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(17, 24, 39, 0.98) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.15)',
        backdropFilter: 'blur(20px)',
        padding: '26px 30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#f8fafc',
        boxSizing: 'border-box',
        transform: `scale(${interpolate(entrance, [0, 1], [0.93, 1])}) translateY(${interpolate(entrance, [0, 1], [25, 0])}px)`,
        opacity: interpolate(entrance, [0, 1], [0, 1]),
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <span
              style={{
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.2px',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                textTransform: 'uppercase',
              }}
            >
              Sprint Radar
            </span>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              {sprintName}
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.4px' }}>
            {title}
          </h2>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>{subtitle}</p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '2px', borderTop: '2px dashed #64748b' }} />
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Ideal Guideline</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '3px', background: '#38bdf8', borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>Actual Burndown</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '16px',
          padding: '12px 14px',
          position: 'relative',
        }}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="burndownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal Grid Lines */}
          {[0, 16, 32, 48, 64].map((pts) => {
            const y = getY(pts);
            return (
              <g key={pts}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={padLeft + chartW}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="4 4"
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="11"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {pts}p
                </text>
              </g>
            );
          })}

          {/* Vertical Grid Lines & Day Labels */}
          {[0, 2, 4, 6, 8, 10, 12, 14].map((day) => {
            const x = getX(day);
            return (
              <g key={day}>
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + chartH}
                  stroke="rgba(255, 255, 255, 0.05)"
                />
                <text
                  x={x}
                  y={padTop + chartH + 20}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  Day {day}
                </text>
              </g>
            );
          })}

          {/* Ideal Guideline */}
          <line
            x1={idealX1}
            y1={idealY1}
            x2={idealX2}
            y2={idealY2}
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="6 6"
            opacity="0.7"
          />

          {/* Actual Gradient Fill */}
          <path
            d={areaPathD}
            fill="url(#burndownGrad)"
            opacity={interpolate(lineProgress, [0, 0.5], [0, 1])}
          />

          {/* Actual Burndown Animated Line */}
          <path
            d={actualPathD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={estimatedPathLength}
            strokeDashoffset={strokeDashoffset}
            filter="url(#glow)"
          />

          {/* Data points & milestone dots */}
          {pointsCoords.map((pt, idx) => {
            const ptAppearProgress = interpolate(lineProgress, [(idx - 0.5) / pointsCoords.length, idx / pointsCoords.length], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            if (ptAppearProgress <= 0) return null;

            return (
              <g key={idx} opacity={ptAppearProgress}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={5}
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                {pt.label && (
                  <g>
                    <rect
                      x={pt.x - 45}
                      y={pt.y - 28}
                      width="90"
                      height="18"
                      rx="4"
                      fill="rgba(15, 23, 42, 0.85)"
                      stroke="rgba(56, 189, 248, 0.4)"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 15}
                      textAnchor="middle"
                      fill="#e0f2fe"
                      fontSize="9.5"
                      fontWeight="600"
                    >
                      {pt.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom KPI Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '10px 14px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>REMAINING WORK</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '3px' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8', fontFamily: '"JetBrains Mono", monospace' }}>
              {currentActualPoints}
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>/ {totalPoints} pts</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '10px 14px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>AVG CYCLE TIME</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '3px' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', fontFamily: '"JetBrains Mono", monospace' }}>
              {avgCycleTime}
            </span>
            <span style={{ fontSize: '11px', color: '#34d399' }}>(-40%)</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '10px 14px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>COMPLETION RATE</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '3px' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#818cf8', fontFamily: '"JetBrains Mono", monospace' }}>
              {completionRate}
            </span>
            <span style={{ fontSize: '11px', color: '#a5b4fc' }}>on target</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '10px 14px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>WIP CONCURRENCY</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '3px' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#f59e0b', fontFamily: '"JetBrains Mono", monospace' }}>
              5 Active
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Max 6</span>
          </div>
        </div>
      </div>
    </div>
  );
};
