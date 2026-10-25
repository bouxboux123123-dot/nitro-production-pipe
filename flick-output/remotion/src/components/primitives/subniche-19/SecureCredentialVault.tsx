import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface VaultCredentialItem {
  platform: string;
  accountIdentifier: string;
  rawCredentialPreview: string;
  maskedLength: number;
  scope: string;
  status: 'delegated' | 'encrypting' | 'verified';
  iconColor: string;
}

export interface RoleDelegation {
  role: string;
  assignee: string;
  permission: string;
  status: 'active' | 'revoked';
}

export interface SecureCredentialVaultProps {
  clientName?: string;
  encryptionCipher?: string;
  credentials?: VaultCredentialItem[];
  delegations?: RoleDelegation[];
  width?: number;
  height?: number;
}

export const SecureCredentialVault: React.FC<SecureCredentialVaultProps> = ({
  clientName = 'Apex Peak Ventures',
  encryptionCipher = 'AES-256-GCM (Zero-Knowledge)',
  credentials = [
    {
      platform: 'Meta Business Manager',
      accountIdentifier: 'BM-ID: 9482-1082-9901',
      rawCredentialPreview: 'EAABsbCS1920zK09',
      maskedLength: 28,
      scope: 'Ads Management & Pixel Only',
      status: 'delegated',
      iconColor: '#3b82f6',
    },
    {
      platform: 'Shopify Plus Private API',
      accountIdentifier: 'store: apex-peak-official.myshopify.com',
      rawCredentialPreview: 'shppa_9f81a70cb3e211',
      maskedLength: 32,
      scope: 'Read Products, Orders & Analytics',
      status: 'delegated',
      iconColor: '#10b981',
    },
    {
      platform: 'Google Ads Manager (MCC)',
      accountIdentifier: 'CID: 481-992-0193',
      rawCredentialPreview: 'oauth_rt_942901aa',
      maskedLength: 24,
      scope: 'Standard Client Manager Link',
      status: 'verified',
      iconColor: '#f59e0b',
    },
  ],
  delegations = [
    { role: 'Senior Media Buyer', assignee: 'sarah.m@agency.io', permission: 'Ad Ops Exec', status: 'active' },
    { role: 'Creative Director', assignee: 'david.k@agency.io', permission: 'Asset Read Only', status: 'active' },
    { role: 'Master Admin Root', assignee: 'Restricted', permission: 'Zero Access (Client Held)', status: 'revoked' },
  ],
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master card entrance
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const cardScale = interpolate(cardSpring, [0, 1], [0.88, 1]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  // Encryption transition timing: between frame 20 and 45, raw text scrambles into dots
  const encryptProgress = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Shield pulse
  const shieldPulse = (Math.sin((frame / fps) * Math.PI * 3) + 1) / 2;
  const shieldGlow = interpolate(shieldPulse, [0, 1], [8, 22]);

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
          'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(13, 27, 42, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(16, 185, 129, 0.4)',
        boxShadow:
          '0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 50px rgba(16, 185, 129, 0.16)',
        padding: '26px 30px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background emerald and cyan security glow */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          left: 100,
          width: 450,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -70,
          right: -30,
          width: 380,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
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
          paddingBottom: 16,
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Shield Icon */}
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 182, 212, 0.2))',
              border: '1.5px solid rgba(52, 211, 153, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 ${shieldGlow}px rgba(16, 185, 129, 0.4)`,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                Secure Credential Vault
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '2px 8px',
                  borderRadius: 10,
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  letterSpacing: '0.05em',
                }}
              >
                SOC-2 TYPE II
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Client: <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{clientName}</span> • Zero-Knowledge Token Passing
            </div>
          </div>
        </div>

        {/* Live Cipher Mode */}
        <div
          style={{
            padding: '8px 14px',
            borderRadius: 12,
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, color: '#6ee7b7', fontWeight: 700, letterSpacing: '0.08em' }}>
            ENCRYPTION CIPHER
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#ffffff', fontFamily: 'monospace' }}>
            {encryptionCipher}
          </div>
        </div>
      </div>

      {/* Main split section: Left Credentials List, Right Delegation Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.95fr', gap: 16, flex: 1 }}>
        {/* Credentials Submission and Masking List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Active Platform Integrations
          </div>

          {credentials.map((cred, idx) => {
            const rowSpring = spring({
              frame: Math.max(0, frame - (10 + idx * 7)),
              fps,
              config: { damping: 14, stiffness: 130 },
            });
            const rowOpacity = interpolate(rowSpring, [0, 1], [0, 1]);
            const rowX = interpolate(rowSpring, [0, 1], [-20, 0]);

            // Scramble to masked dots as encryptProgress rises
            const isEncrypted = encryptProgress > 0.6;
            const displayedToken = isEncrypted
              ? '•••• •••• •••• •••• ••••'
              : `${cred.rawCredentialPreview}${'*'.repeat(12)}`;

            return (
              <div
                key={cred.platform}
                style={{
                  opacity: rowOpacity,
                  transform: `translateX(${rowX}px)`,
                  background: 'rgba(30, 41, 59, 0.55)',
                  border: '1px solid rgba(148, 163, 184, 0.16)',
                  borderRadius: 14,
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: cred.iconColor,
                        boxShadow: `0 0 8px ${cred.iconColor}`,
                      }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                      {cred.platform}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: isEncrypted ? '#34d399' : '#38bdf8',
                      background: isEncrypted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                      padding: '2px 8px',
                      borderRadius: 8,
                      border: `1px solid ${isEncrypted ? 'rgba(52, 211, 153, 0.35)' : 'rgba(56, 189, 248, 0.35)'}`,
                    }}
                  >
                    {isEncrypted ? '🔒 ENCRYPTED' : 'HASHING...'}
                  </span>
                </div>

                {/* Account identifier */}
                <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
                  {cred.accountIdentifier}
                </div>

                {/* Masked Secret Box */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(51, 65, 85, 0.6)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: 'monospace',
                      letterSpacing: isEncrypted ? '0.15em' : '0.05em',
                      color: isEncrypted ? '#10b981' : '#f1f5f9',
                    }}
                  >
                    {displayedToken}
                  </span>
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
                    {cred.scope}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right side: Auto-Delegated Access Matrix */}
        <div
          style={{
            background: 'rgba(24, 34, 53, 0.55)',
            border: '1px solid rgba(56, 189, 248, 0.22)',
            borderRadius: 16,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.06em' }}>
                SCOPED DELEGATION MATRIX
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {delegations.map((role) => {
                const isActive = role.status === 'active';
                return (
                  <div
                    key={role.role}
                    style={{
                      background: 'rgba(15, 23, 42, 0.75)',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: `1px solid ${isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>
                        {role.role}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 6,
                          background: isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isActive ? '#4ade80' : '#f87171',
                        }}
                      >
                        {isActive ? 'DELEGATED' : 'BLOCKED'}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>
                      {role.assignee} • <strong style={{ color: '#cbd5e1' }}>{role.permission}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Revoke Safeguard Banner */}
          <div
            style={{
              marginTop: 14,
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>🛑</span>
              <span style={{ fontSize: 11, color: '#fca5a5', fontWeight: 600 }}>
                1-Click Emergency Revoke
              </span>
            </div>
            <span
              style={{
                fontSize: 10,
                color: '#ef4444',
                fontWeight: 700,
                textTransform: 'uppercase',
                borderBottom: '1px dotted #ef4444',
              }}
            >
              Master Kill-Switch
            </span>
          </div>
        </div>
      </div>

      {/* Vault Footer */}
      <div
        style={{
          marginTop: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#64748b',
          borderTop: '1px solid rgba(148, 163, 184, 0.14)',
          paddingTop: 10,
        }}
      >
        <span>
          🔐 Passwords never touch agency servers. Direct OAuth tokens with granular scopes only.
        </span>
        <span style={{ color: '#10b981', fontWeight: 700 }}>● VAULT INTEGRITY 100%</span>
      </div>
    </div>
  );
};
