import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GitCommitIssueLinkerProps {
  title?: string;
  subtitle?: string;
  issueKey?: string;
  issueTitle?: string;
  assigneeName?: string;
  commitHash?: string;
  branchName?: string;
  commitMessage?: string;
  width?: number;
  height?: number;
}

export const GitCommitIssueLinker: React.FC<GitCommitIssueLinkerProps> = ({
  title = 'GIT COMMIT ISSUE AUTO-LINKER',
  subtitle = 'Terminal Push Automatically Closes & Audits Ticket',
  issueKey = 'LIN-1042',
  issueTitle = 'Session token invalidation on OAuth refresh failure',
  assigneeName = 'Alex River',
  commitHash = '7df82a1',
  branchName = 'main',
  commitMessage = 'fix(auth): invalidate revoked sessions [fixes LIN-1042]',
  width = 880,
  height = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Typewriter effect for git command: starts frame 10, ends frame 40
  const fullCommand = `git commit -m "${commitMessage}" && git push origin ${branchName}`;
  const charCount = Math.floor(
    interpolate(frame, [10, 42], [0, fullCommand.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const typedText = fullCommand.slice(0, charCount);

  // Terminal output lines
  const showPushOutput = frame >= 46;
  const showWebhookTrigger = frame >= 54;

  // Ticket transition happens at frame 58
  const transitionFrame = 58;
  const isClosed = frame >= transitionFrame;

  // Spring for status pill transition
  const statusTransitionSpring = spring({
    frame: frame - transitionFrame,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Glowing pulse when transition happens
  const pulseScale = isClosed
    ? 1 + 0.04 * Math.sin((frame - transitionFrame) * 0.4) * Math.max(0, 1 - (frame - transitionFrame) / 25)
    : 1;

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.94) 0%, rgba(18, 22, 36, 0.98) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(16, 185, 129, 0.12)',
        backdropFilter: 'blur(20px)',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#f8fafc',
        boxSizing: 'border-box',
        transform: `scale(${interpolate(entrance, [0, 1], [0.93, 1])}) translateY(${interpolate(entrance, [0, 1], [25, 0])}px)`,
        opacity: interpolate(entrance, [0, 1], [0, 1]),
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.2px',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                textTransform: 'uppercase',
              }}
            >
              Automation
            </span>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              CONTINUOUS WORKFLOW INTEGRATION
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.4px' }}>
            {title}
          </h2>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>{subtitle}</p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '6px 14px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isClosed ? '#10b981' : '#f59e0b',
              boxShadow: `0 0 8px ${isClosed ? '#10b981' : '#f59e0b'}`,
            }}
          />
          <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
            {isClosed ? 'WEBHOOK SYNCED' : 'LISTENING ON MAIN'}
          </span>
        </div>
      </div>

      {/* Terminal Mockup */}
      <div
        style={{
          background: 'rgba(10, 15, 29, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Terminal Title Bar */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          </div>
          <span
            style={{
              fontSize: '11px',
              color: '#64748b',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            zsh — ~/projects/core-api ({branchName})
          </span>
          <div style={{ width: '40px' }} />
        </div>

        {/* Terminal Body */}
        <div
          style={{
            padding: '14px 18px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '12px',
            lineHeight: 1.6,
            minHeight: '100px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#10b981', marginRight: '8px' }}>alex@workstation:~/core-api$</span>
            <span style={{ color: '#f8fafc' }}>{typedText}</span>
            {frame < 45 && (
              <span
                style={{
                  display: 'inline-block',
                  width: '7px',
                  height: '14px',
                  background: '#38bdf8',
                  marginLeft: '2px',
                  opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0,
                }}
              />
            )}
          </div>

          {showPushOutput && (
            <div style={{ color: '#94a3b8', marginTop: '6px', fontSize: '11.5px' }}>
              <div>[main {commitHash}] fix(auth): invalidate revoked sessions [fixes LIN-1042]</div>
              <div>Counting objects: 6, done. Pushed to remote origin/main.</div>
            </div>
          )}

          {showWebhookTrigger && (
            <div
              style={{
                color: '#34d399',
                marginTop: '4px',
                fontSize: '11.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>⚡</span>
              <span>Linear GitHub Action: Resolved issue [{issueKey}] automatically.</span>
            </div>
          )}
        </div>
      </div>

      {/* Sync Arrow / Flow Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          margin: '2px 0',
        }}
      >
        <div style={{ height: '1px', flex: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            padding: '3px 12px',
            borderRadius: '20px',
            fontSize: '10.5px',
            color: '#38bdf8',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <span>↓ 0-CLICK KANBAN TRANSITION</span>
        </div>
        <div style={{ height: '1px', flex: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
      </div>

      {/* Linear Kanban Issue Card */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.7) 100%)',
          border: isClosed ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '16px',
          padding: '16px 20px',
          transform: `scale(${pulseScale})`,
          boxShadow: isClosed ? '0 0 30px rgba(16, 185, 129, 0.2)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
                fontWeight: 700,
                color: '#818cf8',
                background: 'rgba(99, 102, 241, 0.15)',
                padding: '2px 7px',
                borderRadius: '5px',
              }}
            >
              {issueKey}
            </span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>
              {issueTitle}
            </span>
          </div>

          {/* Dynamic Status Badge */}
          <div
            style={{
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 800,
              fontFamily: '"JetBrains Mono", monospace',
              letterSpacing: '0.5px',
              background: isClosed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: isClosed ? '#34d399' : '#fbbf24',
              border: `1px solid ${isClosed ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.5)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transform: `scale(${interpolate(statusTransitionSpring, [0, 1], [0.9, 1])})`,
            }}
          >
            <span>{isClosed ? '✓ DONE' : '⏳ IN PROGRESS'}</span>
          </div>
        </div>

        {/* Issue metadata line */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11.5px',
            color: '#94a3b8',
            paddingTop: '6px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div style={{ display: 'flex', gap: '14px' }}>
            <span>Assignee: <strong style={{ color: '#e2e8f0' }}>{assigneeName}</strong></span>
            <span>Priority: <strong style={{ color: '#f87171' }}>P1 Urgent</strong></span>
            <span>Estimate: <strong style={{ color: '#e2e8f0' }}>3 Points</strong></span>
          </div>
          <div style={{ color: isClosed ? '#10b981' : '#64748b', fontSize: '11px' }}>
            {isClosed ? `Closed via ${commitHash} in ${branchName}` : 'Awaiting commit trigger'}
          </div>
        </div>
      </div>
    </div>
  );
};
