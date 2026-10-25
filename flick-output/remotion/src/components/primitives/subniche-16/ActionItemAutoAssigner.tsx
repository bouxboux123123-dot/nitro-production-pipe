import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TranscriptLine {
  id: string;
  speaker: string;
  role: string;
  timestamp: string;
  avatarColor: string;
  text: string;
  hasMention?: boolean;
  highlightedText?: string;
}

export interface ExtractedTask {
  id: string;
  title: string;
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  ticketRef: string;
  confidence: number;
}

export interface ActionItemAutoAssignerProps {
  title?: string;
  badgeText?: string;
  meetingTopic?: string;
  transcriptLines?: TranscriptLine[];
  tasks?: ExtractedTask[];
  width?: number;
  height?: number;
}

const DEFAULT_TRANSCRIPT: TranscriptLine[] = [
  {
    id: 't-1',
    speaker: 'Elena Rostova',
    role: 'Lead Architect',
    timestamp: '14:22',
    avatarColor: 'linear-gradient(135deg, #06b6d4, #0284c7)',
    text: 'Looking at query locks: @Alex can you deploy the Redis replica index and run latency benchmarks before Thursday?',
    hasMention: true,
    highlightedText: '@Alex can you deploy the Redis replica index and run latency benchmarks before Thursday?',
  },
  {
    id: 't-2',
    speaker: 'Alex Chen',
    role: 'Backend Eng',
    timestamp: '14:24',
    avatarColor: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    text: 'On it! I will also configure the Prometheus dashboard so we have live latency charts.',
    hasMention: false,
  },
];

const DEFAULT_TASKS: ExtractedTask[] = [
  {
    id: 'task-1',
    title: 'Deploy Redis replica index & run latency benchmarks',
    assignee: 'Alex Chen',
    assigneeInitials: 'AC',
    dueDate: 'Thursday, 5:00 PM',
    priority: 'HIGH',
    ticketRef: 'ENG-489',
    confidence: 99,
  },
  {
    id: 'task-2',
    title: 'Configure Prometheus dashboard for latency metrics',
    assignee: 'Alex Chen',
    assigneeInitials: 'AC',
    dueDate: 'Friday, 12:00 PM',
    priority: 'MEDIUM',
    ticketRef: 'ENG-490',
    confidence: 96,
  },
];

