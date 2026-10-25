import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CityTimezone {
  name: string;
  flag: string;
  utcOffset: number; // e.g. -5 for NY, 0 for London, +9 for Tokyo
  timezoneCode: string;
  localWorkStart: number; // e.g. 9 (9am)
  localWorkEnd: number; // e.g. 17 (5pm)
  avatar: string;
  role: string;
  color: string;
}

export interface TimezoneGlobeOverlapProps {
  goldenWindowStartUtc?: number; // e.g. 13 (13:00 UTC = 9am NY / 2pm London)
  goldenWindowEndUtc?: number; // e.g. 15 (15:00 UTC = 11am NY / 4pm London)
  activeUtcHour?: number;
  cities?: CityTimezone[];
}

export const TimezoneGlobeOverlap: React.FC<TimezoneGlobeOverlapProps> = ({
  goldenWindowStartUtc = 13,
  goldenWindowEndUtc = 15,
  activeUtcHour = 14,
  cities = [
    {
      name: 'London',
      flag: '🇬🇧',
      utcOffset: 1,
      timezoneCode: 'BST (UTC+1)',
      localWorkStart: 9,
      localWorkEnd: 17.5,
      avatar: 'LDN',
      role: 'Backend Core & Architecture',
      color: '#38bdf8',
    },
    {
      name: 'New York',
      flag: '🇺🇸',
      utcOffset: -4,
      timezoneCode: 'EDT (UTC-4)',
      localWorkStart: 9,
      localWorkEnd: 17,
      avatar: 'NYC',
      role: 'Product & Customer Ops',
      color: '#818cf8',
    },
    {
      name: 'Tokyo',
      flag: '🇯🇵',
      utcOffset: 9,
      timezoneCode: 'JST (UTC+9)',
      localWorkStart: 9.5,
      localWorkEnd: 18.5,
      avatar: 'TYO',
      role: 'Infra & Reliability Team',
      color: '#f43f5e',
    },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });

  // Animated scrubber sweeps from 10:00 to 16:30 UTC
  const scrubberUtc = interpolate(frame, [15, 75], [11, 15.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse effect on the Golden Window
  const pulseGlow = interpolate(
    Math.sin(frame * 0.12),
    [-1, 1],
    [0.2, 0.45]
  );

  // Radar wave for Tokyo handoff ping
  const pingScale = interpolate((frame + 15) % 40, [0, 40], [1, 2.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pingOpacity = interpolate((frame + 15) % 40, [0, 40], [0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Helper to convert UTC 0-24 to X percentage
  const utcToPercent = (utcH: number) => {
    return (utcH / 24) * 100;
  };

  // Convert local working hours into UTC interval [startUtc, endUtc]
  const getCityUtcWorkingRange = (city: CityTimezone) => {
    let start = city.localWorkStart - city.utcOffset;
    let end = city.localWorkEnd - city.utcOffset;
    return { start, end };
  };

  const goldenLeft = utcToPercent(goldenWindowStartUtc);
  const goldenWidth = utcToPercent(goldenWindowEndUtc - goldenWindowStartUtc);
  const scrubberLeft = utcToPercent(scrubberUtc);

  return (
    <div
      style={{
        width: 880,
        height: 600,
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        borderRadius: 24,
        border: '1px solid rgba(148, 163, 184, 0.18)',
        boxShadow:
          '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 45px rgba(56, 189, 248, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        transform: `scale(${entrance})`,
        opacity: entrance,
      }}
    >
      {/* Background ambient gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(56, 189, 248, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Bar */}
      <div
        style={{
          height: 68,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          zIndex: 3,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(99, 102, 241, 0.25))',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              fontSize: 11,
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 13 }}>🌐</span> GLOBAL OVERLAP ENGINE
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>
              Asynchronous Follow-the-Sun Matrix
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              3 Continents • 24h Relay Pipeline
            </div>
          </div>
        </div>

        {/* Golden Window Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: `rgba(245, 158, 11, ${pulseGlow})`,
            border: '1px solid rgba(245, 158, 11, 0.6)',
            padding: '6px 14px',
            borderRadius: 20,
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#f59e0b',
              boxShadow: '0 0 8px #f59e0b',
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#fef3c7' }}>
            GOLDEN WINDOW: 2.0 HRS
          </span>
          <span style={{ fontSize: 11, color: '#fde68a', opacity: 0.85 }}>
            (13:00 - 15:00 UTC)
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        {/* Timeline Header Scale (00:00 -> 24:00 UTC) */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 10,
              fontWeight: 600,
              color: '#64748b',
              marginBottom: 6,
              paddingLeft: 220,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <span>00:00 UTC</span>
            <span>04:00</span>
            <span>08:00</span>
            <span style={{ color: '#f59e0b', fontWeight: 800 }}>12:00 (Overlap)</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>24:00</span>
          </div>

          {/* Master 24-hr Bar Ruler */}
          <div
            style={{
              marginLeft: 220,
              height: 12,
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: 6,
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Ticks */}
            {[0, 4, 8, 12, 16, 20, 24].map((tick) => (
              <div
                key={tick}
                style={{
                  position: 'absolute',
                  left: `${utcToPercent(tick)}%`,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  backgroundColor: tick === 12 ? 'rgba(245, 158, 11, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                }}
              />
            ))}

            {/* Overlap Zone Band */}
            <div
              style={{
                position: 'absolute',
                left: `${goldenLeft}%`,
                width: `${goldenWidth}%`,
                top: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, #f59e0b, #eab308)',
                boxShadow: '0 0 12px rgba(245, 158, 11, 0.6)',
              }}
            />
          </div>
        </div>

        {/* City Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cities.map((city, idx) => {
            const range = getCityUtcWorkingRange(city);
            const rowEntrance = spring({
              frame: frame - idx * 6,
              fps,
              config: { damping: 15, stiffness: 100 },
            });

            // Calculate local time based on scrubberUtc
            const cityLocalHour = (scrubberUtc + city.utcOffset + 24) % 24;
            const hourInt = Math.floor(cityLocalHour);
            const minuteInt = Math.floor((cityLocalHour - hourInt) * 60);
            const timeStr = `${hourInt.toString().padStart(2, '0')}:${minuteInt.toString().padStart(2, '0')}`;
            const isWorking = cityLocalHour >= city.localWorkStart && cityLocalHour <= city.localWorkEnd;
            const isTokyoEod = city.name === 'Tokyo' && cityLocalHour > 18;

            return (
              <div
                key={city.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  opacity: rowEntrance,
                  transform: `translateX(${(1 - rowEntrance) * -20}px)`,
                }}
              >
                {/* City Card Left Info */}
                <div
                  style={{
                    width: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    paddingRight: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{city.flag}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>
                      {city.name}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '1px 6px',
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: city.color,
                        fontFamily: 'monospace',
                        fontWeight: 600,
                      }}
                    >
                      {timeStr}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: isWorking ? '#34d399' : '#64748b',
                      marginTop: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>{isWorking ? '🟢 Working' : isTokyoEod ? '🌙 Handoff Dispatched' : '💤 Off-Hours'}</span>
                    <span style={{ color: '#475569' }}>•</span>
                    <span style={{ color: '#94a3b8' }}>{city.timezoneCode}</span>
                  </div>
                </div>

                {/* 24-hr Bar Track for this city */}
                <div
                  style={{
                    flex: 1,
                    height: 52,
                    backgroundColor: 'rgba(15, 23, 42, 0.7)',
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {/* Grid divisions */}
                  {[0, 6, 12, 18, 24].map((gridH) => (
                    <div
                      key={gridH}
                      style={{
                        position: 'absolute',
                        left: `${utcToPercent(gridH)}%`,
                        top: 0,
                        bottom: 0,
                        width: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      }}
                    />
                  ))}

                  {/* Golden Sync Shading Background across all rows */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${goldenLeft}%`,
                      width: `${goldenWidth}%`,
                      top: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(245, 158, 11, 0.12)',
                      borderLeft: '1px dashed rgba(245, 158, 11, 0.4)',
                      borderRight: '1px dashed rgba(245, 158, 11, 0.4)',
                      zIndex: 1,
                    }}
                  />

                  {/* Active working hours range pill */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${Math.max(0, utcToPercent(range.start))}%`,
                      width: `${utcToPercent(range.end - range.start)}%`,
                      height: 34,
                      borderRadius: 8,
                      background: `linear-gradient(90deg, ${city.color}22, ${city.color}44)`,
                      border: `1.5px solid ${city.color}99`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 10px',
                      boxShadow: `0 0 15px ${city.color}20`,
                      zIndex: 2,
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#f8fafc' }}>
                      {city.localWorkStart}:00
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 800, color: city.color, letterSpacing: '0.04em' }}>
                      {city.role.split(' ')[0].toUpperCase()}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#f8fafc' }}>
                      {city.localWorkEnd}:00
                    </span>
                  </div>

                  {/* Tokyo handoff ping wave indicator */}
                  {city.name === 'Tokyo' && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${utcToPercent(range.end)}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 4,
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: '2px solid #f43f5e',
                          transform: `translate(-50%, -50%) scale(${pingScale})`,
                          opacity: pingOpacity,
                        }}
                      />
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: '#f43f5e',
                          transform: 'translate(-50%, -50%)',
                          boxShadow: '0 0 10px #f43f5e',
                        }}
                      />
                    </div>
                  )}

                  {/* Vertical Scrubber Line on current track */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${scrubberLeft}%`,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      backgroundColor: '#38bdf8',
                      boxShadow: '0 0 10px #38bdf8',
                      zIndex: 5,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Sync Stats Footer Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginTop: 8,
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Synchronous Sync Window
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b', marginTop: 2 }}>
              120 Mins <span style={{ fontSize: 11, fontWeight: 500, color: '#cbd5e1' }}>/ day</span>
            </div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
              Strictly reserved for unblocking
            </div>
          </div>

          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Asynchronous Deep Flow
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>
              22.0 Hours <span style={{ fontSize: 11, fontWeight: 500, color: '#cbd5e1' }}>/ day</span>
            </div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
              Zero interruptive meetings
            </div>
          </div>

          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Relay Handoff Latency
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#34d399', marginTop: 2 }}>
              0 Idle Hours <span style={{ fontSize: 11, fontWeight: 500, color: '#cbd5e1' }}>• 24/7 velocity</span>
            </div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
              Automated PR context handoff
            </div>
          </div>
        </div>
      </div>

      {/* Footer Log */}
      <div
        style={{
          height: 42,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          fontSize: 11,
          color: '#94a3b8',
          zIndex: 3,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span>Active Pipeline:</span>
          <span style={{ color: '#f1f5f9', fontWeight: 600 }}>
            London & New York co-working window live
          </span>
        </div>
        <div style={{ color: '#64748b', fontFamily: 'monospace' }}>
          UTC 14:12 • Follow-the-Sun Protocol v3.8
        </div>
      </div>
    </div>
  );
};
