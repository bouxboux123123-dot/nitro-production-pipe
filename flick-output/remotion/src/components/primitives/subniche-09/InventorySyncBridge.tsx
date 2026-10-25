import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface InventorySyncBridgeProps {
  productSku?: string;
  productName?: string;
  initialStock?: number;
  saleSource?: string;
  syncLatencyMs?: number;
  width?: number;
  height?: number;
}

export const InventorySyncBridge: React.FC<InventorySyncBridgeProps> = ({
  productSku = 'SKU-DESK-MAT-882',
  productName = 'Ergonomic Desk Mat (Midnight Black)',
  initialStock = 48,
  saleSource = 'Shopify Storefront #1042',
  syncLatencyMs = 140,
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Trigger sale event at frame 25
  const saleEventSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  // Central decrement animation (from initialStock to initialStock - 1)
  const isDecremented = frame >= 38;
  const centralStock = isDecremented ? initialStock - 1 : initialStock;

  // Connector sync beam travel (from frame 30 to 60)
  const beamProgress = interpolate(frame, [30, 60], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Staggered platform sync states
  const shopifySynced = frame >= 44;
  const etsySynced = frame >= 52;
  const ebaySynced = frame >= 60;

  // Badge pulse
  const pulseOpacity = interpolate(Math.sin((frame / fps) * 4), [-1, 1], [0.6, 1]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(2, 6, 23, 0.98) 100%)',
        borderRadius: 28,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(56, 189, 248, 0.12)',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        color: '#F8FAFC',
        padding: '28px 34px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        transform: `scale(${enterSpring})`,
        opacity: enterSpring,
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          left: '35%',
          width: 320,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(45px)',
        }}
      />

      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(14, 165, 233, 0.4)',
            }}
          >
            {/* Sync arrows icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#38BDF8', fontWeight: 700 }}>
              Omnichannel Inventory Orchestrator
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>{productName}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 8,
              padding: '4px 12px',
              fontSize: 12,
              fontFamily: 'monospace',
              color: '#94A3B8',
            }}
          >
            {productSku}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 600,
              color: '#34D399',
              opacity: pulseOpacity,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
            Zero Overselling Sync Active
          </div>
        </div>
      </div>

      {/* Central Node: Master Hub Stock */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.65)',
          backdropFilter: 'blur(16px)',
          borderRadius: 20,
          border: '1px solid rgba(56, 189, 248, 0.3)',
          padding: '16px 24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Central Cloud Inventory Hub
            </div>
            <div style={{ fontSize: 14, color: '#94A3B8', marginTop: 2 }}>
              Trigger Event:{' '}
              <strong style={{ color: frame >= 25 ? '#F59E0B' : '#E2E8F0' }}>
                {frame >= 25 ? `Order Placed: ${saleSource} (-1 unit)` : 'Listening for multi-store webhooks...'}
              </strong>
            </div>
          </div>
        </div>

        {/* Master Stock Counter Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {frame >= 25 && (
            <div
              style={{
                transform: `scale(${saleEventSpring})`,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 700,
                color: '#EF4444',
              }}
            >
              -1 SOLD
            </div>
          )}

          <div
            style={{
              background: 'rgba(2, 6, 23, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 14,
              padding: '6px 20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>
              AVAILABLE STOCK
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                fontFamily: 'monospace',
                color: isDecremented ? '#10B981' : '#FFFFFF',
                textShadow: isDecremented ? '0 0 16px rgba(16, 185, 129, 0.5)' : 'none',
              }}
            >
              {centralStock}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Sync Rays / Connector Paths */}
      <div style={{ position: 'relative', height: 26, margin: '2px 0' }}>
        <svg width="100%" height="100%" viewBox="0 0 800 26" fill="none" style={{ overflow: 'visible' }}>
          {/* Connector lines from center top (400, 0) to 3 bottom platform targets (130, 26), (400, 26), (670, 26) */}
          <path d="M 400 0 L 140 26" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 400 0 L 400 26" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 400 0 L 660 26" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" strokeDasharray="4 4" />

          {/* Animated Glowing Signal Pulses */}
          {frame >= 30 && (
            <>
              <circle
                cx={400 - (260 * beamProgress) / 100}
                cy={(26 * beamProgress) / 100}
                r="4"
                fill="#10B981"
                filter="drop-shadow(0 0 6px #10B981)"
              />
              <circle
                cx={400}
                cy={(26 * beamProgress) / 100}
                r="4"
                fill="#F97316"
                filter="drop-shadow(0 0 6px #F97316)"
              />
              <circle
                cx={400 + (260 * beamProgress) / 100}
                cy={(26 * beamProgress) / 100}
                r="4"
                fill="#38BDF8"
                filter="drop-shadow(0 0 6px #38BDF8)"
              />
            </>
          )}
        </svg>
      </div>

      {/* 3 Synchronized Storefronts (Shopify, Etsy, eBay) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* Platform 1: Shopify */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: shopifySynced ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 18,
            padding: '16px 18px',
            boxShadow: shopifySynced ? '0 0 20px rgba(16, 185, 129, 0.15)' : 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Shopify Bag Icon */}
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'rgba(149, 191, 71, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#95BF47">
                  <path d="M12 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-9-4z" />
                </svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>Shopify</span>
            </div>

            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: shopifySynced ? '#10B981' : '#94A3B8',
                background: shopifySynced ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              {shopifySynced ? 'ORIGIN (-1)' : 'STANDBY'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>LIVE INVENTORY</div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'monospace', color: shopifySynced ? '#10B981' : '#E2E8F0' }}>
                {shopifySynced ? initialStock - 1 : initialStock}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 11, fontFamily: 'monospace', color: '#94A3B8' }}>
              Latency: <span style={{ color: '#10B981', fontWeight: 700 }}>45ms</span>
            </div>
          </div>
        </div>

        {/* Platform 2: Etsy */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: etsySynced ? '1px solid rgba(249, 115, 22, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 18,
            padding: '16px 18px',
            boxShadow: etsySynced ? '0 0 20px rgba(249, 115, 22, 0.15)' : 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Etsy Icon */}
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'rgba(241, 101, 33, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#F16521', fontWeight: 900, fontSize: 16, fontFamily: 'serif' }}>E</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>Etsy</span>
            </div>

            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: etsySynced ? '#F97316' : '#94A3B8',
                background: etsySynced ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              {etsySynced ? 'SYNCED (-1)' : 'UPDATING...'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>LIVE INVENTORY</div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'monospace', color: etsySynced ? '#F97316' : '#E2E8F0' }}>
                {etsySynced ? initialStock - 1 : initialStock}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 11, fontFamily: 'monospace', color: '#94A3B8' }}>
              Latency: <span style={{ color: '#F97316', fontWeight: 700 }}>180ms</span>
            </div>
          </div>
        </div>

        {/* Platform 3: eBay */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: ebaySynced ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 18,
            padding: '16px 18px',
            boxShadow: ebaySynced ? '0 0 20px rgba(56, 189, 248, 0.15)' : 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* eBay Icon */}
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'rgba(0, 100, 210, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#38BDF8', fontWeight: 900, fontSize: 14 }}>eB</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>eBay</span>
            </div>

            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: ebaySynced ? '#38BDF8' : '#94A3B8',
                background: ebaySynced ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              {ebaySynced ? 'SYNCED (-1)' : 'UPDATING...'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>LIVE INVENTORY</div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'monospace', color: ebaySynced ? '#38BDF8' : '#E2E8F0' }}>
                {ebaySynced ? initialStock - 1 : initialStock}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 11, fontFamily: 'monospace', color: '#94A3B8' }}>
              Latency: <span style={{ color: '#38BDF8', fontWeight: 700 }}>{syncLatencyMs}ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Broadcast Audit Log */}
      <div
        style={{
          background: 'rgba(2, 6, 23, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 14,
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#10B981' }}>✔</span>
          <span style={{ color: '#94A3B8' }}>
            {ebaySynced
              ? 'Multi-Channel Decrement Complete: 0 overselling collisions across 3 channels.'
              : etsySynced
              ? 'Shopify & Etsy synced. Awaiting eBay API webhook confirmation...'
              : 'Listening to inbound POS & e-commerce sales webhooks...'}
          </span>
        </div>
        <div style={{ color: '#64748B' }}>Total sync time: 310ms</div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 10,
          fontSize: 12,
          color: '#64748B',
        }}
      >
        <span>
          Automate Your Side Hustle • <strong style={{ color: '#E2E8F0' }}>24/7 Multi-Channel Sync</strong>
        </span>
        <span style={{ color: '#10B981' }}>Shopify / Etsy / eBay Real-Time API</span>
      </div>
    </div>
  );
};
