import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPostBySlug, fetchPostsPage } from "@/app/lib/wordpress";
import { stripScriptTags } from "@/app/lib/html";
import { ShareIcons } from "@/app/components/blog/ShareIcons";

export async function generateStaticParams() {
  // Keep exports fast for GitHub Pages. Prebuild a small number of posts.
  const { posts } = await fetchPostsPage({ page: 1, perPage: 12, query: { _fields: "slug" } });
  return posts.map((p) => ({ slug: String(p.slug || "").trim() })).filter((p) => Boolean(p.slug));
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export default async function BlogDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const post = await fetchPostBySlug({
    slug,
    query: { _embed: 1 },
  });

  if (!post) notFound();

  const title = post.title?.rendered ? stripHtml(post.title.rendered) : slug;
  const contentHtml = stripScriptTags(post.content?.rendered ?? "");
  const excerpt = post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : "";
  const embedded = post as unknown as {
    _embedded?: { ["wp:featuredmedia"]?: Array<{ source_url?: string; alt_text?: string }> };
    categories?: number[];
  };
  const featured = embedded._embedded?.["wp:featuredmedia"]?.[0];
  const featuredUrl = featured?.source_url;
  const featuredAlt = featured?.alt_text || title;
  const postLink = typeof post.link === "string" ? post.link : "";

  return (
    <main id="main-content" className="single-post-template" role="main">
      <div className="single-navigation">
        <div className="single-navigation__container">
          <Link href="/blog" className="single-nav-link single-nav-link--back">
            <span aria-hidden="true">☰</span>
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>

      <section className="single-header">
        <div className="single-header__container">
          <div className="single-header__content">
            <div className="single-header__text">
              <span className="single-header__date">
                {post.date ? new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : ""}
              </span>
              <h1 className="single-header__title">{title}</h1>
              {excerpt ? <p className="single-header__subtitle">{excerpt}</p> : null}
            </div>
          </div>
          <div className="single-header__image">
            {featuredUrl ? (
              <img src={featuredUrl} alt={featuredAlt} loading="lazy" />
            ) : (
              <span className="image-placeholder-text">[ Image ]</span>
            )}
          </div>
        </div>
      </section>

      <article className="single-content">
        <div
          className="single-content__body"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <div className="single-share">
          <h3 className="single-share__title">Share this entry.</h3>
          <ShareIcons postLink={postLink} title={title} />

          <p className="single-disclaimer">
            While this blog may occasionally contain information that relates to Unitek College's programs or courses, the
            majority of information provided within this blog is for general informational purposes only and is not intended
            to represent the specific details of any educational offerings or opinions of Unitek College. *Please note that
            wage data provided by the Bureau of Labor Statistics (BLS) or other third-party sources may not be an accurate
            reflection of all areas of the country, may not account for the employees' years of experience, and may not
            reflect the wages or outlook of entry-level employees, such as graduates of our program. (accessed on{" "}
            {new Date().toLocaleDateString()})
          </p>
        </div>
      </article>
    </main>
  );
}

