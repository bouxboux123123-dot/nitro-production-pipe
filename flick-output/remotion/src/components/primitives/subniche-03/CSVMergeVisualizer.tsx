import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CSVRow {
  id: string;
  name: string;
  company: string;
  email: string;
  isDuplicate?: boolean;
}

export interface CSVMergeVisualizerProps {
  title?: string;
  fileAName?: string;
  fileBName?: string;
  mergedFileName?: string;
  sourceARows?: CSVRow[];
  sourceBRows?: CSVRow[];
  masterRows?: CSVRow[];
  duplicatesRemoved?: number;
  totalMerged?: number;
  accentColor?: string;
}

export const CSVMergeVisualizer: React.FC<CSVMergeVisualizerProps> = ({
  title = 'SMART CSV DEDUPLICATOR & MERGER',
  fileAName = 'apollo_export_raw.csv',
  fileBName = 'linkedin_scrape_v2.csv',
  mergedFileName = 'master_leads_deduped.csv',
  sourceARows = [
    { id: '1', name: 'Alex Rivera', company: 'Nexus AI', email: 'alex@nexus.ai' },
    { id: '2', name: 'Chloe Zhao', company: 'HyperScale', email: 'chloe@hyperscale.io', isDuplicate: true },
    { id: '3', name: 'David Park', company: 'SynthLab', email: 'david.p@synthlab.co' },
  ],
  sourceBRows = [
    { id: '4', name: 'Chloe Zhao', company: 'HyperScale', email: 'chloe@hyperscale.io', isDuplicate: true },
    { id: '5', name: 'James Wilson', company: 'Apex Group', email: 'jwilson@apexgroup.com' },
    { id: '6', name: 'Maria Santos', company: 'NovaOps', email: 'maria@novaops.dev' },
  ],
  masterRows = [
    { id: 'm1', name: 'Alex Rivera', company: 'Nexus AI', email: 'alex@nexus.ai' },
    { id: 'm2', name: 'Chloe Zhao', company: 'HyperScale', email: 'chloe@hyperscale.io' },
    { id: 'm3', name: 'David Park', company: 'SynthLab', email: 'david.p@synthlab.co' },
    { id: 'm4', name: 'James Wilson', company: 'Apex Group', email: 'jwilson@apexgroup.com' },
    { id: 'm5', name: 'Maria Santos', company: 'NovaOps', email: 'maria@novaops.dev' },
  ],
  duplicatesRemoved = 342,
  totalMerged = 1420,
  accentColor = '#a855f7', // Purple 500
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Magnetic convergence progress (frames 20 -> 55)
  const mergeProgress = interpolate(frame, [15, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Spring snap on convergence
  const snapSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  // Lateral translation for left and right source cards
  const leftTranslateX = interpolate(mergeProgress, [0, 1], [0, 160]);
  const rightTranslateX = interpolate(mergeProgress, [0, 1], [0, -160]);
  const splitOpacity = interpolate(mergeProgress, [0, 0.85, 1], [1, 0.4, 0]);

  // Master unified table opacity
  const masterOpacity = interpolate(mergeProgress, [0.7, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const masterScale = interpolate(snapSpring, [0, 1], [0.94, 1]);

  return (
    <div
      style={{
        width: 880,
        height: 620,
        borderRadius: 20,
        background: 'linear-gradient(150deg, rgba(15, 23, 42, 0.96) 0%, rgba(9, 14, 30, 0.98) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.28)',
        boxShadow: `0 24px 60px -12px rgba(0, 0, 0, 0.75), 0 0 45px rgba(168, 85, 247, 0.16)`,
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'SF Pro Display', -apple-system, 'Segoe UI', Roboto, sans-serif",
        color: '#f8fafc',
        transform: `scale(${entrance})`,
        opacity: entrance,
        boxSizing: 'border-box',
        padding: 24,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 14,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(168, 85, 247, 0.5)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.04em', color: '#f8fafc' }}>{title}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Fuzzy Deduplication &amp; Zero-Loss Schema Fusion</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            - {duplicatesRemoved} DUPLICATES PURGED
          </div>
          <div
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            ✓ {totalMerged} UNIQUE LEADS
          </div>
        </div>
      </div>

      {/* Dynamic Content Area: Either Floating 2 Disordered Tables OR Merged Master */}
      <div style={{ flex: 1, position: 'relative', marginTop: 16 }}>
        {/* State 1: Floating colliding tables */}
        {splitOpacity > 0.01 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              gap: 20,
              opacity: splitOpacity,
            }}
          >
            {/* Table A */}
            <div
              style={{
                flex: 1,
                background: 'rgba(11, 18, 36, 0.85)',
                borderRadius: 14,
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                transform: `translateX(${leftTranslateX}px)`,
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#c084fc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 10,
                  fontFamily: "'Fira Code', monospace",
                }}
              >
                <span>📄 {fileAName}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
                {sourceARows.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: r.isDuplicate ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: r.isDuplicate
                        ? '1px dashed rgba(239, 68, 68, 0.4)'
                        : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: 8,
                      padding: '8px 10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{r.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: 10 }}>{r.company}</div>
                    </div>
                    {r.isDuplicate && (
                      <span style={{ color: '#ef4444', fontSize: 9, fontWeight: 800 }}>COLLISION</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Table B */}
            <div
              style={{
                flex: 1,
                background: 'rgba(11, 18, 36, 0.85)',
                borderRadius: 14,
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                transform: `translateX(${rightTranslateX}px)`,
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 10,
                  fontFamily: "'Fira Code', monospace",
                }}
              >
                <span>📄 {fileBName}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
                {sourceBRows.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: r.isDuplicate ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: r.isDuplicate
                        ? '1px dashed rgba(239, 68, 68, 0.4)'
                        : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: 8,
                      padding: '8px 10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{r.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: 10 }}>{r.company}</div>
                    </div>
                    {r.isDuplicate && (
                      <span style={{ color: '#ef4444', fontSize: 9, fontWeight: 800 }}>COLLISION</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State 2: Unified Master Clean Table (Revealed after magnetic snap) */}
        {masterOpacity > 0.01 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(2, 6, 23, 0.92)',
              borderRadius: 14,
              border: '2px solid rgba(168, 85, 247, 0.5)',
              boxShadow: '0 0 35px rgba(168, 85, 247, 0.25)',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              opacity: masterOpacity,
              transform: `scale(${masterScale})`,
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 10,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#c084fc', fontFamily: "'Fira Code', monospace" }}>
                  ✨ {mergedFileName}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    background: 'rgba(168, 85, 247, 0.2)',
                    color: '#e9d5ff',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontWeight: 700,
                  }}
                >
                  DE-DUPLICATED MASTER
                </span>
              </div>
              <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>
                100% VALIDATED
              </span>
            </div>

            {/* Table Columns Title */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1.2fr 1.8fr 0.8fr',
                padding: '6px 12px',
                fontSize: 10,
                fontWeight: 800,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 6,
              }}
            >
              <span>Prospect Name</span>
              <span>Account</span>
              <span>Verified Email</span>
              <span style={{ textAlign: 'right' }}>Status</span>
            </div>

            {/* Clean Data Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6, flex: 1 }}>
              {masterRows.map((r, idx) => (
                <div
                  key={r.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1.2fr 1.8fr 0.8fr',
                    padding: '8px 12px',
                    fontSize: 12,
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: 6,
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>{r.name}</span>
                  <span style={{ color: '#cbd5e1' }}>{r.company}</span>
                  <span style={{ color: '#38bdf8', fontFamily: "'Fira Code', monospace", fontSize: 11 }}>
                    {r.email}
                  </span>
                  <span style={{ textAlign: 'right', color: '#10b981', fontWeight: 700, fontSize: 10 }}>
                    MERGED ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control / Deduplication Engine Bar */}
      <div
        style={{
          marginTop: 14,
          background: 'rgba(15, 23, 42, 0.65)',
          borderRadius: 10,
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 11,
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <span style={{ color: '#94a3b8' }}>
          Algorithm: <strong style={{ color: '#f8fafc' }}>Levenshtein Fuzzy Match + MX Domain Cross-Ref</strong>
        </span>
        <span style={{ color: '#c084fc', fontWeight: 700, fontFamily: "'Fira Code', monospace" }}>
          READY FOR CSV/EXCEL DOWNLOAD
        </span>
      </div>
    </div>
  );
};
