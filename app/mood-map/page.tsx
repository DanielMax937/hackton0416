"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

//const DEFAULT_MOOD_MAP_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const DEFAULT_MOOD_MAP_VIDEO="https://www.bitstripe.cn/files/abc.mp4"
const MOOD_MAP_VIDEO_SRC =
  process.env.NEXT_PUBLIC_MOOD_MAP_VIDEO_URL ?? DEFAULT_MOOD_MAP_VIDEO;

export default function MoodMapPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [shrinking, setShrinking] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(
      typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setExpanded(true);
      return;
    }
    const id = requestAnimationFrame(() => setExpanded(true));
    return () => cancelAnimationFrame(id);
  }, [reduceMotion]);

  useEffect(() => {
    if (!expanded) {
      return;
    }
    const delay = reduceMotion ? 80 : 520;
    const timer = window.setTimeout(() => {
      void videoRef.current?.play().catch(() => {});
    }, delay);
    return () => window.clearTimeout(timer);
  }, [expanded, reduceMotion]);

  const handleVideoEnded = useCallback(() => {
    if (reduceMotion) {
      setShowBadge(true);
      return;
    }
    setShrinking(true);
    window.setTimeout(() => {
      setShowBadge(true);
    }, 680);
  }, [reduceMotion]);

  const scale = shrinking ? 0.14 : expanded ? 1 : 0.22;
  const modalOpacity = shrinking ? 0 : 1;
  const backdropOpacity = showBadge ? 0 : expanded ? 1 : 0.55;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-zen-void">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% -15%, rgba(34,211,238,0.12), transparent 55%), radial-gradient(ellipse 70% 50% at 100% 40%, rgba(139,92,246,0.1), transparent 50%)",
        }}
      />

      {!showBadge ? (
        <>
          <div
            className="fixed inset-0 z-20 bg-zen-void/80 backdrop-blur-sm transition-opacity duration-[680ms] ease-out"
            style={{ opacity: backdropOpacity }}
            aria-hidden
          />
          <div className="fixed inset-0 z-30 flex items-center justify-center p-5 sm:p-10">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="mood-map-video-title"
              className="glass-panel w-full max-w-2xl overflow-hidden rounded-sm p-4 shadow-[0_0_80px_-24px_rgba(34,211,238,0.35)] sm:p-6"
              style={{
                transform: `scale(${scale})`,
                opacity: modalOpacity,
                transition: reduceMotion
                  ? "none"
                  : "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s ease",
                transformOrigin: "center center",
              }}
            >
              <p
                id="mood-map-video-title"
                className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-zen-muted"
              >
                心境地图 · 引导短片
              </p>
              <video
                ref={videoRef}
                className="aspect-video w-full rounded-sm border border-zen-line/80 bg-black/40 object-cover"
                src={MOOD_MAP_VIDEO_SRC}
                playsInline
                muted
                controls={false}
                preload="auto"
                onEnded={handleVideoEnded}
              />
              <p className="mt-3 text-center text-[11px] leading-relaxed text-zen-muted">
                播放结束后将收起窗口并展示你的徽章
              </p>
            </div>
          </div>
        </>
      ) : null}

      {showBadge ? (
        <div className="relative z-40 flex min-h-dvh flex-col items-center justify-center gap-10 px-6 py-16">
          <div className="animate-zen-badge-in">
            <div className="relative flex h-52 w-52 flex-col items-center justify-center sm:h-60 sm:w-60">
              <div
                className="absolute inset-0 rounded-full opacity-90"
                style={{
                  background:
                    "conic-gradient(from 210deg, rgba(34,211,238,0.55), rgba(167,139,250,0.55), rgba(34,211,238,0.45))",
                  filter: "blur(14px)",
                }}
              />
              <div className="relative flex h-[88%] w-[88%] flex-col items-center justify-center rounded-full border border-white/10 bg-zen-void/85 px-6 text-center shadow-[inset_0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-md">
                <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-zen-muted">
                  Mindscape
                </p>
                <p className="mt-3 text-2xl font-light tracking-[0.12em] text-foreground sm:text-3xl">
                  心境地图
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zen-muted">
                  已解锁
                  <br />
                  情绪景观徽章
                </p>
                <div className="zen-rule mx-auto mt-4 w-16 opacity-80" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/report"
              className="rounded-sm border border-zen-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zen-muted transition-colors hover:border-zen-cyan/35 hover:text-zen-cyan"
            >
              返回报告
            </Link>
            <Link
              href="/"
              className="zen-link font-mono text-[11px] uppercase tracking-[0.18em]"
            >
              回首页
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
