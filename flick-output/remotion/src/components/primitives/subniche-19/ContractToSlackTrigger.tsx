import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ContractToSlackTriggerProps {
  clientName?: string;
  signerName?: string;
  contractValue?: string;
  channelName?: string;
  teamInvitedCount?: number;
  envelopeId?: string;
  latencyMs?: number;
  width?: number;
  height?: number;
}

export const ContractToSlackTrigger: React.FC<ContractToSlackTriggerProps> = ({
  clientName = 'Apex Peak Ventures',
  signerName = 'Johnathan Vance, CEO',
  contractValue = '$111,000 (6-Mo Retainer)',
  channelName = 'client-apex-peak',
  teamInvitedCount = 5,
  envelopeId = 'DS-8921-994A',
  latencyMs = 280,
  width = 960,
  height = 760,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master card entrance
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const cardScale = interpolate(cardSpring, [0, 1], [0.88, 1]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  // DocuSign Stamp Spring (pops in at frame 12)
  const stampSpring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.9 },
  });
  const stampScale = interpolate(stampSpring, [0, 1], [2.2, 1]);
  const stampOpacity = interpolate(stampSpring, [0, 1], [0, 1]);

  // Webhook particle pulse progress (travels between frame 24 and 45)
  const webhookTravel = interpolate(frame, [22, 44], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Slack card spring (pops in at frame 38)
  const slackSpring = spring({
    frame: Math.max(0, frame - 38),
    fps,
    config: { damping: 13, stiffness: 130 },
  });
  const slackScale = interpolate(slackSpring, [0, 1], [0.92, 1]);
  const slackOpacity = interpolate(slackSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
        borderRadius: 24,
        background:
          'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(18, 20, 36, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(56, 189, 248, 0.35)',
        boxShadow:
          '0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 45px rgba(56, 189, 248, 0.16)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background glow effects */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          left: 40,
          width: 360,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.16) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          right: 30,
          width: 380,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.16) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
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
              background: 'linear-gradient(135deg, #0284c7, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(99, 102, 241, 0.45)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 26, fontWeight: 900, color: '#ffffff' }}>
                Contract-To-Slack Instant Trigger
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.18)',
                  padding: '4px 10px',
                  borderRadius: 8,
                  border: '1.5px solid rgba(56, 189, 248, 0.4)',
                }}
              >
                WEBHOOK BOT ACTIVE
              </span>
            </div>
            <div style={{ fontSize: 16, color: '#94a3b8', marginTop: 4, fontWeight: 600 }}>
              DocuSign Event → REST API Webhook → Slack Workspace Provisioning
            </div>
          </div>
        </div>

        {/* Latency badge */}
        <div
          style={{
            padding: '8px 18px',
            borderRadius: 12,
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1.5px solid rgba(16, 185, 129, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span style={{ fontSize: 16, fontWeight: 800, color: '#4ade80' }}>
            ⚡ {latencyMs}ms Latency
          </span>
        </div>
      </div>

      {/* Main split grid: Left DocuSign Envelope, Center Webhook pipeline, Right Slack channel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 50px 1.25fr',
          gap: 12,
          flex: 1,
          alignItems: 'stretch',
        }}
      >
        {/* Left Side: DocuSign Card */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.55)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 16,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    background: '#ff5900',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  DOCUSIGN
                </span>
                <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
                  {envelopeId}
                </span>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#4ade80',
                  background: 'rgba(34, 197, 94, 0.15)',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                COMPLETED
              </span>
            </div>

            <div style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', marginBottom: 6 }}>
              6-Month Master Agreement
            </div>
            <div style={{ fontSize: 15, color: '#94a3b8', marginBottom: 14 }}>
              Client: <strong style={{ color: '#e2e8f0' }}>{clientName}</strong>
            </div>

            {/* Contract Value Highlight */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px solid rgba(51, 65, 85, 0.8)',
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>SIGNED RETAINER VALUE</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#38bdf8' }}>{contractValue}</div>
            </div>

            {/* Signer verification */}
            <div style={{ fontSize: 14, color: '#cbd5e1' }}>
              Signer: <strong>{signerName}</strong>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Timestamp: Oct 25, 2026 • IP & Audit Trail Sealed
            </div>
          </div>

          {/* DocuSign Stamp Overlay */}
          <div
            style={{
              opacity: stampOpacity,
              transform: `scale(${stampScale}) rotate(-6deg)`,
              marginTop: 12,
              alignSelf: 'center',
              border: '2.5px solid #22c55e',
              borderRadius: 12,
              padding: '8px 18px',
              backgroundColor: 'rgba(22, 101, 52, 0.55)',
              boxShadow: '0 0 25px rgba(34, 197, 94, 0.5)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 900, color: '#4ade80', letterSpacing: '0.08em' }}>
              ✓ SIGNED & CERTIFIED
            </div>
            <div style={{ fontSize: 9, color: '#86efac', fontWeight: 700 }}>
              AUTO-TRIGGER DISPATCHED
            </div>
          </div>
        </div>

        {/* Center: Animated Webhook Conduit */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Connector line */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '20%',
              bottom: '20%',
              width: 2,
              background: 'rgba(148, 163, 184, 0.2)',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Glowing pulse moving across */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              boxShadow: '0 0 16px #06b6d4, 0 0 30px #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              transform: `scale(${1 + webhookTravel * 0.2})`,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>

          <span
            style={{
              fontSize: 8,
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '0.06em',
              marginTop: 8,
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            JSON<br />PAYLOAD
          </span>
        </div>

        {/* Right Side: Slack Channel Mockup */}
        <div
          style={{
            opacity: slackOpacity,
            transform: `scale(${slackScale})`,
            background: 'rgba(26, 29, 33, 0.85)',
            border: '1.5px solid rgba(236, 72, 153, 0.35)',
            borderRadius: 16,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Slack Channel Header */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: 10,
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, color: '#e2e8f0', fontWeight: 900 }}>🔒 #{channelName}</span>
                <span
                  style={{
                    fontSize: 12,
                    color: '#94a3b8',
                    background: 'rgba(255, 255, 255, 0.12)',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  Private
                </span>
              </div>
              <span style={{ fontSize: 14, color: '#cbd5e1', fontWeight: 600 }}>👥 {teamInvitedCount} Members</span>
            </div>

            {/* Bot message bubble */}
            <div
              style={{
                background: 'rgba(34, 38, 44, 0.85)',
                borderLeft: '4px solid #ec4899',
                borderRadius: '0 12px 12px 0',
                padding: '12px 14px',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: '#ec4899',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 900,
                    color: '#fff',
                  }}
                >
                  ⚡
                </span>
                <span style={{ fontSize: 15, fontWeight: 900, color: '#f8fafc' }}>AgencyFlow Bot</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#94a3b8',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  APP
                </span>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>Just now</span>
              </div>

              <div style={{ fontSize: 16, color: '#f1f5f9', lineHeight: 1.4, fontWeight: 700 }}>
                🎉 24H SOP Triggered! <span style={{ color: '#38bdf8' }}>{clientName}</span> assets & logins verified!
              </div>
            </div>

            {/* Automated provision checklist (Progressive checkoff) */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 15,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4ade80', opacity: frame >= 65 ? 1 : 0.2, transition: 'opacity 0.2s' }}>
                <span>✓</span>
                <span>Created private channel <strong>#{channelName}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4ade80', opacity: frame >= 85 ? 1 : 0.2, transition: 'opacity 0.2s' }}>
                <span>✓</span>
                <span>Auto-invited {teamInvitedCount} Core Team Leads & Client</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4ade80', opacity: frame >= 105 ? 1 : 0.2, transition: 'opacity 0.2s' }}>
                <span>✓</span>
                <span>Google Drive client folders generated</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8', opacity: frame >= 120 ? 1 : 0.2, transition: 'opacity 0.2s' }}>
                <span>⚡</span>
                <span>24-Hour Kickoff Sprint initialized</span>
              </div>
            </div>
          </div>

          {/* Slack notification pill */}
          <div
            style={{
              marginTop: 10,
              fontSize: 10,
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: 8,
            }}
          >
            <span>Auto-provisioned without manual human delay</span>
            <span style={{ color: '#22c55e', fontWeight: 700 }}>● ZERO LATENCY</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#64748b',
          borderTop: '1px solid rgba(148, 163, 184, 0.14)',
          paddingTop: 10,
        }}
      >
        <span>⚡ Trigger rule: Envelope.Completed → Webhook Dispatcher → Slack Bot Gateway</span>
        <span style={{ color: '#38bdf8', fontWeight: 600 }}>Agency Workflow System #19.4</span>
      </div>
    </div>
  );
};
