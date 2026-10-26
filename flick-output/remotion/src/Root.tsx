import React from 'react';
import { Composition } from 'remotion';
import { PythonStackScene } from './scenes/PythonStackScene';
import { CaptionHormozi, CaptionNeonPill, CaptionOneWordFire } from './scenes/CaptionSamples';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PythonStackReel"
        component={PythonStackScene}
        durationInFrames={900} // 30.0 seconds @ 30fps matching exact fast-paced voiceover
        fps={30}
        width={1080}
        height={1920}
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
