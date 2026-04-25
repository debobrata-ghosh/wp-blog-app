import Link from "next/link";
import { BlogCategoryNav } from "@/app/components/blog/BlogCategoryNav";
import { fetchCategories, fetchPostsPage } from "@/app/lib/wordpress";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export default async function BlogPage() {
  const perPage = 9;

  const { categories: allCategories } = await fetchCategories({ perPage: 100 });
  const { posts, totalPages, total } = await fetchPostsPage({
    page: 1,
    perPage,
    query: {
      _embed: 1,
      order: "desc",
      orderby: "date",
    },
  });

  const featured = posts[0] ?? null;
  const featuredTitle = featured?.title?.rendered ? stripHtml(featured.title.rendered) : "Welcome to Our Blog";
  const featuredExcerpt = featured?.excerpt?.rendered ? stripHtml(featured.excerpt.rendered) : "";
  const featuredSlug = featured?.slug ?? "";
  const featuredEmbedded = featured as any;
  const featuredMedia = featuredEmbedded?._embedded?.["wp:featuredmedia"]?.[0];
  const featuredImage = featuredMedia?.source_url as string | undefined;

  return (
    <main id="main-content" className="page-template-blog" role="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__container">
          <div className="hero__content">
            <h1 className="hero__title" id="hero-title">
              {featuredTitle}
            </h1>
            <p className="hero__subtitle">{featuredExcerpt}</p>
            {featuredSlug ? (
              <Link href={`/blog/${featuredSlug}`} className="btn-link" aria-label="Read the full story">
                Read the story <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <a href="#articles" className="btn-link" aria-label="Browse all articles">
                Browse Articles <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
          <div
            className="hero__image"
            style={
              featuredImage
                ? { backgroundImage: `url(${featuredImage})`, backgroundSize: "cover", backgroundPosition: "center" }
                : undefined
            }
            aria-label={`${featuredTitle} featured image`}
          >
            {!featuredImage ? "[ Image ]" : null}
          </div>
        </div>
      </section>

      <BlogCategoryNav categories={allCategories} />

      <section className="articles-section" aria-labelledby="articles-title" id="articles">
        <h2 id="articles-title" className="sr-only">
          Latest Articles
        </h2>

        <div className="articles-grid">
          {posts.map((post) => {
            const pTitle = post.title?.rendered ? stripHtml(post.title.rendered) : post.slug;
            const embedded = post as any;
            const media = embedded?._embedded?.["wp:featuredmedia"]?.[0];
            const img = media?.source_url as string | undefined;
            const date = post.date
              ? new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
              : "";
            const author = embedded?._embedded?.author?.[0]?.name as string | undefined;
            const terms = embedded?._embedded?.["wp:term"];
            const firstCat = Array.isArray(terms?.[0]) ? terms[0].find((t: any) => t?.taxonomy === "category") : null;
            const catName = typeof firstCat?.name === "string" ? firstCat.name : "Uncategorized";

            return (
              <article key={post.id} className="article-card">
                <div className="article-card__tag">
                  <span className="label">{catName}</span>
                </div>
                <div className="article-card__image" role="img" aria-label="Article featured image">
                  {img ? <img src={img} alt={pTitle} loading="lazy" /> : null}
                </div>
                <div className="article-card__overlay">
                  <div className="article-card__meta">
                    <span className="article-card__date">{date}</span>
                    <span className="article-card__divider"></span>
                    <span className="article-card__author">{author ?? ""}</span>
                  </div>
                  <h3 className="article-card__title">{pTitle}</h3>
                  <Link href={`/blog/${post.slug}`} className="article-card__footer">
                    <span>Read more</span> <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            );
          })}

          {posts.length === 0 ? (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>
              No articles found in this category.
            </p>
          ) : null}
        </div>

        <div className="blog-disclaimer">
          <p className="blog-disclaimer__text">
            While this blog may occasionally contain information that relates to Unitek College&apos;s programs or courses,
            the majority of information provided within this blog is for general informational purposes only and is not
            intended to represent the specific details of any educational offerings or opinions of Unitek College.
          </p>
          <p className="blog-disclaimer__note">
            *Please note that wage data provided by the Bureau of Labor Statistics (BLS) or other third-party sources may
            not be an accurate reflection of all areas of the country, may not account for the employees&apos; years of
            experience, and may not reflect the wages or outlook of entry-level employees, such as graduates of our
            program.
          </p>
        </div>
      </section>
    </main>
  );
}

