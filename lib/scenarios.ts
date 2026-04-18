/** 探索问题集：简短版（压缩关键提问） / 正常版（完整追问链） */
export type ExploreQuestionMode = "short" | "normal";

export type HealingScenario = {
  id: string;
  title: string;
  description: string;
  questions_short: string[];
  questions_normal: string[];
};

/** 探索模式：四种意象入口，各含简短 / 正常两套问题 */
export const HEALING_SCENARIOS: HealingScenario[] = [
  {
    id: "inner-house",
    title: "房子",
    description: "你内心的家，现在是什么状态？",
    questions_short: [
      "如果把此刻的你放进一间「内在房子」里，它坐落在什么样的地方？",
      "门与窗：更接近开着、有光，还是关着、偏暗？",
      "如果只改一个小细节，你会先动哪里？",
    ],
    questions_normal: [
      "如果把此刻的你放进一间「内在的房子」里，这间房子坐落在什么样的地方？（城市边、海边、森林里、悬崖上……随意。）",
      "门是开着、虚掩，还是上锁？窗外透进来的是什么样的光？",
      "房子里哪个房间最让你想待一会儿？哪个房间你几乎不去？",
      "这间房子里，有没有一个「声音」一直在说话？它在说什么？",
      "如果你可以给这间房子改一个小地方（只改一点点），你会先动哪里？",
    ],
  },
  {
    id: "flower-bee",
    title: "花与蜜蜂",
    description:
      "在亲密关系里，你是一直开放给予的那朵花，还是来了又走的蜜蜂？",
    questions_short: [
      "你面前有一朵花。它是什么样的花？现在是什么状态？",
      "现在，一只蜜蜂出现了。它在哪里？它和花之间，正在发生什么？",
      "如果这朵花可以对蜜蜂说一句话，它最想说什么？",
    ],
    questions_normal: [
      "你面前有一朵花。它是什么样的花？现在是什么状态？",
      "现在，一只蜜蜂出现了。它在哪里？它和花之间，正在发生什么？",
      "花在等它吗？它在等什么——被看见、被回应，还是别的？",
      "此刻，这朵花是什么感觉？它愿意让蜜蜂落下来吗？边界在哪里？",
      "如果这朵花可以对蜜蜂说一句话，它最想说什么？",
    ],
  },
  {
    id: "inner-animal",
    title: "动物",
    description: "你内心最原始的力量，此刻是什么形态？",
    questions_short: [
      "此刻你心里最先浮现的动物是什么？不必合理，只要真实。",
      "它现在的动作与呼吸，更像怎样的节奏？",
      "若它只能对你说一个词，会是什么？",
    ],
    questions_normal: [
      "此刻，你心里最先浮现的动物是什么？不必合理，只要真实。",
      "它的体型、毛色或皮肤、眼神，各是什么样的？",
      "它现在是静止、踱步，还是在奔跑？呼吸快还是慢？",
      "它在保护什么、寻找什么，还是在躲避什么？",
      "如果这个动物可以对你耳语一句，它最想告诉你什么？",
    ],
  },
  {
    id: "inner-cave",
    title: "洞穴",
    description: "你内心深处，有什么东西一直没有被看见？",
    questions_short: [
      "如果把内心深处想像成洞穴入口：它朝向哪里？往里走最先遇见什么？",
      "洞穴里藏着什么？它长什么样？",
      "此刻谁被允许进入，谁从未被允许？",
    ],
    questions_normal: [
      "如果把你的内心深处想像成一个洞穴入口——它朝向哪里？是潮湿还是干燥？",
      "往里走，最先遇到的是阴影、回声，还是一点微光？",
      "洞穴里有没有一件被藏起来的东西？它长什么样？",
      "谁被允许进入这个洞穴？谁从未被允许？",
      "如果洞穴深处有一个名字，你觉得它可能叫什么？",
    ],
  },
];

export function getScenarioById(id: string): HealingScenario | undefined {
  return HEALING_SCENARIOS.find((s) => s.id === id);
}

export function getExploreQuestionsForMode(
  scenario: HealingScenario,
  mode: ExploreQuestionMode,
): string[] {
  return mode === "short" ? scenario.questions_short : scenario.questions_normal;
}
