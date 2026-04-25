export type WPPost = {
  id: number;
  date: string;
  slug: string;
  link: string;
  title?: { rendered: string };
  excerpt?: { rendered: string };
  content?: { rendered: string };
  [key: string]: unknown;
};

export type WPPage = {
  id: number;
  date: string;
  slug: string;
  link: string;
  title?: { rendered: string };
  excerpt?: { rendered: string };
  content?: { rendered: string };
  [key: string]: unknown;
};

export type WPCategory = {
  id: number;
  name: string;
  slug: string;
  count?: number;
  [key: string]: unknown;
};

function getWpBaseUrl() {
  // Prefer env so this works across machines/environments.
  // Example: WORDPRESS_BASE_URL=http://localhost/unitek-rebuild
  return (
    process.env.WORDPRESS_BASE_URL?.replace(/\/+$/, "") ??
    "http://localhost/unitek-rebuild"
  );
}

function getWpBasicAuthHeader(): string | undefined {
  const user = process.env.WORDPRESS_APP_USERNAME?.trim();
  const pass = process.env.WORDPRESS_APP_PASSWORD?.trim();
  if (!user || !pass) return undefined;
  return `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
}

export type UnitekThemeOptions = {
  top_bar_enabled?: boolean;
  top_bar_text?: string;
  header_phone?: string;
  header_logo?: { url: string; alt?: string; width?: number | null; height?: number | null } | null;
  mobile_logo?: { url: string; alt?: string; width?: number | null; height?: number | null } | null;
  apply_button_text?: string;
  apply_button_url?: string;
  footer_logo?: { url: string; alt?: string; width?: number | null; height?: number | null } | null;
  footer_copyright?: string;
  footer_description?: string;
  footer_columns?: Array<{ title: string; links: Array<{ label: string; url: string }> }>;
  social_links?: Array<{ icon_class: string; url: string; label?: string }>;
};

export async function fetchUnitekThemeOptions(): Promise<UnitekThemeOptions | null> {
  const baseUrl = getWpBaseUrl();
  const url = new URL(`${baseUrl}/wp-json/unitek/v1/options`);

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  const json = (await res.json().catch(() => null)) as UnitekThemeOptions | null;
  return json;
}

export async function fetchCategories(options?: {
  perPage?: number;
  page?: number;
  query?: Record<string, string | number | boolean | undefined>;
}): Promise<{ categories: WPCategory[]; totalPages: number; total: number }> {
  const baseUrl = getWpBaseUrl();
  const perPage = Math.min(Math.max(options?.perPage ?? 100, 1), 100);
  const page = Math.max(1, Math.floor(options?.page ?? 1));
  const query = options?.query ?? {};

  const url = new URL(`${baseUrl}/wp-json/wp/v2/categories`);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(page));
  url.searchParams.set("hide_empty", "true");
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined) continue;
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `WordPress categories fetch failed (${res.status} ${res.statusText}) for ${url.toString()}\n${body}`,
    );
  }

  const categories = (await res.json()) as WPCategory[];
  const totalPages = Number(res.headers.get("x-wp-totalpages") ?? "1") || 1;
  const total = Number(res.headers.get("x-wp-total") ?? String(categories.length)) || 0;

  return { categories, totalPages, total };
}

export async function fetchPostsPage(options: {
  page: number;
  perPage?: number;
  /**
   * Additional query params supported by WP REST API, e.g. { _embed: "1" }
   */
  query?: Record<string, string | number | boolean | undefined>;
}): Promise<{ posts: WPPost[]; totalPages: number; total: number }> {
  const baseUrl = getWpBaseUrl();
  const perPage = Math.min(Math.max(options.perPage ?? 10, 1), 100);
  const query = options.query ?? {};
  const page = Math.max(1, Math.floor(options.page || 1));

  const url = new URL(`${baseUrl}/wp-json/wp/v2/posts`);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(page));
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined) continue;
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `WordPress posts fetch failed (${res.status} ${res.statusText}) for ${url.toString()}\n${body}`,
    );
  }

  const posts = (await res.json()) as WPPost[];
  const totalPages = Number(res.headers.get("x-wp-totalpages") ?? "1") || 1;
  const total = Number(res.headers.get("x-wp-total") ?? String(posts.length)) || 0;

  return { posts, totalPages, total };
}

export async function fetchPostBySlug(options: {
  slug: string;
  /**
   * Additional query params supported by WP REST API, e.g. { _embed: "1" }
   */
  query?: Record<string, string | number | boolean | undefined>;
}): Promise<WPPost | null> {
  const baseUrl = getWpBaseUrl();
  const slug = options.slug.trim();
  if (!slug) return null;

  const url = new URL(`${baseUrl}/wp-json/wp/v2/posts`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("per_page", "1");
  for (const [k, v] of Object.entries(options.query ?? {})) {
    if (v === undefined) continue;
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `WordPress post fetch failed (${res.status} ${res.statusText}) for ${url.toString()}\n${body}`,
    );
  }

  const posts = (await res.json()) as WPPost[];
  return posts[0] ?? null;
}

export async function fetchPageBySlug(options: {
  slug: string;
  /**
   * Additional query params supported by WP REST API, e.g. { _embed: "1" }
   */
  query?: Record<string, string | number | boolean | undefined>;
}): Promise<WPPage | null> {
  const baseUrl = getWpBaseUrl();
  const slug = options.slug.trim();
  if (!slug) return null;

  const url = new URL(`${baseUrl}/wp-json/wp/v2/pages`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("per_page", "1");
  for (const [k, v] of Object.entries(options.query ?? {})) {
    if (v === undefined) continue;
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `WordPress page fetch failed (${res.status} ${res.statusText}) for ${url.toString()}\n${body}`,
    );
  }

  const pages = (await res.json()) as WPPage[];
  return pages[0] ?? null;
}

export async function fetchPageForBlocksBySlug(options: {
  slug: string;
  /**
   * In WP, block parsing requires raw post_content; this is typically only
   * available via `context=edit` with auth (Application Password).
   */
  preferRaw?: boolean;
}): Promise<{ page: WPPage | null; raw: string | null }> {
  const slug = options.slug.trim();
  if (!slug) return { page: null, raw: null };

  if (options.preferRaw) {
    const baseUrl = getWpBaseUrl();
    const url = new URL(`${baseUrl}/wp-json/wp/v2/pages`);
    url.searchParams.set("slug", slug);
    url.searchParams.set("per_page", "1");
    url.searchParams.set("context", "edit");

    const auth = getWpBasicAuthHeader();
    if (auth) {
      const res = await fetch(url, {
        headers: { Accept: "application/json", Authorization: auth },
      });

      if (res.ok) {
        const pages = (await res.json()) as Array<any>;
        const page = (pages?.[0] ?? null) as WPPage | null;
        const raw =
          typeof (pages?.[0] as any)?.content?.raw === "string"
            ? ((pages?.[0] as any).content.raw as string)
            : null;
        return { page, raw };
      }
    }
  }

  const page = await fetchPageBySlug({ slug, query: { _embed: 1 } });
  return { page, raw: null };
}

export async function fetchAllPosts(options?: {
  perPage?: number;
  /**
   * Additional query params supported by WP REST API, e.g. { _embed: "1" }
   */
  query?: Record<string, string | number | boolean | undefined>;
}): Promise<WPPost[]> {
  const baseUrl = getWpBaseUrl();
  const perPage = Math.min(Math.max(options?.perPage ?? 100, 1), 100);
  const query = options?.query ?? {};

  const all: WPPost[] = [];
  let page = 1;
  let totalPages: number | undefined;

  while (true) {
    const url = new URL(`${baseUrl}/wp-json/wp/v2/posts`);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined) continue;
      url.searchParams.set(k, String(v));
    }

    const res = await fetch(url, {
      // Server-side fetch; Next can cache/revalidate if you want later.
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `WordPress posts fetch failed (${res.status} ${res.statusText}) for ${url.toString()}\n${body}`,
      );
    }

    const posts = (await res.json()) as WPPost[];
    all.push(...posts);

    // WP provides total pages in header; use it if present.
    if (totalPages === undefined) {
      const header = res.headers.get("x-wp-totalpages");
      if (header) {
        const n = Number(header);
        if (!Number.isNaN(n) && n > 0) totalPages = n;
      }
    }

    // Stop conditions:
    // - header-based (authoritative when present)
    // - fallback: last page returns fewer than perPage
    if (totalPages !== undefined) {
      if (page >= totalPages) break;
    } else if (posts.length < perPage) {
      break;
    }

    page += 1;
  }

  return all;
}

export async function fetchRenderedBlock(options: {
  /**
   * Block name in `namespace/name` format, e.g. `acf/get-started-today-dark`
   */
  name: string;
  /**
   * Block attributes (will be passed to WP block renderer endpoint)
   */
  attributes?: Record<string, unknown>;
}): Promise<string> {
  const baseUrl = getWpBaseUrl();
  const name = options.name.trim();
  if (!name) return "";

  const [namespace, blockName] = name.split("/");
  if (!namespace || !blockName) return "";

  const url = new URL(`${baseUrl}/wp-json/wp/v2/block-renderer/${namespace}/${blockName}`);
  if (options.attributes) {
    // WP expects JSON string for `attributes` query param.
    url.searchParams.set("attributes", JSON.stringify(options.attributes));
  }

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    // Non-fatal: if this endpoint isn't enabled, return empty string.
    return "";
  }

  const json = (await res.json().catch(() => null)) as any;
  const rendered = typeof json?.rendered === "string" ? (json.rendered as string) : "";
  return rendered;
}

