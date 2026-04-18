import type { HealingReport } from "@/lib/healing_report";

export type OfflineRecommendation = {
  id: string;
  title: string;
  description: string;
  /** 结合本次报告维度，优先参考（非医疗处方） */
  emphasize: boolean;
};

const BASE_OFFLINE: Omit<OfflineRecommendation, "emphasize">[] = [
  {
    id: "forest",
    title: "森林疗养 / 自然暴露",
    description:
      "在安全的开放绿地或森林公园慢走 30–60 分钟，降低皮质醇节律负荷；避开恶劣天气与陡峭地形，可结伴同行。",
  },
  {
    id: "rage-room",
    title: "情绪发泄室 / 安全击打",
    description:
      "佩戴护具，在合规场馆用击打、摔软物等方式释放紧张；明确时间边界，结束后做 3 分钟缓慢呼吸收束。",
  },
  {
    id: "mind-body",
    title: "正念与身体工作坊",
    description:
      "线下团体或一对一带领的呼吸、身体扫描、缓慢伸展；适合希望「把唤醒度降下来」、重建身体感的人。",
  },
  {
    id: "art-writing",
    title: "艺术或书写疗愈小组",
    description:
      "非评价性的绘画、拼贴、自由书写；把模糊情绪外化为图像或词语，常与「关键意象」工作相衔接。",
  },
  {
    id: "clinical",
    title: "面对面心理咨询 / 医院心理科",
    description:
      "当出现持续功能受损、强烈自伤念头或无法自我安抚时，线下专业评估是最稳妥的选项；本应用不提供诊断与治疗。",
  },
];

function scoreForId(id: string, report: HealingReport): number {
  const { valence, arousal } = report;
  switch (id) {
    case "forest":
      return (valence < 0.2 ? 2.4 : 0) + (arousal < 0.5 ? 1 : 0) + 0.3;
    case "rage-room":
      return arousal > 0.55 ? 3 : arousal > 0.38 ? 1.6 : 0.2;
    case "mind-body":
      return arousal > 0.42 && arousal < 0.78 ? 1.9 : arousal >= 0.78 ? 1.2 : 0.8;
    case "art-writing":
      return valence < 0.35 ? 2 : valence < 0.55 ? 1.2 : 0.6;
    case "clinical":
      return valence < -0.15 ? 2.8 : valence < 0.1 ? 1.1 : 0.4;
    default:
      return 0;
  }
}

/** 固定 5 条线下建议；根据效价/唤醒度为其中 2 条打「优先参考」标记 */
export function buildOfflineRecommendations(
  report: HealingReport,
): { intro: string; items: OfflineRecommendation[] } {
  const scored = BASE_OFFLINE.map((item) => ({
    ...item,
    score: scoreForId(item.id, report),
  }));
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  const emphasizeIds = new Set(sorted.slice(0, 2).map((s) => s.id));

  const items: OfflineRecommendation[] = BASE_OFFLINE.map((item) => ({
    ...item,
    emphasize: emphasizeIds.has(item.id),
  }));

  const intro = `以下为「固定清单」式线下补充：不替代医疗。结合你本次报告的效价 ${report.valence.toFixed(1)}、唤醒度 ${report.arousal.toFixed(1)}，系统标出两项「优先参考」，其余亦可根据城市资源与安全条件尝试。`;

  return { intro, items };
}
