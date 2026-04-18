"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatTurn } from "@/lib/chat_types";

type ChatThreadProps = {
  messages: ChatTurn[];
  topSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  inputPlaceholder: string;
  isLoading: boolean;
  error: string | null;
  inputDisabled?: boolean;
  onSend: (text: string) => void | Promise<void>;
  /** 生成报告并跳转独立页：由父级完成请求与 sessionStorage */
  onGenerateReport?: () => Promise<void>;
};

export function ChatThread({
  messages,
  topSlot,
  footerSlot,
  inputPlaceholder,
  isLoading,
  error,
  inputDisabled,
  onSend,
  onGenerateReport,
}: ChatThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [reportBusy, setReportBusy] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const visible = messages.filter((m) => !m.omitFromDisplay);
  const canReport =
    Boolean(onGenerateReport) && visible.length > 0 && !isLoading;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visible.length, isLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const el = inputRef.current;
    if (!el || isLoading || inputDisabled) {
      return;
    }
    const text = el.value.trim();
    if (!text) {
      return;
    }
    el.value = "";
    await onSend(text);
  }

  async function handleGenerateReport() {
    if (!onGenerateReport) {
      return;
    }
    setReportBusy(true);
    setReportError(null);
    try {
      await onGenerateReport();
    } catch (err) {
      setReportError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setReportBusy(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {topSlot ? <div className="shrink-0 space-y-3">{topSlot}</div> : null}

      <div
        className="glass-panel glass-panel--tight flex min-h-[14rem] flex-1 flex-col rounded-sm"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
      >
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          {visible.length === 0 && !isLoading ? (
            <p className="text-center text-xs tracking-wide text-zen-muted">
              对话将出现在这里。
            </p>
          ) : null}
          {visible.map((m, i) => (
            <div
              key={`${m.role}-${i}-${m.content.slice(0, 12)}`}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[92%] rounded-sm border border-zen-cyan/25 bg-zen-cyan/10 px-3 py-2.5 text-sm leading-relaxed text-foreground sm:max-w-[85%]"
                    : "max-w-[92%] rounded-sm border border-zen-violet/20 bg-zen-violet/5 px-3 py-2.5 text-sm leading-relaxed text-foreground/95 sm:max-w-[85%]"
                }
              >
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
              </div>
            </div>
          ))}
          {isLoading ? (
            <div className="flex justify-start">
              <div className="rounded-sm border border-zen-line px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-zen-muted">
                <span className="animate-pulse">正在回复…</span>
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        {error ? (
          <p className="border-t border-red-500/20 px-4 py-2 text-xs text-red-300/90 sm:px-5">
            {error}
          </p>
        ) : null}

        {reportError ? (
          <p className="border-t border-amber-500/20 px-4 py-2 text-xs text-amber-200/90 sm:px-5">
            {reportError}
          </p>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="border-t border-zen-line/80 p-3 sm:p-4"
        >
          <label htmlFor="chat-input" className="sr-only">
            输入消息
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            name="message"
            rows={2}
            disabled={isLoading || inputDisabled}
            placeholder={inputPlaceholder}
            className="w-full resize-none rounded-sm border border-zen-line/90 bg-zen-void/40 px-3 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-zen-muted/70 outline-none transition-[box-shadow,border-color] focus:border-zen-cyan/45 focus:shadow-[0_0_0_1px_rgba(34,211,238,0.15)] disabled:opacity-50"
          />
          <div className="mt-2 flex flex-wrap justify-end gap-2">
            {onGenerateReport ? (
              <button
                type="button"
                onClick={() => void handleGenerateReport()}
                disabled={!canReport || reportBusy}
                className="rounded-sm border border-zen-violet/35 bg-zen-violet/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zen-violet transition-[background-color,box-shadow] hover:bg-zen-violet/15 hover:shadow-[0_0_24px_rgba(167,139,250,0.12)] disabled:pointer-events-none disabled:opacity-40"
              >
                {reportBusy ? "生成中…" : "生成报告"}
              </button>
            ) : null}
            <button
              type="submit"
              disabled={isLoading || inputDisabled}
              className="rounded-sm border border-zen-cyan/35 bg-zen-cyan/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zen-cyan transition-[background-color,box-shadow] hover:bg-zen-cyan/15 hover:shadow-[0_0_24px_rgba(34,211,238,0.12)] disabled:pointer-events-none disabled:opacity-40"
            >
              发送
            </button>
          </div>
        </form>
      </div>

      {footerSlot ? <div className="shrink-0">{footerSlot}</div> : null}
    </div>
  );
}
