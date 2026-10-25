import React, { useMemo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProxyNode {
  ip: string;
  port: number;
  country: string;
  flag: string;
  type: string;
  latency: number;
  status: 'ONLINE' | 'STANDBY' | 'FAILED';
}

export interface ProxyRotationGaugeProps {
  title?: string;
  poolSize?: string;
  activeProxy?: ProxyNode;
  latencyMs?: number;
  successRate?: number;
  requestsCompleted?: number;
  recentProxies?: ProxyNode[];
  accentColor?: string;
  dangerColor?: string;
}

export const ProxyRotationGauge: React.FC<ProxyRotationGaugeProps> = ({
  title = 'FREE PROXY ROTATION & HEALTH GAUGES',
  poolSize = '1,840 PUBLIC PROXIES',
  activeProxy = {
    ip: '198.51.100.84',
    port: 8080,
    country: 'United States',
    flag: '🇺🇸',
    type: 'RESIDENTIAL SOCKS5',
    latency: 38,
    status: 'ONLINE',
  },
  latencyMs = 38,
  successRate = 99.2,
  requestsCompleted = 124,
  recentProxies = [
    { ip: '185.220.101.5', port: 3128, country: 'Germany', flag: '🇩🇪', type: 'ELITE HTTP', latency: 45, status: 'ONLINE' },
    { ip: '103.152.112.18', port: 8080, country: 'Singapore', flag: '🇸🇬', type: 'SOCKS5', latency: 62, status: 'ONLINE' },
    { ip: '45.154.255.8', port: 9050, country: 'United Kingdom', flag: '🇬🇧', type: 'HTTPS', latency: 29, status: 'ONLINE' },
  ],
  accentColor = '#06b6d4', // Cyan 500
  dangerColor = '#f43f5e',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Animated rotation radar angle
  const radarAngle = (frame * 6) % 360;

  // Latency Gauge calculation (0 to 300ms range)
  const maxLatency = 300;
  const latencyPercent = Math.min(1, Math.max(0, latencyMs / maxLatency));
  const latencyArc = latencyPercent * 251.2; // Circumference of r=40 is ~251.2

  // Success Rate calculation (0 to 100%)
  const successArc = (successRate / 100) * 251.2;

  // Pulse effect
  const pulse = 1 + Math.sin(frame * 0.2) * 0.03;

  return (
    <div
      style={{
        width: 880,
        height: 600,
        borderRadius: 20,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(8, 14, 26, 0.98) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.28)',
        boxShadow: `0 24px 60px -12px rgba(0, 0, 0, 0.75), 0 0 45px rgba(6, 182, 212, 0.15)`,
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'SF Pro Display', -apple-system, 'Segoe UI', Roboto, sans-serif",
        color: '#f8fafc',
        transform: `scale(${entrance})`,
        opacity: entrance,
        boxSizing: 'border-box',
        padding: 24,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 14,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(6, 182, 212, 0.5)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.04em', color: '#f8fafc' }}>{title}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Dynamic Multi-Node IP Evasion & Health Monitor</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              color: '#22d3ee',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            ● {poolSize}
          </div>
          <div
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            ROTATION: AUTO
          </div>
        </div>
      </div>

      {/* Main Gauges Section (3 Columns: Latency Meter, Active Rotating Node, Success Rate Meter) */}
      <div style={{ display: 'flex', gap: 20, marginTop: 20, flex: 1 }}>
        {/* Left Gauge: Latency Speedometer */}
        <div
          style={{
            flex: 1,
            background: 'rgba(11, 18, 36, 0.75)',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>
            PING LATENCY
          </div>

          {/* SVG Circular Radial Gauge */}
          <div style={{ position: 'relative', width: 140, height: 140 }}>
            <svg width="140" height="140" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset="0"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - latencyArc}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{
                  filter: 'drop-shadow(0 0 6px #06b6d4)',
                }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', fontFamily: "'Fira Code', monospace" }}>
                {latencyMs}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#06b6d4' }}>ms</span>
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '2px 8px',
              borderRadius: 4,
              fontWeight: 700,
            }}
          >
            ULTRA FAST RESPONSE
          </div>
        </div>

        {/* Center: Active Rotating Node Card */}
        <div
          style={{
            flex: 1.4,
            background: 'rgba(2, 6, 23, 0.85)',
            borderRadius: 16,
            border: '2px solid rgba(6, 182, 212, 0.4)',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.2)',
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Animated radar sweep line background */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 260,
              height: 260,
              marginLeft: -130,
              marginTop: -130,
              borderRadius: '50%',
              border: '1px dashed rgba(6, 182, 212, 0.15)',
              transform: `rotate(${radarAngle}deg)`,
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#06b6d4',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              CURRENT OUTBOUND TUNNEL
            </span>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }}
            />
          </div>

          <div style={{ textAlign: 'center', margin: '14px 0' }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{activeProxy.flag}</div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: '#ffffff',
                fontFamily: "'Fira Code', monospace",
              }}
            >
              {activeProxy.ip}
              <span style={{ color: '#06b6d4', fontSize: 16 }}>:{activeProxy.port}</span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              {activeProxy.country} • <strong style={{ color: '#38bdf8' }}>{activeProxy.type}</strong>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              padding: '8px 10px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: 11,
              fontFamily: "'Fira Code', monospace",
            }}
          >
            <div>
              <span style={{ color: '#64748b' }}>ANON: </span>
              <span style={{ color: '#34d399', fontWeight: 700 }}>HIGH</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>UPTIME: </span>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>99.9%</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>PROTOCOL: </span>
              <span style={{ color: '#fde047', fontWeight: 700 }}>SOCKS5</span>
            </div>
          </div>
        </div>

        {/* Right Gauge: Success Rate Meter */}
        <div
          style={{
            flex: 1,
            background: 'rgba(11, 18, 36, 0.75)',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>
            SUCCESS ACCURACY
          </div>

          {/* SVG Circular Radial Gauge */}
          <div style={{ position: 'relative', width: 140, height: 140 }}>
            <svg width="140" height="140" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset="0"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - successArc}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{
                  filter: 'drop-shadow(0 0 6px #10b981)',
                }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', fontFamily: "'Fira Code', monospace" }}>
                {successRate}%
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399' }}>HTTP 200</span>
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '2px 8px',
              borderRadius: 4,
              fontWeight: 700,
            }}
          >
            {requestsCompleted} PASS / 0 FAIL
          </div>
        </div>
      </div>

      {/* Bottom Ticker: Recent Rotated Nodes Stream */}
      <div
        style={{
          marginTop: 16,
          background: 'rgba(2, 6, 23, 0.8)',
          borderRadius: 12,
          padding: '10px 16px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
            ROTATION LOG:
          </span>
          <div style={{ display: 'flex', gap: 14 }}>
            {recentProxies.map((p, idx) => (
              <span
                key={p.ip}
                style={{
                  fontSize: 11,
                  fontFamily: "'Fira Code', monospace",
                  color: idx === 0 ? '#38bdf8' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span>{p.flag}</span>
                <span>{p.ip}:{p.port}</span>
                <span style={{ color: '#10b981' }}>({p.latency}ms)</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#22d3ee' }}>
          ✓ ZERO CAPTCHA DETECTIONS
        </div>
      </div>
    </div>
  );
};
