import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { NextResponse } from "next/server";
import {
  getDefaultArkModel,
  getVolcengineArkOpenAI,
} from "@/lib/volcengine_ark_openai";

export const runtime = "nodejs";

type ChatRequestBody = {
  messages?: ChatCompletionMessageParam[];
  /** 可选：与 OpenAI SDK 一致，单独传入系统提示（会置于 messages 之前） */
  system?: string;
  model?: string;
  temperature?: number;
};

function mergeSystemMessages(
  system: string | undefined,
  messages: ChatCompletionMessageParam[],
): ChatCompletionMessageParam[] {
  const trimmed = system?.trim();
  if (!trimmed) {
    return messages;
  }
  return [{ role: "system", content: trimmed }, ...messages];
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawMessages = body.messages;
  if (!rawMessages?.length) {
    return NextResponse.json(
      { error: "messages is required and must be non-empty" },
      { status: 400 },
    );
  }

  const messages = mergeSystemMessages(body.system, rawMessages);

  const model = body.model?.trim() || getDefaultArkModel();
  if (!model) {
    return NextResponse.json(
      {
        error:
          "No model specified. Set ARK_MODEL in .env.local or pass model in the request body.",
      },
      { status: 400 },
    );
  }

  try {
    const client = getVolcengineArkOpenAI();
    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature: body.temperature ?? 0.7,
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({
      text,
      model: completion.model,
      id: completion.id,
      usage: completion.usage,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
