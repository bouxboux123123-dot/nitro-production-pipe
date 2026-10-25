import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TrashRetentionPurgeProps {
  title?: string;
  subtitle?: string;
  totalStorageGb?: number;
  systemGb?: number;
  projectsGb?: number;
  cacheGb?: number;
  downloadsGb?: number;
  initialFreeGb?: number;
  purgeStartFrame?: number;
  width?: number;
  height?: number;
}

export const TrashRetentionPurge: React.FC<TrashRetentionPurgeProps> = ({
  title = 'STORAGE PURGE & CACHE RECLAMATION',
  subtitle = 'Automated 30-Day Retention Policy & Scratch Disk Flushing',
  totalStorageGb = 500,
  systemGb = 120,
  projectsGb = 210,
  cacheGb = 28.2,
  downloadsGb = 16.8,
  initialFreeGb = 125,
  purgeStartFrame = 25,
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalPurgeable = cacheGb + downloadsGb; // 45.0 GB

  // Entrance spring
  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });

  // Purge shrink spring
  const purgeSpring = spring({
    frame: Math.max(0, frame - purgeStartFrame),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Current animated values
  const currentJunkRatio = interpolate(purgeSpring, [0, 1], [1, 0]);
  const currentCacheGb = cacheGb * currentJunkRatio;
  const currentDownloadsGb = downloadsGb * currentJunkRatio;
  const reclaimedGb = totalPurgeable * (1 - currentJunkRatio);
  const currentFreeGb = initialFreeGb + reclaimedGb;

  // Percentage widths
  const systemPct = (systemGb / totalStorageGb) * 100;
  const projectsPct = (projectsGb / totalStorageGb) * 100;
  const cachePct = (currentCacheGb / totalStorageGb) * 100;
  const downloadsPct = (currentDownloadsGb / totalStorageGb) * 100;
  const freePct = (currentFreeGb / totalStorageGb) * 100;

  // Reclaimed hero badge spring
  const badgeSpring = spring({
    frame: Math.max(0, frame - (purgeStartFrame + 18)),
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  // Subtle pulsing glow on reclaimed space
  const pulse = (Math.sin((frame / fps) * Math.PI * 4) + 1) / 2;
  const reclaimedGlow = interpolate(pulse, [0, 1], [0.25, 0.65]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: 24,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(25, 33, 50, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 25px 65px -15px rgba(0, 0, 0, 0.85), 0 0 45px rgba(16, 185, 129, 0.12)',
        padding: '24px 30px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
        transform: `scale(${interpolate(containerSpring, [0, 1], [0.92, 1])})`,
        opacity: interpolate(containerSpring, [0, 1], [0, 1]),
      }}
    >
      {/* Background radial highlight */}
      <div
        style={{
          position: 'absolute',
          top: -50,
          right: '30%',
          width: 360,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(16, 185, 129, 0.3) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            🗑️
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.04em', color: '#ffffff' }}>
              {title}
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>

        {/* Retention Policy Pill */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 800, color: '#34d399', letterSpacing: '0.06em' }}>
            AUTO 30-DAY RETENTION
          </span>
        </div>
      </div>

      {/* Total Storage Summary Topline */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 10,
        }}
      >
        <div>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>STORAGE UTILIZATION</span>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>
            {(totalStorageGb - currentFreeGb).toFixed(1)}{' '}
            <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600 }}>
              / {totalStorageGb} GB ({(currentFreeGb / totalStorageGb * 100).toFixed(0)}% Free)
            </span>
          </div>
        </div>

        {/* Dynamic reclaimed counter */}
        <div
          style={{
            textAlign: 'right',
            opacity: interpolate(purgeSpring, [0, 0.1], [0, 1]),
          }}
        >
          <div style={{ fontSize: 11, color: '#34d399', fontWeight: 700, letterSpacing: '0.05em' }}>
            SPACE RECLAIMED
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#10b981',
              fontFamily: 'monospace',
              textShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
            }}
          >
            +{reclaimedGb.toFixed(1)} GB
          </div>
        </div>
      </div>

      {/* Segmented Storage Bar */}
      <div
        style={{
          width: '100%',
          height: 38,
          borderRadius: 12,
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          overflow: 'hidden',
          marginBottom: 16,
          boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* System Segment */}
        <div
          style={{
            width: `${systemPct}%`,
            height: '100%',
            background: 'linear-gradient(180deg, #64748b 0%, #475569 100%)',
            borderRight: '1px solid rgba(15, 23, 42, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 800,
            color: '#f8fafc',
          }}
        >
          OS & Apps ({systemGb}G)
        </div>

        {/* Projects Segment */}
        <div
          style={{
            width: `${projectsPct}%`,
            height: '100%',
            background: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)',
            borderRight: '1px solid rgba(15, 23, 42, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 800,
            color: '#f8fafc',
          }}
        >
          Active Projects ({projectsGb}G)
        </div>

        {/* NLE Cache Segment (Shrinks to 0) */}
        {cachePct > 0.5 && (
          <div
            style={{
              width: `${cachePct}%`,
              height: '100%',
              background: 'repeating-linear-gradient(45deg, #f97316, #f97316 10px, #ea580c 10px, #ea580c 20px)',
              borderRight: '1px solid rgba(15, 23, 42, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 800,
              color: '#ffffff',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)',
            }}
          >
            {cachePct > 4 ? `Cache (${currentCacheGb.toFixed(0)}G)` : ''}
          </div>
        )}

        {/* Downloads & Trash Segment (Shrinks to 0) */}
        {downloadsPct > 0.5 && (
          <div
            style={{
              width: `${downloadsPct}%`,
              height: '100%',
              background: 'linear-gradient(180deg, #f43f5e 0%, #e11d48 100%)',
              borderRight: '1px solid rgba(15, 23, 42, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 800,
              color: '#ffffff',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 10px rgba(244, 63, 94, 0.5)',
            }}
          >
            {downloadsPct > 3 ? `Trash (${currentDownloadsGb.toFixed(0)}G)` : ''}
          </div>
        )}

        {/* Free Space Segment (Grows to 170 GB!) */}
        <div
          style={{
            width: `${freePct}%`,
            height: '100%',
            background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 800,
            color: '#ffffff',
            boxShadow: `inset 0 0 15px rgba(255, 255, 255, ${reclaimedGlow})`,
          }}
        >
          Free Space ({currentFreeGb.toFixed(0)} GB)
        </div>
      </div>

      {/* Hero Purge Success Stamp Badge */}
      {badgeSpring > 0.05 && (
        <div
          style={{
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.25) 100%)',
            border: '1.5px solid #10b981',
            boxShadow: `0 0 30px rgba(16, 185, 129, ${reclaimedGlow})`,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            transform: `scale(${interpolate(badgeSpring, [0, 1], [0.94, 1])})`,
            opacity: badgeSpring,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.6)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#ecfdf5' }}>
                45.0 GB Storage Reclaimed Instantly
              </div>
              <div style={{ fontSize: 12, color: '#a7f3d0' }}>
                Scratch caches purged & stale downloads deleted automatically
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontFamily: 'monospace',
            }}
          >
            FREE SPACE: +36%
          </span>
        </div>
      )}

      {/* Breakdown Breakdown 3 Grid Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.55)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            borderRadius: 14,
            padding: '12px 14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>NLE Media Cache</span>
            <span style={{ fontSize: 14 }}>⚡</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fb923c', marginTop: 4 }}>
            28.2 GB Purged
          </div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
            Premiere & AE scratch cleared
          </div>
        </div>

        <div
          style={{
            background: 'rgba(30, 41, 59, 0.55)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 14,
            padding: '12px 14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Temp Downloads</span>
            <span style={{ fontSize: 14 }}>📥</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fb7185', marginTop: 4 }}>
            16.8 GB Purged
          </div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
            Files older than 30 days
          </div>
        </div>

        <div
          style={{
            background: 'rgba(30, 41, 59, 0.55)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 14,
            padding: '12px 14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>SSD Peak Performance</span>
            <span style={{ fontSize: 14 }}>🚀</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#34d399', marginTop: 4 }}>
            Zero Throttling
          </div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
            Write amplification prevented
          </div>
        </div>
      </div>
    </div>
  );
};
