import type { ChatTurn } from "@/lib/chat_types";

export type HealingReport = {
  title: string;
  valence: number;
  arousal: number;
  insight: string;
  key_imagery: string[];
  echo_title: string;
  advice_body: string;
  dialogue_recap: string;
};

export function formatChatTranscript(turns: ChatTurn[]): string {
  const visible = turns.filter((t) => !t.omitFromDisplay);
  return visible
    .map((t) =>
      t.role === "assistant"
        ? `【引导】\n${t.content}`
        : `【用户】\n${t.content}`,
    )
    .join("\n\n---\n\n");
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function parseHealingReportFromModelText(raw: string): HealingReport {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        obj = JSON.parse(cleaned.slice(start, end + 1)) as Record<
          string,
          unknown
        >;
      } catch {
        throw new Error("模型返回的不是合法 JSON，请重试。");
      }
    } else {
      throw new Error("模型返回的不是合法 JSON，请重试。");
    }
  }

  const title = String(obj.title ?? "未命名景观").trim() || "未命名景观";
  const valence = clamp(Number(obj.valence ?? 0), -1, 1);
  const arousal = clamp(Number(obj.arousal ?? 0.5), 0, 1);
  const insight = String(obj.insight ?? "").trim() || "（暂无摘要句）";

  const rawImagery = obj.key_imagery;
  let key_imagery: string[] = [];
  if (Array.isArray(rawImagery)) {
    key_imagery = rawImagery
      .map((x) => String(x).trim())
      .filter(Boolean)
      .slice(0, 8);
  }
  while (key_imagery.length < 4) {
    key_imagery.push("—");
  }
  key_imagery = key_imagery.slice(0, 4);

  const echo_title = String(obj.echo_title ?? "延展").trim() || "延展";
  const advice_body =
    String(obj.advice_body ?? "").trim() || "（暂无建议段落）";
  const dialogue_recap =
    String(obj.dialogue_recap ?? "").trim() || "（暂无原始记录摘要）";

  return {
    title,
    valence,
    arousal,
    insight,
    key_imagery,
    echo_title,
    advice_body,
    dialogue_recap,
  };
}
