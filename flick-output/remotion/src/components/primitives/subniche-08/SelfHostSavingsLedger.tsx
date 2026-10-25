import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LedgerItem {
  label: string;
  cloudCost: number;
  vpsCost: number;
  notes: string;
}

export interface SelfHostSavingsLedgerProps {
  comparisonTitle?: string;
  cloudProviderName?: string;
  selfHostStack?: string;
  vpsMonthlyCost?: number;
  cloudMonthlyCost?: number;
  items?: LedgerItem[];
  vpsSpecs?: string;
  width?: number;
  height?: number;
}

const DEFAULT_LEDGER_ITEMS: LedgerItem[] = [
  {
    label: 'Core User Seats (10 seats)',
    cloudCost: 350,
    vpsCost: 0,
    notes: 'Open source has zero seat penalty',
  },
  {
    label: 'Compute, DB & Hosting',
    cloudCost: 50,
    vpsCost: 10,
    notes: '4 vCPU, 8GB RAM Hetzner / Linode VPS',
  },
  {
    label: 'API & Workflow Runs',
    cloudCost: 65,
    vpsCost: 0,
    notes: 'Unlimited local n8n / worker execution',
  },
  {
    label: 'Automated Encrypted Backups',
    cloudCost: 35,
    vpsCost: 2,
    notes: 'Daily snapshot to S3 / Cloudflare R2',
  },
];

export const SelfHostSavingsLedger: React.FC<SelfHostSavingsLedgerProps> = ({
  comparisonTitle = 'CLOUD SAAS VS. SELF-HOSTED VPS LEDGER',
  cloudProviderName = 'Commercial Cloud SaaS (Per-Seat)',
  selfHostStack = 'Self-Hosted Docker Stack (Open Source)',
  vpsMonthlyCost = 12,
  cloudMonthlyCost = 500,
  items = DEFAULT_LEDGER_ITEMS,
  vpsSpecs = 'Hetzner CX32 • 4 vCPU / 8GB RAM / 80GB NVMe',
  width = 900,
  height = 630,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.93, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [25, 0]);

  // Annual calculation
  const cloudAnnual = cloudMonthlyCost * 12;
  const vpsAnnual = vpsMonthlyCost * 12;
  const annualSavings = cloudAnnual - vpsAnnual;
  const savingsPercent = Math.round((annualSavings / cloudAnnual) * 100);

  // Animated savings counter
  const savingsProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const animatedSavings = Math.round(interpolate(savingsProgress, [0, 1], [0, annualSavings]));
  const animatedBarWidth = interpolate(savingsProgress, [0, 1], [0, savingsPercent]);

  // Status green pulse
  const greenGlow = interpolate(Math.sin(frame * 0.18), [-1, 1], [0.35, 0.8]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 25, 41, 0.94) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        boxShadow: `0 25px 65px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, ${greenGlow * 0.35})`,
        padding: '24px 30px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background terminal matrix accent */}
      <div
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: 16,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Server / Terminal Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 18px rgba(16, 185, 129, 0.45)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
              <line x1="6" y1="6" x2="6.01" y2="6" />
              <line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  background: 'linear-gradient(90deg, #34d399, #38bdf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {comparisonTitle}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 9999,
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#6ee7b7',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 8px #10b981',
                  }}
                />
                DATA SOVEREIGNTY
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              Comparing 12 months recurring cloud expenses vs. single self-hosted node
            </div>
          </div>
        </div>

        {/* VPS Spec Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            borderRadius: 10,
            background: 'rgba(2, 6, 23, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#34d399',
          }}
        >
          <span>$10/mo VPS</span>
          <span style={{ color: '#475569' }}>|</span>
          <span style={{ color: '#cbd5e1' }}>docker compose up -d</span>
        </div>
      </div>

      {/* Side-by-Side Dual Header Summary Boxes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        {/* Left: Commercial Cloud SaaS */}
        <div
          style={{
            borderRadius: 14,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase' }}>
              {cloudProviderName}
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#f87171', marginTop: 2 }}>
              ${cloudMonthlyCost} <span style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>/ mo</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12, color: '#cbd5e1' }}>
            <div style={{ fontWeight: 700, color: '#ffffff' }}>${cloudAnnual.toLocaleString()}</div>
            <div style={{ color: '#94a3b8', fontSize: 11 }}>12-month bill</div>
          </div>
        </div>

        {/* Right: Self-Hosted VPS */}
        <div
          style={{
            borderRadius: 14,
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1.5px solid rgba(16, 185, 129, 0.5)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)',
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase' }}>
              {selfHostStack}
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#34d399', marginTop: 2 }}>
              ${vpsMonthlyCost} <span style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>/ mo</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12, color: '#cbd5e1' }}>
            <div style={{ fontWeight: 700, color: '#34d399' }}>${vpsAnnual.toLocaleString()}</div>
            <div style={{ color: '#94a3b8', fontSize: 11 }}>12-month total</div>
          </div>
        </div>
      </div>

      {/* Main Ledger Breakdown Table */}
      <div
        style={{
          borderRadius: 14,
          background: 'rgba(2, 6, 23, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginBottom: 16,
          zIndex: 2,
        }}
      >
        {/* Table Column Labels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 1fr 1fr',
            fontSize: 11,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            paddingBottom: 6,
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div>Expense Category</div>
          <div style={{ textAlign: 'center' }}>Cloud Monthly</div>
          <div style={{ textAlign: 'center' }}>VPS Equivalent</div>
        </div>

        {items.map((item, idx) => {
          const itemProgress = spring({
            frame: frame - (15 + idx * 6),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={idx}
              style={{
                opacity: interpolate(itemProgress, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(itemProgress, [0, 1], [-10, 0])}px)`,
                display: 'grid',
                gridTemplateColumns: '1.8fr 1fr 1fr',
                alignItems: 'center',
                padding: '8px 4px',
                fontSize: 12.5,
                borderBottom: idx < items.length - 1 ? '1px solid rgba(255, 255, 255, 0.04)' : 'none',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{item.notes}</div>
              </div>

              <div style={{ textAlign: 'center', fontWeight: 700, color: '#f87171' }}>
                ${item.cloudCost}/mo
              </div>

              <div style={{ textAlign: 'center', fontWeight: 800, color: item.vpsCost === 0 ? '#34d399' : '#38bdf8' }}>
                {item.vpsCost === 0 ? 'FREE ($0)' : `$${item.vpsCost}/mo`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Hero Net Savings Callout */}
      <div
        style={{
          marginTop: 'auto',
          borderRadius: 14,
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.22) 0%, rgba(6, 78, 59, 0.3) 100%)',
          border: '1.5px solid rgba(16, 185, 129, 0.65)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.6)',
              color: '#064e3b',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cumulative 1-Year Financial Advantage
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
              +${animatedSavings.toLocaleString()} Saved / Year
            </div>
          </div>
        </div>

        {/* Savings Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: 220 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#a7f3d0' }}>Cost Reduction</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#34d399' }}>{savingsPercent}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: 8,
              borderRadius: 9999,
              background: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${animatedBarWidth}%`,
                height: '100%',
                borderRadius: 9999,
                background: 'linear-gradient(90deg, #10b981, #34d399)',
                boxShadow: '0 0 10px #10b981',
              }}
            />
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
            {vpsSpecs}
          </div>
        </div>
      </div>
    </div>
  );
};
