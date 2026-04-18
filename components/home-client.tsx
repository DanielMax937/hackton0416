"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ChatThread } from "@/components/chat-thread";
import type { ChatTurn } from "@/lib/chat_types";
import { buildExploreSystemPrompt } from "@/lib/build_explore_system_prompt";
import {
  QUESTION_CONTINUATION_SYSTEM_PROMPT,
  QUESTION_DIMENSION_ANALYSIS_SYSTEM_PROMPT,
  QUESTION_EMPATHY_SYSTEM_PROMPT,
  QUESTION_METAPHOR_SYSTEM_PROMPT,
  QUESTION_MODE_AI_OPENING,
  QUESTION_MODE_INPUT_PLACEHOLDER,
} from "@/lib/question_mode_prompts";
import {
  getScenarioById,
  HEALING_SCENARIOS,
  type ExploreQuestionMode,
  type HealingScenario,
} from "@/lib/scenarios";
import { formatChatTranscript, type HealingReport } from "@/lib/healing_report";
import { persistHealingReportForSession } from "@/lib/report_storage";

type MainTab = "explore" | "question";

async function postChat(
  system: string | undefined,
  turns: ChatTurn[],
): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system,
      messages: turns.map(({ role, content }) => ({ role, content })),
      temperature: 0.65,
    }),
  });
  const data: { text?: string; error?: string } = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "请求失败");
  }
  if (!data.text) {
    throw new Error("模型未返回内容");
  }
  return data.text;
}

async function postHealingReport(params: {
  transcript: string;
  context_line: string;
}): Promise<HealingReport> {
  const res = await fetch("/api/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data: { report?: HealingReport; error?: string } = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "报告生成失败");
  }
  if (!data.report) {
    throw new Error("报告数据缺失");
  }
  return data.report;
}

