import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MessyDesktopCleanupProps {
  title?: string;
  subtitle?: string;
  totalFiles?: number;
  sweepStartFrame?: number;
  width?: number;
  height?: number;
}

interface ScatterFile {
  id: number;
  name: string;
  ext: string;
  startX: number;
  startY: number;
  folderIndex: number; // 0: Clients, 1: Assets, 2: Exports, 3: Archive
  color: string;
}

export const MessyDesktopCleanup: React.FC<MessyDesktopCleanupProps> = ({
  title = 'DESKTOP HYGIENE AUTOMATION',
  subtitle = '50 Scattered Icons Auto-Sorted into Canonical Folders',
  totalFiles = 50,
  sweepStartFrame = 22,
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Folders configuration
  const folders = useMemo(
    () => [
      { id: 'clients', label: '01_CLIENTS', color: '#38bdf8', icon: '💼', targetX: 110 },
      { id: 'assets', label: '02_ASSETS', color: '#10b981', icon: '🎨', targetX: 330 },
      { id: 'exports', label: '03_EXPORTS', color: '#f59e0b', icon: '🚀', targetX: 550 },
      { id: 'archive', label: '04_ARCHIVE', color: '#a855f7', icon: '📦', targetX: 770 },
    ],
    []
  );

  // Deterministically generate 50 scattered files so Remotion rendering is 100% pure & reproducible
  const scatteredFiles: ScatterFile[] = useMemo(() => {
    const exts = [
      { ext: 'pdf', cat: 0, color: '#38bdf8' },
      { ext: 'png', cat: 1, color: '#10b981' },
      { ext: 'mp4', cat: 2, color: '#f59e0b' },
      { ext: 'zip', cat: 3, color: '#a855f7' },
      { ext: 'mov', cat: 2, color: '#f59e0b' },
      { ext: 'wav', cat: 1, color: '#10b981' },
      { ext: 'docx', cat: 0, color: '#38bdf8' },
    ];

    const files: ScatterFile[] = [];
    // Pseudo-random deterministic generator using linear congruential sequence
    let seed = 1337;
    const lcg = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < totalFiles; i++) {
      const typeInfo = exts[i % exts.length];
      const startX = 40 + lcg() * 740;
      const startY = 30 + lcg() * 210;
      files.push({
        id: i,
        name: `file_${i + 1}`,
        ext: typeInfo.ext,
        startX,
        startY,
        folderIndex: typeInfo.cat,
        color: typeInfo.color,
      });
    }
    return files;
  }, [totalFiles]);

  // Entrance spring for main container
  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });

  // Organizing sweep beam progress
  const sweepProgress = interpolate(
    frame,
    [sweepStartFrame, sweepStartFrame + 35],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Clean status alert spring at the end
  const cleanSpring = spring({
    frame: Math.max(0, frame - (sweepStartFrame + 30)),
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: 24,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.88) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 40px rgba(56, 189, 248, 0.12)',
        padding: '24px 28px',
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
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.4) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            🧹
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.04em', color: '#ffffff' }}>
              {title}
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>

        {/* Dynamic Status Badge */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            background:
              sweepProgress < 1
                ? 'rgba(239, 68, 68, 0.15)'
                : 'linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
            border:
              sweepProgress < 1
                ? '1px solid rgba(239, 68, 68, 0.4)'
                : '1px solid rgba(16, 185, 129, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: sweepProgress < 1 ? '#ef4444' : '#10b981',
              boxShadow: sweepProgress < 1 ? '0 0 10px #ef4444' : '0 0 12px #10b981',
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: sweepProgress < 1 ? '#fca5a5' : '#6ee7b7',
            }}
          >
            {sweepProgress === 0
              ? '50 CLUTTERED FILES'
              : sweepProgress < 1
              ? 'SWEEPING IN PROGRESS...'
              : '0 LOOSE FILES • 100% CLEAN'}
          </span>
        </div>
      </div>

      {/* Simulated Desktop Workspace Area */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          borderRadius: 16,
          background: 'rgba(11, 17, 32, 0.75)',
          border: '1px dashed rgba(255, 255, 255, 0.12)',
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.6,
          }}
        />

        {/* Sweep Laser Scan Line */}
        {sweepProgress > 0 && sweepProgress < 1 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${sweepProgress * 100}%`,
              width: 2,
              background: 'linear-gradient(180deg, transparent 0%, #38bdf8 50%, transparent 100%)',
              boxShadow: '0 0 15px #38bdf8, 0 0 30px #38bdf8',
              zIndex: 10,
            }}
          />
        )}

        {/* 50 Scattered Icon Dots */}
        {scatteredFiles.map((file) => {
          // Individual staggered departure
          const fileDelay = sweepStartFrame + (file.id * 0.5);
          const moveSpring = spring({
            frame: Math.max(0, frame - fileDelay),
            fps,
            config: { damping: 16, stiffness: 140 },
          });

          const targetFolder = folders[file.folderIndex];
          // Target coordinate is toward the folder at bottom
          const currentX = interpolate(moveSpring, [0, 1], [file.startX, targetFolder.targetX - 20]);
          const currentY = interpolate(moveSpring, [0, 1], [file.startY, 260]);
          const itemScale = interpolate(moveSpring, [0, 0.8, 1], [1, 0.7, 0]);
          const itemOpacity = interpolate(moveSpring, [0, 0.9, 1], [0.95, 0.9, 0]);

          return (
            <div
              key={file.id}
              style={{
                position: 'absolute',
                left: currentX,
                top: currentY,
                transform: `scale(${itemScale})`,
                opacity: itemOpacity,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 7px',
                borderRadius: 6,
                background: 'rgba(30, 41, 59, 0.85)',
                border: `1px solid ${file.color}60`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.4), 0 0 8px ${file.color}30`,
                pointerEvents: 'none',
                zIndex: 5,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: file.color,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#e2e8f0',
                  fontFamily: 'monospace',
                }}
              >
                .{file.ext}
              </span>
            </div>
          );
        })}

        {/* Pristine Clean Desktop State Overlay */}
        {cleanSpring > 0.05 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: cleanSpring,
              transform: `scale(${interpolate(cleanSpring, [0, 1], [0.85, 1])})`,
              zIndex: 8,
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.4) 100%)',
                border: '1.5px solid rgba(16, 185, 129, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.35)',
                marginBottom: 12,
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.02em' }}>
              Desktop Clean & Organized
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
              Zero clutter • Strict folder taxonomy established
            </div>
          </div>
        )}
      </div>

      {/* Bottom Destination Parent Folders Dock */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}
      >
        {folders.map((folder, index) => {
          // Staggered folder bump as items arrive
          const hitFrame = sweepStartFrame + 18 + index * 4;
          const folderBump = spring({
            frame: Math.max(0, frame - hitFrame),
            fps,
            config: { damping: 8, stiffness: 200 },
          });

          const isAbsorbing = frame >= hitFrame;
          const count = isAbsorbing
            ? Math.min(13, Math.round(interpolate(folderBump, [0, 1], [0, 12 + (index % 2)])))
            : 0;

          return (
            <div
              key={folder.id}
              style={{
                borderRadius: 16,
                background: `linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)`,
                border: `1.5px solid ${isAbsorbing ? folder.color : 'rgba(255, 255, 255, 0.1)'}`,
                boxShadow: isAbsorbing ? `0 0 20px ${folder.color}35` : 'none',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                transform: `scale(${1 + folderBump * 0.04})`,
                transition: 'border 0.2s, box-shadow 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 20 }}>{folder.icon}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: `${folder.color}25`,
                    color: folder.color,
                    border: `1px solid ${folder.color}40`,
                    fontFamily: 'monospace',
                  }}
                >
                  {isAbsorbing ? `+${count} files` : '0 files'}
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#f1f5f9',
                  letterSpacing: '0.02em',
                }}
              >
                {folder.label}
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                Sorted by filetype
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
