import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SmokeTestConversionCardProps {
  title?: string;
  testHypothesis?: string;
  adSpend?: number;
  adClicksTarget?: number;
  pageViewsTarget?: number;
  signupsTarget?: number;
  benchmarkRate?: number;
  width?: number;
  height?: number;
}

export const SmokeTestConversionCard: React.FC<SmokeTestConversionCardProps> = ({
  title = 'SMOKE TEST VALIDATION FUNNEL',
  testHypothesis = 'Hypothesis: Founders will pre-order AI audit tools at >15% conversion rate',
  adSpend = 142,
  adClicksTarget = 100,
  pageViewsTarget = 68,
  signupsTarget = 28,
  benchmarkRate = 6.5,
  width = 900,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const scale = interpolate(enterSpring, [0, 1], [0.93, 1]);

  // Funnel progression timing
  // Clicks count up: frames 10 to 45
  const clickCount = Math.round(
    interpolate(frame, [10, 45], [0, adClicksTarget], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // Page views: frames 25 to 55
  const viewCount = Math.round(
    interpolate(frame, [25, 55], [0, pageViewsTarget], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // Signups count: frames 40 to 75
  const signupCount = Math.round(
    interpolate(frame, [40, 75], [0, signupsTarget], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // Current calculated conversion rate
  const currentCr = clickCount > 0 ? ((signupCount / clickCount) * 100).toFixed(1) : '0.0';
  const finalCr = ((signupsTarget / adClicksTarget) * 100).toFixed(1);

  // Validation pill emergence: frame 70+
  const pillSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 11, stiffness: 160 },
  });
  const pillScale = interpolate(pillSpring, [0, 1], [0.7, 1]);
  const pillOpacity = interpolate(pillSpring, [0, 1], [0, 1]);

  // Traffic pulse stream animation
  const streamPulse = (frame * 3) % 100;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity,
        transform: `scale(${scale})`,
        borderRadius: 20,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.90))',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(34, 197, 94, 0.1)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        color: '#F8FAFC',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.35))',
              border: '1px solid rgba(34, 197, 94, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', color: '#22C55E', textTransform: 'uppercase' }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
              {testHypothesis}
            </div>
          </div>
        </div>

        {/* Experiment Budget & Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '6px 14px',
            borderRadius: 10,
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
          }}
        >
          <div style={{ fontSize: 11.5, color: '#94A3B8' }}>
            Total Budget: <strong style={{ color: '#F1F5F9' }}>${adSpend} USD</strong>
          </div>
          <div style={{ width: 1, height: 14, backgroundColor: 'rgba(148, 163, 184, 0.3)' }} />
          <div style={{ fontSize: 11.5, color: '#94A3B8' }}>
            Cost / Lead: <strong style={{ color: '#4ADE80' }}>${(adSpend / (signupCount || 1)).toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* 3-Stage Funnel Flow Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr auto 1fr',
          alignItems: 'center',
          gap: 12,
          margin: '8px 0 16px 0',
        }}
      >
        {/* Step 1: Paid Traffic */}
        <div
          style={{
            padding: '18px 20px',
            borderRadius: 14,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#38BDF8', letterSpacing: '0.05em' }}>STEP 1 • TRAFFIC</span>
            <span style={{ fontSize: 11, color: '#64748B' }}>Meta & X Ads</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>
            {clickCount}
            <span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8', marginLeft: 6 }}>clicks</span>
          </div>
          <div style={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: 'rgba(56, 189, 248, 0.15)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(clickCount / adClicksTarget) * 100}%`,
                height: '100%',
                backgroundColor: '#38BDF8',
                boxShadow: '0 0 10px #38BDF8',
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>100% Top-of-Funnel Sample</div>
        </div>

        {/* Funnel Arrow 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>68% Drop</div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        {/* Step 2: Pitch Reading */}
        <div
          style={{
            padding: '18px 20px',
            borderRadius: 14,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C084FC', letterSpacing: '0.05em' }}>STEP 2 • ENGAGEMENT</span>
            <span style={{ fontSize: 11, color: '#64748B' }}>&gt;45s on Page</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>
            {viewCount}
            <span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8', marginLeft: 6 }}>readers</span>
          </div>
          <div style={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: 'rgba(168, 85, 247, 0.15)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(viewCount / adClicksTarget) * 100}%`,
                height: '100%',
                backgroundColor: '#A855F7',
                boxShadow: '0 0 10px #A855F7',
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>68% Pitch Read-Through</div>
        </div>

        {/* Funnel Arrow 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#22C55E' }}>41.2% Conv</div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        {/* Step 3: Waitlist Signups */}
        <div
          style={{
            padding: '18px 20px',
            borderRadius: 14,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '2px solid rgba(34, 197, 94, 0.6)',
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#4ADE80', letterSpacing: '0.05em' }}>STEP 3 • CONVERTED</span>
            <span style={{ fontSize: 11, color: '#4ADE80', fontWeight: 700 }}>VERIFIED</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#4ADE80' }}>
            {signupCount}
            <span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8', marginLeft: 6 }}>signups</span>
          </div>
          <div style={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: 'rgba(34, 197, 94, 0.2)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(signupCount / adClicksTarget) * 100}%`,
                height: '100%',
                backgroundColor: '#22C55E',
                boxShadow: '0 0 12px #22C55E',
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: '#4ADE80', fontWeight: 600 }}>High Intent Email Capture</div>
        </div>
      </div>

      {/* Validation Result Pill Banner */}
      <div
        style={{
          marginTop: 6,
          padding: '16px 22px',
          borderRadius: 14,
          background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.15) 0%, rgba(15, 23, 42, 0.8) 50%, rgba(56, 189, 248, 0.15) 100%)',
          border: '1.5px solid rgba(34, 197, 94, 0.5)',
          boxShadow: '0 0 25px rgba(34, 197, 94, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: pillOpacity,
          transform: `scale(${pillScale})`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              backgroundColor: '#22C55E',
              color: '#064E3B',
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 0 16px rgba(34, 197, 94, 0.6)',
            }}
          >
            <span>✓</span>
            <span>VALIDATED: {finalCr}% CONVERSION</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>
              Statistically Significant Demand Signal
            </div>
            <div style={{ fontSize: 11.5, color: '#94A3B8' }}>
              Beats B2B SaaS industry benchmark ({benchmarkRate}%) by <strong style={{ color: '#4ADE80' }}>4.3x</strong>
            </div>
          </div>
        </div>

        {/* Go/No-Go Decision Tag */}
        <div
          style={{
            padding: '8px 16px',
            borderRadius: 10,
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#86EFAC', letterSpacing: '0.06em' }}>DECISION VERDICT</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#22C55E' }}>PROCEED TO BUILD MVP ➔</div>
        </div>
      </div>

      {/* Mini Diagnostic Metrics Footer */}
      <div
        style={{
          marginTop: 18,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}
      >
        <div style={{ padding: '10px 14px', borderRadius: 10, backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <div style={{ fontSize: 11, color: '#64748B' }}>Bounce Rate</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', marginTop: 2 }}>32.0% <span style={{ fontSize: 11, color: '#22C55E' }}>↓ Low</span></div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 10, backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <div style={{ fontSize: 11, color: '#64748B' }}>Avg Time on Site</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', marginTop: 2 }}>1m 48s <span style={{ fontSize: 11, color: '#22C55E' }}>↑ High</span></div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 10, backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <div style={{ fontSize: 11, color: '#64748B' }}>CTR on Hero CTA</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', marginTop: 2 }}>41.2% <span style={{ fontSize: 11, color: '#22C55E' }}>★ Super</span></div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 10, backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <div style={{ fontSize: 11, color: '#64748B' }}>Estimated LTV/CAC</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#4ADE80', marginTop: 2 }}>18.4x <span style={{ fontSize: 11, color: '#86EFAC' }}>Strong</span></div>
        </div>
      </div>
    </div>
  );
};
