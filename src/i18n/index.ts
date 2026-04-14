import { zh } from "./zh.ts";
import { en } from "./en.ts";

export type I18n = typeof zh;

const locales = { zh, en } as const;

export function t(lang: string): I18n {
  return lang === "en" ? (en as unknown as I18n) : zh;
}
