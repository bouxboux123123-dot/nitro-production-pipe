import React, { useMemo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ExtractedField {
  label: string;
  selector: string;
  value: string;
  type: 'string' | 'number' | 'badge';
}

export interface DOMElementSnifferProps {
  title?: string;
  url?: string;
  targetSelector?: string;
  leadName?: string;
  leadTitle?: string;
  leadCompany?: string;
  leadEmail?: string;
  leadPhone?: string;
  extractedFields?: ExtractedField[];
  accentColor?: string;
  secondaryAccent?: string;
}

export const DOMElementSniffer: React.FC<DOMElementSnifferProps> = ({
  title = 'FREE DOM ELEMENT SNIFFER',
  url = 'https://directory.openweb.io/leads/us-saas',
  targetSelector = 'div.lead-card[data-verified="true"]',
  leadName = 'Sarah Lin',
  leadTitle = 'Head of Growth & Acquisition',
  leadCompany = 'CloudScale AI',
  leadEmail = 'sarah.lin@cloudscale.ai',
  leadPhone = '+1 (415) 890-2341',
  extractedFields = [
    { label: 'lead_id', selector: 'div#uid-4421', value: 'CS-89204', type: 'string' },
    { label: 'full_name', selector: 'h3.profile-name', value: 'Sarah Lin', type: 'string' },
    { label: 'job_title', selector: 'span.lead-title', value: 'Head of Growth', type: 'string' },
    { label: 'corporate_email', selector: 'a[href^="mailto:"]', value: 'sarah.lin@cloudscale.ai', type: 'string' },
    { label: 'scraping_status', selector: 'span.status-pill', value: 'VERIFIED_PUBLIC', type: 'badge' },
  ],
  accentColor = '#38bdf8', // Cyan 400
  secondaryAccent = '#10b981', // Emerald 500
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const containerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Crosshair tracking animation
  const scanProgress = interpolate(frame, [15, 45, 75, 105], [0, 1, 1, 2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse effect for active target
  const pulseScale = 1 + Math.sin(frame * 0.18) * 0.02;
  const glowIntensity = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.3, 0.75]);

  // Extraction trigger after frame 35
  const extractSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  return (
    <div
      style={{
        width: 880,
        height: 600,
        borderRadius: 20,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(10, 15, 29, 0.98) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.28)',
        boxShadow: `0 24px 60px -12px rgba(0, 0, 0, 0.7), 0 0 45px rgba(56, 189, 248, ${0.15 * containerEntrance})`,
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'SF Pro Display', -apple-system, 'Segoe UI', Roboto, sans-serif",
        color: '#f8fafc',
        transform: `scale(${containerEntrance})`,
        opacity: containerEntrance,
        boxSizing: 'border-box',
      }}
    >
      {/* Browser Window Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: 'rgba(2, 6, 23, 0.65)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#f59e0b' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#10b981' }} />
          <div
            style={{
              marginLeft: 14,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {title}
          </div>
        </div>

        {/* URL Bar */}
        <div
          style={{
            flex: 1,
            maxWidth: 440,
            margin: '0 20px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 8,
            padding: '5px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: '#94a3b8',
            fontFamily: "'Fira Code', monospace",
          }}
        >
          <span style={{ color: secondaryAccent, fontSize: 13 }}>🔒</span>
          <span style={{ color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {url}
          </span>
        </div>

        {/* Status Chip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: 11,
            fontWeight: 700,
            color: accentColor,
            letterSpacing: '0.05em',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
          INSPECTING
        </div>
      </div>

      {/* Main Workspace: Left DOM Inspector Viewport / Right JSON Output */}
      <div style={{ flex: 1, display: 'flex', padding: 18, gap: 16, overflow: 'hidden' }}>
        {/* Left Column: Simulated Rendered DOM Page */}
        <div
          style={{
            flex: 1.1,
            background: 'rgba(11, 18, 36, 0.75)',
            borderRadius: 14,
            border: '1px solid rgba(255, 255, 255, 0.07)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              color: '#64748b',
              letterSpacing: '0.06em',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Target DOM Node</span>
            <span style={{ color: accentColor, fontFamily: "'Fira Code', monospace" }}>{targetSelector}</span>
          </div>

          {/* Dummy sibling element */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              opacity: 0.45,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>David Kim</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>VP Operations • VectorFlow</div>
          </div>

          {/* ACTIVE TARGET INSPECTED ELEMENT */}
          <div
            style={{
              position: 'relative',
              padding: 14,
              borderRadius: 12,
              background: 'rgba(14, 165, 233, 0.08)',
              border: `2px solid ${accentColor}`,
              boxShadow: `0 0 24px rgba(56, 189, 248, ${glowIntensity})`,
              transform: `scale(${pulseScale})`,
              transition: 'border 0.2s ease',
            }}
          >
            {/* DevTools Dimension Pill Tag */}
            <div
              style={{
                position: 'absolute',
                top: -12,
                left: 14,
                background: accentColor,
                color: '#020617',
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 4,
                fontFamily: "'Fira Code', monospace",
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>{targetSelector}</span>
              <span style={{ opacity: 0.7 }}>•</span>
              <span>420 × 94 px</span>
            </div>

            {/* Profile Content */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)',
                }}
              >
                {leadName.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>{leadName}</span>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: secondaryAccent,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 4,
                    }}
                  >
                    PUBLIC LEAD
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  {leadTitle} • <strong style={{ color: '#cbd5e1' }}>{leadCompany}</strong>
                </div>
              </div>
            </div>

            {/* Contact details mini rows */}
            <div
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: '1px dashed rgba(56, 189, 248, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
                fontFamily: "'Fira Code', monospace",
              }}
            >
              <span style={{ color: '#38bdf8' }}>✉ {leadEmail}</span>
              <span style={{ color: '#94a3b8' }}>☎ {leadPhone}</span>
            </div>

            {/* DevTools Corner crosshairs */}
            <div
              style={{
                position: 'absolute',
                top: -5,
                left: -5,
                width: 10,
                height: 10,
                borderTop: `2px solid ${accentColor}`,
                borderLeft: `2px solid ${accentColor}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -5,
                right: -5,
                width: 10,
                height: 10,
                borderBottom: `2px solid ${accentColor}`,
                borderRight: `2px solid ${accentColor}`,
              }}
            />
          </div>

          {/* Another dummy sibling */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              opacity: 0.35,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Marcus Brody</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Founder & CTO • NextPeak Data</div>
          </div>

          {/* Bottom Extraction laser bar */}
          <div
            style={{
              marginTop: 'auto',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 8,
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 11,
              color: '#94a3b8',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: accentColor, fontWeight: 700 }}>CSS Path:</span>
              <span style={{ fontFamily: "'Fira Code', monospace", color: '#e2e8f0', fontSize: 10 }}>
                html &gt; body &gt; div#app &gt; div.grid &gt; div.lead-card
              </span>
            </div>
            <span style={{ color: secondaryAccent, fontWeight: 700 }}>200 OK</span>
          </div>
        </div>

        {/* Right Column: Clean Extracted JSON Payload */}
        <div
          style={{
            flex: 0.9,
            background: 'rgba(2, 6, 23, 0.9)',
            borderRadius: 14,
            border: '1px solid rgba(56, 189, 248, 0.2)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Fira Code', monospace",
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 10,
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, letterSpacing: '0.04em' }}>
              &gt; EXTRACTED_JSON [LIVE]
            </span>
            <span
              style={{
                fontSize: 10,
                background: 'rgba(16, 185, 129, 0.15)',
                color: secondaryAccent,
                padding: '2px 8px',
                borderRadius: 4,
                fontWeight: 700,
              }}
            >
              FORMAT: UTF-8
            </span>
          </div>

          {/* JSON Tree lines with progressive reveal */}
          <div style={{ fontSize: 12, lineHeight: 1.6, color: '#cbd5e1', flex: 1 }}>
            <div style={{ color: '#64748b' }}>&#123;</div>
            <div style={{ paddingLeft: 14 }}>
              <span style={{ color: '#94a3b8' }}>&quot;target_status&quot;:</span>{' '}
              <span style={{ color: secondaryAccent }}>&quot;SUCCESS_EXTRACTED&quot;</span>,
            </div>

            {extractedFields.map((field, idx) => {
              const itemAppear = interpolate(frame - (20 + idx * 8), [0, 10], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

              return (
                <div
                  key={field.label}
                  style={{
                    paddingLeft: 14,
                    opacity: itemAppear,
                    transform: `translateX(${(1 - itemAppear) * 12}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    lineHeight: '26px',
                  }}
                >
                  <span style={{ color: '#38bdf8' }}>&quot;{field.label}&quot;:</span>
                  {field.type === 'badge' ? (
                    <span
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: secondaryAccent,
                        padding: '1px 6px',
                        borderRadius: 3,
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      &quot;{field.value}&quot;
                    </span>
                  ) : (
                    <span style={{ color: '#fde047' }}>&quot;{field.value}&quot;</span>
                  )}
                  {idx < extractedFields.length - 1 && <span style={{ color: '#64748b' }}>,</span>}
                </div>
              );
            })}

            <div style={{ color: '#64748b' }}>&#125;</div>
          </div>

          {/* Bottom Extraction Status */}
          <div
            style={{
              paddingTop: 10,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 11,
              color: '#64748b',
            }}
          >
            <span>Payload Size: 412 Bytes</span>
            <span style={{ color: secondaryAccent, fontWeight: 700 }}>✓ ZERO-CODE EXPORT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
