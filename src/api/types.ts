// PokeAPI /api/v2/pokemon/{name}
export interface Pokemon {
  id: number;
  name: string;
  height: number; // 分米
  weight: number; // 百克
  base_experience: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
}

export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string; url: string };
}

export interface PokemonAbility {
  ability: { name: string; url: string };
  is_hidden: boolean;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other: {
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
    home: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

// PokeAPI /api/v2/pokemon-species/{name}
export interface PokemonSpecies {
  id: number;
  name: string;
  names: LocalizedName[];
  genera: LocalizedGenus[];
  flavor_text_entries: FlavorTextEntry[];
  evolution_chain: { url: string };
  capture_rate: number;
  base_happiness: number;
  gender_rate: number; // -1=无性别, 0=全♂, 8=全♀, 4=50/50
  is_legendary: boolean;
  is_mythical: boolean;
  generation: { name: string; url: string };
  growth_rate: { name: string };
  egg_groups: { name: string }[];
}

export interface LocalizedName {
  name: string;
  language: { name: string };
}

export interface LocalizedGenus {
  genus: string;
  language: { name: string };
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string };
  version: { name: string };
}

// PokeAPI /api/v2/evolution-chain/{id}
export interface EvolutionChainResponse {
  chain: EvolutionNode;
}

export interface EvolutionNode {
  species: { name: string; url: string };
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionNode[];
}

export interface EvolutionDetail {
  trigger: { name: string };
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  item: { name: string } | null;
  held_item: { name: string } | null;
  known_move: { name: string } | null;
  known_move_type: { name: string } | null;
  time_of_day: string;
  location: { name: string } | null;
  needs_overworld_rain: boolean;
  party_species: { name: string } | null;
  party_type: { name: string } | null;
  trade_species: { name: string } | null;
  turn_upside_down: boolean;
  gender: number | null;
}

// Ability detail from /api/v2/ability/{name}
export interface AbilityDetail {
  id: number;
  name: string;
  names: LocalizedName[];
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
    version_group: { name: string };
  }[];
}

// Flattened evolution step for rendering
export interface EvolutionStep {
  from: string; // species name (slug)
  to: string;
  details: EvolutionDetail[];
}
