import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface LookupField {
  label: string;
  sourceKey: string;
  value: string;
  icon: string;
}

export interface LookupFieldProjectionProps {
  title?: string;
  dealId?: string;
  dealName?: string;
  selectedOrg?: string;
  orgId?: string;
  lookupFields?: LookupField[];
  width?: number;
  height?: number;
}

const DEFAULT_LOOKUP_FIELDS: LookupField[] = [
  { label: 'Industry Sector', sourceKey: 'orgs.industry', value: 'Aerospace & Defense', icon: '🚀' },
  { label: 'Tax Registration / VAT', sourceKey: 'orgs.tax_id', value: 'US-EIN: 84-2910482', icon: '🏛️' },
  { label: 'Payment Terms', sourceKey: 'orgs.terms', value: 'Net 30 (ACH Auto-debit)', icon: '💳' },
  { label: 'Primary Contact', sourceKey: 'orgs.contact', value: 'Elena Rostova (VP Eng)', icon: '👤' },
];

export const LookupFieldProjection: React.FC<LookupFieldProjectionProps> = ({
  title = 'CROSS-TABLE LOOKUP PROJECTION ENGINE',
  dealId = 'DEAL-4812',
  dealName = 'Enterprise Cloud SaaS Expansion',
  selectedOrg = 'Starlight Aerospace Corp',
  orgId = 'ORG-9041',
  lookupFields = DEFAULT_LOOKUP_FIELDS,
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

  // Timeline:
  // Frame 0-25: Idle, dropdown closed / empty
  // Frame 25-38: Dropdown menu drops down, highlighting 'Starlight Aerospace'
  // Frame 38: Selection picked! Dropdown closes with 'Starlight Aerospace' active
  // Frame 40-70: Lookup fields illuminate and pull data from Table B with glowing beam projection

  const isDropdownOpen = frame >= 22 && frame < 38;
  const isSelected = frame >= 38;

  // Staggered projection progress for each lookup field
  const fieldProjections = lookupFields.map((_, idx) => {
    return interpolate(frame, [38 + idx * 6, 52 + idx * 6], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  });

  const allProjected = fieldProjections.every((p) => p >= 1);

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
        boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.15)',
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
            'radial-gradient(rgba(59, 130, 246, 0.08) 1.5px, transparent 1.5px), radial-gradient(rgba(168, 85, 247, 0.05) 1.5px, transparent 1.5px)',
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
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(59, 130, 246, 0.5)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', color: '#60a5fa' }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
              Table Reference: <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>Deals ⇄ Organizations</span>
            </div>
          </div>
        </div>

        {/* Live Lookup Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 14px',
            borderRadius: 999,
            background: allProjected
              ? 'rgba(34, 197, 94, 0.15)'
              : isSelected
              ? 'rgba(59, 130, 246, 0.15)'
              : 'rgba(234, 179, 8, 0.15)',
            border: `1px solid ${
              allProjected
                ? 'rgba(34, 197, 94, 0.4)'
                : isSelected
                ? 'rgba(59, 130, 246, 0.4)'
                : 'rgba(234, 179, 8, 0.4)'
            }`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: allProjected ? '#22c55e' : isSelected ? '#3b82f6' : '#eab308',
              boxShadow: `0 0 8px ${allProjected ? '#22c55e' : isSelected ? '#3b82f6' : '#eab308'}`,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: allProjected ? '#4ade80' : isSelected ? '#93c5fd' : '#fde047',
              letterSpacing: '0.03em',
            }}
          >
            {allProjected ? '4/4 FIELDS PROJECTED' : isSelected ? 'STREAMING LOOKUPS...' : 'AWAITING SELECTION'}
          </span>
        </div>
      </div>

      {/* Main Split Section: Table A (Left) & Table B (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, flex: 1, zIndex: 2 }}>
        {/* LEFT CARD: TABLE A (TARGET RECORD: DEALS) */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.75)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 16,
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.06em' }}>
                TABLE A: DEALS
              </span>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b' }}>{dealId}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>
              {dealName}
            </div>
          </div>

          {/* Relation Dropdown Field */}
          <div style={{ margin: '12px 0', position: 'relative' }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
              Linked Organization (Relation Field)
            </label>
            <div
              style={{
                height: 38,
                background: 'rgba(15, 23, 42, 0.8)',
                border: isSelected
                  ? '1px solid #3b82f6'
                  : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 8,
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: isSelected ? '0 0 12px rgba(59, 130, 246, 0.35)' : 'none',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: isSelected ? 700 : 400, color: isSelected ? '#ffffff' : '#64748b' }}>
                {isSelected ? selectedOrg : 'Select an organization...'}
              </span>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>▼</span>
            </div>

            {/* Dropdown Options Flyout (Visible during selection phase) */}
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 4,
                  background: 'rgba(15, 23, 42, 0.98)',
                  border: '1px solid #3b82f6',
                  borderRadius: 8,
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(59, 130, 246, 0.3)',
                  overflow: 'hidden',
                  zIndex: 20,
                }}
              >
                <div style={{ padding: '8px 12px', fontSize: 12, color: '#64748b' }}>Acme Global Holdings</div>
                <div
                  style={{
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    background: 'rgba(59, 130, 246, 0.25)',
                    color: '#60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{selectedOrg}</span>
                  <span style={{ fontSize: 10 }}>← Selected</span>
                </div>
                <div style={{ padding: '8px 12px', fontSize: 12, color: '#64748b' }}>CyberDyne Systems</div>
              </div>
            )}
          </div>

          {/* 4 Projected Lookup Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
              Projected Lookup Attributes
            </div>

            {lookupFields.map((field, idx) => {
              const proj = fieldProjections[idx];
              const isFieldReady = proj > 0.8;

              return (
                <div
                  key={field.sourceKey}
                  style={{
                    background: isFieldReady ? 'rgba(15, 23, 42, 0.7)' : 'rgba(15, 23, 42, 0.3)',
                    border: isFieldReady ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: 8,
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isFieldReady ? '0 2px 8px rgba(56, 189, 248, 0.1)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12 }}>{field.icon}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{field.label}</span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: 'monospace',
                      color: isFieldReady ? '#38bdf8' : '#475569',
                      opacity: isSelected ? Math.max(0.2, proj) : 0.2,
                    }}
                  >
                    {isFieldReady ? field.value : '— Waiting for link —'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT CARD: TABLE B (SOURCE RECORD: ORGANIZATIONS) */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.75)',
            border: isSelected ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#c084fc', letterSpacing: '0.06em' }}>
                TABLE B: ORGANIZATIONS
              </span>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b' }}>{orgId}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>
              {selectedOrg}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>Primary Master Account</div>
          </div>

          {/* Master Record Data Attributes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
              Master Field Store
            </div>

            {lookupFields.map((field, idx) => {
              const proj = fieldProjections[idx];
              const isEmitting = proj > 0 && proj < 1;

              return (
                <div
                  key={`src-${field.sourceKey}`}
                  style={{
                    background: isEmitting ? 'rgba(168, 85, 247, 0.2)' : 'rgba(15, 23, 42, 0.5)',
                    border: isEmitting ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    boxShadow: isEmitting ? '0 0 12px rgba(168, 85, 247, 0.4)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b' }}>
                    <span>{field.sourceKey}</span>
                    {isEmitting && <span style={{ color: '#c084fc', fontWeight: 700 }}>STREAMING ➔</span>}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', fontFamily: 'monospace' }}>
                    {field.value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Source indicator */}
          <div
            style={{
              marginTop: 10,
              fontSize: 10,
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            Source of Truth • Changes here propagate instantly
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
          <span style={{ color: allProjected ? '#22c55e' : '#3b82f6' }}>●</span>
          <span>Lookup Cache Engine: Read-only Virtual View (Zero Duplication)</span>
        </div>
        <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
          Resolver: {allProjected ? 'SYNCED (4/4 Fields Projected)' : 'Resolving Pointer...'}
        </div>
      </div>
    </div>
  );
};
