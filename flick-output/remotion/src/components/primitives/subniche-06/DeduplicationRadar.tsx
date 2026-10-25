import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DeduplicationRecord {
  id: string;
  name: string;
  location: string;
  revenue: number;
  isDuplicate: boolean;
  duplicateGroup?: 'A' | 'B';
}

export interface DeduplicationRadarProps {
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
}

const INITIAL_RECORDS: DeduplicationRecord[] = [
  { id: 'REC-102', name: 'Stripe Payments Inc.', location: 'San Francisco, CA', revenue: 420000, isDuplicate: false },
  { id: 'REC-304', name: 'Apex Dynamics, LLC', location: 'Austin, TX', revenue: 185000, isDuplicate: true, duplicateGroup: 'A' },
  { id: 'REC-551', name: 'Vercel Cloud Platform', location: 'San Francisco, CA', revenue: 290000, isDuplicate: false },
  { id: 'REC-788', name: 'Apex Dynamics LLC.', location: 'Austin, TX', revenue: 140000, isDuplicate: true, duplicateGroup: 'B' },
  { id: 'REC-912', name: 'Datadog Observability', location: 'New York, NY', revenue: 360000, isDuplicate: false },
];

export const DeduplicationRadar: React.FC<DeduplicationRadarProps> = ({
  title = 'AI DEDUPLICATION RADAR & MERGE RESOLVER',
  subtitle = 'Fuzzy Similarity Match: 98.4% Confidence • Levenshtein Distance: 2',
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Radar sweep line progress (Y: 0% to 100% across records area)
  // Sweeps from frame 10 to 45
  const radarSweep = interpolate(frame, [10, 45], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Detection triggers when radar passes rows
  const isDetectedA = radarSweep >= 28;
  const isDetectedB = radarSweep >= 72;

  // Merge animation phases:
  // Frame 50 to 70: Duplicate rows move towards each other and fuse
  const mergeProgress = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isMerged = mergeProgress >= 1;

  // Spark burst calculation
  const sparkPhase = Math.max(0, frame - 65);
  const showSparks = sparkPhase > 0 && sparkPhase < 30;

  // Combined revenue for merged record
  const combinedRevenue = 185000 + 140000;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: enterSpring,
        transform: `scale(${interpolate(enterSpring, [0, 1], [0.93, 1])})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(6, 182, 212, 0.15)',
        padding: '22px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background Matrix grid accents */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(6, 182, 212, 0.08) 1.5px, transparent 1.5px), radial-gradient(rgba(244, 63, 94, 0.04) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 14,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(6, 182, 212, 0.5)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="3" x2="12" y2="12" />
              <line x1="12" y1="12" x2="18.36" y2="18.36" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', color: '#22d3ee' }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
              {subtitle}
            </div>
          </div>
        </div>

        {/* Live Radar Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 14px',
            borderRadius: 999,
            background: isMerged
              ? 'rgba(34, 197, 94, 0.15)'
              : isDetectedB
              ? 'rgba(239, 68, 68, 0.15)'
              : 'rgba(6, 182, 212, 0.15)',
            border: `1px solid ${
              isMerged
                ? 'rgba(34, 197, 94, 0.4)'
                : isDetectedB
                ? 'rgba(239, 68, 68, 0.4)'
                : 'rgba(6, 182, 212, 0.4)'
            }`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isMerged ? '#22c55e' : isDetectedB ? '#ef4444' : '#06b6d4',
              boxShadow: `0 0 8px ${isMerged ? '#22c55e' : isDetectedB ? '#ef4444' : '#06b6d4'}`,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: isMerged ? '#4ade80' : isDetectedB ? '#f87171' : '#67e8f9',
              letterSpacing: '0.03em',
            }}
          >
            {isMerged ? 'RESOLVED: CLEAN GOLDEN ROW' : isDetectedB ? 'CONFLICT DETECTED (2x)' : 'SCANNING REPO...'}
          </span>
        </div>
      </div>

      {/* Main Database Table with Radar Scanner */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        {/* RADAR SWEEP LINE OVERLAY (Active during sweep phase) */}
        {radarSweep > 0 && radarSweep < 100 && (
          <div
            style={{
              position: 'absolute',
              top: `${radarSweep}%`,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent 0%, #22d3ee 50%, transparent 100%)',
              boxShadow: '0 0 16px #06b6d4, 0 0 30px rgba(6, 182, 212, 0.6)',
              pointerEvents: 'none',
              zIndex: 15,
            }}
          >
            {/* Trailing Radar Beam Gradient */}
            <div
              style={{
                position: 'absolute',
                top: -30,
                left: 0,
                right: 0,
                height: 30,
                background: 'linear-gradient(to top, rgba(6, 182, 212, 0.25), transparent)',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}

        {/* SPARK EFFECT BURST */}
        {showSparks && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '42%',
              transform: 'translate(-50%, -50%)',
              width: 150,
              height: 150,
              pointerEvents: 'none',
              zIndex: 30,
            }}
          >
            {[...Array(16)].map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              const dist = 20 + sparkPhase * 3.5;
              const x = 75 + Math.cos(angle) * dist;
              const y = 75 + Math.sin(angle) * dist;
              const opacity = Math.max(0, 1 - sparkPhase / 25);
              return (
                <div
                  key={`spark-${i}`}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: i % 2 === 0 ? 5 : 3,
                    height: i % 2 === 0 ? 5 : 3,
                    borderRadius: '50%',
                    background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#22d3ee' : '#ffffff',
                    boxShadow: '0 0 10px #fbbf24',
                    opacity,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* ROW 1: Stripe (Unique) */}
        <div
          style={{
            height: 58,
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b' }}>REC-102</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Stripe Payments Inc.</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>San Francisco, CA</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#38bdf8' }}>$420,000</span>
            <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
              Unique
            </span>
          </div>
        </div>

        {/* DUPLICATE PAIR / MERGED ROW AREA */}
        {isMerged ? (
          /* SINGLE CONSOLIDATED GOLDEN RECORD */
          <div
            style={{
              height: 74,
              background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.8) 0%, rgba(30, 41, 59, 0.95) 100%)',
              border: '2px solid rgba(52, 211, 153, 0.7)',
              borderRadius: 14,
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.25), 0 0 20px rgba(52, 211, 153, 0.4)',
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid #34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34d399',
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                ✓
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>Apex Dynamics LLC</span>
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(52, 211, 153, 0.2)', color: '#6ee7b7', fontWeight: 700 }}>
                    MERGED GOLDEN RECORD
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                  Austin, TX • Unified ID: <span style={{ fontFamily: 'monospace', color: '#6ee7b7' }}>REC-304-MERGED</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' }}>Combined Revenue</div>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'monospace', color: '#34d399' }}>
                ${combinedRevenue.toLocaleString()}
              </div>
            </div>
          </div>
        ) : (
          /* PRE-MERGE: DUP A & DUP B WITH MATCH INDICATOR */
          <>
            {/* ROW 2: Duplicate A */}
            <div
              style={{
                height: 58,
                background: isDetectedA ? 'rgba(239, 68, 68, 0.12)' : 'rgba(30, 41, 59, 0.6)',
                border: isDetectedA ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                transform: `translateY(${mergeProgress * 30}px)`,
                opacity: 1 - mergeProgress * 0.5,
                boxShadow: isDetectedA ? '0 0 15px rgba(239, 68, 68, 0.25)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b' }}>REC-304</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Apex Dynamics, LLC</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Austin, TX</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#38bdf8' }}>$185,000</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: isDetectedA ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    color: isDetectedA ? '#fca5a5' : '#94a3b8',
                  }}
                >
                  {isDetectedA ? '⚠️ MATCH A' : 'Pending'}
                </span>
              </div>
            </div>

            {/* ROW 3: Vercel (Unique) */}
            <div
              style={{
                height: 58,
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b' }}>REC-551</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Vercel Cloud Platform</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>San Francisco, CA</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#38bdf8' }}>$290,000</span>
                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                  Unique
                </span>
              </div>
            </div>

            {/* ROW 4: Duplicate B */}
            <div
              style={{
                height: 58,
                background: isDetectedB ? 'rgba(239, 68, 68, 0.12)' : 'rgba(30, 41, 59, 0.6)',
                border: isDetectedB ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                transform: `translateY(-${mergeProgress * 30}px)`,
                opacity: 1 - mergeProgress * 0.5,
                boxShadow: isDetectedB ? '0 0 15px rgba(239, 68, 68, 0.25)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b' }}>REC-788</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Apex Dynamics LLC.</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Austin, TX</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#38bdf8' }}>$140,000</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: isDetectedB ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    color: isDetectedB ? '#fca5a5' : '#94a3b8',
                  }}
                >
                  {isDetectedB ? '⚠️ MATCH B (98.4%)' : 'Pending'}
                </span>
              </div>
            </div>
          </>
        )}

        {/* ROW 5: Datadog (Unique) */}
        <div
          style={{
            height: 58,
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b' }}>REC-912</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Datadog Observability</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>New York, NY</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#38bdf8' }}>$360,000</span>
            <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
              Unique
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER SYSTEM STATUS */}
      <div
        style={{
          marginTop: 14,
          paddingTop: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#64748b',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: isMerged ? '#22c55e' : '#06b6d4' }}>●</span>
          <span>Deduplication Algorithm: Jaro-Winkler + Phonetic Soundex Pass</span>
        </div>
        <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
          Conflicts: {isMerged ? '0 Remaining' : isDetectedB ? '1 Duplicate Pair Detected' : 'Analyzing...'}
        </div>
      </div>
    </div>
  );
};
