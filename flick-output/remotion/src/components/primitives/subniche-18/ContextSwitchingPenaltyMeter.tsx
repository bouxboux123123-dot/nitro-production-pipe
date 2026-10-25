import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface InterruptionEvent {
  id: string;
  app: 'slack' | 'email' | 'phone';
  sender: string;
  message: string;
  triggerFrame: number;
  penaltyPct: number;
  timeCostMin: number;
}

export interface ContextSwitchingPenaltyMeterProps {
  title?: string;
  subtitle?: string;
  interruptions?: InterruptionEvent[];
  width?: number;
  height?: number;
}

const DEFAULT_INTERRUPTIONS: InterruptionEvent[] = [
  {
    id: 'int-1',
    app: 'slack',
    sender: 'Dev Lead (Slack)',
    message: 'Hey, do you have a quick 2 minutes to check a PR?',
    triggerFrame: 18,
    penaltyPct: 20,
    timeCostMin: 23,
  },
  {
    id: 'int-2',
    app: 'email',
    sender: 'Client Account Rep (Email)',
    message: 'URGENT: Can we hop on a quick unscheduled sync?',
    triggerFrame: 44,
    penaltyPct: 20,
    timeCostMin: 23,
  },
  {
    id: 'int-3',
    app: 'phone',
    sender: 'Group Chat (WhatsApp)',
    message: 'Did you see what just happened on Twitter lmao',
    triggerFrame: 70,
    penaltyPct: 20,
    timeCostMin: 23,
  },
];

