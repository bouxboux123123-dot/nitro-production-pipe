import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TerminalLogEntry {
  timestamp: string;
  tag: 'BROWSER' | 'NAV' | 'DOM' | 'HTTP_200' | 'EXTRACT' | 'DONE';
  message: string;
  color?: string;
}

export interface HeadlessBrowserTerminalProps {
  title?: string;
  workerPid?: string;
  memoryUsage?: string;
  command?: string;
  logs?: TerminalLogEntry[];
  recordsParsed?: number;
  durationMs?: number;
  accentColor?: string;
}

export const HeadlessBrowserTerminal: React.FC<HeadlessBrowserTerminalProps> = ({
  title = 'HEADLESS CHROMIUM SCRAPER WORKER',
  workerPid = 'PID: 88104',
  memoryUsage = '38.4 MB RAM',
  command = 'npx playwright-core run --target=open-saas-leads',
  logs = [
    { timestamp: '00:00.12', tag: 'BROWSER', message: 'Chromium headless context spawned (viewport: 1920x1080)', color: '#38bdf8' },
    { timestamp: '00:00.48', tag: 'NAV', message: 'Goto https://directory.app/saas-leads [WaitUntil: domcontentloaded]', color: '#f59e0b' },
    { timestamp: '00:01.15', tag: 'DOM', message: 'Selector "div.lead-item" resolved -> 48 DOM nodes detected', color: '#818cf8' },
    { timestamp: '00:01.62', tag: 'HTTP_200', message: 'XHR payload intercepted: GET /api/v1/prospects.json (200 OK)', color: '#34d399' },
    { timestamp: '00:02.10', tag: 'EXTRACT', message: 'Extracted 48 verified email & company pairs without CAPTCHA', color: '#22d3ee' },
    { timestamp: '00:02.45', tag: 'DONE', message: 'Stream flushed to leads_stream_48.json (0 cost incurred)', color: '#10b981' },
  ],
  recordsParsed = 48,
  durationMs = 2450,
  accentColor = '#10b981', // Emerald 500
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Cursor blink (flashing every 16 frames)
  const cursorVisible = Math.floor(frame / 16) % 2 === 0;

  // Typing effect for the CLI command
  const typedLength = Math.min(command.length, Math.floor(interpolate(frame, [5, 30], [0, command.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })));
  const displayedCommand = command.substring(0, typedLength);

  return (
    <div
      style={{
        width: 880,
        height: 600,
        borderRadius: 20,
        background: 'linear-gradient(145deg, rgba(10, 15, 29, 0.96) 0%, rgba(2, 6, 23, 0.98) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.28)',
        boxShadow: `0 24px 60px -12px rgba(0, 0, 0, 0.8), 0 0 45px rgba(16, 185, 129, 0.15)`,
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'Fira Code', monospace",
        color: '#f8fafc',
        transform: `scale(${entrance})`,
        opacity: entrance,
        boxSizing: 'border-box',
      }}
    >
      {/* Terminal Title Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          background: 'rgba(2, 6, 23, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#f59e0b' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#10b981' }} />
          <div
            style={{
              marginLeft: 12,
              fontSize: 12,
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: '0.04em',
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
          <span style={{ color: '#64748b' }}>{workerPid}</span>
          <span style={{ color: '#64748b' }}>•</span>
          <span style={{ color: '#38bdf8' }}>{memoryUsage}</span>
          <span style={{ color: '#64748b' }}>•</span>
          <span style={{ color: '#10b981', fontWeight: 700 }}>● RUNNING</span>
        </div>
      </div>

      {/* Main Terminal Screen Area */}
      <div
        style={{
          flex: 1,
          padding: '18px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          overflow: 'hidden',
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        {/* Command Prompt Line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <span style={{ color: '#10b981', fontWeight: 800 }}>root@scraper-node:~#</span>
          <span style={{ color: '#f8fafc', fontWeight: 600 }}>{displayedCommand}</span>
          <span
            style={{
              width: 8,
              height: 16,
              background: '#38bdf8',
              opacity: cursorVisible ? 1 : 0,
              display: 'inline-block',
            }}
          />
        </div>

        {/* Console Log Feed */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {logs.map((log, index) => {
            const appearFrame = 25 + index * 8;
            const logOpacity = interpolate(frame, [appearFrame, appearFrame + 6], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const translateY = interpolate(frame, [appearFrame, appearFrame + 6], [6, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={log.timestamp + index}
                style={{
                  opacity: logOpacity,
                  transform: `translateY(${translateY}px)`,
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 12,
                  fontFamily: "'Fira Code', monospace",
                }}
              >
                <span style={{ color: '#475569', fontSize: 11, flexShrink: 0 }}>[{log.timestamp}]</span>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 4,
                    padding: '1px 6px',
                    fontSize: 10,
                    fontWeight: 700,
                    color: log.color || '#38bdf8',
                    flexShrink: 0,
                  }}
                >
                  {log.tag}
                </span>
                <span style={{ color: '#cbd5e1', fontSize: 12 }}>{log.message}</span>
              </div>
            );
          })}
        </div>

        {/* Real-time Browser Viewport Snapshot Wireframe mini panel */}
        <div
          style={{
            marginTop: 'auto',
            background: 'rgba(2, 6, 23, 0.9)',
            borderRadius: 12,
            border: '1px solid rgba(56, 189, 248, 0.2)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              ⚡
            </div>
            <div>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>EXECUTION METRICS: </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#ffffff' }}>
                {recordsParsed} RECORDS EXTRACTED IN {durationMs}ms
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            STATUS: 200 OK (0 ERRORS)
          </div>
        </div>
      </div>
    </div>
  );
};
