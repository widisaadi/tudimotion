import React from "react";
import { Composition } from "remotion";
import { FPS, H, W } from "./lib/theme";
import { TOTAL, Video } from "./Video";

export const Root: React.FC = () => (
  <Composition id="Main" component={Video} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
