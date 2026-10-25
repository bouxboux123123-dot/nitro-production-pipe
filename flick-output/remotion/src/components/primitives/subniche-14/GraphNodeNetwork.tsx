import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GraphNode {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  r: number;
  color: string;
  backlinksCount: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
}

export interface GraphNodeNetworkProps {
  title?: string;
  subtitle?: string;
  activeNodeId?: string;
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  width?: number;
  height?: number;
  triggerFrame?: number;
}

const DEFAULT_NODES: GraphNode[] = [
  { id: 'n1', label: 'Mental Models', category: 'Framework', x: 440, y: 240, r: 38, color: '#6366f1', backlinksCount: 7 },
  { id: 'n2', label: 'Zettelkasten', category: 'System', x: 230, y: 150, r: 28, color: '#38bdf8', backlinksCount: 5 },
  { id: 'n3', label: 'Atomic Notes', category: 'Method', x: 200, y: 340, r: 30, color: '#06b6d4', backlinksCount: 6 },
  { id: 'n4', label: 'Bi-directional Links', category: 'Topology', x: 670, y: 170, r: 32, color: '#a855f7', backlinksCount: 8 },
  { id: 'n5', label: 'Second Brain', category: 'Vault', x: 680, y: 350, r: 34, color: '#ec4899', backlinksCount: 9 },
  { id: 'n6', label: 'Spaced Retrieval', category: 'Cognition', x: 440, y: 430, r: 26, color: '#10b981', backlinksCount: 4 },
  { id: 'n7', label: 'Daily Reflection', category: 'Log', x: 440, y: 80, r: 24, color: '#f59e0b', backlinksCount: 3 },
];

const DEFAULT_EDGES: GraphEdge[] = [
  { from: 'n1', to: 'n2', label: 'structures' },
  { from: 'n1', to: 'n3', label: 'composed of' },
  { from: 'n1', to: 'n4', label: 'connected by' },
  { from: 'n1', to: 'n5', label: 'stored in' },
  { from: 'n1', to: 'n6', label: 'reinforced via' },
  { from: 'n1', to: 'n7', label: 'synthesized from' },
  { from: 'n2', to: 'n3', label: 'index' },
  { from: 'n4', to: 'n5', label: 'graph network' },
  { from: 'n5', to: 'n6', label: 'spaced recall' },
];

