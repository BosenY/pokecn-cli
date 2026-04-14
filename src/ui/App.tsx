import React, { useState } from "react";
import { SearchApp } from "./SearchApp.tsx";
import { DetailApp } from "./DetailApp.tsx";

interface Props {
  initialMode?: "search" | "detail";
  initialSlug?: string;
  lang: string;
  showImage?: boolean;
  shiny?: boolean;
}

type Mode = "search" | "detail";

export function App({
  initialMode = "search",
  initialSlug,
  lang,
  showImage = true,
  shiny: initialShiny = false,
}: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug ?? "");

  const handleSelect = (slug: string) => {
    setSelectedSlug(slug);
    setMode("detail");
  };

  const handleBack = () => {
    setMode("search");
  };

  if (mode === "detail" && selectedSlug) {
    return (
      <DetailApp
        slug={selectedSlug}
        lang={lang}
        shiny={initialShiny}
        showImage={showImage}
        autoExit={false}
        onBack={handleBack}
      />
    );
  }

  return (
    <SearchApp
      lang={lang}
      onSelect={handleSelect}
    />
  );
}
