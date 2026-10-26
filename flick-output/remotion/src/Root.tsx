import React from 'react';
import { Composition } from 'remotion';
import { PythonStackScene, PythonStackSceneProps } from './scenes/PythonStackScene';
import manifestData from './data/audio-manifest.json';
import { CaptionHormozi, CaptionNeonPill, CaptionOneWordFire } from './scenes/CaptionSamples';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition<PythonStackSceneProps>
        id="PythonStackReel"
        component={PythonStackScene}
        durationInFrames={900} // Default 30.0s @ 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          manifest: manifestData,
          audioFile: 'full-dialogue.mp3',
          backgroundVideo: 'backgrounds/bg_01.mp4',
        }}
        calculateMetadata={async ({ props }) => {
          const m = props?.manifest || manifestData;
          const durFrames = m?.duration ? Math.ceil(m.duration * 30) : 900;
          return {
            durationInFrames: durFrames,
            props,
          };
        }}
      />
      {/* Instagram Animated Caption Style Samples (5.0s Black Screen Audio Previews) */}
      <Composition
        id="CaptionHormozi"
        component={CaptionHormozi}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CaptionNeonPill"
        component={CaptionNeonPill}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CaptionOneWordFire"
        component={CaptionOneWordFire}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
