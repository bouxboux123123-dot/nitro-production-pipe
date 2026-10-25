import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WebhookPayloadPulseProps {
  sourceAppName?: string;
  sourceEvent?: string;
  destAppName?: string;
  destTable?: string;
  payloadData?: Record<string, string | number>;
  latencyMs?: number;
  pulseSpeed?: number;
  themeColor?: string;
}

export const WebhookPayloadPulse: React.FC<WebhookPayloadPulseProps> = ({
  sourceAppName = 'Typeform',
  sourceEvent = 'New Submission #9042',
  destAppName = 'Airtable',
  destTable = 'CRM Pipeline',
  payloadData = {
    email: 'alex@velocity.io',
    dealSize: '$48,000',
    tier: 'Enterprise',
    status: 'Qualified',
  },
  latencyMs = 42,
  pulseSpeed = 1,
  themeColor = '#38bdf8',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });

  // Cycle animation for the traveling payload along the curve
  // Loop cycle every 75 frames adjusted by pulseSpeed
  const cycleLength = Math.max(30, Math.round(75 / pulseSpeed));
  const cycleFrame = frame % cycleLength;
  const travelProgress = interpolate(cycleFrame, [0, cycleLength * 0.75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse effect at destination node when payload arrives
  const arrivalBurst = interpolate(
    cycleFrame,
    [cycleLength * 0.72, cycleLength * 0.82, cycleLength],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Bezier curve points: P0=(180, 240), P1=(450, 90), P2=(450, 390), P3=(720, 240)
  // Cubic Bezier formula: B(t) = (1-t)^3 P0 + 3(1-t)^2 t P1 + 3(1-t) t^2 P2 + t^3 P3
  const t = travelProgress;
  const p0 = { x: 190, y: 240 };
  const p1 = { x: 450, y: 110 };
  const p2 = { x: 450, y: 370 };
  const p3 = { x: 710, y: 240 };

  const oneMinusT = 1 - t;
  const curX =
    Math.pow(oneMinusT, 3) * p0.x +
    3 * Math.pow(oneMinusT, 2) * t * p1.x +
    3 * oneMinusT * Math.pow(t, 2) * p2.x +
    Math.pow(t, 3) * p3.x;
  const curY =
    Math.pow(oneMinusT, 3) * p0.y +
    3 * Math.pow(oneMinusT, 2) * t * p1.y +
    3 * oneMinusT * Math.pow(t, 2) * p2.y +
    Math.pow(t, 3) * p3.y;

  // Tangent angle for rotating the traveling payload
  const tangentX =
    3 * Math.pow(oneMinusT, 2) * (p1.x - p0.x) +
    6 * oneMinusT * t * (p2.x - p1.x) +
    3 * Math.pow(t, 2) * (p3.x - p2.x);
  const tangentY =
    3 * Math.pow(oneMinusT, 2) * (p1.y - p0.y) +
    6 * oneMinusT * t * (p2.y - p1.y) +
    3 * Math.pow(t, 2) * (p3.y - p2.y);
  const angleRad = Math.atan2(tangentY, tangentX);
  const angleDeg = (angleRad * 180) / Math.PI;

  const payloadOpacity = interpolate(
    cycleFrame,
    [0, 5, cycleLength * 0.72, cycleLength * 0.78],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        width: 900,
        height: 560,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 24,
        border: '1px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(56, 189, 248, 0.12)',
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
      {/* Background ambient grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.08) 0%, transparent 65%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          height: 64,
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
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 10px #10b981',
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>
            Pipeline 01 • Real-Time Webhook Stream
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: '#38bdf8',
            }}
          >
            <span>⚡ LATENCY:</span>
            <span style={{ color: '#fff' }}>{latencyMs}ms</span>
          </div>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: '#34d399',
            }}
          >
            HTTP 200 OK
          </div>
        </div>
      </div>

      {/* Middle Interactive Flow Area */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {/* SVG Bezier Path with Glowing Dash */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <defs>
            <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.5" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Underlay glow track */}
          <path
            d={`M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`}
            fill="none"
            stroke="rgba(56, 189, 248, 0.25)"
            strokeWidth="5"
            strokeDasharray="6 6"
          />

          {/* Glowing Animated Bezier Curve */}
          <path
            d={`M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`}
            fill="none"
            stroke="url(#curveGrad)"
            strokeWidth="3.5"
            filter="url(#glow)"
          />

          {/* Directional Chevrons along curve */}
          <circle cx="340" cy="180" r="3" fill="#38bdf8" opacity="0.6" />
          <circle cx="450" cy="240" r="3.5" fill="#38bdf8" opacity="0.9" />
          <circle cx="560" cy="300" r="3" fill="#34d399" opacity="0.6" />
        </svg>

        {/* Source Node (Left): Typeform */}
        <div
          style={{
            position: 'absolute',
            left: 36,
            top: 130,
            width: 220,
            borderRadius: 18,
            backgroundColor: 'rgba(30, 41, 59, 0.85)',
            border: '1px solid rgba(129, 140, 248, 0.4)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(129, 140, 248, 0.15)',
            padding: 18,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{sourceAppName}</div>
              <div style={{ fontSize: 11, color: '#818cf8', fontWeight: 600 }}>TRIGGER NODE</div>
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#cbd5e1',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {sourceEvent}
          </div>
        </div>

        {/* Destination Node (Right): Airtable */}
        <div
          style={{
            position: 'absolute',
            right: 36,
            top: 130,
            width: 220,
            borderRadius: 18,
            backgroundColor: 'rgba(30, 41, 59, 0.85)',
            border: `1px solid ${arrivalBurst > 0.2 ? '#34d399' : 'rgba(52, 211, 153, 0.4)'}`,
            boxShadow: `0 12px 30px rgba(0, 0, 0, 0.4), 0 0 ${20 + arrivalBurst * 35}px rgba(52, 211, 153, ${0.15 + arrivalBurst * 0.4})`,
            padding: 18,
            boxSizing: 'border-box',
            transform: `scale(${1 + arrivalBurst * 0.04})`,
            transition: 'transform 0.1s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{destAppName}</div>
              <div style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>ACTION NODE</div>
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#cbd5e1',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{destTable}</span>
            <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>+ INSERT</span>
          </div>
        </div>

        {/* Traveling JSON Payload Capsule */}
        <div
          style={{
            position: 'absolute',
            left: curX,
            top: curY,
            transform: `translate(-50%, -50%) rotate(${angleDeg * 0.3}deg)`,
            opacity: payloadOpacity,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
              border: '1.5px solid #38bdf8',
              borderRadius: 14,
              padding: '8px 14px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 800,
                color: '#38bdf8',
              }}
            >
              &#123;&#125;
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#f1f5f9' }}>
              <span style={{ color: '#38bdf8' }}>deal:</span>
              <span style={{ color: '#fef08a' }}> &quot;{String(payloadData.dealSize)}&quot;</span>
            </div>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#38bdf8',
                boxShadow: '0 0 8px #38bdf8',
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Live JSON Payload Inspector Drawer */}
      <div
        style={{
          margin: '0 28px 20px 28px',
          padding: '14px 18px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          borderRadius: 14,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'monospace',
          fontSize: 12,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: '#94a3b8' }}>payload:</span>
          <span style={{ color: '#cbd5e1' }}>&#123;</span>
          {Object.entries(payloadData).map(([key, val], idx, arr) => (
            <span key={key} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ color: '#38bdf8' }}>&quot;{key}&quot;</span>:
              <span style={{ color: typeof val === 'number' ? '#a78bfa' : '#34d399' }}>
                {typeof val === 'number' ? ` ${val}` : ` "${val}"`}
              </span>
              {idx < arr.length - 1 ? <span style={{ color: '#64748b', marginRight: 8 }}>,</span> : null}
            </span>
          ))}
          <span style={{ color: '#cbd5e1' }}>&#125;</span>
        </div>
        <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600 }}>
          CONTENT-TYPE: application/json
        </div>
      </div>
    </div>
  );
};