export const GraphNodeNetwork: React.FC<GraphNodeNetworkProps> = ({
  title = 'KNOWLEDGE GRAPH VISUALIZER',
  subtitle = 'Associative Backlink Mesh • Bi-Directional Graph View',
  activeNodeId = 'n1',
  nodes = DEFAULT_NODES,
  edges = DEFAULT_EDGES,
  width = 880,
  height = 640,
  triggerFrame = 25,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro entrance
  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.8 },
  });

  const cardOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const cardScale = interpolate(entrance, [0, 1], [0.93, 1]);
  const cardY = interpolate(entrance, [0, 1], [30, 0]);

  // Click trigger animation
  const clickSpring = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  const isActivated = frame >= triggerFrame;
  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];

  // Connected edges and neighbor node IDs
  const connectedEdgeIndices = edges
    .map((e, idx) => (e.from === activeNodeId || e.to === activeNodeId ? idx : -1))
    .filter((idx) => idx !== -1);

  const neighborNodeIds = new Set<string>();
  edges.forEach((e) => {
    if (e.from === activeNodeId) neighborNodeIds.add(e.to);
    if (e.to === activeNodeId) neighborNodeIds.add(e.from);
  });
  neighborNodeIds.add(activeNodeId);

  // Simulated cursor animation moving to central node
  const cursorProgress = interpolate(frame, [8, triggerFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorX = interpolate(cursorProgress, [0, 1], [width * 0.25, activeNode.x]);
  const cursorY = interpolate(cursorProgress, [0, 1], [height * 0.7, activeNode.y]);
  const cursorOpacity = interpolate(frame, [8, 16, triggerFrame + 18, triggerFrame + 30], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse wave expanding from active node after click
  const rippleScale = interpolate(clickSpring, [0, 1], [1, 2.6]);
  const rippleOpacity = interpolate(clickSpring, [0, 0.4, 1], [0.8, 0.5, 0]);

  // Floating ambient drift for nodes
  const ambientWiggle = Math.sin(frame * 0.05) * 3;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        borderRadius: 24,
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 65px -15px rgba(0, 0, 0, 0.75), 0 0 40px rgba(99, 102, 241, 0.15)',
        padding: '24px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* Background Starry Mesh / Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            'radial-gradient(#818cf8 1.2px, transparent 1.2px), radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0, 14px 14px',
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
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Graph Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.45)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  background: 'linear-gradient(90deg, #818cf8, #c084fc, #38bdf8)',
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
                  background: isActivated ? 'rgba(99, 102, 241, 0.25)' : 'rgba(148, 163, 184, 0.15)',
                  color: isActivated ? '#a5b4fc' : '#94a3b8',
                  border: `1px solid ${isActivated ? 'rgba(99, 102, 241, 0.5)' : 'rgba(148, 163, 184, 0.25)'}`,
                  letterSpacing: '0.06em',
                }}
              >
                {isActivated ? 'NODE ACTIVATED: 7 CONNECTIONS' : 'ORBITAL GRAPH READY'}
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>

        {/* Graph Stats Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: 'rgba(30, 41, 59, 0.6)',
            padding: '6px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>NODES</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{nodes.length}</div>
          </div>
          <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>EDGES</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#38bdf8' }}>{edges.length}</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          marginTop: 10,
          borderRadius: 18,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height - 180}`}
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <linearGradient id="edgeGlowActive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="1" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
            </linearGradient>
            <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* SVG Edges */}
          {edges.map((edge, idx) => {
            const source = nodes.find((n) => n.id === edge.from);
            const target = nodes.find((n) => n.id === edge.to);
            if (!source || !target) return null;

            const isConnectedToActive = edge.from === activeNodeId || edge.to === activeNodeId;
            const strokeColor = isConnectedToActive && isActivated ? 'url(#edgeGlowActive)' : 'rgba(148, 163, 184, 0.2)';
            const strokeWidth = isConnectedToActive && isActivated ? 3 : 1.5;
            const strokeOpacity = isConnectedToActive && isActivated ? 1 : isActivated ? 0.15 : 0.4;

            // Animated packet dot along active edge
            const packetCycle = ((frame * 0.035 + idx * 0.2) % 1);
            const packetX = interpolate(packetCycle, [0, 1], [source.x, target.x]);
            const packetY = interpolate(packetCycle, [0, 1], [source.y, target.y]);

            return (
              <g key={`edge-${edge.from}-${edge.to}`}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeOpacity={strokeOpacity}
                  strokeDasharray={isConnectedToActive && isActivated ? undefined : '4 4'}
                  filter={isConnectedToActive && isActivated ? 'url(#neonGlow)' : undefined}
                />
                {isConnectedToActive && isActivated && (
                  <circle
                    cx={packetX}
                    cy={packetY}
                    r={3.5}
                    fill="#38bdf8"
                    box-shadow="0 0 10px #38bdf8"
                  />
                )}
              </g>
            );
          })}

          {/* Ripple Wave on Selected Node */}
          {isActivated && (
            <circle
              cx={activeNode.x}
              cy={activeNode.y}
              r={activeNode.r * rippleScale}
              fill="none"
              stroke="#818cf8"
              strokeWidth="2.5"
              opacity={rippleOpacity}
            />
          )}

          {/* Nodes */}
          {nodes.map((node) => {
            const isTarget = node.id === activeNodeId;
            const isNeighbor = neighborNodeIds.has(node.id);
            const nodeOpacity = isActivated ? (isNeighbor ? 1 : 0.25) : 0.9;
            const extraScale = isTarget && isActivated ? 1.12 : 1;
            const nodeY = node.y + (isTarget ? 0 : Math.sin((frame + node.x) * 0.05) * 2);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${nodeY}) scale(${extraScale})`}
                style={{
                  transition: 'opacity 0.3s ease',
                  opacity: nodeOpacity,
                  cursor: 'pointer',
                }}
              >
                {/* Glowing halo for active/neighbor */}
                {isActivated && isNeighbor && (
                  <circle
                    cx={0}
                    cy={0}
                    r={node.r + 8}
                    fill={isTarget ? 'rgba(99, 102, 241, 0.28)' : 'rgba(56, 189, 248, 0.18)'}
                    filter="url(#neonGlow)"
                  />
                )}

                {/* Main Node Body */}
                <circle
                  cx={0}
                  cy={0}
                  r={node.r}
                  fill={`linear-gradient(135deg, ${node.color}cc, #0f172a)`}
                  stroke={isTarget && isActivated ? '#ffffff' : node.color}
                  strokeWidth={isTarget && isActivated ? 3 : 2}
                  style={{
                    filter: isTarget && isActivated ? 'drop-shadow(0 0 15px rgba(99,102,241,0.8))' : 'none',
                  }}
                />

                {/* Node Interior Dot Accent */}
                <circle
                  cx={0}
                  cy={0}
                  r={isTarget ? 7 : 4}
                  fill={isTarget ? '#ffffff' : node.color}
                  opacity={0.9}
                />

                {/* Node Label Text */}
                <text
                  x={0}
                  y={node.r + 16}
                  textAnchor="middle"
                  fill={isTarget && isActivated ? '#f8fafc' : '#cbd5e1'}
                  fontSize={isTarget ? 13 : 11}
                  fontWeight={isTarget ? 800 : 600}
                  letterSpacing="0.02em"
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  }}
                >
                  {node.label}
                </text>

                {/* Backlink Count Pill */}
                {isActivated && isNeighbor && (
                  <g transform={`translate(${node.r - 8}, ${-node.r + 6})`}>
                    <rect
                      x={-10}
                      y={-9}
                      width={20}
                      height={18}
                      rx={9}
                      fill="#0f172a"
                      stroke={node.color}
                      strokeWidth="1.5"
                    />
                    <text
                      x={0}
                      y={4}
                      textAnchor="middle"
                      fill={node.color}
                      fontSize={10}
                      fontWeight={800}
                    >
                      {node.backlinksCount}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Animated Cursor Pointer */}
          <g
            transform={`translate(${cursorX}, ${cursorY})`}
            opacity={cursorOpacity}
            style={{ pointerEvents: 'none' }}
          >
            <path
              d="M0,0 L18,18 L10,20 L6,30 L0,0"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="2"
              filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
            />
            {frame >= triggerFrame - 3 && frame <= triggerFrame + 8 && (
              <circle
                cx={0}
                cy={0}
                r={12}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                opacity={0.8}
              />
            )}
          </g>
        </svg>

        {/* Floating Quick Filter Badges */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            display: 'flex',
            gap: 8,
            zIndex: 5,
          }}
        >
          {['ALL NODES (7)', 'BACKLINKS (9)', 'ORPHANS (0)'].map((tab, i) => (
            <div
              key={tab}
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 8,
                background: i === 1 && isActivated ? 'rgba(99, 102, 241, 0.4)' : 'rgba(15, 23, 42, 0.75)',
                color: i === 1 && isActivated ? '#c7d2fe' : '#94a3b8',
                border: `1px solid ${i === 1 && isActivated ? 'rgba(129, 140, 248, 0.6)' : 'rgba(255, 255, 255, 0.06)'}`,
                backdropFilter: 'blur(8px)',
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Inspector Panel */}
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
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 10px #22c55e',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                Active Focal Node: <span style={{ color: '#818cf8' }}>[[{activeNode.label}]]</span>
              </span>
              <span
                style={{
                  fontSize: 10,
                  padding: '2px 7px',
                  borderRadius: 6,
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#a5b4fc',
                  fontWeight: 600,
                }}
              >
                Category: {activeNode.category}
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
              {isActivated
                ? '6 Bidirectional references dynamically resolved in 1.2ms'
                : 'Click any thought node to inspect full associative web'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Connected: {isActivated ? neighborNodeIds.size - 1 : 0} Nodes
          </div>
        </div>
      </div>
    </div>
  );
};
