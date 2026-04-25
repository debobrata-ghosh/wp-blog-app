import React from "react";
import type { GutenbergBlock } from "@/app/lib/gutenberg";
import { HeroBlock } from "@/app/components/acf/blocks/HeroBlock";

/**
 * Map `acf/your-block-name` -> React component.
 *
 * ACF blocks usually store fields under `block.attrs.data`.
 * Example: block.blockName === "acf/hero-section"
 */

type AcfBlockComponent = (props: { block: GutenbergBlock; data: Record<string, unknown> }) => React.ReactNode;

function getAcfData(block: GutenbergBlock): Record<string, unknown> {
  const attrs = block.attrs as any;
  const data = attrs?.data;
  return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
}

export function renderAcfBlock(block: GutenbergBlock) {
  const name = block.blockName ?? "";
  const data = getAcfData(block);

  const registry: Record<string, AcfBlockComponent> = {
    // Your WP folder: template-parts/blocks/hero → most commonly registers as `acf/hero`
    "acf/hero": ({ data }) => <HeroBlock data={data} />,
    // Common naming variant
    "acf/hero-section": ({ data }) => <HeroBlock data={data} />,
  };

  const Component = registry[name];
  if (Component) return Component({ block, data });

  // Helpful fallback while you implement mappings for each ACF block.
  return (
    <div className="not-prose rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-50">
      <div className="text-sm font-semibold">Unmapped ACF block</div>
      <div className="mt-1 text-xs opacity-80">
        <span className="font-mono">{name}</span>
      </div>
      <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-white/70 p-3 text-xs text-zinc-900 dark:bg-black/40 dark:text-zinc-100">
        {JSON.stringify({ attrs: block.attrs, innerBlocks: block.innerBlocks?.length ?? 0 }, null, 2)}
      </pre>
    </div>
  );
}