export const ContextSwitchingPenaltyMeter: React.FC<ContextSwitchingPenaltyMeterProps> = ({
  title = 'CONTEXT SWITCHING PENALTY METER',
  subtitle = 'UC Irvine Study: Each Interruption Costs 23m 15s of Flow State Recovery',
  interruptions = DEFAULT_INTERRUPTIONS,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro entrance
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const cardOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const cardScale = interpolate(entrance, [0, 1], [0.94, 1]);
  const cardY = interpolate(entrance, [0, 1], [24, 0]);

  // Calculate current battery level based on fired interruptions
  let activePenaltyTotal = 0;
  let activeTimeCostTotal = 0;
  let firedCount = 0;

  interruptions.forEach((item) => {
    if (frame >= item.triggerFrame) {
      // Spring down on trigger
      const penaltyProgress = spring({
        frame: frame - item.triggerFrame,
        fps,
        config: { damping: 12, stiffness: 140, mass: 0.7 },
      });
      activePenaltyTotal += item.penaltyPct * penaltyProgress;
      activeTimeCostTotal += item.timeCostMin * penaltyProgress;
      firedCount += 1;
    }
  });

  const batteryPercent = Math.max(10, Math.round(100 - activePenaltyTotal));
  const timeLostTotalMin = Math.round(activeTimeCostTotal);

  // Dynamic battery color interpolation
  const getBatteryColor = (pct: number) => {
    if (pct > 70) return '#10b981'; // Emerald
    if (pct > 45) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const currentColor = getBatteryColor(batteryPercent);

  // Status text based on battery
  const getStatusText = (pct: number) => {
    if (pct > 75) return { label: 'OPTIMAL FLOW STATE', color: '#34d399' };
    if (pct > 55) return { label: 'ATTENTION FRACTURED', color: '#fbbf24' };
    return { label: 'SEVERE COGNITIVE RESIDUE', color: '#f87171' };
  };

  const status = getStatusText(batteryPercent);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 28,
        background: 'linear-gradient(150deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%)',
        border: `1px solid ${currentColor}44`,
        boxShadow: `0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px ${currentColor}22`,
        backdropFilter: 'blur(20px)',
        padding: '34px 42px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Background ambient glow based on current color */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          left: '10%',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${currentColor}20 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 14px',
              borderRadius: 999,
              background: `${currentColor}1a`,
              border: `1px solid ${currentColor}55`,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: currentColor,
                boxShadow: `0 0 8px ${currentColor}`,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: currentColor,
                textTransform: 'uppercase',
              }}
            >
              COGNITIVE LOAD TELEMETRY
            </span>
          </div>

          <h2
            style={{
              fontSize: 27,
              fontWeight: 800,
              letterSpacing: -0.5,
              margin: '2px 0 4px 0',
              background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, fontWeight: 500 }}>
            {subtitle}
          </p>
        </div>

        {/* Real-time Status Badge */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.85)',
            border: `1px solid ${currentColor}44`,
            borderRadius: 16,
            padding: '8px 16px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
            Current State
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: status.color, marginTop: 2 }}>
            {status.label}
          </div>
        </div>
      </div>

      {/* Middle Interactive Grid: Left Battery Gauge + Right Notification Stream */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: 28,
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          margin: '12px 0',
        }}
      >
        {/* Left: Battery Gauge Box */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 22,
            padding: '24px 22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: 1, marginBottom: 12 }}>
            MENTAL BATTERY GAUGE
          </div>

          {/* Large Battery Graphic */}
          <div style={{ position: 'relative', width: 220, height: 95, display: 'flex', alignItems: 'center' }}>
            {/* Battery Body */}
            <div
              style={{
                width: 200,
                height: 90,
                borderRadius: 16,
                border: `3px solid ${currentColor}`,
                background: 'rgba(15, 23, 42, 0.9)',
                padding: 6,
                display: 'flex',
                gap: 5,
                boxShadow: `0 0 20px ${currentColor}33`,
                boxSizing: 'border-box',
              }}
            >
              {/* 5 Battery Segments */}
              {[1, 2, 3, 4, 5].map((seg) => {
                const segThreshold = seg * 20;
                const isLit = batteryPercent >= segThreshold - 10;
                return (
                  <div
                    key={seg}
                    style={{
                      flex: 1,
                      borderRadius: 8,
                      background: isLit
                        ? `linear-gradient(180deg, ${currentColor}dd 0%, ${currentColor} 100%)`
                        : 'rgba(255, 255, 255, 0.05)',
                      boxShadow: isLit ? `0 0 10px ${currentColor}` : 'none',
                      transition: 'background 0.3s ease',
                    }}
                  />
                );
              })}
            </div>

            {/* Battery Terminal Nub */}
            <div
              style={{
                width: 10,
                height: 38,
                background: currentColor,
                borderRadius: '0 6px 6px 0',
                marginLeft: 4,
                boxShadow: `0 0 10px ${currentColor}66`,
              }}
            />
          </div>

          {/* Battery Number Readout */}
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: currentColor,
              marginTop: 14,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              textShadow: `0 0 24px ${currentColor}66`,
            }}
          >
            {batteryPercent}%
          </div>

          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 4 }}>
            Deep Work Reserves Remaining
          </div>
        </div>

        {/* Right: Incoming Interruptions Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {interruptions.map((item) => {
            const hasTriggered = frame >= item.triggerFrame;
            const itemSpring = spring({
              frame: frame - item.triggerFrame,
              fps,
              config: { damping: 14, stiffness: 130, mass: 0.8 },
            });

            const slideX = interpolate(itemSpring, [0, 1], [40, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const opacity = hasTriggered
              ? interpolate(itemSpring, [0, 1], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
              : 0.18;

            return (
              <div
                key={item.id}
                style={{
                  transform: `translateX(${hasTriggered ? slideX : 0}px)`,
                  opacity,
                  background: hasTriggered
                    ? 'rgba(15, 23, 42, 0.9)'
                    : 'rgba(15, 23, 42, 0.4)',
                  border: hasTriggered
                    ? '1.5px solid rgba(239, 68, 68, 0.5)'
                    : '1px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: 16,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  boxShadow: hasTriggered ? '0 8px 20px rgba(239, 68, 68, 0.15)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* App Icon */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: hasTriggered ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: hasTriggered ? '#ef4444' : '#64748b',
                    }}
                  >
                    {item.app === 'slack' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="4" y1="9" x2="20" y2="9" />
                        <line x1="4" y1="15" x2="20" y2="15" />
                        <line x1="10" y1="3" x2="8" y2="21" />
                        <line x1="16" y1="3" x2="14" y2="21" />
                      </svg>
                    ) : item.app === 'email' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: hasTriggered ? '#fca5a5' : '#64748b' }}>
                      {item.sender}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: hasTriggered ? '#ffffff' : '#475569',
                        marginTop: 1,
                      }}
                    >
                      "{item.message}"
                    </div>
                  </div>
                </div>

                {/* Penalty Tag */}
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div
                    style={{
                      display: 'inline-block',
                      fontSize: 11,
                      fontWeight: 800,
                      color: hasTriggered ? '#ef4444' : '#64748b',
                      background: hasTriggered ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      padding: '3px 8px',
                      borderRadius: 6,
                    }}
                  >
                    -{item.penaltyPct}% BATTERY
                  </div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, fontWeight: 600 }}>
                    +{item.timeCostMin}m Flow Tax
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
          padding: '14px 24px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              Cumulative Refocusing Penalty
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>
              +{timeLostTotalMin} Minutes Lost Today ({firedCount} interruptions)
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: '#38bdf8',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            padding: '6px 14px',
            borderRadius: 999,
            letterSpacing: 0.5,
          }}
        >
          SOLUTION: BATCH PINGS TO 11:30 & 16:30
        </div>
      </div>
    </div>
  );
};
