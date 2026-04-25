import React from "react";
import parseHtml, { DOMNode, Element as HtmlElement } from "html-react-parser";
import type { GutenbergBlock } from "@/app/lib/gutenberg";
import { renderAcfBlock } from "@/app/components/acf/acfBlocks";
import { stripScriptTags } from "@/app/lib/html";

type Props = {
  blocks: GutenbergBlock[];
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function renderInnerBlocks(innerBlocks: GutenbergBlock[]) {
  return innerBlocks.map((b, i) => <BlockView key={`${b.blockName ?? "html"}-${i}`} block={b} />);
}

function isElement(node: DOMNode): node is HtmlElement {
  return (node as any)?.type === "tag";
}

function sanitizeWpButtonLink(node: HtmlElement) {
  if (node.name !== "a") return undefined;
  const className = String(node.attribs?.class ?? "");
  if (!className.includes("wp-block-button__link")) return undefined;

  const href = node.attribs?.href;
  const target = node.attribs?.target;
  const rel = node.attribs?.rel;

  // Keep WP-generated semantics but allow our Tailwind-based look.
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={cx(
        "wp-block-button__link",
        "inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200",
      )}
    >
      {parseHtml(node.children as any)}
    </a>
  );
}

function HtmlContent({ html, className }: { html: string; className?: string }) {
  if (!html) return null;
  const safeHtml = stripScriptTags(html);
  return (
    <div
      className={className}
      // WP content is trusted from your WP instance; if needed we can add HTML sanitization later.
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}

function BlockView({ block }: { block: GutenbergBlock }) {
  const name = block.blockName ?? "core/html";

  if (name.startsWith("acf/")) {
    return <>{renderAcfBlock(block)}</>;
  }

  switch (name) {
    case "core/paragraph":
      return <HtmlContent html={block.innerHTML} className="wp-block-paragraph" />;
    case "core/heading":
      return <HtmlContent html={block.innerHTML} className="wp-block-heading" />;
    case "core/list":
      return <HtmlContent html={block.innerHTML} className="wp-block-list" />;
    case "core/image":
      return <HtmlContent html={block.innerHTML} className="wp-block-image" />;
    case "core/gallery":
      return <HtmlContent html={block.innerHTML} className="wp-block-gallery" />;
    case "core/quote":
      return <HtmlContent html={block.innerHTML} className="wp-block-quote" />;
    case "core/separator":
      return <HtmlContent html={block.innerHTML} className="wp-block-separator" />;
    case "core/spacer":
      return <HtmlContent html={block.innerHTML} className="wp-block-spacer" />;

    case "core/group":
      return <section className="wp-block-group">{renderInnerBlocks(block.innerBlocks)}</section>;

    case "core/columns":
      return <div className="wp-block-columns">{renderInnerBlocks(block.innerBlocks)}</div>;

    case "core/column":
      return <div className="wp-block-column">{renderInnerBlocks(block.innerBlocks)}</div>;

    case "core/buttons":
      return (
        <div className="wp-block-buttons">
          {block.innerBlocks.length ? (
            renderInnerBlocks(block.innerBlocks)
          ) : (
            <div>
              {parseHtml(block.innerHTML, {
                replace: (node) => {
                  if (!isElement(node)) return;
                  return sanitizeWpButtonLink(node);
                },
              })}
            </div>
          )}
        </div>
      );

    case "core/button": {
      if (block.innerHTML) {
        return (
          <div className="wp-block-button">
            {parseHtml(block.innerHTML, {
              replace: (node) => {
                if (!isElement(node)) return;
                return sanitizeWpButtonLink(node);
              },
            })}
          </div>
        );
      }
      return <div className="wp-block-button">{renderInnerBlocks(block.innerBlocks)}</div>;
    }

    case "core/cover":
      return <HtmlContent html={block.innerHTML} className="wp-block-cover" />;

    default:
      // Fallback: render whatever HTML WP produced for this block.
      // This keeps custom blocks working immediately, even before we implement a React component.
      return <HtmlContent html={block.innerHTML} />;
  }
}

export function GutenbergRenderer({ blocks }: Props) {
  return (
    <div className="wp-content prose prose-zinc max-w-none dark:prose-invert">
      {blocks.map((b, i) => (
        <BlockView key={`${b.blockName ?? "html"}-${i}`} block={b} />
      ))}
    </div>
  );
}

