import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface LatencyStep {
  name: string;
  durationMs: number;
  completedAtFrame: number;
}

export interface TicketingSpeedStopwatchProps {
  title?: string;
  subtitle?: string;
  linearToolName?: string;
  linearDurationSeconds?: number;
  linearSteps?: LatencyStep[];
  jiraToolName?: string;
  jiraDurationSeconds?: number;
  jiraSteps?: LatencyStep[];
  comparisonMultiplier?: string;
  width?: number;
  height?: number;
}

const DEFAULT_LINEAR_STEPS: LatencyStep[] = [
  { name: 'Command Palette Trigger (⌘K)', durationMs: 40, completedAtFrame: 12 },
  { name: 'Local Optimistic Cache Sync', durationMs: 180, completedAtFrame: 22 },
  { name: 'Instant UI Canvas Render', durationMs: 980, completedAtFrame: 36 },
];

const DEFAULT_JIRA_STEPS: LatencyStep[] = [
  { name: 'Resolving Custom Field Schema (42 fields)', durationMs: 2400, completedAtFrame: 40 },
  { name: 'Permission & Workflow Guard Evaluation', durationMs: 3100, completedAtFrame: 65 },
  { name: 'Re-indexing Cloud Database & Assets', durationMs: 2900, completedAtFrame: 95 },
];

