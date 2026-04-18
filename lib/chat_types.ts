export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  /** 为 true 时不展示在界面（用于探索模式由系统触发的首轮） */
  omitFromDisplay?: boolean;
};
