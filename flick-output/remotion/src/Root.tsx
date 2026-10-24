import React from 'react';
import { Composition } from 'remotion';
import { PythonStackScene } from './scenes/PythonStackScene';

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
    </>
  );
};
