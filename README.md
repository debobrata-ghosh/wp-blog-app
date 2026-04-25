<<<<<<< HEAD
<<<<<<< HEAD
# wp-blog-app
This project is a **Next.js App Router** frontend that renders content from a local WordPress site (Gutenberg + ACF blocks) while reusing your **WordPress theme CSS/JS** for the same look &amp; feel.
=======
=======
# WP Blog App (Next.js + WordPress / Gutenberg / ACF)

This project is a **Next.js App Router** frontend that renders content from a local WordPress site (Gutenberg + ACF blocks) while reusing your **WordPress theme CSS/JS** for the same look & feel.

## What’s inside

- **Home page (`/`)**: renders the WP page by slug `HOME_PAGE_SLUG` (default `home`)
- **Blog page (`/blog`)**: matches your theme’s `blog.php` layout (hero + category filter/search + cards + load more)
- **Single post (`/blog/[slug]`)**: matches your theme’s `single.php` layout (nav + header + content + share + related + “Get Started Today (Dark)”)
- **Gutenberg renderer**: parses Gutenberg blocks (when raw content is available) and maps blocks to React components
- **ACF block mapping**: `acf/*` blocks are mapped to React components (example included for `acf/hero`)
- **Theme styling**: loads WordPress theme + per-block CSS (and optional JS) via URLs

## Requirements

### 1) WordPress (local)

- Running at: `WORDPRESS_BASE_URL` (example: `http://localhost/unitek-rebuild`)
- Permalinks set normally (WP REST enabled)
- ACF installed and your theme active: `unitekcollage`

### 2) Node.js

- Install dependencies with npm

## Setup

From the `wp-blog-app/` directory:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables (`.env.local`)

This app reads environment variables from `wp-blog-app/.env.local`.

### Core

- **`WORDPRESS_BASE_URL`**: base URL of WordPress  
  Example: `http://localhost/unitek-rebuild`
- **`HOME_PAGE_SLUG`**: WP page slug used for `/`  
  Example: `home`
- **`BLOG_PAGE_SLUG`**: reserved slug value (kept for consistency)  
  Example: `blog`

### Styling (recommended for “same look & feel”)

- **`WORDPRESS_THEME_STYLESHEET_URL`**: your theme’s main stylesheet  
  Example: `http://localhost/unitek-rebuild/wp-content/themes/unitekcollage/style.css`
- **`WORDPRESS_EXTRA_STYLESHEET_URLS`**: comma-separated list of extra CSS (usually block CSS)  
  Example: `http://localhost/.../template-parts/blocks/hero/style.css,...`

The app also loads core Gutenberg CSS by default:

- `@wordpress/block-library` `style.css` and `theme.css` via CDN (no React peer-dep install needed)

### Scripts (optional)

- **`WORDPRESS_EXTRA_SCRIPT_URLS`**: comma-separated list of JS files to load globally  
  Example:  
  `http://localhost/unitek-rebuild/wp-content/themes/unitekcollage/script.js,http://localhost/.../blocks/faq/index.js`

Notes:
- Any `<script>` tags inside WP HTML are **stripped** before rendering in React (React won’t execute them anyway).
- Prefer adding scripts via `WORDPRESS_EXTRA_SCRIPT_URLS`.

### WordPress Application Password (optional, improves Gutenberg parsing)

If you add these, the app can fetch `context=edit` and parse **raw Gutenberg blocks** (better for ACF/custom blocks):

- **`WORDPRESS_APP_USERNAME`**
- **`WORDPRESS_APP_PASSWORD`**

## ACF Options in Header/Footer (important)

Your WordPress theme uses ACF **Options Page** fields (logo, phone, footer columns, etc.).  
WordPress does **not** expose ACF options over REST by default, so we added a small theme REST endpoint:

`GET /wp-json/unitek/v1/options`

Implemented in:

- `C:\xampp\htdocs\unitek-rebuild\wp-content\themes\unitekcollage\functions.php`

Next.js reads those values in:

- `app/lib/wordpress.ts` → `fetchUnitekThemeOptions()`
- `app/layout.tsx` → uses options first, then falls back to env vars

## Gutenberg / ACF block rendering

### Parser

- `app/lib/gutenberg.ts` uses `@wordpress/block-serialization-default-parser` to parse raw blocks.

### Renderer

- `app/components/GutenbergRenderer.tsx` renders core blocks and routes `acf/*` blocks to a registry.

### ACF block mapping

Add mappings here:

- `app/components/acf/acfBlocks.tsx`

Example implemented:

- `acf/hero` → `app/components/acf/blocks/HeroBlock.tsx`

## Common troubleshooting

### “npm run dev” fails with package.json not found

Run it inside the app folder:

```powershell
cd C:\Users\Debabrata\Desktop\projects\Next-app-wp\wp-blog-app
npm run dev
```

### Styles/scripts not updating

If you changed `.env.local`, you must restart dev server:

```bash
npm run dev
```

### WP REST errors

- Confirm `WORDPRESS_BASE_URL/wp-json/wp/v2/posts` works in browser.
- Some REST params are not supported (example: `orderby=rand`); the frontend avoids unsupported params.

>>>>>>> 158c9a4 (all code changes)
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 56691c3 (Initial commit from Create Next App)
