import type { Metadata } from "next";
import { LandingClient } from "./landing-client";

export const metadata: Metadata = {
  title: "产品介绍 · 心境入口",
  description:
    "心境入口：面向即时情绪支持与自我探索用户；月包 29.9 元含速测与深度测试等，探索超出 3 次按次 19.9 元；线上分析衔接团体、森林疗愈、一对一与 SPA 等线下服务。",
};

export default function LandingPage() {
  return <LandingClient />;
}
