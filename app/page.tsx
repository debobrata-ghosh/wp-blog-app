import { notFound } from "next/navigation";
import { GutenbergRenderer } from "@/app/components/GutenbergRenderer";
import { parseGutenbergBlocks } from "@/app/lib/gutenberg";
import { stripScriptTags } from "@/app/lib/html";
import { fetchPageForBlocksBySlug } from "@/app/lib/wordpress";

export const revalidate = 60;

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export default async function Home() {
  const slug = (process.env.HOME_PAGE_SLUG ?? "home").trim() || "home";
  const { page, raw } = await fetchPageForBlocksBySlug({ slug, preferRaw: true });
  if (!page) notFound();

  const title = page.title?.rendered ? stripHtml(page.title.rendered) : "";
  const contentHtml = stripScriptTags(page.content?.rendered ?? "");
  const blocks = raw ? parseGutenbergBlocks(raw) : null;

  return (
    <article className="mx-auto w-full">
      {blocks ? (
        <GutenbergRenderer blocks={blocks} />
      ) : (
        <div
          className="wp-content prose prose-zinc max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      )}
    </article>
  );
}
