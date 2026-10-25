import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RevisionCounterDialProps {
  title?: string;
  agreedRevisions?: number;
  currentRevisions?: number;
  hourlyRate?: number;
  estimatedHoursPerExtraRev?: number;
  width?: number;
  height?: number;
}

export const RevisionCounterDial: React.FC<RevisionCounterDialProps> = ({
  title = 'CLIENT REVISION TRACKER',
  agreedRevisions = 2,
  currentRevisions = 4,
  hourlyRate = 150,
  estimatedHoursPerExtraRev = 2.5,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance card spring
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Needle and count animation ticking from 1 up to currentRevisions
  // Over frames 10 to 60
  const tickProgress = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const animatedRevision = interpolate(tickProgress, [0, 1], [1, currentRevisions]);
  const currentRevNumber = Math.min(currentRevisions, Math.floor(animatedRevision + 0.1));

  // Dial angles: -120 deg (Rev 0) to +120 deg (Rev 5)
  // Max revs on dial scale = 5
  const maxDialRevs = 5;
  const needleAngle = interpolate(animatedRevision, [0, maxDialRevs], [-120, 120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isOverLimit = currentRevNumber > agreedRevisions;
  const excessRevisions = Math.max(0, currentRevNumber - agreedRevisions);
  const totalSurcharge = excessRevisions * estimatedHoursPerExtraRev * hourlyRate;

  // Flash effect for danger alert
  const alertFlash = isOverLimit ? (Math.sin((frame / fps) * Math.PI * 6) + 1) / 2 : 0;

  // Surcharge banner entrance
  const surchargeBannerSpring = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardSpring,
        transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1.5px solid ${isOverLimit ? 'rgba(239, 68, 68, 0.45)' : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 45px ${isOverLimit ? 'rgba(239, 68, 68, 0.22)' : 'rgba(56, 189, 248, 0.1)'}`,
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background glow circle */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: isOverLimit
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
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
          paddingBottom: 14,
          marginBottom: 10,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Dial Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: isOverLimit
                ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 16px ${isOverLimit ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.4)'}`,
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
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  background: isOverLimit
                    ? 'linear-gradient(90deg, #f87171, #ef4444)'
                    : 'linear-gradient(90deg, #34d399, #10b981)',
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
                  background: isOverLimit ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: isOverLimit ? '#ef4444' : '#10b981',
                  border: `1px solid ${isOverLimit ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`,
                }}
              >
                {isOverLimit ? 'CAP EXCEEDED' : 'WITHIN SCOPE'}
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              Contract Cap: {agreedRevisions} Included Rounds &bull; Excess Billed Hourly
            </div>
          </div>
        </div>

        {/* Counter Summary Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '8px 16px',
            borderRadius: 14,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Agreed</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>{agreedRevisions} Rounds</div>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255, 255, 255, 0.1)' }} />
          <div>
            <div style={{ fontSize: 10, color: isOverLimit ? '#ef4444' : '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Current
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: isOverLimit ? '#ef4444' : '#f8fafc' }}>
              Round {currentRevNumber}
            </div>
          </div>
        </div>
      </div>

      {/* Center Dial Container */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        {/* SVG Radial Meter */}
        <div style={{ position: 'relative', width: 340, height: 210, display: 'flex', justifyContent: 'center' }}>
          <svg width="340" height="210" viewBox="0 0 340 210">
            <defs>
              {/* Gradients */}
              <linearGradient id="safeArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="dangerArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            {/* Background Arc Track */}
            <path
              d="M 40 175 A 135 135 0 0 1 300 175"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Scope Included Arc (Revs 1 & 2 -> ~40% of arc) */}
            <path
              d="M 40 175 A 135 135 0 0 1 144 44"
              fill="none"
              stroke="url(#safeArcGradient)"
              strokeWidth="20"
              strokeDasharray="4 2"
              strokeLinecap="round"
            />

            {/* Danger Zone Arc (Revs 3, 4, 5+ -> remaining 60% of arc) */}
            <path
              d="M 152 42 A 135 135 0 0 1 300 175"
              fill="none"
              stroke="url(#dangerArcGradient)"
              strokeWidth="20"
              strokeDasharray="4 2"
              strokeLinecap="round"
            />

            {/* Scale Marker Labels */}
            <text x="35" y="200" fill="#10b981" fontSize="13" fontWeight="800" textAnchor="middle">0</text>
            <text x="80" y="115" fill="#10b981" fontSize="13" fontWeight="800" textAnchor="middle">REV 1</text>
            <text x="145" y="32" fill="#f59e0b" fontSize="13" fontWeight="800" textAnchor="middle">REV 2 (CAP)</text>
            <text x="235" y="65" fill="#ef4444" fontSize="13" fontWeight="800" textAnchor="middle">REV 3 ⚠️</text>
            <text x="295" y="140" fill="#ef4444" fontSize="13" fontWeight="800" textAnchor="middle">REV 4 🚨</text>
            <text x="310" y="200" fill="#ef4444" fontSize="13" fontWeight="800" textAnchor="middle">REV 5+</text>

            {/* Center Pivot Needle */}
            <g transform={`translate(170, 175) rotate(${needleAngle})`}>
              {/* Needle pointer */}
              <polygon
                points="-5,0 0,-130 5,0"
                fill={isOverLimit ? '#ef4444' : '#10b981'}
                filter="drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))"
              />
              {/* Pivot center circle */}
              <circle cx="0" cy="0" r="14" fill="#0f172a" stroke={isOverLimit ? '#ef4444' : '#10b981'} strokeWidth="4" />
              <circle cx="0" cy="0" r="6" fill="#ffffff" />
            </g>
          </svg>

          {/* Central Digital Readout under needle */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 900,
                fontFamily: 'monospace',
                color: isOverLimit ? '#ef4444' : '#10b981',
                textShadow: isOverLimit ? '0 0 16px rgba(239, 68, 68, 0.6)' : '0 0 16px rgba(16, 185, 129, 0.5)',
              }}
            >
              ROUND {currentRevNumber}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              {isOverLimit ? `+${excessRevisions} Exceeding Contract Limit` : 'Included within base price'}
            </span>
          </div>
        </div>

        {/* Surcharge Alert Banner */}
        {isOverLimit && (
          <div
            style={{
              width: '100%',
              marginTop: 16,
              transform: `scale(${interpolate(surchargeBannerSpring, [0, 1], [0.9, 1])})`,
              opacity: surchargeBannerSpring,
              borderRadius: 16,
              background: `linear-gradient(90deg, rgba(239, 68, 68, ${0.2 + alertFlash * 0.1}) 0%, rgba(185, 28, 28, 0.25) 100%)`,
              border: '1.5px solid rgba(239, 68, 68, 0.6)',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.3)',
              padding: '14px 20px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Siren / warning sign */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 14px #ef4444',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>

              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', letterSpacing: '0.04em' }}>
                  SURCHARGE TRIGGERED: EXTRA REVISIONS
                </div>
                <div style={{ fontSize: 12, color: '#fca5a5', marginTop: 2 }}>
                  Clause 4.3 applies: {excessRevisions} round(s) &times; {estimatedHoursPerExtraRev} hrs @ ${hourlyRate}/hr
                </div>
              </div>
            </div>

            {/* Total Fee Due */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: '#fca5a5', textTransform: 'uppercase', fontWeight: 800 }}>Auto Invoiced</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#ef4444', fontFamily: 'monospace' }}>
                +${Math.round(totalSurcharge)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div
        style={{
          marginTop: 8,
          paddingTop: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 11,
          color: '#64748b',
        }}
      >
        <span>Contract terms automatically stop endless free client iterations.</span>
        <span style={{ color: '#94a3b8' }}>Protection Status: Enforced &bull; Scope Shield</span>
      </div>
    </div>
  );
};
