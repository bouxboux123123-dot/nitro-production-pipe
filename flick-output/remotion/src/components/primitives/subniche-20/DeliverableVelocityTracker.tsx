import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WorkflowStage {
  name: string;
  durationDays: number;
  slaTargetDays: number;
  isBottleneck?: boolean;
}

export interface DeliverableVelocityTrackerProps {
  title?: string;
  agencyLabel?: string;
  totalCycleTimeDays?: number; // e.g. 4.3
  targetSlaDays?: number; // e.g. 3.0
  activeDeliverablesCount?: number;
  stages?: WorkflowStage[];
  width?: number;
  height?: number;
}

const DEFAULT_STAGES: WorkflowStage[] = [
  { name: '1. Brief Scoping', durationDays: 0.5, slaTargetDays: 0.5 },
  { name: '2. Production & Draft', durationDays: 1.1, slaTargetDays: 1.2 },
  { name: '3. Client Feedback Lag', durationDays: 2.4, slaTargetDays: 1.0, isBottleneck: true },
  { name: '4. Final Polish & Sign-Off', durationDays: 0.3, slaTargetDays: 0.3 },
];

export const DeliverableVelocityTracker: React.FC<DeliverableVelocityTrackerProps> = ({
  title = 'DELIVERABLE VELOCITY TRACKER',
  agencyLabel = 'Agency Output Cycle Time & SLA Radar',
  totalCycleTimeDays = 4.3,
  targetSlaDays = 3.0,
  activeDeliverablesCount = 34,
  stages = DEFAULT_STAGES,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.9 },
  });

  // Animated velocity number counter
  const counterSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16, stiffness: 75 },
  });

  const animatedDays = interpolate(counterSpring, [0, 1], [0, totalCycleTimeDays]);
  const isOverSla = totalCycleTimeDays > targetSlaDays;
  const slaDelta = totalCycleTimeDays - targetSlaDays;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: containerSpring,
        transform: `translateY(${interpolate(containerSpring, [0, 1], [30, 0])}px) scale(${interpolate(
          containerSpring,
          [0, 1],
          [0.93, 1]
        )})`,
        borderRadius: 24,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.15)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Gauge Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(90deg, #f8fafc 30%, #94a3b8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {title}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                }}
              >
                LATENCY WARNING
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              {agencyLabel} &bull; {activeDeliverablesCount} Assets In Flight
            </div>
          </div>
        </div>

        {/* SLA Status Indicator */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '6px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Target SLA
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>
            {targetSlaDays.toFixed(1)} Days
          </div>
        </div>
      </div>

      {/* Main Velocity KPI Banner */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.35)',
          borderRadius: 18,
          padding: '16px 20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Average Turnaround Time (Brief ➔ Sign-Off)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
            <span
              style={{
                fontSize: 42,
                fontWeight: 900,
                fontFamily: 'monospace',
                color: isOverSla ? '#f59e0b' : '#10b981',
                lineHeight: 1,
              }}
            >
              {animatedDays.toFixed(1)} Days
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: isOverSla ? '#ef4444' : '#10b981',
                background: isOverSla ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                padding: '3px 8px',
                borderRadius: 6,
              }}
            >
              {isOverSla ? `+${slaDelta.toFixed(1)}d over SLA limit` : 'Within Target Window'}
            </span>
          </div>
        </div>

        {/* Speed Dial Visual Icon */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '8px 16px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Delivery Throughput</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8', marginTop: 2, fontFamily: 'monospace' }}>
            6.5 Assets / Wk
          </div>
        </div>
      </div>

      {/* Stage Breakdown Waterfall */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: 1,
          zIndex: 2,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Cycle Time Stage Distribution & Latency Points:
        </div>

        {stages.map((stage, idx) => {
          const stageSpring = spring({
            frame: frame - (14 + idx * 5),
            fps,
            config: { damping: 14, stiffness: 100 },
          });

          const maxScaleDays = 3.0; // visual scaling reference
          const barWidthPct = Math.min(100, (stage.durationDays / maxScaleDays) * 100);
          const isBottleneck = !!stage.isBottleneck;

          return (
            <div
              key={stage.name}
              style={{
                opacity: stageSpring,
                transform: `translateX(${interpolate(stageSpring, [0, 1], [-12, 0])}px)`,
                background: isBottleneck ? 'rgba(239, 68, 68, 0.08)' : 'rgba(15, 23, 42, 0.55)',
                border: `1px solid ${isBottleneck ? 'rgba(239, 68, 68, 0.35)' : 'rgba(255, 255, 255, 0.06)'}`,
                borderRadius: 12,
                padding: '10px 14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{stage.name}</span>
                  {isBottleneck && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        padding: '1px 6px',
                        borderRadius: 4,
                        letterSpacing: '0.04em',
                      }}
                    >
                      BOTTLENECK DETECTED
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    SLA: {stage.slaTargetDays}d
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      color: isBottleneck ? '#ef4444' : '#38bdf8',
                    }}
                  >
                    {stage.durationDays} Days
                  </span>
                </div>
              </div>

              {/* Progress bar representing duration */}
              <div
                style={{
                  width: '100%',
                  height: 8,
                  borderRadius: 9999,
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Target SLA line */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${(stage.slaTargetDays / maxScaleDays) * 100}%`,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    zIndex: 2,
                  }}
                />

                {/* Fill bar */}
                <div
                  style={{
                    height: '100%',
                    width: `${interpolate(stageSpring, [0, 1], [0, barWidthPct])}%`,
                    borderRadius: 9999,
                    background: isBottleneck
                      ? 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)'
                      : 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)',
                    boxShadow: isBottleneck ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Diagnostic Insight */}
      <div
        style={{
          marginTop: 12,
          padding: '10px 14px',
          borderRadius: 12,
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}>
          <span>💡</span>
          <span>56% of total delivery delay occurs waiting on client revision approvals.</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>
          Fix: Implement 48h Silence-Is-Consent Rule
        </div>
      </div>
    </div>
  );
};
