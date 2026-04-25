import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { fetchUnitekThemeOptions } from "@/app/lib/wordpress";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WP Blog App",
  description: "Next.js + WordPress REST API",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const basePath = process.env.NODE_ENV === "production" ? "/wp-blog-app" : "";

  const localizeWpAsset = (url: string) => {
    const normalized = url.trim();
    const localPrefix = "http://localhost/unitek-rebuild/";
    if (process.env.NODE_ENV !== "production") return normalized;
    if (!normalized.startsWith(localPrefix)) return normalized;
    const rel = normalized.slice(localPrefix.length);
    return `${basePath}/wp-static/${rel}`;
  };

  const options = await fetchUnitekThemeOptions();

  const topBarEnabled =
    options?.top_bar_enabled ?? (process.env.TOP_BAR_ENABLED ?? "").trim() === "1";
  const topBarText =
    (options?.top_bar_text ?? "").trim() ||
    (process.env.TOP_BAR_TEXT ?? "Get info").trim() ||
    "Get info";
  const headerPhone =
    (options?.header_phone ?? "").trim() || (process.env.HEADER_PHONE ?? "").trim();
  const headerLogoUrl =
    (options?.header_logo?.url ?? "").trim() ||
    (process.env.HEADER_LOGO_URL ?? "").trim() ||
    "http://localhost/unitek-rebuild/wp-content/themes/unitekcollage/images/UC-main-logo.png";
  const mobileLogoUrl =
    (options?.mobile_logo?.url ?? "").trim() ||
    (process.env.MOBILE_LOGO_URL ?? "").trim() ||
    headerLogoUrl;
  const applyText =
    (options?.apply_button_text ?? "").trim() ||
    (process.env.APPLY_BUTTON_TEXT ?? "Apply now").trim() ||
    "Apply now";
  const applyUrl =
    (options?.apply_button_url ?? "").trim() ||
    (process.env.APPLY_BUTTON_URL ?? "#").trim() ||
    "#";

  const footerLogoUrl =
    (options?.footer_logo?.url ?? "").trim() ||
    (process.env.FOOTER_LOGO_URL ?? "").trim() ||
    "http://localhost/unitek-rebuild/wp-content/themes/unitekcollage/images/UC-Lndscp-R.png";
  const footerCopyright =
    (options?.footer_copyright ?? "").trim() ||
    (process.env.FOOTER_COPYRIGHT ?? "").trim() ||
    `© ${new Date().getFullYear()} Unitek College. All rights reserved.`;
  const footerDescription =
    (options?.footer_description ?? "").trim() || (process.env.FOOTER_DESCRIPTION ?? "").trim();
  const footerSeparatorImg =
    (process.env.FOOTER_SEPARATOR_IMG_URL ?? "").trim() ||
    "http://localhost/unitek-rebuild/wp-content/themes/unitekcollage/images/1920-Wave.png";

  const footerColumns =
    options?.footer_columns ??
    (() => {
      try {
        const raw = (process.env.FOOTER_COLUMNS_JSON ?? "").trim();
        if (!raw) return [] as Array<{ title: string; links: Array<{ label: string; url: string }> }>;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();

  const footerSocial =
    options?.social_links ??
    (() => {
      try {
        const raw = (process.env.FOOTER_SOCIAL_JSON ?? "").trim();
        if (!raw) return [] as Array<{ icon_class: string; url: string; label?: string }>;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();

  const wpThemeCss = process.env.WORDPRESS_THEME_STYLESHEET_URL?.trim();
  const extraStylesheets =
    process.env.WORDPRESS_EXTRA_STYLESHEET_URLS?.split(",").map((s) => s.trim()).filter(Boolean) ??
    [];
  const extraScripts =
    process.env.WORDPRESS_EXTRA_SCRIPT_URLS?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const wpBlockLibraryCss =
    process.env.WORDPRESS_BLOCK_LIBRARY_STYLE_URL?.trim() ||
    "https://unpkg.com/@wordpress/block-library@9.44.0/build-style/style.css";
  const wpBlockLibraryThemeCss =
    process.env.WORDPRESS_BLOCK_LIBRARY_THEME_URL?.trim() ||
    "https://unpkg.com/@wordpress/block-library@9.44.0/build-style/theme.css";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href={wpBlockLibraryCss} />
        <link rel="stylesheet" href={wpBlockLibraryThemeCss} />
        {wpThemeCss ? <link rel="stylesheet" href={localizeWpAsset(wpThemeCss)} /> : null}
        {extraStylesheets.map((href) => (
          <link key={href} rel="stylesheet" href={localizeWpAsset(href)} />
        ))}
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        {extraScripts.map((src) => (
          <Script key={src} src={localizeWpAsset(src)} strategy="afterInteractive" />
        ))}

        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {topBarEnabled ? (
          <div className="top-bar">
            <div className="top-bar-container">
              <div className="top-bar-left" />
              <div className="top-bar-right">
                <a href="#" className="top-bar-link">
                  <span className="info-icon-circle" aria-hidden="true">
                    i
                  </span>
                  {topBarText}
                </a>

                <div className="top-bar-separator" />

                <button className="top-bar-icon search-toggle" aria-label="Search">
                  Search
                </button>

                <div className="top-bar-separator" />

                {headerPhone ? (
                  <a
                    href={`tel:${headerPhone}`}
                    className="top-bar-icon"
                    aria-label="Phone"
                  >
                    Phone
                  </a>
                ) : null}

                <div className="top-bar-separator" />
              </div>
            </div>
          </div>
        ) : null}

        <header className="header">
          <div className="header-container">
            <div className="header-logo">
              <Link href="/" rel="home" className="logo-link desktop-logo">
                <img src={headerLogoUrl} alt="Site Logo" />
              </Link>
              <Link href="/" rel="home" className="logo-link mobile-logo">
                <img src={mobileLogoUrl} alt="Site Logo" />
              </Link>
            </div>

            <nav className="header-nav" role="navigation" aria-label="Primary Menu">
              <ul className="nav-list">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/categories">Categories</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </nav>

            <div className="header-cta">
              <a href={applyUrl} className="btn-apply">
                {applyText} <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="mobile-header-right">
              {headerPhone ? (
                <a
                  href={`tel:${headerPhone}`}
                  className="mobile-header-icon mobile-phone-icon"
                  aria-label="Phone"
                >
                  Phone
                </a>
              ) : null}

              <div className="mobile-header-separator" />

              <button className="mobile-menu-toggle" aria-label="Toggle mobile menu">
                <span />
                <span />
                <span />
              </button>

              <button
                className="mobile-header-icon mobile-menu-close-btn"
                aria-label="Close mobile menu"
              >
                ✕
              </button>
            </div>
          </div>
        </header>

        <div className="search-overlay" id="searchOverlay">
          <div className="search-overlay-container">
            <div className="search-overlay-content">
              <div className="search-logo">
                <div className="search-logo-icon">
                  <img
                    src="http://localhost/unitek-rebuild/wp-content/themes/unitekcollage/images/UC-Side-Stack.png"
                    alt="Unitek College Logo"
                  />
                </div>
              </div>

              <div className="search-prompt">
                <h2 className="search-prompt-text">What can we help you find?</h2>
              </div>

              <form className="search-form-overlay" role="search" method="get" action="/">
                <div className="search-input-container">
                  <input
                    type="search"
                    className="search-input-field"
                    placeholder="Search programs"
                    name="s"
                    autoComplete="off"
                    required
                    minLength={2}
                    aria-label="Search programs"
                  />
                  <button type="submit" className="search-submit-btn" aria-label="Search">
                    Search
                  </button>
                </div>
                <div className="search-results" id="searchResults" />
              </form>

              <button className="search-close-btn" aria-label="Close search">
                ✕
              </button>
            </div>
          </div>
        </div>

        <main className="mx-auto w-full flex-1 px-6 py-10">
          {children}
        </main>

        <div className="saparator">
          <img src={footerSeparatorImg} alt="Unitek College" className="saparator-img" />
        </div>

        <footer className="footer">
          <div className="footer-container">
            <div className="footer-logo">
              <img src={footerLogoUrl} alt="Unitek College" className="footer-logo-img" />
            </div>

            <div className="footer-links">
              {footerColumns.map((col, idx) => (
                <div key={`${col?.title ?? "col"}-${idx}`} className="footer-column">
                  {col?.title ? <h4>{col.title}</h4> : null}
                  {Array.isArray(col?.links) && col.links.length ? (
                    <ul>
                      {col.links.map((l: { label: string; url: string }, i: number) =>
                        l?.label && l?.url ? (
                          <li key={`${l.url}-${i}`}>
                            <a href={l.url}>{l.label}</a>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="footer-social">
              {footerSocial.map((s, idx) =>
                s?.url ? (
                  <a
                    key={`${s.url}-${idx}`}
                    href={s.url}
                    className="social-icon"
                    aria-label={s.label || "Follow us on social media"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.icon_class ? <i className={s.icon_class} /> : null}
                  </a>
                ) : null,
              )}
            </div>

            {footerCopyright ? (
              <div className="footer-copyright">
                <p>{footerCopyright}</p>
              </div>
            ) : null}

            {footerDescription ? (
              <div className="footer-description">
                <p style={{ textAlign: "center" }}>{footerDescription}</p>
              </div>
            ) : null}
          </div>
        </footer>
      </body>
    </html>
  );
}
