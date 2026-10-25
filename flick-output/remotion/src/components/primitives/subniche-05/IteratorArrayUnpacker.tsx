import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TaskItem {
  id: string;
  orderNumber: string;
  customer: string;
  amount: string;
  status: 'completed' | 'processing' | 'queued';
}

export interface IteratorArrayUnpackerProps {
  arrayName?: string;
  totalItems?: number;
  tasks?: TaskItem[];
}

export const IteratorArrayUnpacker: React.FC<IteratorArrayUnpackerProps> = ({
  arrayName = 'webhook_event.body.line_items',
  totalItems = 10,
  tasks = [
    { id: '1', orderNumber: '#ORD-1091', customer: 'Acme SaaS', amount: '$420', status: 'completed' },
    { id: '2', orderNumber: '#ORD-1092', customer: 'Linear Bio', amount: '$1,290', status: 'completed' },
    { id: '3', orderNumber: '#ORD-1093', customer: 'Stripe Apps', amount: '$850', status: 'completed' },
    { id: '4', orderNumber: '#ORD-1094', customer: 'Vercel Cloud', amount: '$3,100', status: 'processing' },
    { id: '5', orderNumber: '#ORD-1095', customer: 'Supabase Inc', amount: '$620', status: 'queued' },
    { id: '6', orderNumber: '#ORD-1096', customer: 'Retool Team', amount: '$2,400', status: 'queued' },
    { id: '7', orderNumber: '#ORD-1097', customer: 'Render API', amount: '$990', status: 'queued' },
    { id: '8', orderNumber: '#ORD-1098', customer: 'Fly.io Host', amount: '$1,450', status: 'queued' },
    { id: '9', orderNumber: '#ORD-1099', customer: 'Resend Mail', amount: '$330', status: 'queued' },
    { id: '10', orderNumber: '#ORD-1100', customer: 'Datadog App', amount: '$4,800', status: 'queued' },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });

  // Bundle burst animation starts at frame 15
  const burstSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.6 },
  });

  // Pulse glow for processing item
  const processingPulse = interpolate((frame * 2) % 30, [0, 15, 30], [0.6, 1, 0.6]);

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  return (
    <div
      style={{
        width: 900,
        height: 620,
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        borderRadius: 24,
        border: '1px solid rgba(168, 85, 247, 0.28)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 45px rgba(168, 85, 247, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        transform: `scale(${entrance})`,
        opacity: entrance,
      }}
    >
      {/* Background mesh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header */}
      <div
        style={{
          height: 62,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              background: 'rgba(168, 85, 247, 0.18)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              fontSize: 11,
              fontWeight: 800,
              color: '#c084fc',
              letterSpacing: '0.05em',
            }}
          >
            ITERATOR / UNPACKER
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
            Array Decompression & Queue Splitting
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Processed:</span>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              background: 'rgba(30, 41, 59, 0.8)',
              padding: '3px 10px',
              borderRadius: 6,
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              fontWeight: 700,
            }}
          >
            {completedCount} / {totalItems} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Main Workspace */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          padding: '20px 28px',
          gap: 24,
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left Side: Single Incoming Bundle Block */}
        <div
          style={{
            width: 250,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div
            style={{
              padding: '20px 18px',
              borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(88, 28, 135, 0.25))',
              border: '1.5px solid rgba(168, 85, 247, 0.5)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 25px rgba(168, 85, 247, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Compressed badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: 'rgba(168, 85, 247, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#c084fc',
                  backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  padding: '3px 8px',
                  borderRadius: 12,
                }}
              >
                COMPRESSED
              </span>
            </div>

            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>INCOMING BUNDLE</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginTop: 2, marginBottom: 8 }}>
              Array [10 Items]
            </div>

            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 11,
                color: '#cbd5e1',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.06)',
                wordBreak: 'break-all',
              }}
            >
              {arrayName}
            </div>

            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
              <span>Size: 48.2 KB</span>
              <span style={{ color: '#c084fc', fontWeight: 700 }}>Burst Unpack ⚡</span>
            </div>
          </div>

          {/* Unpack Action Indicator */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: 12,
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Batch Mode:</span>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>1-by-1 Iterative</span>
          </div>
        </div>

        {/* Center Burst Connector SVG */}
        <div style={{ width: 50, height: 400, position: 'relative' }}>
          <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} viewBox="0 0 50 400">
            <path
              d="M 0 200 C 25 200, 25 200, 50 200"
              stroke="#c084fc"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="4 4"
            />
            {/* Burst particle ring */}
            <circle
              cx="25"
              cy="200"
              r={15 * burstSpring}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              opacity={Math.max(0, 1 - burstSpring * 0.7)}
            />
          </svg>
        </div>

        {/* Right Side: 10 Individual Task Cards (2 Columns x 5 Rows) */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            transform: `scale(${interpolate(burstSpring, [0, 1], [0.85, 1])})`,
            opacity: burstSpring,
          }}
        >
          {tasks.map((task, idx) => {
            const isCompleted = task.status === 'completed';
            const isProcessing = task.status === 'processing';

            return (
              <div
                key={task.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  backgroundColor: isCompleted
                    ? 'rgba(16, 185, 129, 0.08)'
                    : isProcessing
                    ? 'rgba(56, 189, 248, 0.12)'
                    : 'rgba(30, 41, 59, 0.5)',
                  border: isCompleted
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : isProcessing
                    ? `1.5px solid rgba(56, 189, 248, ${processingPulse})`
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: isProcessing
                    ? '0 0 16px rgba(56, 189, 248, 0.25)'
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Status Indicator Icon */}
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      backgroundColor: isCompleted
                        ? '#10b981'
                        : isProcessing
                        ? '#0284c7'
                        : 'rgba(100, 116, 139, 0.3)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    {isCompleted ? '✓' : isProcessing ? '↻' : idx + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>
                      {task.orderNumber}
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{task.customer}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', fontFamily: 'monospace' }}>
                    {task.amount}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: isCompleted ? '#34d399' : isProcessing ? '#38bdf8' : '#64748b',
                      textTransform: 'uppercase',
                    }}
                  >
                    {task.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Status Bar */}
      <div
        style={{
          height: 44,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          fontSize: 11,
          color: '#94a3b8',
          zIndex: 2,
        }}
      >
        <div>
          Iterator Stream: <span style={{ color: '#38bdf8', fontWeight: 600 }}>Item 4 executing</span> • Next in line: 6 remaining
        </div>
        <div style={{ color: '#64748b' }}>Rate: 14 ops/sec • No-Lock Concurrent</div>
      </div>
    </div>
  );
};
