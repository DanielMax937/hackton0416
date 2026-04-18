"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildOfflineRecommendations } from "@/lib/offline_recommendations";
import {
  readStoredHealingReport,
  type StoredHealingReportPayload,
} from "@/lib/report_storage";

export default function ReportPage() {
  const [payload, setPayload] = useState<StoredHealingReportPayload | null>(
    null,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPayload(readStoredHealingReport());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zen-muted animate-pulse">
          载入中
        </p>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-6 px-6">
        <p className="max-w-sm text-center text-sm leading-relaxed text-zen-muted">
          没有找到报告数据。请从首页聊天中点击「生成报告」，或返回后重试。
        </p>
        <Link
          href="/"
          className="zen-link font-mono text-[11px] uppercase tracking-[0.2em]"
        >
          ← 返回首页
        </Link>
      </div>
    );
  }

  const { report, generatedAt, mode, scenarioTitle } = payload;
  const offline = buildOfflineRecommendations(report);
  const modeLabel =
    mode === "explore"
      ? `探索模式${scenarioTitle ? ` · ${scenarioTitle}` : ""}`
      : "问题模式";

  return (
    <div className="flex min-h-dvh flex-col px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto w-full max-w-xl space-y-10">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zen-muted">
              {modeLabel}
            </p>
            <h1 className="text-balance text-2xl font-light tracking-tight text-foreground sm:text-3xl">
              {report.title}
            </h1>
            <p className="font-mono text-[11px] tracking-wide text-zen-muted">
              {generatedAt}
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 rounded-sm border border-zen-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zen-muted transition-colors hover:border-zen-cyan/35 hover:text-zen-cyan"
          >
            返回
          </Link>
        </header>

        <article className="glass-panel glass-panel--tight space-y-8 rounded-sm px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid grid-cols-2 gap-4 border-y border-zen-line/80 py-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zen-muted">
                效价
              </p>
              <p className="mt-1 text-lg font-light tabular-nums text-zen-cyan">
                {report.valence.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zen-muted">
                唤醒度
              </p>
              <p className="mt-1 text-lg font-light tabular-nums text-zen-violet">
                {report.arousal.toFixed(1)}
              </p>
            </div>
          </div>

          <blockquote className="border-l border-zen-cyan/35 pl-4 text-sm leading-relaxed text-foreground/95">
            <p className="whitespace-pre-wrap">{report.insight}</p>
          </blockquote>

          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-zen-muted">
              关键意象
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/90">
              {report.key_imagery.map((item, index) => (
                <li
                  key={`${index}-${item}`}
                  className="border-b border-zen-line/40 pb-2 last:border-0 last:pb-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-zen-muted">
              {report.echo_title}
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {report.advice_body}
            </p>
          </section>

          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-zen-muted">
              原始记录摘要
            </h2>
            <pre className="mt-3 whitespace-pre-wrap rounded-sm border border-zen-line/60 bg-zen-void/35 p-3 font-sans text-xs leading-relaxed text-zen-muted">
              {report.dialogue_recap}
            </pre>
          </section>
        </article>

        <div className="flex flex-col items-center gap-3">
          <Link
            href="/mood-map"
            className="inline-flex items-center justify-center rounded-sm border border-zen-cyan/35 bg-zen-cyan/10 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zen-cyan transition-[background-color,box-shadow] hover:bg-zen-cyan/15 hover:shadow-[0_0_28px_rgba(34,211,238,0.15)]"
          >
            心境地图
          </Link>
          <p className="max-w-sm text-center text-[11px] leading-relaxed text-zen-muted">
            观看引导短片，结束后领取「心境地图」徽章。
          </p>
        </div>

        <section className="space-y-4">
          <div className="zen-rule" aria-hidden />
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-zen-muted">
              线下可补充尝试
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zen-muted">
              {offline.intro}
            </p>
          </div>
          <ul className="space-y-3">
            {offline.items.map((item) => (
              <li
                key={item.id}
                className={`rounded-sm border px-4 py-4 text-sm leading-relaxed transition-colors ${
                  item.emphasize
                    ? "border-zen-cyan/35 bg-zen-cyan/5 text-foreground/95"
                    : "border-zen-line/80 bg-zen-void/25 text-foreground/85"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-light tracking-wide">{item.title}</span>
                  {item.emphasize ? (
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-zen-cyan">
                      优先参考
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zen-muted">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
