import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AssetSubfolder {
  name: string;
  tag: string;
  desc: string;
  color: string;
}

export interface FolderHierarchyTreeProps {
  title?: string;
  subtitle?: string;
  rootVolume?: string;
  level1Name?: string;
  level2Name?: string;
  level3Project?: string;
  subfolders?: AssetSubfolder[];
  width?: number;
  height?: number;
}

export const FolderHierarchyTree: React.FC<FolderHierarchyTreeProps> = ({
  title = 'CANONICAL DIRECTORY TOPOLOGY',
  subtitle = 'Deterministic 3-Level Hierarchy for Frictionless Asset Retrieval',
  rootVolume = '/Volumes/FastProjects',
  level1Name = '01_CLIENTS',
  level2Name = '2026',
  level3Project = 'ApexGlobal_Rebrand',
  subfolders = [
    { name: '01_Pre_Production', tag: 'DOCS', desc: 'Briefs, Scripts, Storyboards', color: '#38bdf8' },
    { name: '02_Project_Files', tag: 'NLE', desc: 'PRPROJ, AEP, C4D Projects', color: '#a855f7' },
    { name: '03_Footage_RAW', tag: 'MEDIA', desc: '4K ProRes 422 HQ Camera Media', color: '#f59e0b' },
    { name: '04_Audio_SFX', tag: 'AUDIO', desc: 'VO, Stems, Foley, Master Mix', color: '#ec4899' },
    { name: '05_Master_Exports', tag: 'FINAL', desc: 'Color Graded ProRes & H264', color: '#10b981' },
  ],
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Root container spring
  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });

  // Staggered accordion unfold springs
  const level1Spring = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  const level2Spring = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  const level3Spring = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  const assetsBranchSpring = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: 24,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(26, 36, 56, 0.9) 100%)',
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
        transform: `scale(${interpolate(containerSpring, [0, 1], [0.92, 1])})`,
        opacity: interpolate(containerSpring, [0, 1], [0, 1]),
      }}
    >
      {/* Background radial highlight */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          left: '20%',
          width: 350,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
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
          paddingBottom: 14,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(168, 85, 247, 0.3) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            🗂️
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.04em', color: '#ffffff' }}>
              {title}
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>

        {/* 3-Level Badge */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.06em' }}>
            MAX 3 CLICKS TO ANY ASSET
          </span>
        </div>
      </div>

      {/* Visual Tree Body */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: 18,
          background: 'rgba(11, 17, 32, 0.7)',
          borderRadius: 18,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 20px',
          marginBottom: 14,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Left Column: 3-Level Folder Spine */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
          {/* Level 0: Root Volume */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
              borderRadius: 8,
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#cbd5e1',
            }}
          >
            <span>💾</span>
            <span style={{ fontWeight: 700 }}>{rootVolume}</span>
          </div>

          {/* Level 1: Clients */}
          <div
            style={{
              marginLeft: 16,
              transform: `translateX(${interpolate(level1Spring, [0, 1], [-15, 0])}px)`,
              opacity: level1Spring,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
              borderRadius: 8,
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#38bdf8',
            }}
          >
            <span>📁</span>
            <span style={{ fontWeight: 800 }}>{level1Name}</span>
            <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 'auto' }}>L1: Domain</span>
          </div>

          {/* Level 2: Year */}
          <div
            style={{
              marginLeft: 32,
              transform: `translateX(${interpolate(level2Spring, [0, 1], [-15, 0])}px)`,
              opacity: level2Spring,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
              borderRadius: 8,
              background: 'rgba(168, 85, 247, 0.12)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#c084fc',
            }}
          >
            <span>📁</span>
            <span style={{ fontWeight: 800 }}>{level2Name}</span>
            <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 'auto' }}>L2: Chronology</span>
          </div>

          {/* Level 3: Active Project (ApexGlobal_Rebrand) */}
          <div
            style={{
              marginLeft: 48,
              transform: `scale(${interpolate(level3Spring, [0, 1], [0.92, 1])})`,
              opacity: level3Spring,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 78, 59, 0.3) 100%)',
              border: '1.5px solid #10b981',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
              fontFamily: 'monospace',
              fontSize: 13,
              color: '#ecfdf5',
            }}
          >
            <span>📂</span>
            <span style={{ fontWeight: 800 }}>{level3Project}</span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.25)',
                padding: '2px 6px',
                borderRadius: 4,
                marginLeft: 'auto',
              }}
            >
              ACTIVE
            </span>
          </div>

          {/* Golden Rule Tip Box */}
          <div
            style={{
              marginTop: 'auto',
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: 11,
              color: '#94a3b8',
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>💡 Golden Rule:</span> Never create more than 3 nested layers. Beyond 3 clicks, assets get orphaned and forgotten.
          </div>
        </div>

        {/* Right Column: Project Assets Subtree */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
            opacity: assetsBranchSpring,
            transform: `translateY(${interpolate(assetsBranchSpring, [0, 1], [15, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#94a3b8',
              letterSpacing: '0.06em',
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>📋</span> STANDARDIZED PROJECT ASSET SUBFOLDERS
          </div>

          {subfolders.map((folder, idx) => {
            const itemSpring = spring({
              frame: Math.max(0, frame - (30 + idx * 3)),
              fps,
              config: { damping: 12, stiffness: 180 },
            });

            return (
              <div
                key={folder.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 12px',
                  borderRadius: 8,
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: `1px solid ${folder.color}35`,
                  transform: `translateX(${interpolate(itemSpring, [0, 1], [20, 0])}px)`,
                  opacity: itemSpring,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: folder.color,
                      boxShadow: `0 0 6px ${folder.color}`,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#f1f5f9' }}>
                      {folder.name}
                    </div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>{folder.desc}</div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: `${folder.color}20`,
                    color: folder.color,
                    border: `1px solid ${folder.color}40`,
                    fontFamily: 'monospace',
                  }}
                >
                  {folder.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer System Guarantees */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
      >
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>🔗</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f8fafc' }}>Zero Broken Relinks</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>Deterministic relative paths</div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>👥</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f8fafc' }}>Team Interoperable</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>Any editor opens any project</div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>⚡</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f8fafc' }}>Instant Search Query</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>Indexed metadata tags</div>
          </div>
        </div>
      </div>
    </div>
  );
};
