import React, { useEffect, useState } from "react";
import { Text } from "ink";
import { renderSprite } from "../../render/image.ts";

interface Props {
  pokemonId: number;
  shiny: boolean;
  // 如果外部已预加载好 ANSI 字符串，直接传入跳过内部异步加载
  preloaded?: string;
}

export function SpriteBox({ pokemonId, shiny, preloaded }: Props) {
  const [ansi, setAnsi] = useState<string | null>(preloaded ?? null);

  useEffect(() => {
    // 已有预加载内容且 shiny/id 未变，直接用
    if (preloaded !== undefined) {
      setAnsi(preloaded);
      return;
    }
    setAnsi(null);
    renderSprite(pokemonId, shiny)
      .then((output) => setAnsi(output || null))
      .catch(() => setAnsi(null));
  }, [pokemonId, shiny, preloaded]);

  if (!ansi) return null;

  // 不用 Box width 约束，避免 ANSI 重置码破坏 terminal-image 背景色渲染
  return <Text>{ansi}</Text>;
}
