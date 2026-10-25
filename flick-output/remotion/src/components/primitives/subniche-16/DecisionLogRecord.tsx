import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AlternativeOption {
  id: string;
  name: string;
  status: 'REJECTED' | 'CHOSEN';
  tradeoff: string;
  estimatedCost: string;
}

export interface DecisionLogRecordProps {
  rfcId?: string;
  title?: string;
  status?: string;
  author?: string;
  authorRole?: string;
  authorAvatar?: string;
  reviewersCount?: number;
  commentsCount?: number;
  meetingsHeld?: number;
  problemStatement?: string;
  alternatives?: AlternativeOption[];
  decisionSummary?: string;
  ownerSignature?: string;
  signDate?: string;
  width?: number;
  height?: number;
}

const DEFAULT_ALTERNATIVES: AlternativeOption[] = [
  {
    id: 'alt-1',
    name: 'Option A: Vertical Scale Redis',
    status: 'REJECTED',
    tradeoff: '+$3,800/mo cost; does not solve write-lock contention.',
    estimatedCost: '$4,200/mo',
  },
  {
    id: 'alt-2',
    name: 'Option B: Multi-Master Cluster',
    status: 'REJECTED',
    tradeoff: 'High operational overhead and split-brain sync risks.',
    estimatedCost: '$2,900/mo',
  },
  {
    id: 'alt-3',
    name: 'Option C: Event-Driven CDC Replicas',
    status: 'CHOSEN',
    tradeoff: 'Zero API stalls, 99.99% availability, 34% cost drop.',
    estimatedCost: '$980/mo',
  },
];

export const DecisionLogRecord: React.FC<DecisionLogRecordProps> = ({
  rfcId = 'RFC-084',
  title = 'Database Cache De-bottlenecking Strategy',
  status = 'APPROVED ASYNC',
  author = 'Elena Rostova',
  authorRole = 'Staff Infrastructure Eng',
  authorAvatar = 'ER',
  reviewersCount = 5,
  commentsCount = 19,
  meetingsHeld = 0,
  problemStatement = 'Synchronous cache flushes stall API gateways during 10x traffic spikes (p99 latency > 850ms).',
  alternatives = DEFAULT_ALTERNATIVES,
  decisionSummary = 'Adopted Option C: Change Data Capture via Kafka. Eliminates sync locks, saves $38k/yr.',
  ownerSignature = 'Elena Rostova',
  signDate = 'Oct 24, 2026',
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

  // Stamp spring animation
  const stampSpring = spring({
    frame: frame - 38,
    fps,
    config: { damping: 11, stiffness: 140, mass: 0.7 },
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
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.90) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow:
          '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Bar: RFC Identifier & Status Pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.08em',
              fontFamily: 'monospace',
              padding: '4px 10px',
              borderRadius: 8,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.35)',
            }}
          >
            {rfcId}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(16, 185, 129, 0.18)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#34d399',
                boxShadow: '0 0 6px #34d399',
              }}
            />
            {status}
          </span>
        </div>

        {/* Meeting-Free Stat Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '4px 12px',
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8' }}>
            <span style={{ color: '#10b981', fontWeight: 800 }}>⚡ {meetingsHeld}</span>
            <span>Meetings Held</span>
          </div>
          <span style={{ color: '#475569' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8' }}>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>💬 {commentsCount}</span>
            <span>Async Comments</span>
          </div>
          <span style={{ color: '#475569' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8' }}>
            <span style={{ color: '#c084fc', fontWeight: 700 }}>👥 {reviewersCount}</span>
            <span>Sign-offs</span>
          </div>
        </div>
      </div>

      {/* Title & Author */}
      <div style={{ marginTop: 8, zIndex: 1 }}>
        <h2
          style={{
            margin: '0 0 4px 0',
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        >
          {title}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 800,
              color: '#fff',
            }}
          >
            {authorAvatar}
          </div>
          <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>{author}</span>
          <span style={{ fontSize: 11, color: '#64748b' }}>• {authorRole}</span>
        </div>
      </div>

      {/* Problem Statement Box */}
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 12,
          padding: '10px 14px',
          marginTop: 10,
          zIndex: 1,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: '#f87171', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Problem Statement
        </div>
        <div style={{ fontSize: 12, color: '#fca5a5', marginTop: 3, lineHeight: 1.4 }}>
          {problemStatement}
        </div>
      </div>

      {/* 3 Alternatives Matrix */}
      <div style={{ marginTop: 12, zIndex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
          Explored Alternatives & Async Evaluation
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.15fr', gap: 10 }}>
          {alternatives.map((alt, idx) => {
            const isChosen = alt.status === 'CHOSEN';
            const altSpring = spring({
              frame: frame - 10 - idx * 8,
              fps,
              config: { damping: 14, stiffness: 120 },
            });

            return (
              <div
                key={alt.id}
                style={{
                  opacity: frame >= 10 + idx * 8 ? altSpring : 0,
                  transform: `translateY(${interpolate(altSpring, [0, 1], [15, 0])}px)`,
                  background: isChosen
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.3) 100%)'
                    : 'rgba(15, 23, 42, 0.65)',
                  border: isChosen
                    ? '1.5px solid #10b981'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isChosen ? '0 0 20px rgba(16, 185, 129, 0.25)' : 'none',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: isChosen ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.2)',
                        color: isChosen ? '#6ee7b7' : '#fca5a5',
                        border: `1px solid ${isChosen ? '#10b981' : 'rgba(239, 68, 68, 0.4)'}`,
                      }}
                    >
                      {isChosen ? '✔ WINNER' : '✕ REJECTED'}
                    </span>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#94a3b8' }}>
                      {alt.estimatedCost}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isChosen ? '#ffffff' : '#cbd5e1', marginTop: 6 }}>
                    {alt.name}
                  </div>
                  <div style={{ fontSize: 10, color: isChosen ? '#a7f3d0' : '#94a3b8', marginTop: 4, lineHeight: 1.35 }}>
                    {alt.tradeoff}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decision Conclusion & Owner Digital Stamp */}
      <div
        style={{
          marginTop: 12,
          padding: '12px 16px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: '65%' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#34d399', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Final Resolution
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginTop: 2, lineHeight: 1.35 }}>
            {decisionSummary}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 10, color: '#94a3b8' }}>
            <span>Signed: <strong style={{ color: '#f8fafc' }}>{ownerSignature}</strong></span>
            <span>•</span>
            <span>Effective: {signDate}</span>
          </div>
        </div>

        {/* Stamp Graphic */}
        <div
          style={{
            opacity: frame >= 38 ? stampSpring : 0,
            transform: `scale(${interpolate(stampSpring, [0, 1], [1.8, 1])}) rotate(-5deg)`,
            border: '2px dashed #10b981',
            borderRadius: 10,
            padding: '6px 14px',
            textAlign: 'center',
            background: 'rgba(6, 78, 59, 0.35)',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.3)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 900, color: '#34d399', letterSpacing: '0.1em' }}>
            PASSED ASYNC
          </div>
          <div style={{ fontSize: 8, color: '#6ee7b7', fontWeight: 700, letterSpacing: '0.05em', marginTop: 2 }}>
            NO MEETING REQUIRED
          </div>
        </div>
      </div>
    </div>
  );
};