export const TicketingSpeedStopwatch: React.FC<TicketingSpeedStopwatchProps> = ({
  title = 'TICKETING LATENCY BENCHMARK',
  subtitle = 'Ticket Creation & Workflow Responsiveness',
  linearToolName = 'Linear (Modern Speed)',
  linearDurationSeconds = 1.2,
  linearSteps = DEFAULT_LINEAR_STEPS,
  jiraToolName = 'Jira Cloud (Legacy Stack)',
  jiraDurationSeconds = 8.4,
  jiraSteps = DEFAULT_JIRA_STEPS,
  comparisonMultiplier = '7.0x FASTER',
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Linear stopwatch completes at frame 36 (~1.2s at 30fps)
  const linearFinishFrame = 36;
  const linearProgress = interpolate(frame, [0, linearFinishFrame], [0, linearDurationSeconds], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Jira stopwatch completes at frame 100 (~3.3s animated speed-up representing 8.4s)
  const jiraFinishFrame = 95;
  const jiraProgress = interpolate(frame, [0, jiraFinishFrame], [0, jiraDurationSeconds], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isLinearComplete = frame >= linearFinishFrame;
  const isJiraComplete = frame >= jiraFinishFrame;

  // Pulse when Linear finishes
  const linearDoneScale = isLinearComplete
    ? 1 + 0.05 * Math.sin((frame - linearFinishFrame) * 0.4) * Math.max(0, 1 - (frame - linearFinishFrame) / 30)
    : 1;

  // Circular gauge values (0 to 1)
  const linearAngle = Math.min(1, linearProgress / 2.0); // scale up for visual impact
  const jiraAngle = Math.min(1, jiraProgress / 10.0);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(20, 20, 35, 0.96) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(94, 106, 210, 0.15)',
        backdropFilter: 'blur(20px)',
        padding: '28px 32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#f8fafc',
        boxSizing: 'border-box',
        transform: `scale(${interpolate(entrance, [0, 1], [0.94, 1])}) translateY(${interpolate(entrance, [0, 1], [25, 0])}px)`,
        opacity: interpolate(entrance, [0, 1], [0, 1]),
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                background: 'rgba(94, 106, 210, 0.25)',
                color: '#a5b4fc',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.2px',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(94, 106, 210, 0.4)',
                textTransform: 'uppercase',
              }}
            >
              Benchmark
            </span>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              PAGE 7 • WORKFLOW ENGINE ANALYSIS
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '23px', fontWeight: 800, letterSpacing: '-0.5px', color: '#ffffff' }}>
            {title}
          </h2>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>{subtitle}</p>
        </div>

        {/* Highlight badge */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(94, 106, 210, 0.22))',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '12px',
            padding: '8px 16px',
            textAlign: 'right',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)',
          }}
        >
          <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, letterSpacing: '0.8px' }}>
            PERFORMANCE GAP
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 900,
              color: '#34d399',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {comparisonMultiplier}
          </div>
        </div>
      </div>

      {/* Split Comparison Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '14px 0' }}>
        {/* Left Column: Linear */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.5) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: isLinearComplete ? '1px solid rgba(94, 106, 210, 0.6)' : '1px solid rgba(94, 106, 210, 0.3)',
            borderRadius: '16px',
            padding: '18px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: isLinearComplete ? '0 0 30px rgba(94, 106, 210, 0.25)' : 'none',
            transform: `scale(${linearDoneScale})`,
            transition: 'transform 0.1s ease',
          }}
        >
          {/* Header pill */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#5e6ad2',
                  boxShadow: '0 0 10px #5e6ad2',
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#e0e7ff' }}>{linearToolName}</span>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isLinearComplete ? '#34d399' : '#a5b4fc',
                background: isLinearComplete ? 'rgba(16, 185, 129, 0.15)' : 'rgba(94, 106, 210, 0.15)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: `1px solid ${isLinearComplete ? 'rgba(16, 185, 129, 0.3)' : 'rgba(94, 106, 210, 0.3)'}`,
              }}
            >
              {isLinearComplete ? '✓ SUB-SECOND READY' : 'INTERACTING...'}
            </span>
          </div>

          {/* Stopwatch Digital Readout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              padding: '14px 0',
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                fontSize: '52px',
                fontWeight: 900,
                fontFamily: '"JetBrains Mono", monospace',
                color: '#60a5fa',
                letterSpacing: '-1.5px',
                textShadow: '0 0 25px rgba(96, 165, 250, 0.4)',
              }}
            >
              {linearProgress.toFixed(2)}
            </span>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 600,
                color: '#94a3b8',
                marginLeft: '4px',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              s
            </span>
          </div>

          {/* Step Progress Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {linearSteps.map((step, idx) => {
              const stepDone = frame >= step.completedAtFrame;
              const stepEntrance = spring({
                frame: frame - (step.completedAtFrame - 8),
                fps,
                config: { damping: 15, stiffness: 150 },
              });

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: stepDone ? 'rgba(94, 106, 210, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: stepDone ? '1px solid rgba(94, 106, 210, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                    opacity: interpolate(stepEntrance, [0, 1], [0.35, 1]),
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: stepDone ? '#34d399' : '#64748b' }}>
                      {stepDone ? '●' : '○'}
                    </span>
                    <span style={{ fontSize: '11.5px', color: stepDone ? '#f1f5f9' : '#94a3b8', fontWeight: 500 }}>
                      {step.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: stepDone ? '#818cf8' : '#475569',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontWeight: 600,
                    }}
                  >
                    {step.durationMs}ms
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Jira */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(69, 26, 3, 0.25) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: isJiraComplete ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '18px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Header pill */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  boxShadow: '0 0 10px #f59e0b',
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fde68a' }}>{jiraToolName}</span>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isJiraComplete ? '#f59e0b' : '#f87171',
                background: isJiraComplete ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: `1px solid ${isJiraComplete ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              }}
            >
              {isJiraComplete ? '⚠ BLOATED RETRIEVAL' : 'SPINNING CLOUD LATENCY...'}
            </span>
          </div>

          {/* Stopwatch Digital Readout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              padding: '14px 0',
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                fontSize: '52px',
                fontWeight: 900,
                fontFamily: '"JetBrains Mono", monospace',
                color: isJiraComplete ? '#f59e0b' : '#ef4444',
                letterSpacing: '-1.5px',
                textShadow: isJiraComplete
                  ? '0 0 25px rgba(245, 158, 11, 0.4)'
                  : '0 0 25px rgba(239, 68, 68, 0.4)',
              }}
            >
              {jiraProgress.toFixed(2)}
            </span>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 600,
                color: '#94a3b8',
                marginLeft: '4px',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              s
            </span>
          </div>

          {/* Step Progress Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {jiraSteps.map((step, idx) => {
              const stepDone = frame >= step.completedAtFrame;
              const stepEntrance = spring({
                frame: frame - (step.completedAtFrame - 10),
                fps,
                config: { damping: 15, stiffness: 150 },
              });

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: stepDone ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: stepDone ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                    opacity: interpolate(stepEntrance, [0, 1], [0.35, 1]),
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: stepDone ? '#f59e0b' : '#64748b' }}>
                      {stepDone ? '⏳' : '○'}
                    </span>
                    <span style={{ fontSize: '11.5px', color: stepDone ? '#fef3c7' : '#94a3b8', fontWeight: 500 }}>
                      {step.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: stepDone ? '#fbbf24' : '#475569',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontWeight: 600,
                    }}
                  >
                    {step.durationMs}ms
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Summary Callout */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              background: '#3b82f6',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#ffffff',
              fontWeight: 800,
            }}
          >
            ⚡
          </div>
          <span style={{ fontSize: '12.5px', color: '#cbd5e1', fontWeight: 500 }}>
            Modern engineers create 12+ tickets daily. Linear saves ~1.5 hours of pure UI wait time per engineer every month.
          </span>
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '12px',
            color: '#38bdf8',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          -7.2s / ACTION
        </div>
      </div>
    </div>
  );
};
