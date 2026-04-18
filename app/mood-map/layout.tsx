import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "心境地图 · 心境入口",
  description: "观看心境地图引导短片，并领取你的心境徽章。",
};

export default function MoodMapLayout({ children }: { children: ReactNode }) {
  return children;
}