export const ActionItemAutoAssigner: React.FC<ActionItemAutoAssignerProps> = ({
  title = 'AI TRANSCRIPT ACTION EXTRACTOR',
  badgeText = 'NLP AUTO-DISPATCH ACTIVE',
  meetingTopic = 'Architecture Review: Redis Lock Contention',
  transcriptLines = DEFAULT_TRANSCRIPT,
  tasks = DEFAULT_TASKS,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.9 },
  });

  // Highlight marker animation for the mention sentence
  const highlightProgress = interpolate(frame, [15, 45], [0, 100], {
    extrapolateLeft: 'clamp',
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
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.90) 100%)',
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
      {/* Background glow orb */}
      <div
        style={{
          position: 'absolute',
          top: -70,
          right: -70,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.08em',
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
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#c084fc',
                  boxShadow: '0 0 6px #c084fc',
                }}
              />
              {badgeText}
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              Zero manual note-taking required
            </span>
          </div>
          <h2
            style={{
              margin: '6px 0 0 0',
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            {title}
          </h2>
        </div>

        {/* Meeting context pill */}
        <div
          style={{
            padding: '6px 12px',
            borderRadius: 10,
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>SOURCE CONVERSATION</div>
          <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 700 }}>{meetingTopic}</div>
        </div>
      </div>

      {/* Split Area: Left Live Transcript -> Right Extracted Action Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 1fr',
          gap: 18,
          margin: '14px 0',
          flex: 1,
          zIndex: 1,
        }}
      >
        {/* Left Column: Transcript Stream */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Real-time Audio Transcript
            </span>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} />
              STREAMING 100% ACCURACY
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {transcriptLines.map((line, idx) => {
              const lineSpring = spring({
                frame: frame - idx * 12,
                fps,
                config: { damping: 14, stiffness: 120 },
              });

              return (
                <div
                  key={line.id}
                  style={{
                    opacity: frame >= idx * 12 ? lineSpring : 0,
                    transform: `translateY(${interpolate(lineSpring, [0, 1], [15, 0])}px)`,
                    background: 'rgba(30, 41, 59, 0.5)',
                    borderRadius: 12,
                    padding: '10px 12px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: line.avatarColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 9,
                        fontWeight: 800,
                        color: '#fff',
                      }}
                    >
                      {line.speaker.charAt(0)}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>
                      {line.speaker}
                    </span>
                    <span style={{ fontSize: 10, color: '#64748b' }}>({line.role})</span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: 'monospace', color: '#475569' }}>
                      {line.timestamp}
                    </span>
                  </div>

                  {/* Transcript Content with Dynamic Highlighting */}
                  <div style={{ fontSize: 12, lineHeight: 1.4, color: '#cbd5e1' }}>
                    {line.hasMention ? (
                      <span>
                        Looking at query locks:{' '}
                        <span
                          style={{
                            background: `linear-gradient(90deg, rgba(245, 158, 11, 0.35) 0%, rgba(245, 158, 11, 0.35) ${highlightProgress}%, transparent ${highlightProgress}%)`,
                            borderBottom: '2px solid #f59e0b',
                            padding: '1px 3px',
                            borderRadius: 4,
                            color: '#fbbf24',
                            fontWeight: 700,
                            transition: 'all 0.1s ease',
                          }}
                        >
                          {line.highlightedText}
                        </span>
                      </span>
                    ) : (
                      line.text
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Parser status badge */}
          <div
            style={{
              marginTop: 10,
              padding: '8px 12px',
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
            <span>⚡</span>
            <span>Detected direct commitment from <strong>@Alex Chen</strong></span>
          </div>
        </div>

        {/* Right Column: Auto-Assigned Task Cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Auto-Generated Tickets
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 4,
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.35)',
              }}
            >
              SYNCED TO LINEAR
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasks.map((task, idx) => {
              const taskDelay = 42 + idx * 14;
              const taskSpring = spring({
                frame: frame - taskDelay,
                fps,
                config: { damping: 13, stiffness: 120 },
              });
              const isVisible = frame >= taskDelay;

              return (
                <div
                  key={task.id}
                  style={{
                    opacity: isVisible ? taskSpring : 0,
                    transform: `translateX(${interpolate(taskSpring, [0, 1], [30, 0])}px)`,
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1.5px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: 14,
                    padding: '12px 14px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(56, 189, 248, 0.1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: 'rgba(56, 189, 248, 0.2)',
                        color: '#38bdf8',
                      }}
                    >
                      {task.ticketRef}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: task.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: task.priority === 'HIGH' ? '#f87171' : '#fbbf24',
                      }}
                    >
                      {task.priority} PRIORITY
                    </span>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginTop: 8, lineHeight: 1.3 }}>
                    {task.title}
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      paddingTop: 8,
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 800,
                          color: '#fff',
                        }}
                      >
                        {task.assigneeInitials}
                      </div>
                      <span style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 600 }}>{task.assignee}</span>
                    </div>

                    <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>
                      Due: <strong style={{ color: '#f8fafc' }}>{task.dueDate}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontSize: 11,
              color: '#6ee7b7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>✨ 2 Tasks Dispatched to Linear Sprint</span>
            <span style={{ fontWeight: 800, color: '#34d399' }}>99% Match</span>
          </div>
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
          <span>Zero manual action items missed</span>
          <span style={{ color: '#475569' }}>•</span>
          <span>Automatic SLA notifications configured</span>
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#c084fc',
            background: 'rgba(168, 85, 247, 0.12)',
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid rgba(168, 85, 247, 0.25)',
          }}
        >
          View in Linear Project Board →
        </div>
      </div>
    </div>
  );
};