export function HomeClient() {
  const router = useRouter();
  const [mainTab, setMainTab] = useState<MainTab>("explore");

  const [questionTurns, setQuestionTurns] = useState<ChatTurn[]>([]);
  const [questionBusy, setQuestionBusy] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [questionMetaphorReady, setQuestionMetaphorReady] = useState(false);
  const [questionAnalysisDone, setQuestionAnalysisDone] = useState(false);

  const [exploreView, setExploreView] = useState<"pick" | "chat">("pick");
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [exploreQuestionMode, setExploreQuestionMode] =
    useState<ExploreQuestionMode>("normal");
  const [exploreTurns, setExploreTurns] = useState<ChatTurn[]>([]);
  const [exploreSession, setExploreSession] = useState(0);
  const [exploreBusy, setExploreBusy] = useState(false);
  const [exploreError, setExploreError] = useState<string | null>(null);

  const scenario = scenarioId ? getScenarioById(scenarioId) : undefined;

  const requestHealingReport = useCallback(async (): Promise<HealingReport> => {
    const turns = mainTab === "explore" ? exploreTurns : questionTurns;
    const visible = turns.filter((t) => !t.omitFromDisplay);
    if (visible.length === 0) {
      throw new Error("请先进行少量对话，再生成报告。");
    }
    const transcript = formatChatTranscript(turns);
    const exploreModeLabel =
      exploreQuestionMode === "short" ? "简短模式" : "正常模式";
    const context_line =
      mainTab === "explore" && scenario?.title
        ? `探索场景：${scenario.title} · ${exploreModeLabel}`
        : "问题模式：共情接住—意象引导（花与蜜蜂等）—对话延展";
    return postHealingReport({ transcript, context_line });
  }, [mainTab, exploreTurns, questionTurns, scenario?.title, exploreQuestionMode]);

  const generateReportAndOpenPage = useCallback(async () => {
    const report = await requestHealingReport();
    const generatedAt = new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    persistHealingReportForSession({
      report,
      generatedAt,
      mode: mainTab,
      scenarioTitle: scenario?.title ?? null,
    });
    router.push("/report");
  }, [mainTab, requestHealingReport, router, scenario?.title]);

  const handleSelectScenario = useCallback(
    (id: string, mode: ExploreQuestionMode) => {
      setScenarioId(id);
      setExploreQuestionMode(mode);
      setExploreTurns([]);
      setExploreError(null);
      setExploreView("chat");
      setExploreSession((n) => n + 1);
    },
    [],
  );

  const handleBackFromExplore = useCallback(() => {
    setExploreView("pick");
    setScenarioId(null);
    setExploreQuestionMode("normal");
    setExploreTurns([]);
    setExploreError(null);
    setExploreBusy(false);
  }, []);

  useEffect(() => {
    if (exploreView !== "chat" || !scenarioId) {
      return;
    }
    const activeScenario = getScenarioById(scenarioId);
    if (!activeScenario) {
      return;
    }
    const lockedScenario: HealingScenario = activeScenario;
    const lockedMode: ExploreQuestionMode = exploreQuestionMode;

    let cancelled = false;

    async function bootstrap() {
      setExploreBusy(true);
      setExploreError(null);
      setExploreTurns([]);
      const seed: ChatTurn = {
        role: "user",
        content:
          "【会话已由系统开始】请根据系统指引输出你的第一条回复：先简短问候与在场感，再自然抛出该场景问题列表中的第 1 个问题。不要提及本括号内的说明文字。",
        omitFromDisplay: true,
      };
      try {
        const system = buildExploreSystemPrompt(lockedScenario, lockedMode);
        const text = await postChat(system, [seed]);
        if (cancelled) {
          return;
        }
        setExploreTurns([{ role: "assistant", content: text }]);
      } catch (err) {
        if (!cancelled) {
          setExploreError(
            err instanceof Error ? err.message : "无法开始探索会话",
          );
        }
      } finally {
        if (!cancelled) {
          setExploreBusy(false);
        }
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [exploreView, scenarioId, exploreSession, exploreQuestionMode]);

  useEffect(() => {
    if (mainTab !== "question") {
      return;
    }
    if (questionTurns.length > 0) {
      return;
    }
    setQuestionMetaphorReady(false);
    setQuestionAnalysisDone(false);
    setQuestionTurns([{ role: "assistant", content: QUESTION_MODE_AI_OPENING }]);
  }, [mainTab, questionTurns.length]);

  const sendQuestionMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    const priorUserCount = questionTurns.filter((m) => m.role === "user").length;
    const next: ChatTurn[] = [
      ...questionTurns,
      { role: "user" as const, content: trimmed },
    ];
    setQuestionTurns(next);
    setQuestionBusy(true);
    setQuestionError(null);
    try {
      if (priorUserCount === 0) {
        const empathyText = await postChat(QUESTION_EMPATHY_SYSTEM_PROMPT, next);
        const afterEmpathy: ChatTurn[] = [
          ...next,
          { role: "assistant", content: empathyText },
        ];
        setQuestionTurns(afterEmpathy);
        const metaphorText = await postChat(
          QUESTION_METAPHOR_SYSTEM_PROMPT,
          afterEmpathy,
        );
        setQuestionTurns([
          ...afterEmpathy,
          { role: "assistant", content: metaphorText },
        ]);
        setQuestionMetaphorReady(true);
      } else {
        const reply = await postChat(
          QUESTION_CONTINUATION_SYSTEM_PROMPT,
          next,
        );
        setQuestionTurns([...next, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      setQuestionError(err instanceof Error ? err.message : "发送失败");
    } finally {
      setQuestionBusy(false);
    }
  }, [questionTurns]);

  const runQuestionDimensionAnalysis = useCallback(async () => {
    if (questionAnalysisDone || !questionMetaphorReady) {
      return;
    }
    setQuestionBusy(true);
    setQuestionError(null);
    try {
      const text = await postChat(
        QUESTION_DIMENSION_ANALYSIS_SYSTEM_PROMPT,
        questionTurns,
      );
      setQuestionTurns((prev) => [
        ...prev,
        { role: "assistant", content: text },
      ]);
      setQuestionAnalysisDone(true);
    } catch (err) {
      setQuestionError(err instanceof Error ? err.message : "分析失败");
    } finally {
      setQuestionBusy(false);
    }
  }, [
    questionAnalysisDone,
    questionMetaphorReady,
    questionTurns,
  ]);

  const sendExploreMessage = useCallback(
    async (text: string) => {
      if (!scenario) {
        return;
      }
      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }
      const system = buildExploreSystemPrompt(scenario, exploreQuestionMode);
      const next: ChatTurn[] = [
        ...exploreTurns,
        { role: "user" as const, content: trimmed },
      ];
      setExploreTurns(next);
      setExploreBusy(true);
      setExploreError(null);
      try {
        const reply = await postChat(system, next);
        setExploreTurns([...next, { role: "assistant", content: reply }]);
      } catch (err) {
        setExploreError(err instanceof Error ? err.message : "发送失败");
      } finally {
        setExploreBusy(false);
      }
    },
    [exploreTurns, scenario, exploreQuestionMode],
  );

  const exploreModeLabel =
    exploreQuestionMode === "short" ? "简短模式" : "正常模式";

  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col gap-8">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-zen-muted">
              Healing · Space
            </p>
            <Link
              href="/landing"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-zen-muted transition-colors hover:text-zen-cyan"
            >
              产品介绍
            </Link>
          </div>
          <div className="zen-rule max-w-[10rem]" aria-hidden />
          <h1 className="text-balance text-2xl font-light tracking-tight text-foreground sm:text-3xl">
            心境入口
          </h1>
        </header>

        <nav
          className="flex gap-0 border-b border-zen-line/90"
          aria-label="模式切换"
        >
          <button
            type="button"
            onClick={() => setMainTab("explore")}
            className={`relative flex-1 px-3 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
              mainTab === "explore"
                ? "text-zen-cyan"
                : "text-zen-muted hover:text-foreground/80"
            }`}
          >
            探索模式
            {mainTab === "explore" ? (
              <span className="absolute inset-x-4 -bottom-px h-px bg-linear-to-r from-transparent via-zen-cyan to-transparent" />
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setMainTab("question")}
            className={`relative flex-1 px-3 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
              mainTab === "question"
                ? "text-zen-violet"
                : "text-zen-muted hover:text-foreground/80"
            }`}
          >
            问题模式
            {mainTab === "question" ? (
              <span className="absolute inset-x-4 -bottom-px h-px bg-linear-to-r from-transparent via-zen-violet to-transparent" />
            ) : null}
          </button>
        </nav>

        {mainTab === "explore" ? (
          exploreView === "pick" ? (
            <section aria-labelledby="explore-title" className="space-y-6">
              <div>
                <h2
                  id="explore-title"
                  className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-zen-muted"
                >
                  选择意象
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed tracking-wide text-zen-muted">
                  房子、花与蜜蜂、动物、洞穴——四种入口。每张卡片可选择
                  <span className="text-foreground/85">简短模式</span>（压缩关键提问）或
                  <span className="text-foreground/85">正常模式</span>
                  （完整追问链）；进入后由 AI 依序抛出问题。
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {HEALING_SCENARIOS.map((s) => (
                  <div
                    key={s.id}
                    className="glass-panel glass-panel--tight flex flex-col rounded-sm px-4 py-5 text-left"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zen-cyan/90">
                      意象
                    </span>
                    <span className="mt-2 text-base font-light tracking-wide text-foreground">
                      {s.title}
                    </span>
                    <span className="mt-1 text-xs leading-relaxed text-zen-muted">
                      {s.description}
                    </span>
                    <div
                      className="mt-5 flex flex-wrap gap-2 border-t border-zen-line/50 pt-4"
                      role="group"
                      aria-label={`${s.title} 问题模式`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectScenario(s.id, "short")}
                        className="flex-1 rounded-sm border border-zen-line/90 bg-zen-void/35 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zen-muted transition-colors hover:border-zen-cyan/40 hover:text-zen-cyan min-w-[7rem]"
                      >
                        简短模式
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectScenario(s.id, "normal")}
                        className="flex-1 rounded-sm border border-zen-violet/30 bg-zen-violet/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zen-violet/95 transition-colors hover:border-zen-violet/50 hover:bg-zen-violet/10 min-w-[7rem]"
                      >
                        正常模式
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zen-muted">
                    探索中 · {exploreModeLabel}
                  </p>
                  <h2 className="mt-1 text-lg font-light text-foreground">
                    {scenario?.title ?? "…"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleBackFromExplore}
                  className="shrink-0 rounded-sm border border-zen-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zen-muted transition-colors hover:border-zen-violet/35 hover:text-zen-violet"
                >
                  返回场景
                </button>
              </div>
              <ChatThread
                messages={exploreTurns}
                inputPlaceholder="回应当下的感受或想法…"
                isLoading={exploreBusy}
                error={exploreError}
                inputDisabled={exploreBusy}
                onSend={sendExploreMessage}
                onGenerateReport={generateReportAndOpenPage}
              />
            </section>
          )
        ) : (
          <section aria-labelledby="question-title" className="flex min-h-0 flex-1 flex-col">
            <div className="mb-4">
              <h2
                id="question-title"
                className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-zen-muted"
              >
                问题模式
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-zen-muted">
                先被接住，再进入意象。完成「花与蜜蜂」或通用意象引导后，可生成本轮
                「维度分析」。
              </p>
            </div>
            <ChatThread
              messages={questionTurns}
              onGenerateReport={generateReportAndOpenPage}
              footerSlot={
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={
                      !questionMetaphorReady ||
                      questionBusy ||
                      questionAnalysisDone
                    }
                    onClick={() => void runQuestionDimensionAnalysis()}
                    className="rounded-sm border border-zen-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zen-muted transition-colors hover:border-zen-violet/35 hover:text-zen-violet disabled:pointer-events-none disabled:opacity-35"
                  >
                    {questionAnalysisDone ? "维度分析 · 已生成" : "维度分析"}
                  </button>
                </div>
              }
              inputPlaceholder={QUESTION_MODE_INPUT_PLACEHOLDER}
              isLoading={questionBusy}
              error={questionError}
              onSend={sendQuestionMessage}
            />
          </section>
        )}
      </div>
    </div>
  );
}
