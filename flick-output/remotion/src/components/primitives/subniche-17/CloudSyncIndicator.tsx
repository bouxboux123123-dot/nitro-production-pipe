import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CloudSyncIndicatorProps {
  title?: string;
  subtitle?: string;
  localFolderName?: string;
  cloudVaultName?: string;
  fileSyncSize?: string;
  transferSpeed?: string;
  syncCompleteFrame?: number;
  width?: number;
  height?: number;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({
  title = 'REAL-TIME BACKUP TELEMETRY',
  subtitle = 'Zero-Knowledge Encrypted Synchronization via 3-2-1 Strategy',
  localFolderName = '01_CLIENTS/ApexRebrand',
  cloudVaultName = 'Vault-Encrypted-Offsite (S3/B2)',
  fileSyncSize = '1.42 GB',
  transferSpeed = '128 MB/s',
  syncCompleteFrame = 35,
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });

  // Sync completion spring
  const isSynced = frame >= syncCompleteFrame;
  const syncDoneSpring = spring({
    frame: Math.max(0, frame - syncCompleteFrame),
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  // Transfer packet motion
  const packetOffset1 = ((frame * 6) % 180) / 180;
  const packetOffset2 = (((frame * 6) + 60) % 180) / 180;
  const packetOffset3 = (((frame * 6) + 120) % 180) / 180;

  // Sync progress interpolation
  const progressRatio = interpolate(frame, [0, syncCompleteFrame], [0.15, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Spinning angle for sync spinner
  const spinAngle = (frame * 12) % 360;

  // Glowing pulse for emerald checkmark
  const pulse = (Math.sin((frame / fps) * Math.PI * 4) + 1) / 2;
  const checkGlow = interpolate(pulse, [0, 1], [0.25, 0.7]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: 24,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(20, 30, 48, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 25px 65px -15px rgba(0, 0, 0, 0.85), 0 0 45px rgba(56, 189, 248, 0.12)',
        padding: '24px 30px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
        transform: `scale(${interpolate(containerSpring, [0, 1], [0.9, 1])})`,
        opacity: interpolate(containerSpring, [0, 1], [0, 1]),
      }}
    >
      {/* Background radial highlight */}
      <div
        style={{
          position: 'absolute',
          top: -50,
          right: '25%',
          width: 400,
          height: 200,
          borderRadius: '50%',
          background: isSynced
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          transition: 'background 0.5s ease',
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
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(16, 185, 129, 0.3) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            ☁️
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.04em', color: '#ffffff' }}>
              {title}
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>

        {/* Live sync pill badge */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            background: isSynced ? 'rgba(16, 185, 129, 0.18)' : 'rgba(56, 189, 248, 0.15)',
            border: isSynced ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {!isSynced ? (
            <div
              style={{
                width: 14,
                height: 14,
                border: '2px solid rgba(56, 189, 248, 0.3)',
                borderTopColor: '#38bdf8',
                borderRadius: '50%',
                transform: `rotate(${spinAngle}deg)`,
              }}
            />
          ) : (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 10px #10b981',
              }}
            />
          )}
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: isSynced ? '#34d399' : '#38bdf8',
            }}
          >
            {isSynced ? 'SYNCHRONIZED & ENCRYPTED' : 'LIVE DELTA SYNCING'}
          </span>
        </div>
      </div>

      {/* Main Conduit Display: Local Node <---> Encrypted Pipeline <---> Cloud Node */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '270px 1fr 270px',
          alignItems: 'center',
          gap: 16,
          background: 'rgba(11, 17, 32, 0.75)',
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px 20px',
          marginBottom: 18,
          position: 'relative',
        }}
      >
        {/* Local Workstation Node (Left) */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 16,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em' }}>
              PRIMARY REPOSITORY
            </span>
            <span style={{ fontSize: 16 }}>💻</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>Local NVMe SSD</div>
          <div
            style={{
              fontSize: 12,
              color: '#94a3b8',
              fontFamily: 'monospace',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '4px 8px',
              borderRadius: 6,
              border: '1px solid rgba(255, 255, 255, 0.06)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            📁 {localFolderName}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: '#64748b' }}>Live Modification</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>
              {isSynced ? '0 pending' : fileSyncSize}
            </span>
          </div>
        </div>

        {/* Center Encrypted Pipe & Animation */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            height: '100%',
          }}
        >
          {/* Animated SVG Pipe */}
          <div style={{ position: 'relative', width: '100%', height: 28, display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
              }}
            />
            {/* Flowing animated gradient line */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                width: `${progressRatio * 100}%`,
                height: 4,
                background: isSynced
                  ? 'linear-gradient(90deg, #38bdf8, #10b981)'
                  : 'linear-gradient(90deg, #38bdf8, #818cf8)',
                boxShadow: isSynced ? '0 0 12px #10b981' : '0 0 10px #38bdf8',
                borderRadius: 2,
              }}
            />

            {/* Moving packets if still syncing */}
            {!isSynced && (
              <>
                <div
                  style={{
                    position: 'absolute',
                    left: `${packetOffset1 * 90}%`,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#38bdf8',
                    boxShadow: '0 0 8px #38bdf8',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: `${packetOffset2 * 90}%`,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 8px #10b981',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: `${packetOffset3 * 90}%`,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#f59e0b',
                    boxShadow: '0 0 8px #f59e0b',
                  }}
                />
              </>
            )}
          </div>

          {/* Center Security Lock / Speed Badge */}
          <div
            style={{
              marginTop: 10,
              padding: '6px 14px',
              borderRadius: 14,
              background: 'rgba(15, 23, 42, 0.95)',
              border: isSynced ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(56, 189, 248, 0.35)',
              boxShadow: isSynced
                ? `0 0 20px rgba(16, 185, 129, ${checkGlow})`
                : '0 4px 12px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 13 }}>{isSynced ? '🔒' : '⚡'}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: isSynced ? '#34d399' : '#38bdf8',
                letterSpacing: '0.04em',
              }}
            >
              {isSynced ? 'AES-256 ENCRYPTED' : `${transferSpeed} • TLS 1.3`}
            </span>
          </div>
        </div>

        {/* Cloud Storage Node (Right) */}
        <div
          style={{
            background: isSynced
              ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: isSynced ? '1.5px solid rgba(16, 185, 129, 0.5)' : '1.5px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 16,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxShadow: isSynced ? '0 0 25px rgba(16, 185, 129, 0.2)' : '0 10px 25px rgba(0, 0, 0, 0.4)',
            transition: 'border 0.3s ease, background 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: isSynced ? '#34d399' : '#94a3b8',
                letterSpacing: '0.08em',
              }}
            >
              OFFSITE VAULT
            </span>
            <span style={{ fontSize: 16 }}>☁️</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>Encrypted Cloud</div>
          <div
            style={{
              fontSize: 12,
              color: '#94a3b8',
              fontFamily: 'monospace',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '4px 8px',
              borderRadius: 6,
              border: '1px solid rgba(255, 255, 255, 0.06)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            🔒 {cloudVaultName}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: '#64748b' }}>Mirror Status</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: isSynced ? '#34d399' : '#f59e0b' }}>
              {isSynced ? 'Bit-Identical' : 'Updating...'}
            </span>
          </div>
        </div>
      </div>

      {/* Synchronized Big Hero Badge */}
      {isSynced && (
        <div
          style={{
            borderRadius: 16,
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            transform: `scale(${interpolate(syncDoneSpring, [0, 1], [0.95, 1])})`,
            opacity: syncDoneSpring,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.5)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#ecfdf5' }}>
                All Changes Secured Offsite
              </div>
              <div style={{ fontSize: 12, color: '#a7f3d0' }}>
                Protected against hardware failure, theft & accidental overwrite
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.25)',
              color: '#34d399',
              fontFamily: 'monospace',
            }}
          >
            IMMUTABLE SNAPSHOT
          </span>
        </div>
      )}

      {/* Bottom 3 Telemetry Cards */}
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
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: '12px 14px',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Checksum Verification</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#38bdf8', marginTop: 4, fontFamily: 'monospace' }}>
            SHA-256 (100% Match)
          </div>
        </div>

        <div
          style={{
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: '12px 14px',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>3-2-1 Strategy Compliance</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#34d399', marginTop: 4 }}>
            3 Copies • 2 Media • 1 Offsite
          </div>
        </div>

        <div
          style={{
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: '12px 14px',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Revision Retention</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#c084fc', marginTop: 4 }}>
            30-Day Version History
          </div>
        </div>
      </div>
    </div>
  );
};
