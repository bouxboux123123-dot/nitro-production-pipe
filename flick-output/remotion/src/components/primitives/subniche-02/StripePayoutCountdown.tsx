import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export interface StripePayoutCountdownProps {
  invoiceId?: string;
  clientName?: string;
  amount?: number;
  currency?: string;
  dueDate?: string;
  instantDepositFee?: string;
  bankName?: string;
}

export const StripePayoutCountdown: React.FC<StripePayoutCountdownProps> = ({
  invoiceId = 'INV-88219-STRIPE',
  clientName = 'Starlight Digital Ltd',
  amount = 8450,
  currency = '$',
  dueDate = 'Net-30 Standard Terms',
  instantDepositFee = '0% Freelance Shield Active',
  bankName = 'Mercury Business Checking ··9041',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 160-frame smooth looping cycle
  const loopDuration = 160;
  const cycleFrame = frame % loopDuration;

  // Phase transition:
  // 0 - 45: Net-30 static / slow tick (frozen cashflow)
  // 45 - 85: Fast-forward countdown compression (30 days -> 24 hours -> 0s)
  // 85 - 160: Instant payout explosion & deposit settled in checking account
  const turboProgress = spring({
    frame: cycleFrame - 45,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const settledProgress = spring({
    frame: cycleFrame - 85,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Calculate simulated days remaining: 30 down to 0
  const daysLeft = Math.max(
    0,
    Math.round(
      interpolate(cycleFrame, [0, 45, 80], [30, 29, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    )
  );

  const hoursLeft = Math.max(
    0,
    Math.round(
      interpolate(cycleFrame, [45, 80], [24, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    )
  );

  const isInstantCleared = cycleFrame >= 85;

  // Visual pulses and glows
  const glowIntensity = interpolate(
    Math.sin(cycleFrame * 0.12),
    [-1, 1],
    [0.15, 0.4]
  );

  return (
    <div
      style={{
        width: 880,
        minHeight: 560,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(20, 24, 46, 0.92) 100%)',
        border: isInstantCleared
          ? '1px solid rgba(16, 185, 129, 0.45)'
          : '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: 28,
        padding: '32px 36px',
        boxShadow: isInstantCleared
          ? '0 24px 60px -10px rgba(0, 0, 0, 0.7), 0 0 50px -5px rgba(16, 185, 129, 0.25)'
          : '0 24px 60px -10px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(99, 102, 241, 0.2)',
        backdropFilter: 'blur(20px)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border 0.4s ease',
      }}
    >
      {/* Background radial highlights */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: isInstantCleared
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 18,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
            }}
          >
            {/* Stripe / Card Icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
                Stripe Payout Accelerator
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#818cf8',
                  background: 'rgba(99, 102, 241, 0.18)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  textTransform: 'uppercase',
                }}
              >
                Direct Rail
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              Invoice {invoiceId} · {clientName}
            </div>
          </div>
        </div>

        {/* Invoice Amount Display */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Invoice Amount</div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
              color: '#ffffff',
            }}
          >
            {currency}{amount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Countdown Display HUD */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Countdown Center Display */}
        <div
          style={{
            background: isInstantCleared
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 78, 59, 0.25) 100%)'
              : 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: isInstantCleared
              ? '1px solid rgba(16, 185, 129, 0.4)'
              : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 22,
            padding: '26px 48px',
            textAlign: 'center',
            position: 'relative',
            width: '85%',
            boxShadow: isInstantCleared
              ? '0 0 40px rgba(16, 185, 129, 0.25)'
              : 'none',
          }}
        >
          {/* Status Label */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: isInstantCleared ? '#34d399' : '#94a3b8',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>{isInstantCleared ? '⚡ INSTANT AUTODEPOSIT COMPLETED' : '⏳ TRADITIONAL NET-30 WAITING PERIOD'}</span>
          </div>

          {/* Large Countdown / Result Text */}
          {!isInstantCleared ? (
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '-0.03em',
                color: cycleFrame > 45 ? '#38bdf8' : '#f1f5f9',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span>{daysLeft.toString().padStart(2, '0')}</span>
              <span style={{ fontSize: 24, color: '#64748b', fontWeight: 600 }}>DAYS</span>
              <span>{hoursLeft.toString().padStart(2, '0')}</span>
              <span style={{ fontSize: 24, color: '#64748b', fontWeight: 600 }}>HRS</span>
            </div>
          ) : (
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                fontFamily: "'JetBrains Mono', monospace",
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                textShadow: '0 0 25px rgba(16, 185, 129, 0.5)',
              }}
            >
              <span>+${amount.toLocaleString()}</span>
              <span
                style={{
                  fontSize: 16,
                  padding: '6px 14px',
                  borderRadius: 12,
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: 800,
                }}
              >
                CLEARED
              </span>
            </div>
          )}

          {/* Subtext description */}
          <div style={{ marginTop: 10, fontSize: 13, color: '#cbd5e1' }}>
            {isInstantCleared
              ? `Funds wired via FedNow Real-Time Rails into ${bankName}`
              : cycleFrame > 45
              ? '⚡ AI Invoicing Engine bypassing standard 30-day payout delay...'
              : 'Clients take 30 days to clear invoices manually. AI unlocks same-day cashflow.'}
          </div>
        </div>

        {/* Speed Comparison Step Indicators */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            width: '100%',
            marginTop: 22,
          }}
        >
          {/* Step 1 */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Old Way</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f87171', marginTop: 2 }}>
              Net-30 / 45 Days
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Frozen cashflow</div>
          </div>

          {/* Step 2 */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              background: 'rgba(30, 41, 59, 0.5)',
              border: cycleFrame > 45 ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>AI Verification</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#38bdf8', marginTop: 2 }}>
              Zero-Risk Escrow
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Auto-approved credit</div>
          </div>

          {/* Step 3 */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              background: isInstantCleared ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.5)',
              border: isInstantCleared ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Instant Deposit</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#10b981', marginTop: 2 }}>
              Under 24 Hours
            </div>
            <div style={{ fontSize: 11, color: isInstantCleared ? '#6ee7b7' : '#94a3b8', marginTop: 2 }}>
              {instantDepositFee}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ledger Footer */}
      <div
        style={{
          marginTop: 18,
          paddingTop: 14,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          color: '#94a3b8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#10b981' }}>●</span>
          <span>ACH / FedNow Rail Status:</span>
          <span style={{ color: '#ffffff', fontWeight: 600 }}>OPERATIONAL (0.02s ping)</span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#64748b' }}>
          TXN_HASH: 0x99a2c...881f
        </div>
      </div>
    </div>
  );
};
