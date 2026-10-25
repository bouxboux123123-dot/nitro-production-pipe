import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SearchResultItem {
  id: string;
  path: string;
  title: string;
  snippet: string;
  matchesCount: number;
  category: string;
}

export interface SearchSpeedBenchmarkProps {
  title?: string;
  subtitle?: string;
  queryKeyword?: string;
  totalNotesScanned?: number;
  benchmarkSeconds?: number;
  cloudBenchmarkSeconds?: number;
  results?: SearchResultItem[];
  width?: number;
  height?: number;
}

const DEFAULT_RESULTS: SearchResultItem[] = [
  {
    id: 'res-1',
    path: 'Mental-Models/Taleb-Antifragility.md',
    title: 'Antifragile Systems & Heuristics',
    snippet: '...systems that benefit from disorder. Unlike resilient structures, antifragile systems grow stronger under systemic stress...',
    matchesCount: 14,
    category: 'Framework',
  },
  {
    id: 'res-2',
    path: 'Slipbox/04-Architecture-Governance.md',
    title: 'Local-First Antifragile Systems',
    snippet: '...applying antifragile systems to personal knowledge architectures: zero vendor lock-in ensures eternal durability...',
    matchesCount: 8,
    category: 'Zettelkasten',
  },
  {
    id: 'res-3',
    path: 'Daily-Log/2026-10-24-Review.md',
    title: 'Daily Review: Second Brain Tooling',
    snippet: '...concluded our evaluation today: local-first markdown vaults create antifragile systems against SaaS shutdowns...',
    matchesCount: 3,
    category: 'Daily Log',
  },
];

export const SearchSpeedBenchmark: React.FC<SearchSpeedBenchmarkProps> = ({
  title = 'INSTANT FULL-TEXT OMNISEARCH',
  subtitle = 'In-Memory C++ / Rust Ripgrep vs Cloud REST API Latency',
  queryKeyword = 'antifragile systems',
  totalNotesScanned = 5240,
  benchmarkSeconds = 0.048,
  cloudBenchmarkSeconds = 1.84,
  results = DEFAULT_RESULTS,
  width = 880,
  height = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(enterSpring, [0, 1], [0.93, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [25, 0]);

  // Typing search query
  const typingStart = 10;
  const typedLength = Math.floor(
    interpolate(frame, [typingStart, typingStart + 35], [0, queryKeyword.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const currentQuery = queryKeyword.slice(0, typedLength);
  const isTypingDone = frame >= typingStart + 35;

  // Search execution benchmark counter
  const searchStartFrame = typingStart + 38;
  const timerProgress = interpolate(frame, [searchStartFrame, searchStartFrame + 15], [0, benchmarkSeconds], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isSearchComplete = frame >= searchStartFrame + 15;

  // Staggered results entrance
  const res1Spring = spring({ frame: frame - (searchStartFrame + 10), fps, config: { damping: 14, stiffness: 130 } });
  const res2Spring = spring({ frame: frame - (searchStartFrame + 16), fps, config: { damping: 14, stiffness: 130 } });
  const res3Spring = spring({ frame: frame - (searchStartFrame + 22), fps, config: { damping: 14, stiffness: 130 } });
  const resSprings = [res1Spring, res2Spring, res3Spring];

  // Cursor blink
  const cursorBlink = Math.floor((frame / 12) % 2) === 0;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 65px -15px rgba(0, 0, 0, 0.75), 0 0 40px rgba(56, 189, 248, 0.14)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background Matrix Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            'radial-gradient(#38bdf8 1.2px, transparent 1.2px), radial-gradient(#818cf8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Search Lens Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(14, 165, 233, 0.45)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {title}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 9999,
                  background: isSearchComplete ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                  color: isSearchComplete ? '#34d399' : '#38bdf8',
                  border: `1px solid ${isSearchComplete ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
                  letterSpacing: '0.05em',
                }}
              >
                {isSearchComplete ? '5,240 NOTES SEARCHED IN 0.05s' : 'SCANNING INDEX...'}
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>

        {/* Speedometer Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(30, 41, 59, 0.7)',
            padding: '6px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: '#64748b', fontWeight: 800 }}>EXECUTION TIME</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>
              {timerProgress.toFixed(3)}s
            </div>
          </div>
          <div style={{ width: 1, height: 22, background: 'rgba(255, 255, 255, 0.1)' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: '#64748b', fontWeight: 800 }}>VAULT SCALE</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>
              {totalNotesScanned.toLocaleString()} Notes
            </div>
          </div>
        </div>
      </div>

      {/* Omnisearch Command Palette Input */}
      <div
        style={{
          marginTop: 16,
          background: 'rgba(15, 23, 42, 0.9)',
          borderRadius: 14,
          border: '1px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.12)',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: 18, color: '#38bdf8' }}>🔍</span>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.02em' }}>
            {currentQuery}
          </span>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 18,
              background: cursorBlink ? '#38bdf8' : 'transparent',
              marginLeft: 3,
            }}
          />
        </div>

        {/* Shortcut Badge */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            background: 'rgba(30, 41, 59, 0.8)',
            padding: '4px 8px',
            borderRadius: 6,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: 10,
            fontWeight: 800,
            color: '#94a3b8',
          }}
        >
          <span>⌘</span>
          <span>SHIFT</span>
          <span>F</span>
        </div>
      </div>

      {/* Search Results Stream Container */}
      <div
        style={{
          marginTop: 14,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 2,
        }}
      >
        {results.map((res, idx) => {
          const resSpring = resSprings[idx] || 0;
          const isVisible = frame >= searchStartFrame + 10 + idx * 6;
          const opacity = isVisible ? interpolate(resSpring, [0, 1], [0, 1]) : 0;
          const translateY = isVisible ? interpolate(resSpring, [0, 1], [15, 0]) : 15;

          return (
            <div
              key={res.id}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                background: 'rgba(30, 41, 59, 0.65)',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13 }}>📄</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>{res.title}</span>
                  <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>({res.path})</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#a5b4fc',
                    }}
                  >
                    {res.category}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                    }}
                  >
                    {res.matchesCount} hits
                  </span>
                </div>
              </div>

              {/* Snippet with highlighted keywords */}
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: '1.5', fontFamily: 'system-ui' }}>
                {res.snippet.split(/(antifragile systems|Antifragile Systems)/gi).map((part, i) =>
                  part.toLowerCase() === 'antifragile systems' ? (
                    <span
                      key={i}
                      style={{
                        background: 'rgba(234, 179, 8, 0.25)',
                        color: '#fef08a',
                        fontWeight: 700,
                        padding: '1px 4px',
                        borderRadius: 3,
                        border: '1px solid rgba(234, 179, 8, 0.4)',
                      }}
                    >
                      {part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Comparative Benchmark Ribbon */}
      <div
        style={{
          marginTop: 14,
          padding: '12px 18px',
          borderRadius: 14,
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            ⚡ 38.3x FASTER THAN CLOUD API
          </div>
          <div style={{ fontSize: 11, color: '#cbd5e1' }}>
            Ripgrep parses 5,000 files in 48ms while cloud databases are still negotiating SSL handshakes.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#38bdf8', fontFamily: 'monospace', fontWeight: 800 }}>
            Local: 0.05s
          </span>
          <span style={{ fontSize: 11, color: '#f87171', fontFamily: 'monospace' }}>
            Cloud: {cloudBenchmarkSeconds.toFixed(2)}s
          </span>
        </div>
      </div>
    </div>
  );
};
