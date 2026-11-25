# semii website

The marketing site and documentation for [semii](https://github.com/AhmadRaza-Khan/semii),
built with [Astro](https://astro.build) as a static site and hosted on Vercel.

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview
```

## Docs come from the framework

The pages under `/docs`, the changelog and the logo are copied from the framework
repository, which sits next to this one:

```sh
npm run sync                       # reads ../ (the framework checkout)
FRAMEWORK=/path/to/semii npm run sync
```

Commit the synced files: Vercel builds this repo on its own.

## Deploy

Import the repository in Vercel; the Astro preset needs no settings. Canonical URLs
and the sitemap use the Vercel production domain, or `SITE_URL` when set
(for example `SITE_URL=https://semii.dev` once a custom domain is added).

## Layout

- `src/pages/` — home, docs, blog, changelog, 404, robots.txt
- `src/layouts/` — the base layout (SEO tags, structured data) and the docs layout
- `src/components/` — header, footer, terminal demo, code showcase
- `src/content/docs/` — synced docs; `src/content/blog/` — posts
- `src/site.ts` — version, install command and links shared by all pages
