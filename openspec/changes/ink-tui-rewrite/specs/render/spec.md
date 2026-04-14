## REMOVED Requirements

### Requirement: 字符串拼接渲染层
**Reason**: `src/render/` 目录下的所有字符串拼接渲染函数（`layout.ts`, `stats.ts`, `evolution.ts`, `types.ts`）完全由 `src/ui/` 下的 ink React 组件替代。`render/image.ts` 保留，供 `SpriteBox` 组件调用。
**Migration**: 使用 `src/ui/components/PokemonCard.tsx` 和相关子组件替代 `renderPokemonCard()`；使用 `src/ui/components/StatsBar.tsx` 替代 `renderStats()`；使用 `src/ui/components/EvolutionChain.tsx` 替代 `renderEvolution()`；使用 `src/ui/components/TypeBadge.tsx` 替代 `formatTypes()`。
