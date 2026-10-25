import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RoadmapTrack {
  id: string;
  team: string;
  teamColor: string;
  title: string;
  lead: string;
  startWeek: number; // 1 to 12
  durationWeeks: number;
  progressPercent: number;
  status: 'completed' | 'in-progress' | 'planned';
  dependsOn?: string;
}

export interface RoadmapTimelineViewProps {
  title?: string;
  subtitle?: string;
  quarterLabel?: string;
  tracks?: RoadmapTrack[];
  currentWeek?: number;
  width?: number;
  height?: number;
}

const DEFAULT_TRACKS: RoadmapTrack[] = [
  {
    id: 'infra',
    team: 'Platform',
    teamColor: '#10b981',
    title: 'Distributed Redis Mesh v2',
    lead: 'Dave K.',
    startWeek: 1,
    durationWeeks: 4,
    progressPercent: 100,
    status: 'completed',
  },
  {
    id: 'auth',
    team: 'Security',
    teamColor: '#38bdf8',
    title: 'FIDO2 Passkeys & Biometrics',
    lead: 'Elena R.',
    startWeek: 3,
    durationWeeks: 5,
    progressPercent: 78,
    status: 'in-progress',
    dependsOn: 'infra',
  },
  {
    id: 'mobile',
    team: 'Mobile',
    teamColor: '#818cf8',
    title: 'Offline-First Local SQLite Sync',
    lead: 'Marcus T.',
    startWeek: 6,
    durationWeeks: 4.5,
    progressPercent: 42,
    status: 'in-progress',
    dependsOn: 'auth',
  },
  {
    id: 'ai',
    team: 'Intelligence',
    teamColor: '#f59e0b',
    title: 'Predictive Triage Auto-pilot',
    lead: 'Aria S.',
    startWeek: 8.5,
    durationWeeks: 3.5,
    progressPercent: 15,
    status: 'planned',
    dependsOn: 'mobile',
  },
];

export const RoadmapTimelineView: React.FC<RoadmapTimelineViewProps> = ({
  title = 'Q3 ENGINEERING ROADMAP & DEPENDENCY GRAPH',
  subtitle = 'Critical Path Gantt Timeline with Cross-Team Handoffs',
  quarterLabel = 'Q3 FY26 (W1 — W12)',
  tracks = DEFAULT_TRACKS,
  currentWeek = 7,
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

  const totalWeeks = 12;

  // Animation progress for timeline bars
  const barsProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 100 },
  });

  // Animated sweep of "TODAY" marker line
  const todayProgress = interpolate(frame, [0, 45], [1, currentWeek], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(18, 22, 38, 0.98) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(129, 140, 248, 0.15)',
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
                background: 'rgba(129, 140, 248, 0.2)',
                color: '#a5b4fc',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.2px',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(129, 140, 248, 0.4)',
                textTransform: 'uppercase',
              }}
            >
              Roadmap Engine
            </span>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              {quarterLabel}
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.4px' }}>
            {title}
          </h2>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>{subtitle}</p>
        </div>

        {/* Legend pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Complete</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>In Flight</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Planned</span>
          </div>
        </div>
      </div>

      {/* Gantt Chart Matrix */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '16px 20px',
          position: 'relative',
        }}
      >
        {/* Months / Weeks Header Row */}
        <div style={{ display: 'flex', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
          <div style={{ width: '220px', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
            WORKSTREAM & INITIATIVE
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', borderRight: '1px solid rgba(255, 255, 255, 0.06)' }}>
              JULY (W1 - W4)
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', borderRight: '1px solid rgba(255, 255, 255, 0.06)' }}>
              AUGUST (W5 - W8)
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>
              SEPTEMBER (W9 - W12)
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
          {/* Vertical Grid Columns (12 weeks) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '220px',
              right: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              pointerEvents: 'none',
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  borderRight: '1px dashed rgba(255, 255, 255, 0.04)',
                  height: '100%',
                }}
              />
            ))}
          </div>

          {/* Glowing TODAY vertical indicator line */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              bottom: '-6px',
              left: `calc(220px + ${(todayProgress / totalWeeks) * 100}% * (1 - 220px / 100%))`,
              width: '2px',
              background: '#38bdf8',
              boxShadow: '0 0 12px #38bdf8',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-16px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#0284c7',
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: 800,
                padding: '2px 5px',
                borderRadius: '3px',
                whiteSpace: 'nowrap',
              }}
            >
              TODAY
            </div>
          </div>

          {/* Render Deliverable Rows */}
          {tracks.map((track) => {
            const leftPct = ((track.startWeek - 1) / totalWeeks) * 100;
            const widthPct = (track.durationWeeks / totalWeeks) * 100;

            const animatedWidth = interpolate(barsProgress, [0, 1], [0, widthPct]);

            return (
              <div key={track.id} style={{ display: 'flex', alignItems: 'center', height: '40px', position: 'relative' }}>
                {/* Track Label */}
                <div style={{ width: '220px', paddingRight: '14px', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        color: track.teamColor,
                        background: `${track.teamColor}22`,
                        padding: '1px 5px',
                        borderRadius: '4px',
                        border: `1px solid ${track.teamColor}44`,
                      }}
                    >
                      {track.team}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{track.lead}</span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#f1f5f9',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {track.title}
                  </div>
                </div>

                {/* Timeline Bar Track Area */}
                <div style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                  {/* The Gantt Bar */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${leftPct}%`,
                      width: `${animatedWidth}%`,
                      height: '26px',
                      background: 'rgba(30, 41, 59, 0.7)',
                      borderRadius: '6px',
                      border: `1px solid ${track.teamColor}66`,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: `0 0 15px ${track.teamColor}25`,
                    }}
                  >
                    {/* Inner Progress Fill */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${track.progressPercent}%`,
                        background: `linear-gradient(90deg, ${track.teamColor}88, ${track.teamColor})`,
                        borderRadius: '5px',
                      }}
                    />

                    {/* Bar Label */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        paddingLeft: '8px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        color: '#ffffff',
                        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {track.progressPercent}%
                    </div>
                  </div>

                  {/* Dependency Line Connector if applicable */}
                  {track.dependsOn && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${leftPct - 10}px`,
                        color: track.teamColor,
                        fontSize: '10px',
                        fontWeight: 800,
                        opacity: 0.7,
                      }}
                    >
                      ↳
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
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
              background: '#10b981',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              color: '#ffffff',
              fontWeight: 800,
            }}
          >
            ✓
          </div>
          <span style={{ fontSize: '12.5px', color: '#cbd5e1', fontWeight: 500 }}>
            Critical Path intact: 4 cross-team dependencies synced with 0 blocking downstream delays.
          </span>
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '12px',
            color: '#10b981',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          ON SCHEDULE (94%)
        </div>
      </div>
    </div>
  );
};
