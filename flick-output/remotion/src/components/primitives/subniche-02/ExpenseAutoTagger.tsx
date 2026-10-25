import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export interface RawTransaction {
  id: string;
  rawText: string;
  cleanMerchant: string;
  amount: number;
  category: string;
  deductionRate: number; // e.g. 100 = 100%
  color: string;
}

export interface ExpenseAutoTaggerProps {
  title?: string;
  totalDeductions?: number;
  estimatedTaxSaved?: number;
  transactions?: RawTransaction[];
}

export const ExpenseAutoTagger: React.FC<ExpenseAutoTaggerProps> = ({
  title = 'AI Auto-Expense & Tax Tagger',
  totalDeductions = 3420,
  estimatedTaxSaved = 1026,
  transactions = [
    {
      id: 'tx-1',
      rawText: 'AMZN MKTP US*8G9Y7 SEATTLE WA',
      cleanMerchant: 'Amazon Tech (Monitor & Desk)',
      amount: 489.0,
      category: 'Home Office Equip.',
      deductionRate: 100,
      color: '#38bdf8',
    },
    {
      id: 'tx-2',
      rawText: 'ADOBE *CREATIVE CLOUD 800-833',
      cleanMerchant: 'Adobe Creative Cloud',
      amount: 59.99,
      category: 'Software & SaaS',
      deductionRate: 100,
      color: '#a855f7',
    },
    {
      id: 'tx-3',
      rawText: 'UBER *TRIP 10/24 SF AIRPORT',
      cleanMerchant: 'Uber (Client Onsite Meeting)',
      amount: 42.5,
      category: 'Business Travel',
      deductionRate: 100,
      color: '#10b981',
    },
    {
      id: 'tx-4',
      rawText: 'WEWORK CO-WORKING NYC #402',
      cleanMerchant: 'WeWork Flexible Office',
      amount: 450.0,
      category: 'Workspace Rent',
      deductionRate: 100,
      color: '#f59e0b',
    },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 160-frame looping cycle
  const loopDuration = 160;
  const cycleFrame = frame % loopDuration;

  // Running deduction counter simulation
  const animatedSavings = Math.round(
    interpolate(cycleFrame, [10, 100], [450, totalDeductions], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  return (
    <div
      style={{
        width: 890,
        minHeight: 570,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(20, 27, 48, 0.92) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 28,
        padding: '30px 34px',
        boxShadow:
          '0 25px 65px -15px rgba(0, 0, 0, 0.7), 0 0 45px -10px rgba(16, 185, 129, 0.15)',
        backdropFilter: 'blur(20px)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            }}
          >
            {/* Tag / Receipt Icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Plaid Real-Time Stream → IRS Schedule C Classification
            </div>
          </div>
        </div>

        {/* Live Tax Savings Counter */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 14,
            padding: '8px 18px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#6ee7b7', fontWeight: 700 }}>
            Tax Write-Offs Found
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
              color: '#34d399',
            }}
          >
            ${animatedSavings.toLocaleString()}
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}> (Saved ~${estimatedTaxSaved})</span>
          </div>
        </div>
      </div>

      {/* Waterfall Stream: Messy Raw vs. Auto-Sorted Cards */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11 }}>
        {transactions.map((tx, idx) => {
          // Staggered transformation per transaction
          const triggerFrame = 12 + idx * 18;
          const progress = spring({
            frame: cycleFrame - triggerFrame,
            fps,
            config: { damping: 15, stiffness: 100 },
          });

          const isSorted = cycleFrame >= triggerFrame + 14;
          const slideX = interpolate(progress, [0, 1], [-20, 0]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          return (
            <div
              key={tx.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '290px 48px 1fr 110px',
                alignItems: 'center',
                padding: '11px 16px',
                borderRadius: 14,
                background: isSorted
                  ? 'linear-gradient(90deg, rgba(30, 41, 59, 0.6) 0%, rgba(16, 185, 129, 0.1) 100%)'
                  : 'rgba(30, 41, 59, 0.35)',
                border: isSorted
                  ? '1px solid rgba(16, 185, 129, 0.25)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                transform: `translateX(${slideX}px)`,
                opacity,
                transition: 'all 0.3s ease',
              }}
            >
              {/* Raw Messy Bank Descriptor */}
              <div>
                <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Raw Bank Descriptor
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: '#94a3b8',
                    marginTop: 2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {tx.rawText}
                </div>
              </div>

              {/* AI Parser Arrow */}
              <div style={{ textAlign: 'center', color: '#10b981', fontSize: 14 }}>
                ➔
              </div>

              {/* Clean Categorized Entity & Tax Folder */}
              <div style={{ paddingLeft: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
                    {tx.cleanMerchant}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: tx.color,
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: `1px solid ${tx.color}44`,
                      padding: '2px 8px',
                      borderRadius: 6,
                    }}
                  >
                    📁 {tx.category}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#10b981', marginTop: 2 }}>
                  ✓ {tx.deductionRate}% Deductible Write-Off Applied
                </div>
              </div>

              {/* Amount & Status Badge */}
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#ffffff',
                  }}
                >
                  ${tx.amount.toFixed(2)}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#34d399',
                    marginTop: 2,
                  }}
                >
                  TAGGED & FILED
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div
        style={{
          marginTop: 18,
          paddingTop: 14,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8' }}>
          <span style={{ color: '#10b981' }}>⚡</span>
          <span>Zero manual receipts scanning. 100% compliant audit-proof records.</span>
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#38bdf8',
            background: 'rgba(56, 189, 248, 0.1)',
            padding: '4px 12px',
            borderRadius: 8,
          }}
        >
          Auto-Synced to QuickBooks / Xero
        </div>
      </div>
    </div>
  );
};
