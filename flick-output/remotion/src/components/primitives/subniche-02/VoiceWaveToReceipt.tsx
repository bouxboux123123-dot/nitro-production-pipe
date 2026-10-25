import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export interface InvoiceItem {
  desc: string;
  hours?: number;
  rate?: number;
  amount: number;
}

export interface VoiceWaveToReceiptProps {
  title?: string;
  clientName?: string;
  voiceDuration?: string;
  voicePrompt?: string;
  items?: InvoiceItem[];
  invoiceNumber?: string;
  taxRate?: number;
  themeColor?: string;
}

export const VoiceWaveToReceipt: React.FC<VoiceWaveToReceiptProps> = ({
  title = 'AI Voice-to-Invoice',
  clientName = 'Acme Corp · Brand Redesign',
  voiceDuration = '0:42 recorded',
  voicePrompt = '“Bill Acme 18 hours UI/UX wireframes at $120/hr plus $450 Figma prototypes”',
  items = [
    { desc: 'UI/UX Wireframes & Flows', hours: 18, rate: 120, amount: 2160 },
    { desc: 'Interactive Figma Prototypes', amount: 450 },
    { desc: 'Client Walkthrough & Handoff', hours: 3, rate: 120, amount: 360 },
  ],
  invoiceNumber = 'INV-2026-089',
  taxRate = 0.08,
  themeColor = '#6366f1',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation cycle (loops smoothly over 160 frames)
  const loopDuration = 160;
  const cycleFrame = frame % loopDuration;

  // Phase timings
  // 0 - 50: Voice wave listening & transcription typing
  // 50 - 75: Fold & compress into invoice paper
  // 75 - 160: Itemized receipt reveals with line-item cascades
  const foldProgress = spring({
    frame: cycleFrame - 50,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const receiptProgress = spring({
    frame: cycleFrame - 72,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  // Calculate totals
  const subtotal = useMemo(() => items.reduce((acc, curr) => acc + curr.amount, 0), [items]);
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + tax;

  // Waveform bars data
  const barCount = 28;
  const waveBars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const freq = 0.18 + (i % 5) * 0.04;
      const phase = i * 0.45;
      return { freq, phase, baseHeight: 18 + ((i * 13) % 45) };
    });
  }, [barCount]);

  // Interpolated transforms
  const waveOpacity = interpolate(cycleFrame, [48, 62], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const waveScale = interpolate(cycleFrame, [48, 65], [1, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const receiptScale = interpolate(receiptProgress, [0, 1], [0.85, 1]);
  const receiptOpacity = interpolate(receiptProgress, [0, 0.4, 1], [0, 0.9, 1]);
  const receiptRotateX = interpolate(receiptProgress, [0, 1], [25, 0]);

  // Glow pulse for audio recording
  const pulseScale = 1 + Math.sin(cycleFrame * 0.2) * 0.08;

  return (
    <div
      style={{
        width: 880,
        minHeight: 560,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.88) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: 28,
        padding: '34px 38px',
        boxShadow:
          '0 24px 60px -12px rgba(0, 0, 0, 0.65), 0 0 50px -10px rgba(99, 102, 241, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
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
      {/* Ambient background glow accents */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)',
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
          paddingBottom: 18,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
            }}
          >
            {/* Microphone Icon SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
              {title}
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              {clientName}
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 20,
            background: cycleFrame < 60 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: cycleFrame < 60 ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)',
            transition: 'all 0.3s ease',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: cycleFrame < 60 ? '#ef4444' : '#10b981',
              boxShadow: cycleFrame < 60 ? '0 0 10px #ef4444' : '0 0 10px #10b981',
              transform: `scale(${pulseScale})`,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: cycleFrame < 60 ? '#fca5a5' : '#6ee7b7',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {cycleFrame < 60 ? 'Listening Voice Note...' : 'Itemized & Ready'}
          </span>
        </div>
      </div>

      {/* Main Stage: Waveform View vs. Unfolded Receipt */}
      <div style={{ position: 'relative', flex: 1, minHeight: 390, perspective: 1200 }}>
        {/* PHASE 1: Voice Waveform Card */}
        {cycleFrame < 70 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: waveOpacity,
              transform: `scale(${waveScale})`,
              transformOrigin: 'center center',
            }}
          >
            {/* Animated Audio Waveform visualizer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                height: 120,
                width: '100%',
                padding: '0 20px',
              }}
            >
              {waveBars.map((bar, i) => {
                // Dynamically modulated bar height with sinusoidal voice flutter
                const waveVal = Math.sin(cycleFrame * bar.freq + bar.phase);
                const currentHeight = Math.max(12, Math.min(95, bar.baseHeight + waveVal * 38));
                const isCenter = Math.abs(i - barCount / 2) < 6;
                const barColor = isCenter
                  ? 'linear-gradient(180deg, #38bdf8 0%, #6366f1 100%)'
                  : 'linear-gradient(180deg, rgba(99, 102, 241, 0.7) 0%, rgba(56, 189, 248, 0.4) 100%)';

                return (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: currentHeight,
                      borderRadius: 4,
                      background: barColor,
                      boxShadow: isCenter ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none',
                      transition: 'height 0.08s ease',
                    }}
                  />
                );
              })}
            </div>

            {/* Transcription speech bubble */}
            <div
              style={{
                marginTop: 26,
                padding: '16px 24px',
                borderRadius: 16,
                background: 'rgba(30, 41, 59, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxWidth: 720,
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#38bdf8',
                  letterSpacing: '0.08em',
                  marginBottom: 6,
                }}
              >
                AI Audio Transcription · {voiceDuration}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontStyle: 'italic',
                  color: '#e2e8f0',
                  lineHeight: 1.45,
                }}
              >
                {voicePrompt}
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: Morphing Itemized Receipt Card */}
        {cycleFrame >= 52 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `scale(${receiptScale}) rotateX(${receiptRotateX}deg)`,
              opacity: receiptOpacity,
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 27, 45, 0.98) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              borderRadius: 20,
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            }}
          >
            {/* Receipt Meta Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px dashed rgba(255, 255, 255, 0.14)',
                paddingBottom: 16,
                marginBottom: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.06em' }}>
                  Generated Invoice
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#ffffff',
                    marginTop: 2,
                  }}
                >
                  {invoiceNumber}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Processed via Whisper AI</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#38bdf8', marginTop: 2 }}>
                  Direct to Stripe Invoicing
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px 100px 110px',
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: '#64748b',
                  padding: '0 8px 4px 8px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <span>Description</span>
                <span style={{ textAlign: 'center' }}>Hours</span>
                <span style={{ textAlign: 'right' }}>Rate</span>
                <span style={{ textAlign: 'right' }}>Amount</span>
              </div>

              {items.map((item, idx) => {
                // Staggered reveal for each line
                const lineProgress = spring({
                  frame: cycleFrame - 75 - idx * 6,
                  fps,
                  config: { damping: 14, stiffness: 120 },
                });
                const lineTranslateY = interpolate(lineProgress, [0, 1], [16, 0]);
                const lineOpacity = interpolate(lineProgress, [0, 1], [0, 1]);

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 100px 100px 110px',
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderRadius: 10,
                      backgroundColor: idx % 2 === 0 ? 'rgba(30, 41, 59, 0.5)' : 'transparent',
                      transform: `translateY(${lineTranslateY}px)`,
                      opacity: lineOpacity,
                      fontSize: 13,
                    }}
                  >
                    <div style={{ fontWeight: 600, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#10b981', fontSize: 14 }}>✓</span>
                      {item.desc}
                    </div>
                    <div style={{ textAlign: 'center', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.hours !== undefined ? `${item.hours}h` : '—'}
                    </div>
                    <div style={{ textAlign: 'right', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.rate !== undefined ? `$${item.rate}/h` : 'Flat'}
                    </div>
                    <div
                      style={{
                        textAlign: 'right',
                        fontWeight: 700,
                        color: '#ffffff',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      ${item.amount.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals & Quick Action Footer */}
            <div
              style={{
                marginTop: 'auto',
                borderTop: '1px dashed rgba(255, 255, 255, 0.14)',
                paddingTop: 14,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: 13,
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  1-Tap Auto-Send
                </div>
                <span style={{ fontSize: 12, color: '#64748b' }}>Converted from voice in 1.4s</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Total Due (Inc. 8% Tax)
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#38bdf8',
                    letterSpacing: '-0.02em',
                    textShadow: '0 0 20px rgba(56, 189, 248, 0.35)',
                  }}
                >
                  ${grandTotal.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
