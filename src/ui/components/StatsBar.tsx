import React from "react";
import { Box, Text } from "ink";

interface Props {
  label: string;
  value: number;
  barWidth?: number;
  max?: number;
}

function statColor(value: number): string {
  if (value < 50) return "red";
  if (value < 100) return "yellow";
  return "green";
}

// CJK 字符占 2 列，ASCII 占 1 列
function displayWidth(str: string): number {
  let w = 0;
  for (const ch of str) {
    const code = ch.codePointAt(0)!;
    if (
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0x3000 && code <= 0x303f) ||
      (code >= 0xff00 && code <= 0xffef) ||
      (code >= 0x3040 && code <= 0x309f) ||
      (code >= 0x30a0 && code <= 0x30ff)
    ) {
      w += 2;
    } else {
      w += 1;
    }
  }
  return w;
}

const LABEL_DISPLAY_WIDTH = 7;

export function StatsBar({ label, value, barWidth = 24, max = 255 }: Props) {
  const filled = Math.round((value / max) * barWidth);
  const empty = barWidth - filled;
  const color = statColor(value);
  const labelPad = LABEL_DISPLAY_WIDTH - displayWidth(label);
  const padding = labelPad > 0 ? " ".repeat(labelPad) : "";

  return (
    <Box>
      <Text>{label}{padding} </Text>
      <Text color={color}>{"█".repeat(filled)}</Text>
      <Text dimColor>{"░".repeat(empty)}</Text>
      <Text>  {String(value).padStart(3)}</Text>
    </Box>
  );
}

export function StatsTotalRow({ total, label, barWidth = 24 }: { total: number; label: string; barWidth?: number }) {
  const labelPad = LABEL_DISPLAY_WIDTH - displayWidth(label);
  const padding = labelPad > 0 ? " ".repeat(labelPad) : "";
  return (
    <Box>
      <Text>{label}{padding} </Text>
      <Text>{" ".repeat(barWidth)}</Text>
      <Text>  <Text bold>{String(total).padStart(3)}</Text></Text>
    </Box>
  );
}
