import React from 'react';
import { Composition } from 'remotion';
import { PythonStackScene } from './scenes/PythonStackScene';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PythonStackReel"
        component={PythonStackScene}
        durationInFrames={1310} // 43.66 seconds @ 30fps matching exact voiceover audio
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
