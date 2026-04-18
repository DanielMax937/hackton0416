import OpenAI from "openai";

/** 火山方舟 OpenAI 兼容接口默认地址（北京） */
export const DEFAULT_ARK_OPENAI_BASE_URL =
  "https://ark.cn-beijing.volces.com/api/v3";

let cached: OpenAI | null = null;

/**
 * 服务端单例：使用 OpenAI 官方 SDK，指向火山方舟兼容端点。
 * 仅在 Server Components、Route Handlers、Server Actions 中调用。
 */
export function getVolcengineArkOpenAI(): OpenAI {
  if (cached) {
    return cached;
  }

  const apiKey =
    process.env.ARK_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "Missing API key: set ARK_API_KEY or OPENAI_API_KEY in .env / .env.local (see .env.example).",
    );
  }

  const baseURL =
    process.env.OPENAI_BASE_URL?.trim() ||
    process.env.ARK_BASE_URL?.trim() ||
    DEFAULT_ARK_OPENAI_BASE_URL;

  cached = new OpenAI({
    apiKey,
    baseURL,
  });

  return cached;
}

/** 默认推理模型：控制台「在线推理」里的 Endpoint / Model ID */
export function getDefaultArkModel(): string | undefined {
  const id =
    process.env.ARK_MODEL?.trim() || process.env.OPENAI_MODEL?.trim();
  return id || undefined;
}
