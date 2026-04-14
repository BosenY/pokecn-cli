import React from "react";
import { Box, Text } from "ink";
import type { EvolutionStep, EvolutionDetail } from "../../api/types.ts";

const TRIGGER_ZH: Record<string, string> = {
  "level-up": "升级",
  "use-item": "使用道具",
  trade: "通信交换",
  shed: "脱壳",
  spin: "旋转",
  "tower-of-darkness": "暗之塔",
  "tower-of-waters": "水之塔",
  "three-critical-hits": "三次暴击",
  "take-damage": "受到伤害",
  other: "其他",
};

const ITEM_ZH: Record<string, string> = {
  "thunder-stone": "雷之石",
  "fire-stone": "火之石",
  "water-stone": "水之石",
  "leaf-stone": "叶之石",
  "moon-stone": "月之石",
  "sun-stone": "日之石",
  "shiny-stone": "光之石",
  "dusk-stone": "暗之石",
  "dawn-stone": "觉醒之石",
  "ice-stone": "冰之石",
  "oval-stone": "浑圆之石",
  "kings-rock": "王者之证",
  "metal-coat": "金属膜",
  "dragon-scale": "龙之鳞片",
  "upgrade": "升级数据",
  "dubious-disc": "可疑补丁",
  "protector": "护具",
  "electirizer": "电力增幅器",
  "magmarizer": "熔岩增幅器",
  "prism-scale": "美丽鳞片",
  "reaper-cloth": "灵界之布",
  "deep-sea-tooth": "深海之牙",
  "deep-sea-scale": "深海之鳞",
  "razor-claw": "锐利之爪",
  "razor-fang": "锐利之牙",
  "linking-cord": "连接绳",
  "auspicious-armor": "将之铠甲",
  "malicious-armor": "咒之铠甲",
  "scroll-of-darkness": "恶之卷轴",
  "scroll-of-waters": "水之卷轴",
  "sweet-apple": "甜甜苹果",
  "tart-apple": "酸酸苹果",
  "syrupy-apple": "蜜糖苹果",
};

function describeEvolution(detail: EvolutionDetail, lang: string): string {
  const parts: string[] = [];
  const isZh = lang === "zh";

  if (detail.min_level) parts.push(isZh ? `Lv.${detail.min_level}` : `Level ${detail.min_level}`);
  if (detail.min_happiness) parts.push(isZh ? "高好感度" : "High Friendship");
  if (detail.item) {
    const n = detail.item.name;
    parts.push(isZh ? (ITEM_ZH[n] ?? n) : n.replace(/-/g, " "));
  }
  if (detail.held_item) {
    const n = detail.held_item.name;
    const s = isZh ? (ITEM_ZH[n] ?? n) : n.replace(/-/g, " ");
    parts.push(isZh ? `携带${s}` : `holding ${s}`);
  }
  if (detail.known_move) parts.push(isZh ? "学会招式" : "knowing move");
  if (detail.time_of_day) {
    const tod = detail.time_of_day;
    parts.push(isZh ? (tod === "day" ? "白天" : tod === "night" ? "夜晚" : tod) : tod);
  }
  if (detail.trigger.name === "trade" && parts.length === 0) parts.push(isZh ? "通信交换" : "Trade");
  if (detail.trigger.name === "use-item" && parts.length === 0) parts.push(isZh ? "使用道具" : "Use Item");
  if (parts.length === 0) {
    const t = detail.trigger.name;
    parts.push(isZh ? (TRIGGER_ZH[t] ?? t) : t.replace(/-/g, " "));
  }
  return parts.join(isZh ? " · " : ", ");
}

interface Props {
  steps: EvolutionStep[];
  nameResolver: (slug: string) => string;
  lang: string;
}

export function EvolutionChain({ steps, nameResolver, lang }: Props) {
  if (steps.length === 0) {
    return <Text dimColor>{lang === "zh" ? "无进化" : "No evolution"}</Text>;
  }

  // 检查是否有分支
  const fromCounts = new Map<string, number>();
  for (const step of steps) {
    fromCounts.set(step.from, (fromCounts.get(step.from) ?? 0) + 1);
  }
  const hasBranch = [...fromCounts.values()].some((c) => c > 1);

  if (!hasBranch) {
    // 线性进化链，单行渲染
    return (
      <Box flexWrap="wrap">
        <Text bold>{nameResolver(steps[0]!.from)}</Text>
        {steps.map((step, i) => {
          const cond = step.details.length > 0
            ? describeEvolution(step.details[0]!, lang)
            : "?";
          return (
            <Text key={i}>
              <Text dimColor> ──[{cond}]──▶ </Text>
              <Text bold>{nameResolver(step.to)}</Text>
            </Text>
          );
        })}
      </Box>
    );
  }

  // 分支进化
  const root = steps[0]!.from;
  const rootSteps = steps.filter((s) => s.from === root);

  return (
    <Box flexDirection="column">
      <Text bold>{nameResolver(root)}</Text>
      {rootSteps.map((step, i) => {
        const cond = step.details.length > 0
          ? describeEvolution(step.details[0]!, lang)
          : "?";
        const isLast = i === rootSteps.length - 1;
        return (
          <Box key={i}>
            <Text dimColor>{isLast ? "  └── " : "  ├── "}</Text>
            <Text dimColor>[{cond}]──▶ </Text>
            <Text bold>{nameResolver(step.to)}</Text>
          </Box>
        );
      })}
    </Box>
  );
}
