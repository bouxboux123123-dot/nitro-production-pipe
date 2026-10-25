import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RetryAttempt {
  attempt: number;
  statusCode: number;
  statusText: string;
  delaySec: number;
  timestamp: string;
  responseBody: string;
}

export interface ErrorRetryBackoffProps {
  endpoint?: string;
  maxRetries?: number;
  attempts?: RetryAttempt[];
  method?: string;
}

export const ErrorRetryBackoff: React.FC<ErrorRetryBackoffProps> = ({
  endpoint = 'https://api.crm-sync.internal/v2/contacts/sync',
  maxRetries = 3,
  method = 'POST',
  attempts = [
    {
      attempt: 1,
      statusCode: 500,
      statusText: 'Internal Server Error',
      delaySec: 1,
      timestamp: '14:22:01.102',
      responseBody: '{"error": "DB_CONNECTION_TIMEOUT"}',
    },
    {
      attempt: 2,
      statusCode: 503,
      statusText: 'Service Unavailable',
      delaySec: 2,
      timestamp: '14:22:02.105',
      responseBody: '{"error": "RATE_LIMITED_DOWNSTREAM"}',
    },
    {
      attempt: 3,
      statusCode: 200,
      statusText: 'OK (Payload Processed)',
      delaySec: 4,
      timestamp: '14:22:04.110',
      responseBody: '{"success": true, "record_id": "rec_9942a"}',
    },
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

  // Timeline progression:
  // Phase 1 (Frame 0-32): Attempt 1 fails -> cooling down 1s
  // Phase 2 (Frame 33-72): Attempt 2 fails -> cooling down 2s
  // Phase 3 (Frame 73+): Attempt 3 succeeds!
  const currentStage = frame < 32 ? 0 : frame < 72 ? 1 : 2;

  // Cooldown countdown percentage for current active stage
  const cooldownProgress = currentStage === 0
    ? interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })
    : currentStage === 1
    ? interpolate(frame, [33, 70], [0, 1], { extrapolateRight: 'clamp' })
    : 1;

  // Shake / tremor animation on failed attempts
  const shake1 = frame < 18 ? Math.sin(frame * 1.5) * 4 * (1 - frame / 18) : 0;
  const shake2 = frame >= 33 && frame < 50 ? Math.sin((frame - 33) * 1.5) * 4 * (1 - (frame - 33) / 17) : 0;
  const activeShake = shake1 + shake2;

  // Success celebration glow for stage 2
  const successBurst = interpolate(frame, [72, 85, 110], [0, 1, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: 900,
        height: 600,
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        borderRadius: 24,
        border: `1px solid ${currentStage === 2 ? '#10b981' : currentStage === 1 ? '#f59e0b' : '#ef4444'}`,
        boxShadow:
          currentStage === 2
            ? '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(16, 185, 129, 0.25)'
            : '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(239, 68, 68, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        transform: `scale(${entrance}) translate(${activeShake}px, 0)`,
        opacity: entrance,
        transition: 'border 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          height: 64,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              fontSize: 11,
              fontWeight: 800,
              color: '#f87171',
              letterSpacing: '0.05em',
            }}
          >
            CIRCUIT BREAKER
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
            Fault Tolerance • Exponential Backoff
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Strategy:</span>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 12,
              background: 'rgba(30, 41, 59, 0.8)',
              padding: '4px 8px',
              borderRadius: 6,
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            t = base * 2^(retry)
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div
        style={{
          flex: 1,
          padding: '20px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Endpoint Bar */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'monospace', fontSize: 13 }}>
            <span
              style={{
                backgroundColor: '#3b82f6',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: 4,
                fontWeight: 700,
                fontSize: 11,
              }}
            >
              {method}
            </span>
            <span style={{ color: '#cbd5e1' }}>{endpoint}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span style={{ color: '#94a3b8' }}>Attempt:</span>
            <span style={{ fontWeight: 800, color: currentStage === 2 ? '#34d399' : '#f87171' }}>
              {currentStage + 1} / {maxRetries}
            </span>
          </div>
        </div>

        {/* Retry Sequence Timeline Stepper */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
          }}
        >
          {attempts.map((att, idx) => {
            const isVisible = idx <= currentStage;
            const isCurrent = idx === currentStage;
            const isSuccess = att.statusCode === 200;
            const isPending = idx > currentStage;

            const borderColor = isPending
              ? 'rgba(255, 255, 255, 0.06)'
              : isSuccess
              ? '#10b981'
              : att.statusCode === 500
              ? '#ef4444'
              : '#f59e0b';

            return (
              <div
                key={att.attempt}
                style={{
                  padding: '14px',
                  borderRadius: 14,
                  backgroundColor: isPending
                    ? 'rgba(15, 23, 42, 0.4)'
                    : isSuccess
                    ? 'rgba(16, 185, 129, 0.12)'
                    : 'rgba(30, 41, 59, 0.7)',
                  border: `1.5px solid ${borderColor}`,
                  boxShadow: isCurrent && isSuccess
                    ? `0 0 25px rgba(16, 185, 129, ${successBurst})`
                    : 'none',
                  opacity: isPending ? 0.35 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Header line */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>
                    Attempt #{att.attempt}
                  </span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      backgroundColor: isPending
                        ? 'rgba(255, 255, 255, 0.05)'
                        : isSuccess
                        ? '#10b981'
                        : att.statusCode === 500
                        ? '#ef4444'
                        : '#f59e0b',
                      color: '#fff',
                    }}
                  >
                    {isPending ? 'WAITING' : `HTTP ${att.statusCode}`}
                  </span>
                </div>

                {/* Status Message */}
                <div style={{ fontSize: 12, fontWeight: 600, color: isSuccess ? '#34d399' : '#e2e8f0' }}>
                  {isPending ? 'Queued retry' : att.statusText}
                </div>

                {/* Backoff / Cooldown badge */}
                <div
                  style={{
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#94a3b8',
                    fontFamily: 'monospace',
                  }}
                >
                  <span>Backoff:</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                    {att.delaySec}s
                  </span>
                </div>

                {/* Active cooldown progress bar */}
                {isCurrent && !isSuccess && (
                  <div
                    style={{
                      height: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      overflow: 'hidden',
                      marginTop: 4,
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${cooldownProgress * 100}%`,
                        backgroundColor: '#f59e0b',
                        boxShadow: '0 0 8px #f59e0b',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Terminal Log Stream */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'rgba(10, 15, 30, 0.85)',
            borderRadius: 14,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px 16px',
            fontFamily: 'monospace',
            fontSize: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: 11, color: '#64748b', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: 4 }}>
            EXECUTION STACK TRACE & WIRE LOGS
          </div>

          {attempts.slice(0, currentStage + 1).map((att) => (
            <div key={att.attempt} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>[{att.timestamp}]</span>
              <span
                style={{
                  color: att.statusCode === 200 ? '#34d399' : att.statusCode === 500 ? '#ef4444' : '#f59e0b',
                  fontWeight: 700,
                }}
              >
                {att.statusCode === 200 ? 'SUCCESS' : 'FAILURE'}
              </span>
              <span style={{ color: '#94a3b8' }}>-</span>
              <span style={{ color: '#cbd5e1' }}>{att.responseBody}</span>
            </div>
          ))}

          {currentStage < 2 && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#f59e0b', marginTop: 4 }}>
              <span style={{ animation: 'blink 1s infinite' }}>⏳</span>
              <span>Backoff timer active: Retrying in {Math.max(0, attempts[currentStage].delaySec * (1 - cooldownProgress)).toFixed(1)}s...</span>
            </div>
          )}

          {currentStage === 2 && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#34d399', marginTop: 4, fontWeight: 700 }}>
              <span>✓</span>
              <span>200 OK: Payload delivered successfully after 2 retries. Circuit healthy.</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer */}
      <div
        style={{
          height: 40,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          fontSize: 11,
          color: '#94a3b8',
        }}
      >
        <span>Auto-Recovery Engine • Max Retries: 3</span>
        <span style={{ color: currentStage === 2 ? '#34d399' : '#f59e0b' }}>
          Status: {currentStage === 2 ? 'DELIVERED' : 'RETRYING'}
        </span>
      </div>
    </div>
  );
};
