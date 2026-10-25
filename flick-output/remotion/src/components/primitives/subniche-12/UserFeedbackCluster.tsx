import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface UserFeedbackTag {
  id: string;
  quote: string;
  cluster: 1 | 2 | 3; // 1: Onboarding, 2: Integrations, 3: Billing
  userHandle: string;
  // Initial scattered layout position (% relative to canvas)
  scatterX: number;
  scatterY: number;
  scatterRot: number;
}

export interface UserFeedbackClusterProps {
  title?: string;
  subtitle?: string;
  tags?: UserFeedbackTag[];
  width?: number;
  height?: number;
}

const DEFAULT_FEEDBACK_TAGS: UserFeedbackTag[] = [
  // Cluster 1: Onboarding Friction (7 items)
  { id: 't1', quote: 'Setup wizard has too many steps', cluster: 1, userHandle: '@dev_sam', scatterX: 8, scatterY: 15, scatterRot: -4 },
  { id: 't2', quote: 'Stuck on team invite screen', cluster: 1, userHandle: '@kate_pm', scatterX: 38, scatterY: 12, scatterRot: 5 },
  { id: 't3', quote: 'Need interactive product tour', cluster: 1, userHandle: '@marc_cto', scatterX: 72, scatterY: 18, scatterRot: -3 },
  { id: 't4', quote: 'Too many mandatory form inputs', cluster: 1, userHandle: '@elena_ux', scatterX: 18, scatterY: 36, scatterRot: 6 },
  { id: 't5', quote: 'API key verification failed silent', cluster: 1, userHandle: '@alex_eng', scatterX: 52, scatterY: 42, scatterRot: -5 },
  { id: 't6', quote: 'Where do I upload first project?', cluster: 1, userHandle: '@tariq_growth', scatterX: 78, scatterY: 46, scatterRot: 4 },
  { id: 't7', quote: 'First 5 minutes felt overwhelming', cluster: 1, userHandle: '@sarah_b2b', scatterX: 25, scatterY: 60, scatterRot: -2 },

  // Cluster 2: Missing Integrations (7 items)
  { id: 't8', quote: 'Need Zapier integration ASAP', cluster: 2, userHandle: '@jason_ops', scatterX: 62, scatterY: 28, scatterRot: 3 },
  { id: 't9', quote: 'Can I pipe alerts into Slack?', cluster: 2, userHandle: '@vikram_sre', scatterX: 84, scatterY: 65, scatterRot: -4 },
  { id: 't10', quote: 'HubSpot sync is missing', cluster: 2, userHandle: '@olivia_sales', scatterX: 5, scatterY: 72, scatterRot: 5 },
  { id: 't11', quote: 'Export to CSV breaks on 10k rows', cluster: 2, userHandle: '@liam_data', scatterX: 45, scatterY: 78, scatterRot: -3 },
  { id: 't12', quote: 'Webhook retries keep timing out', cluster: 2, userHandle: '@noah_backend', scatterX: 14, scatterY: 84, scatterRot: 4 },
  { id: 't13', quote: 'Want Notion database embed', cluster: 2, userHandle: '@chloe_doc', scatterX: 65, scatterY: 82, scatterRot: -6 },
  { id: 't14', quote: 'GitHub issue auto-sync needed', cluster: 2, userHandle: '@dave_oss', scatterX: 35, scatterY: 22, scatterRot: 2 },

  // Cluster 3: Billing & Pricing (6 items)
  { id: 't15', quote: 'Pricing tiers are ambiguous', cluster: 3, userHandle: '@rachel_fin', scatterX: 28, scatterY: 48, scatterRot: -5 },
  { id: 't16', quote: 'Where can I download VAT invoice?', cluster: 3, userHandle: '@hassan_eu', scatterX: 88, scatterY: 34, scatterRot: 3 },
  { id: 't17', quote: 'Surprise charge on added seat', cluster: 3, userHandle: '@tom_saas', scatterX: 48, scatterY: 62, scatterRot: -2 },
  { id: 't18', quote: 'Is there an annual prepay discount?', cluster: 3, userHandle: '@alyssa_cfo', scatterX: 3, scatterY: 48, scatterRot: 4 },
  { id: 't19', quote: 'Trial expired before testing API', cluster: 3, userHandle: '@pete_lead', scatterX: 58, scatterY: 8, scatterRot: -4 },
  { id: 't20', quote: 'Need PO & Wire invoice option', cluster: 3, userHandle: '@corp_procure', scatterX: 74, scatterY: 90, scatterRot: 3 },
];

