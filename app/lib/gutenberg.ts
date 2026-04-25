import { parse } from "@wordpress/block-serialization-default-parser";

export type GutenbergBlock = {
  blockName: string | null;
  attrs: Record<string, unknown>;
  innerBlocks: GutenbergBlock[];
  innerHTML: string;
  innerContent: Array<string | null>;
};

export function parseGutenbergBlocks(raw: string): GutenbergBlock[] {
  if (!raw || typeof raw !== "string") return [];
  // The parser returns an array of blocks (including freeform HTML blocks).
  return parse(raw) as unknown as GutenbergBlock[];
}

