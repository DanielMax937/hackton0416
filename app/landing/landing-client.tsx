"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const HealingPromoPlayer = dynamic(
  () =>
    import("@/components/healing-promo-player").then((m) => m.HealingPromoPlayer),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex aspect-video w-full items-center justify-center rounded-sm border border-zen-line/80 bg-zen-void/40"
        role="status"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zen-muted">
          载入介绍短片…
        </p>
      </div>
    ),
  },
);

export function LandingClient() {
  return (
    <div className="flex min-h-dvh flex-col px-5 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-14 sm:gap-20">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-4">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-zen-muted">
              Product · Landing
            </p>
            <div className="zen-rule max-w-[12rem]" aria-hidden />
            <h1 className="max-w-3xl text-balance text-4xl font-light tracking-tight text-foreground sm:text-5xl">
              即时接住情绪
              <span className="bg-linear-to-r from-zen-cyan via-zen-violet to-zen-cyan bg-clip-text text-transparent">
                {" "}
                线上起步 · 线下加深
              </span>
            </h1>
            <p className="max-w-2xl text-pretty text-sm leading-relaxed tracking-wide text-zen-muted sm:text-base">
              心境入口面向需要「当下缓解」与「持续自我探索」的人群：用可负担的订阅与按次增值，把线上测试、对话与报告，衔接到森林疗愈、团体与一对一等线下服务。
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 rounded-sm border border-zen-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zen-muted transition-colors hover:border-zen-cyan/35 hover:text-zen-cyan"
          >
            进入应用
          </Link>
        </header>

        <section
          aria-labelledby="personas"
          className="glass-panel glass-panel--tight rounded-sm px-6 py-8 sm:px-9 sm:py-10"
        >
          <h2
            id="personas"
            className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-zen-muted"
          >
            目标用户与真实场景
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-foreground/90">
            <li>
              <span className="text-zen-cyan">急需缓解：</span>
              遇到急需解决的情绪问题，希望尽快获得支持与思路的用户。
            </li>
            <li>
              <span className="text-zen-cyan">自我成长：</span>
              希望持续进行自我探索与心理状态梳理的用户。
            </li>
            <li>
              <span className="text-zen-cyan">成本敏感：</span>
              需要心理健康相关服务，但不愿承担过高成本的用户。
            </li>
            <li>
              <span className="text-zen-cyan">线上线下：</span>
              偏好「线上工具 + 线下体验」结合服务路径的用户。
            </li>
          </ul>
        </section>

        <section aria-labelledby="needs" className="space-y-4">
          <h2
            id="needs"
            className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-zen-muted"
          >
            用户需求分析
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              {
                t: "即时性",
                d: "快速获得情绪问题的应对路径与可执行小步。",
              },
              {
                t: "深度探索",
                d: "更系统地了解自我心理状态与关系模式。",
              },
              {
                t: "专业指导",
                d: "获得相对精准的分析框架与整理式建议（非医疗诊断）。",
              },
              {
                t: "体验转化",
                d: "从线上服务自然过渡到线下深度体验与陪伴。",
              },
            ].map((item) => (
              <div
                key={item.t}
                className="rounded-sm border border-zen-line/80 bg-zen-void/30 px-4 py-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zen-violet">
                  {item.t}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zen-muted">
                  {item.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="promo-video" className="space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2
              id="promo-video"
              className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-zen-muted"
            >
              介绍短片（Remotion）
            </h2>
            <p className="text-xs text-zen-muted">内嵌播放器 · 可暂停与拖拽进度</p>
          </div>
          <HealingPromoPlayer />
          <p className="text-xs leading-relaxed text-zen-muted/90">
            短片概括「谁适合用」「月包与按次如何配合」与「线上到线下」路径；页面下方为完整条款与价目。
          </p>
        </section>

        <section aria-labelledby="pricing" className="space-y-8">
          <div className="zen-rule max-w-xs" aria-hidden />
          <div>
            <h2
              id="pricing"
              className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-zen-muted"
            >
              核心付费模式
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zen-muted">
              以「订阅月包」覆盖高频基础测评与模式使用，以「单项付费」承接低频但重度的探索需求。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <article className="glass-panel glass-panel--tight flex flex-col rounded-sm px-7 py-8 sm:px-9 sm:py-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zen-cyan">
                2.1 订阅制 · 月包（基础服务）
              </p>
              <p className="mt-4 text-4xl font-extralight tabular-nums text-foreground sm:text-5xl">
                ¥29.9
                <span className="text-lg text-zen-muted sm:text-xl">/月</span>
              </p>
              <p className="mt-3 text-sm font-medium text-foreground/90">
                包含服务内容
              </p>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-zen-muted">
                <li>
                  <span className="text-foreground/80">5 分钟速测：</span>
                  不限次使用，用于快速问题识别。
                </li>
                <li>
                  <span className="text-foreground/80">15 分钟深度测试：</span>
                  不限次使用，用于深度问题分析。
                </li>
                <li>
                  <span className="text-foreground/80">基础问题模式：</span>
                  全面开放使用权限。
                </li>
                <li>
                  <span className="text-foreground/80">探索模式：</span>
                  前 3 次免费体验；超出部分按下方「单项付费」或继续由月包覆盖（见探索模式说明）。
                </li>
              </ul>
              <p className="mt-6 border-t border-zen-line/60 pt-4 text-xs text-zen-muted/85">
                目标用户：需要持续使用基础心理测试与线上整理工具的用户。
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-zen-muted/75">
                探索权益：文档约定「前 3 次免费体验」；超出部分可按 ¥19.9/次购买，或在产品侧配置「订阅月包含不限次探索」——以上两种策略请与权限、支付页保持同一口径。
              </p>
            </article>
            <article className="glass-panel relative overflow-hidden rounded-sm border-zen-violet/30 px-7 py-8 sm:px-9 sm:py-10">
              <div
                className="pointer-events-none absolute inset-0 opacity-35"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 55% at 100% 0%, rgba(167,139,250,0.4), transparent 55%)",
                }}
              />
              <div className="relative">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zen-violet">
                  2.2 单项付费（增值服务）
                </p>
                <p className="mt-4 text-4xl font-extralight tabular-nums text-foreground sm:text-5xl">
                  ¥19.9
                  <span className="text-lg text-zen-muted sm:text-xl">/次</span>
                </p>
                <p className="mt-3 text-sm font-medium text-foreground/90">
                  适用场景
                </p>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-zen-muted">
                  <li>探索模式超过前 3 次后的每一次使用。</li>
                  <li>需要额外深度探索服务、但订阅意愿低的用户。</li>
                  <li>偶尔使用深度服务、希望按次结算的用户。</li>
                </ul>
                <p className="mt-6 border-t border-zen-line/60 pt-4 text-xs text-zen-muted/85">
                  目标用户：使用频率不高，但在关键节点需要深度支持的人。
                </p>
              </div>
            </article>
          </div>
        </section>

        <section aria-labelledby="modules" className="space-y-6">
          <h2
            id="modules"
            className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-zen-muted"
          >
            服务模块与功能对应
          </h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <article className="rounded-sm border border-zen-line/80 bg-zen-void/25 px-6 py-7">
              <h3 className="text-base font-light text-foreground">3.1 问题模式</h3>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-zen-cyan">
                免费
              </p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed text-zen-muted">
                <li>5 分钟速测：基础问题快速识别。</li>
              </ul>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-zen-violet">
                付费
              </p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed text-zen-muted">
                <li>15 分钟深度测试：需订阅月包后不限次使用。</li>
                <li>深度问题分析报告（与报告能力绑定，按产品规则开通）。</li>
              </ul>
            </article>
            <article className="rounded-sm border border-zen-line/80 bg-zen-void/25 px-6 py-7">
              <h3 className="text-base font-light text-foreground">3.2 探索模式</h3>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-zen-cyan">
                免费
              </p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed text-zen-muted">
                <li>前 3 次探索体验。</li>
              </ul>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-zen-violet">
                付费
              </p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed text-zen-muted">
                <li>第 4 次及以后：¥19.9/次。</li>
                <li>
                  或通过订阅月包获得不限次探索（若产品选择该策略，请在支付与权限系统统一配置）。
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section aria-labelledby="offline" className="space-y-8">
          <div className="zen-rule max-w-xs" aria-hidden />
          <div>
            <h2
              id="offline"
              className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-zen-muted"
            >
              线下转化与服务
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zen-muted">
              转化路径：线上精准分析 → 推荐匹配线下服务 → 微信群运营与预约转化。
            </p>
          </div>
          <div className="overflow-x-auto rounded-sm border border-zen-line/70">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b border-zen-line/80 bg-zen-void/40 font-mono text-[10px] uppercase tracking-[0.16em] text-zen-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">服务项目</th>
                  <th className="px-4 py-3 font-medium">价格区间（参考）</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zen-line/50 text-zen-muted">
                <tr>
                  <td className="px-4 py-3 text-foreground/90">团体心理辅导</td>
                  <td className="px-4 py-3 tabular-nums">¥199 – ¥399 / 次</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">森林疗愈</td>
                  <td className="px-4 py-3 tabular-nums">¥299 – ¥599 / 次</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">1V1 心理辅导</td>
                  <td className="px-4 py-3 tabular-nums">¥399 – ¥899 / 次</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">全身放松 SPA</td>
                  <td className="px-4 py-3 tabular-nums">¥299 – ¥699 / 次</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">运动疗愈</td>
                  <td className="px-4 py-3 tabular-nums">¥199 – ¥499 / 次</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="glass-panel glass-panel--tight rounded-sm px-6 py-7 sm:px-8">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-zen-muted">
              4.2 转化运营策略
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/88">
              <li>
                <span className="text-zen-cyan">微信群：</span>
                按服务类型建立专属微信群，承接答疑、开课与预约。
              </li>
              <li>
                <span className="text-zen-cyan">精准推荐：</span>
                基于线上测试结果与报告，推荐最匹配的线下项目与价位带。
              </li>
              <li>
                <span className="text-zen-cyan">优惠激励：</span>
                首次线下体验享受 8 折优惠（与门店规则统一公示）。
              </li>
              <li>
                <span className="text-zen-cyan">套餐组合：</span>
                推出「线上测评 + 线下体验」组合包，降低决策成本。
              </li>
            </ul>
          </div>
        </section>

        <p className="text-[11px] leading-relaxed text-zen-muted/80">
          线上服务不构成医疗诊断或治疗；危机情况请拨打当地紧急求助电话或前往医疗机构。实际价格、优惠与套餐以各城市合作方及结算页为准。
        </p>

        <footer className="border-t border-zen-line/60 pt-10 text-xs text-zen-muted">
          <p>
            © {new Date().getFullYear()} 心境入口 ·{" "}
            <Link className="zen-link" href="/">
              返回应用
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
