import { NextResponse } from "next/server";
import {
  parseHealingReportFromModelText,
} from "@/lib/healing_report";
import { REPORT_GENERATION_SYSTEM_PROMPT } from "@/lib/build_report_system_prompt";
import {
  getDefaultArkModel,
  getVolcengineArkOpenAI,
} from "@/lib/volcengine_ark_openai";

export const runtime = "nodejs";

type ReportRequestBody = {
  transcript?: string;
  /** 可选：如「探索场景：情绪气象」 */
  context_line?: string;
};

export async function POST(request: Request) {
  let body: ReportRequestBody;
  try {
    body = (await request.json()) as ReportRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const transcript = body.transcript?.trim();
  if (!transcript) {
    return NextResponse.json(
      { error: "transcript is required and must be non-empty" },
      { status: 400 },
    );
  }

  const model = getDefaultArkModel();
  if (!model) {
    return NextResponse.json(
      {
        error:
          "No model specified. Set ARK_MODEL or OPENAI_MODEL in .env / .env.local.",
      },
      { status: 400 },
    );
  }

  const context = body.context_line?.trim();
  const userContent = [
    "以下为对话实录，请生成报告 JSON：",
    context ? `\n语境：${context}\n` : "",
    "\n---\n",
    transcript,
  ].join("");

  try {
    const client = getVolcengineArkOpenAI();
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.45,
      messages: [
        { role: "system", content: REPORT_GENERATION_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    if (!raw.trim()) {
      return NextResponse.json(
        { error: "模型未返回内容" },
        { status: 502 },
      );
    }

    const report = parseHealingReportFromModelText(raw);
    return NextResponse.json({ report });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "报告生成失败";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
