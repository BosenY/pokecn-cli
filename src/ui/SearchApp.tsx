import React, { useState, useMemo } from "react";
import { Box, Text, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import Fuse from "fuse.js";
import type { PokemonEntry } from "./components/PokemonList.tsx";
import { PokemonList } from "./components/PokemonList.tsx";

// 加载映射表
async function loadAllNames(): Promise<PokemonEntry[]> {
  try {
    const data: {
      nameMap: Record<string, string>;
      idMap: Record<string, string>;
    } = await import("../i18n/name-map.json");
    const map = data.nameMap ?? (data as any).default?.nameMap;
    const idMap = data.idMap ?? (data as any).default?.idMap;

    const slugToId = new Map<string, string>();
    if (idMap) {
      for (const [id, slug] of Object.entries(idMap)) {
        slugToId.set(slug, id);
      }
    }

    return Object.entries(map).map(([zh, en]) => ({
      zh,
      en,
      id: slugToId.get(en) ?? "0",
    }));
  } catch {
    return [];
  }
}

interface Props {
  lang: string;
  allNames: PokemonEntry[];
  onSelect: (slug: string) => void;
}

function SearchView({ lang, allNames, onSelect }: Props) {
  const { exit } = useApp();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 初始化 Fuse
  const fuse = useMemo(
    () =>
      new Fuse(allNames, {
        keys: [
          { name: "zh", weight: 0.5 },
          { name: "en", weight: 0.4 },
          { name: "id", weight: 0.1 },
        ],
        threshold: 0.4,
        minMatchCharLength: 1,
        includeScore: true,
      }),
    [allNames],
  );

  // 过滤结果
  const results = useMemo<PokemonEntry[]>(() => {
    if (!query.trim()) {
      // 空输入：按 id 数值排序显示前 20 条
      return [...allNames]
        .sort((a, b) => parseInt(a.id) - parseInt(b.id))
        .slice(0, 20);
    }
    // 纯数字：精确 id 匹配优先
    if (/^\d+$/.test(query.trim())) {
      const exact = allNames.filter((n) => n.id === query.trim());
      if (exact.length > 0) return exact.slice(0, 20);
    }
    return fuse
      .search(query.trim())
      .slice(0, 20)
      .map((r) => r.item);
  }, [query, fuse, allNames]);

  // 搜索词变化时重置选中
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(0);
  };

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (key.downArrow) {
      setSelectedIndex((i) => (i >= results.length - 1 ? 0 : i + 1));
    } else if (key.return) {
      const selected = results[selectedIndex];
      if (selected) onSelect(selected.en);
    } else if (input === "q" || input === "Q" || key.escape) {
      exit();
    }
  });

  const isZh = lang === "zh";

  return (
    <Box flexDirection="column" paddingX={1}>
      {/* 标题 */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {isZh ? "宝可梦百科" : "Pokédex"}{" "}
        </Text>
        <Text dimColor>{isZh ? "· 搜索" : "· Search"}</Text>
      </Box>

      {/* 搜索框 */}
      <Box borderStyle="round" borderColor="cyan" paddingX={1} width={50}>
        <Text color="cyan">🔍 </Text>
        <TextInput
          value={query}
          onChange={handleQueryChange}
          placeholder={isZh ? "输入名称或编号..." : "Search name or ID..."}
        />
      </Box>

      {/* 结果列表 */}
      <Box marginTop={1}>
        <PokemonList items={results} selectedIndex={selectedIndex} lang={lang} />
      </Box>

      {/* 状态栏 */}
      <Box marginTop={1} gap={3} borderStyle="single" borderColor="gray" paddingX={1}>
        <Text dimColor>{results.length} {isZh ? "个结果" : "results"}</Text>
        <Text dimColor>↑↓ {isZh ? "移动" : "navigate"}</Text>
        <Text dimColor>Enter {isZh ? "查看" : "view"}</Text>
        <Text dimColor>Q {isZh ? "退出" : "quit"}</Text>
      </Box>
    </Box>
  );
}

// 异步加载包装，等待数据就绪后渲染
interface SearchAppProps {
  lang: string;
  initialQuery?: string;
  onSelect: (slug: string) => void;
}

export function SearchApp({ lang, initialQuery = "", onSelect }: SearchAppProps) {
  const [allNames, setAllNames] = React.useState<PokemonEntry[] | null>(null);

  React.useEffect(() => {
    loadAllNames().then(setAllNames);
  }, []);

  if (allNames === null) {
    return (
      <Box padding={1}>
        <Text color="cyan">Loading...</Text>
      </Box>
    );
  }

  return <SearchView lang={lang} allNames={allNames} onSelect={onSelect} />;
}
