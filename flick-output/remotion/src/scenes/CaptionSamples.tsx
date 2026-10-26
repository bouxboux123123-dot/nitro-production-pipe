import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import manifestData from '../data/audio-manifest.json';

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

// =========================================================================
// STYLE 1: HORMOZI / MRBEAST KINETIC BOUNCE
// 2-word bursts, thick black text stroke, elastic overshoot pop & neon yellow/cyan active word
// =========================================================================
export const CaptionHormozi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const f = (sec: number) => Math.round(sec * fps);

  const words = useMemo(() => manifestData.words as WordTimestamp[], []);

  // 2-word chunks
  const chunks = useMemo(() => {
    const res: WordTimestamp[][] = [];
    for (let i = 0; i < words.length; i += 2) {
      res.push(words.slice(i, i + 2));
    }
    return res;
  }, [words]);

  const currentChunk = useMemo(() => {
    if (!chunks.length) return [];
    const found = chunks.find((c) => t >= c[0].start && t <= c[c.length - 1].end + 0.15);
    if (found) return found;
    const nextIdx = chunks.findIndex((c) => c[0].start > t);
    if (nextIdx > 0) return chunks[nextIdx - 1];
    return chunks[0] || [];
  }, [chunks, t]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile('full-dialogue.mp3')} />

      {/* Style Label Top */}
      <div style={{ position: 'absolute', top: 180, textAlign: 'center' }}>
        <span style={{
          background: 'rgba(255, 230, 0, 0.15)',
          border: '2px solid #ffe600',
          color: '#ffe600',
          padding: '10px 28px',
          borderRadius: 40,
          fontFamily: 'system-ui',
          fontWeight: 900,
          fontSize: 24,
          letterSpacing: '0.1em'
        }}>
          STYLE 1: HORMOZI KINETIC POP
        </span>
      </div>

      {/* Centered Captions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 960 }}>
        {currentChunk.map((w, idx) => {
          const isCurrent = t >= w.start && t <= w.end;
          const isPast = t > w.end;
          const wordAge = frame - f(w.start);
          const pop = isCurrent
            ? spring({ frame: wordAge, fps, config: { damping: 10, stiffness: 220 } })
            : 1.0;
          const scale = isCurrent ? interpolate(pop, [0, 1], [0.95, 1.12]) : 1.0;
          const tilt = isCurrent ? -2.0 : 0;

          return (
            <div
              key={`${w.word}-${w.start}-${idx}`}
              style={{
                fontFamily: "'Arial Black', system-ui, sans-serif",
                fontWeight: 900,
                fontSize: 76,
                textTransform: 'uppercase',
                color: isCurrent ? '#ffe600' : isPast ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                WebkitTextStroke: '4px #000000',
                textShadow: isCurrent
                  ? '0 0 35px rgba(255, 230, 0, 0.8), 0 8px 0 #000000, 0 14px 30px rgba(0,0,0,0.95)'
                  : '0 8px 0 #000000, 0 10px 25px rgba(0,0,0,0.9)',
                transform: `scale(${scale}) rotate(${tilt}deg)`,
                letterSpacing: '0.04em',
                margin: '0 45px',
              }}
            >
              {w.word}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// STYLE 2: SUBMAGIC / CAPCUT NEON PILL
// 2-3 word phrase, active word encased in an electric glowing cyan background badge
// =========================================================================
export const CaptionNeonPill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const f = (sec: number) => Math.round(sec * fps);

  const words = useMemo(() => manifestData.words as WordTimestamp[], []);

  // 3-word chunks
  const chunks = useMemo(() => {
    const res: WordTimestamp[][] = [];
    for (let i = 0; i < words.length; i += 3) {
      res.push(words.slice(i, i + 3));
    }
    return res;
  }, [words]);

  const currentChunk = useMemo(() => {
    if (!chunks.length) return [];
    const found = chunks.find((c) => t >= c[0].start && t <= c[c.length - 1].end + 0.15);
    if (found) return found;
    const nextIdx = chunks.findIndex((c) => c[0].start > t);
    if (nextIdx > 0) return chunks[nextIdx - 1];
    return chunks[0] || [];
  }, [chunks, t]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#05070e', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile('full-dialogue.mp3')} />

      {/* Style Label Top */}
      <div style={{ position: 'absolute', top: 180, textAlign: 'center' }}>
        <span style={{
          background: 'rgba(0, 229, 255, 0.15)',
          border: '2px solid #00e5ff',
          color: '#00e5ff',
          padding: '10px 28px',
          borderRadius: 40,
          fontFamily: 'system-ui',
          fontWeight: 900,
          fontSize: 24,
          letterSpacing: '0.1em'
        }}>
          STYLE 2: SUBMAGIC NEON PILL
        </span>
      </div>

      {/* Centered Captions */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center', maxWidth: 960, flexWrap: 'wrap' }}>
        {currentChunk.map((w, idx) => {
          const isCurrent = t >= w.start && t <= w.end;
          const wordAge = frame - f(w.start);
          const pop = isCurrent
            ? spring({ frame: wordAge, fps, config: { damping: 11, stiffness: 220 } })
            : 1.0;
          const scale = isCurrent ? interpolate(pop, [0, 1], [0.9, 1.12]) : 1.0;

          return (
            <div
              key={`${w.word}-${w.start}-${idx}`}
              style={{
                background: isCurrent ? '#00e5ff' : 'rgba(255, 255, 255, 0.08)',
                color: isCurrent ? '#030712' : '#ffffff',
                border: isCurrent ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 18,
                padding: '12px 24px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 900,
                fontSize: 54,
                textTransform: 'uppercase',
                boxShadow: isCurrent
                  ? '0 0 45px rgba(0, 229, 255, 0.9), 0 8px 25px rgba(0, 0, 0, 0.8)'
                  : '0 4px 15px rgba(0, 0, 0, 0.5)',
                transform: `scale(${scale})`,
                display: 'inline-block',
                letterSpacing: '0.04em',
              }}
            >
              {w.word}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// STYLE 3: RAPID 1-WORD FIRE (OPUSCLIP / DEVIN JATHO)
// Single massive word in the center of the screen, explosive scale punch & color alternation
// =========================================================================
export const CaptionOneWordFire: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const f = (sec: number) => Math.round(sec * fps);

  const words = useMemo(() => manifestData.words as WordTimestamp[], []);

  // Find active single word
  const activeWordIdx = words.findIndex((w) => t >= w.start && t <= w.end);
  const activeWord = activeWordIdx !== -1 ? words[activeWordIdx] : null;

  // Color sequence across words: Cyan, Yellow, Lime, White
  const colors = ['#00e5ff', '#ffe600', '#22c55e', '#ffffff'];
  const wordColor = activeWordIdx !== -1 ? colors[activeWordIdx % colors.length] : '#ffffff';

  const wordAge = activeWord ? frame - f(activeWord.start) : 0;
  const pop = activeWord
    ? spring({ frame: wordAge, fps, config: { damping: 9, stiffness: 280 } })
    : 1.0;
  const scale = activeWord ? interpolate(pop, [0, 1], [0.75, 1.30]) : 1.0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile('full-dialogue.mp3')} />

      {/* Style Label Top */}
      <div style={{ position: 'absolute', top: 180, textAlign: 'center' }}>
        <span style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '2px solid #22c55e',
          color: '#22c55e',
          padding: '10px 28px',
          borderRadius: 40,
          fontFamily: 'system-ui',
          fontWeight: 900,
          fontSize: 24,
          letterSpacing: '0.1em'
        }}>
          STYLE 3: RAPID 1-WORD FIRE
        </span>
      </div>

      {/* Single Giant Center Word */}
      {activeWord ? (
        <div
          key={`${activeWord.word}-${activeWord.start}`}
          style={{
            fontFamily: "'Arial Black', system-ui, sans-serif",
            fontWeight: 900,
            fontSize: 104,
            textTransform: 'uppercase',
            color: wordColor,
            WebkitTextStroke: '5px #000000',
            textShadow: `0 0 50px ${wordColor}88, 0 10px 0 #000000, 0 15px 40px rgba(0,0,0,0.95)`,
            transform: `scale(${scale})`,
            letterSpacing: '0.04em',
            textAlign: 'center',
            padding: '0 40px',
          }}
        >
          {activeWord.word}
        </div>
      ) : (
        <div style={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.2)' }}>...</div>
      )}
    </AbsoluteFill>
  );
};
