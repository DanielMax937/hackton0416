"use client";

import { Player } from "@remotion/player";
import { HealingLandingPromo } from "@/remotion/HealingLandingPromo";

const FPS = 30;
const DURATION = 390;

export function HealingPromoPlayer() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-sm border border-zen-line/80 bg-zen-void/40 shadow-[0_0_60px_-30px_rgba(34,211,238,0.2)]"
      style={{ aspectRatio: "16 / 9" }}
    >
      <Player
        component={HealingLandingPromo}
        durationInFrames={DURATION}
        compositionWidth={1280}
        compositionHeight={720}
        fps={FPS}
        controls
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
