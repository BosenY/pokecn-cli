import React, { useEffect, useState } from "react";
import { Text } from "ink";
import { renderSprite } from "../../render/image.ts";

interface Props {
  pokemonId: number;
  shiny: boolean;
  preloaded?: string;
}

export function SpriteBox({ pokemonId, shiny, preloaded }: Props) {
  const [ansi, setAnsi] = useState<string | null>(preloaded ?? null);

  useEffect(() => {
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

  return <Text>{ansi}</Text>;
}