export const UserFeedbackCluster: React.FC<UserFeedbackClusterProps> = ({
  title = 'MAGNETIC USER FEEDBACK CLUSTERING',
  subtitle = '20 Beta Tester soundbites automatically coalescing into 3 core root causes',
  tags = DEFAULT_FEEDBACK_TAGS,
  width = 920,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master card entrance
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(cardSpring, [0, 1], [0.94, 1]);

  // Magnetic convergence progress (frames 22 to 62)
  const magneticSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 13, stiffness: 100 },
  });
  const magneticT = interpolate(magneticSpring, [0, 1], [0, 1]);

  // Cluster column header emergence
  const headersOpacity = interpolate(frame, [18, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Actionable synthesis pill emergence
  const synthesisSpring = spring({
    frame: frame - 64,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const synthesisOpacity = interpolate(synthesisSpring, [0, 1], [0, 1]);
  const synthesisScale = interpolate(synthesisSpring, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
        borderRadius: 20,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.92))',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(245, 158, 11, 0.12)',
        padding: '22px 26px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        color: '#F8FAFC',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.35))',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', color: '#F59E0B', textTransform: 'uppercase' }}>
              {title}
            </div>
            <div style={{ fontSize: 11.5, color: '#94A3B8' }}>{subtitle}</div>
          </div>
        </div>

        {/* Live Magnetic State */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 12px',
            borderRadius: 8,
            backgroundColor: frame > 45 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${frame > 45 ? 'rgba(34, 197, 94, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: frame > 45 ? '#22C55E' : '#F59E0B',
              boxShadow: `0 0 8px ${frame > 45 ? '#22C55E' : '#F59E0B'}`,
            }}
          />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: frame > 45 ? '#4ADE80' : '#FCD34D' }}>
            {frame > 45 ? '3 CLUSTERS LOCKED' : 'MAGNETIC ATTRACTION IN PROGRESS'}
          </span>
        </div>
      </div>

      {/* 3 Pillar Columns Background Guides */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 14,
          marginBottom: 10,
          opacity: headersOpacity,
        }}
      >
        {/* Pillar 1 Header */}
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>🚪</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#FCD34D' }}>Onboarding Friction</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.2)', padding: '2px 8px', borderRadius: 6 }}>
            7 tags (45%)
          </span>
        </div>

        {/* Pillar 2 Header */}
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            backgroundColor: 'rgba(168, 85, 247, 0.12)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>🔌</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#D8B4FE' }}>Integrations</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#C084FC', backgroundColor: 'rgba(168, 85, 247, 0.2)', padding: '2px 8px', borderRadius: 6 }}>
            7 tags (35%)
          </span>
        </div>

        {/* Pillar 3 Header */}
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>💳</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#7DD3FC' }}>Pricing & Billing</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.2)', padding: '2px 8px', borderRadius: 6 }}>
            6 tags (20%)
          </span>
        </div>
      </div>

      {/* Main Magnetic Arena */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          borderRadius: 14,
          backgroundColor: 'rgba(2, 6, 23, 0.65)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Visual Magnetic Force Field Lines (Subtle) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            pointerEvents: 'none',
          }}
        >
          <div style={{ borderRight: '1px dashed rgba(245, 158, 11, 0.15)' }} />
          <div style={{ borderRight: '1px dashed rgba(168, 85, 247, 0.15)' }} />
          <div />
        </div>

        {/* 20 User Feedback Tags */}
        {tags.map((tag, idx) => {
          // Assigned column cluster geometry:
          // Column 1: X center ~ 16.6%, Column 2: X center ~ 50%, Column 3: X center ~ 83.3%
          let colLeftPercent = 2;
          let clusterColor = '#F59E0B';
          let clusterBg = 'rgba(245, 158, 11, 0.15)';
          let clusterBorder = 'rgba(245, 158, 11, 0.35)';

          if (tag.cluster === 1) {
            colLeftPercent = 2;
            clusterColor = '#F59E0B';
            clusterBg = 'rgba(245, 158, 11, 0.18)';
            clusterBorder = 'rgba(245, 158, 11, 0.4)';
          } else if (tag.cluster === 2) {
            colLeftPercent = 35.5;
            clusterColor = '#C084FC';
            clusterBg = 'rgba(168, 85, 247, 0.18)';
            clusterBorder = 'rgba(168, 85, 247, 0.4)';
          } else {
            colLeftPercent = 69;
            clusterColor = '#38BDF8';
            clusterBg = 'rgba(56, 189, 248, 0.18)';
            clusterBorder = 'rgba(56, 189, 248, 0.4)';
          }

          // In-cluster vertical stack order
          const clusterItems = tags.filter(t => t.cluster === tag.cluster);
          const indexInCluster = clusterItems.findIndex(t => t.id === tag.id);
          const targetYPercent = 6 + indexInCluster * 14.5; // Stacking cleanly from top

          // Interpolate from scatter position to cluster column position
          const currentX = interpolate(magneticT, [0, 1], [tag.scatterX, colLeftPercent]);
          const currentY = interpolate(magneticT, [0, 1], [tag.scatterY, targetYPercent]);
          const currentRot = interpolate(magneticT, [0, 1], [tag.scatterRot, 0]);

          return (
            <div
              key={tag.id}
              style={{
                position: 'absolute',
                left: `${currentX}%`,
                top: `${currentY}%`,
                width: magneticT > 0.5 ? '29%' : '26%',
                transform: `rotate(${currentRot}deg)`,
                padding: '6px 10px',
                borderRadius: 8,
                backgroundColor: clusterBg,
                border: `1px solid ${clusterBorder}`,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                zIndex: Math.round(10 + indexInCluster),
                transition: 'width 0.1s ease',
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: clusterColor,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: '#F1F5F9',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  "{tag.quote}"
                </div>
                <div style={{ fontSize: 9, color: '#94A3B8', marginTop: 1 }}>{tag.userHandle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actionable Synthesis Bottom Banner */}
      <div
        style={{
          marginTop: 10,
          padding: '10px 18px',
          borderRadius: 12,
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.2), rgba(15, 23, 42, 0.9), rgba(56, 189, 248, 0.2))',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: synthesisOpacity,
          transform: `scale(${synthesisScale})`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>🎯</span>
          <div>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#FCD34D' }}>
              LEAN ACTION ITEM:
            </span>{' '}
            <span style={{ fontSize: 12, color: '#E2E8F0' }}>
              Replace 5-step wizard with 1-click template + ship Zapier Webhook to eliminate 80% of churn!
            </span>
          </div>
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#22C55E',
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid rgba(34, 197, 94, 0.3)',
          }}
        >
          CONFIDENCE: 94%
        </div>
      </div>
    </div>
  );
};
