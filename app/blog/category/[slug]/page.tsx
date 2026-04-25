import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCategoryNav } from "@/app/components/blog/BlogCategoryNav";
import { fetchCategories, fetchPostsPage } from "@/app/lib/wordpress";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export async function generateStaticParams() {
  const { categories } = await fetchCategories({ perPage: 100 });
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function BlogCategoryPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const { categories } = await fetchCategories({ perPage: 100 });
  const active = categories.find((c) => c.slug === slug);
  if (!active) notFound();

  const { posts } = await fetchPostsPage({
    page: 1,
    perPage: 9,
    query: { _embed: 1, order: "desc", orderby: "date", categories: active.id },
  });

  return (
    <main id="main-content" className="page-template-blog" role="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__container">
          <div className="hero__content">
            <h1 className="hero__title" id="hero-title">
              {active.name}
            </h1>
            <p className="hero__subtitle">Latest articles in {active.name}.</p>
            <Link href="/blog" className="btn-link" aria-label="Back to all articles">
              Browse all articles <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hero__image" aria-hidden="true">
            {"[ Image ]"}
          </div>
        </div>
      </section>

      <BlogCategoryNav categories={categories} />

      <section className="articles-section" aria-labelledby="articles-title" id="articles">
        <h2 id="articles-title" className="sr-only">
          Articles
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

            return (
              <article key={post.id} className="article-card">
                <div className="article-card__tag">
                  <span className="label">{active.name}</span>
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
      </section>
    </main>
  );
}

