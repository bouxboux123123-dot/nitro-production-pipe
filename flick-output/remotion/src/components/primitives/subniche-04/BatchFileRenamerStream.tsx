import React, { useMemo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BatchFileRenamerStreamProps {
  title?: string;
  patternRule?: string;
  replaceRule?: string;
  totalFiles?: number;
  accentColor?: string;
  accentGreen?: string;
}

interface FileItem {
  id: number;
  rawName: string;
  cleanName: string;
  size: string;
  date: string;
}

export const BatchFileRenamerStream: React.FC<BatchFileRenamerStreamProps> = ({
  title = 'POWER_RENAME // FOSS ENGINE',
  patternRule = 'DSC_(\\d{4})_RAW\\.(CR3|ARW)',
  replaceRule = '2026-10-25_B-Roll_Seq_$1.dng',
  totalFiles = 50,
  accentColor = '#6366f1',
  accentGreen = '#10b981',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const enterOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Deterministic file dataset (50 items)
  const files: FileItem[] = useMemo(() => {
    const cameraPrefixes = ['DSC', 'IMG', 'DCIM', 'SONY', 'RAW'];
    const extensions = ['CR3', 'ARW', 'NEF', 'RAW'];
    return Array.from({ length: 50 }, (_, i) => {
      const num = String(1000 + i * 17).slice(-4);
      const prefix = cameraPrefixes[i % cameraPrefixes.length];
      const ext = extensions[i % extensions.length];
      const mb = (24 + ((i * 7) % 18) + ((i * 3) % 9) * 0.1).toFixed(1);
      return {
        id: i + 1,
        rawName: `${prefix}_${num}_RAW.${ext}`,
        cleanName: `2026-10-25_B-Roll_Seq_${num}.dng`,
        size: `${mb} MB`,
        date: '2026-10-25',
      };
    });
  }, []);

  // Continuous stream scroll animation
  // Every 6 frames a new batch advances
  const scrollOffset = interpolate(frame, [0, 120], [0, -320], {
    extrapolateRight: 'extend',
  });

  // Rename progress animation (0 to 50 items)
  const renamedCount = Math.min(
    totalFiles,
    Math.floor(
      interpolate(frame, [15, 85], [0, totalFiles], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    )
  );

  const progressPercent = Math.round((renamedCount / totalFiles) * 100);

  // Laser scanner wave
  const scannerY = (frame * 6) % 360;

  return (
    <div
      style={{
        width: 880,
        height: 580,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 24,
        boxShadow: `0 24px 64px -12px rgba(0, 0, 0, 0.7), 0 0 32px -4px ${accentColor}25`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: '#f8fafc',
        transform: `scale(${enterScale})`,
        opacity: enterOpacity,
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Window Titlebar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                opacity: 0.8,
              }}
            />
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                backgroundColor: '#f59e0b',
                opacity: 0.8,
              }}
            />
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                opacity: 0.8,
              }}
            />
          </div>
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#94a3b8',
              marginLeft: 8,
            }}
          >
            {title}
          </span>
        </div>

        {/* Live Batch Count Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px',
            borderRadius: 999,
            backgroundColor: `${accentGreen}18`,
            border: `1px solid ${accentGreen}40`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: accentGreen,
              boxShadow: `0 0 10px ${accentGreen}`,
            }}
          />
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 12,
              fontWeight: 600,
              color: accentGreen,
            }}
          >
            {renamedCount} / {totalFiles} RENAMED ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Regex Rule Configuration Pane */}
      <div
        style={{
          padding: '14px 24px',
          backgroundColor: 'rgba(30, 41, 59, 0.45)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Match Pattern */}
          <div
            style={{
              flex: 1,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: 10,
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                color: '#818cf8',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              REGEX:
            </span>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 13,
                color: '#cbd5e1',
                wordBreak: 'break-all',
              }}
            >
              <span style={{ color: '#f43f5e' }}>{patternRule.slice(0, 4)}</span>
              <span style={{ color: '#38bdf8' }}>{patternRule.slice(4, 11)}</span>
              <span style={{ color: '#a78bfa' }}>{patternRule.slice(11)}</span>
            </span>
          </div>

          {/* Transformation Arrow */}
          <div
            style={{
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#818cf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>

          {/* Replacement Rule */}
          <div
            style={{
              flex: 1.2,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              border: `1px solid ${accentGreen}50`,
              borderRadius: 10,
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                color: accentGreen,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              TARGET:
            </span>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 13,
                color: '#34d399',
                wordBreak: 'break-all',
              }}
            >
              {replaceRule}
            </span>
          </div>
        </div>
      </div>

      {/* Main Stream Conveyor Body */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40px 1.1fr 36px 1.4fr 90px',
            padding: '10px 24px',
            fontSize: 11,
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 700,
            color: '#64748b',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            backgroundColor: 'rgba(15, 23, 42, 0.3)',
          }}
        >
          <div>#</div>
          <div>ORIGINAL SOURCE FILE</div>
          <div></div>
          <div>PIPELINE OUTPUT</div>
          <div style={{ textAlign: 'right' }}>SIZE</div>
        </div>

        {/* Scrolling Stream Content */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              transform: `translateY(${scrollOffset}px)`,
              display: 'flex',
              flexDirection: 'column',
              padding: '4px 0',
            }}
          >
            {files.map((file, idx) => {
              const isRenamed = idx < renamedCount;
              const isCurrentlyActive = idx === renamedCount;

              return (
                <div
                  key={file.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1.1fr 36px 1.4fr 90px',
                    alignItems: 'center',
                    padding: '8px 24px',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 12,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                    backgroundColor: isCurrentlyActive
                      ? 'rgba(99, 102, 241, 0.14)'
                      : isRenamed
                      ? 'rgba(16, 185, 129, 0.03)'
                      : 'transparent',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {/* File Index */}
                  <span style={{ color: '#475569', fontSize: 11 }}>
                    {String(file.id).padStart(2, '0')}
                  </span>

                  {/* Raw File Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        color: isRenamed ? '#64748b' : '#e2e8f0',
                        textDecoration: isRenamed ? 'line-through' : 'none',
                        transition: 'color 0.2s',
                      }}
                    >
                      {file.rawName}
                    </span>
                  </div>

                  {/* Arrow Indicator */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isRenamed ? accentGreen : '#475569',
                      fontSize: 12,
                    }}
                  >
                    ➔
                  </div>

                  {/* Renamed Output */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isRenamed ? (
                      <span
                        style={{
                          color: '#34d399',
                          fontWeight: 600,
                          textShadow: '0 0 10px rgba(52, 211, 153, 0.4)',
                        }}
                      >
                        {file.cleanName}
                      </span>
                    ) : (
                      <span style={{ color: '#475569', fontStyle: 'italic' }}>
                        awaiting regex match...
                      </span>
                    )}
                  </div>

                  {/* File Size */}
                  <span
                    style={{
                      textAlign: 'right',
                      color: isRenamed ? '#94a3b8' : '#64748b',
                      fontSize: 11,
                    }}
                  >
                    {file.size}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Laser Scanner Line Overlay */}
          <div
            style={{
              position: 'absolute',
              top: scannerY,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, transparent 0%, ${accentColor} 30%, ${accentGreen} 70%, transparent 100%)`,
              boxShadow: `0 0 14px 2px ${accentGreen}`,
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Bottom Status / Summary Footer */}
      <div
        style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Progress Bar Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, maxWidth: 440 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              fontFamily: '"JetBrains Mono", monospace',
              color: '#94a3b8',
            }}
          >
            <span>BATCH PROGRESS</span>
            <span style={{ color: accentGreen, fontWeight: 700 }}>
              {renamedCount} OF {totalFiles} COMPLETED
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${accentColor}, ${accentGreen})`,
                borderRadius: 999,
                boxShadow: `0 0 12px ${accentGreen}`,
                transition: 'width 0.1s linear',
              }}
            />
          </div>
        </div>

        {/* Engine Telemetry Tags */}
        <div style={{ display: 'flex', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: '"JetBrains Mono", monospace',
              color: '#94a3b8',
            }}
          >
            <span style={{ color: '#38bdf8' }}>⚡</span>
            <span>0.04ms / op</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: '"JetBrains Mono", monospace',
              color: '#94a3b8',
            }}
          >
            <span style={{ color: accentGreen }}>✓</span>
            <span>0 Collisions</span>
          </div>
          <div
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              fontSize: 11,
              fontFamily: '"JetBrains Mono", monospace',
              color: '#e2e8f0',
              fontWeight: 600,
            }}
          >
            FOSS CLI / Rust Engine
          </div>
        </div>
      </div>
    </div>
  );
};
