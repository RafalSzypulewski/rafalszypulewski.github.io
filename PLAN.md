# Personal Brand Website — Implementation Plan

Portfolio + blog for a software engineer in test, hosted on GitHub Pages.
Source brief: `D:\Personal Brand Website Plan.md` (Oct 27, 2026).

## Decisions

| Topic | Decision |
| --- | --- |
| Generator | Astro (TypeScript) |
| Theme | [AstroPaper](https://github.com/satnaing/astro-paper) (MIT) — [demo](https://astro-paper.pages.dev/) |
| URL | `https://rafalszypulewski.github.io` (custom domain later) |
| Languages | English first; i18n structure from day one so Polish can be added cheaply |
| URL scheme | `/en/...` and `/pl/...`; `/` is a static instant-redirect page to `/en/` (Astro-generated, since Pages has no server redirects) |
| Content | Placeholders until real content is provided |
| Tests | Playwright E2E first; each other check is its own optional phase, decided later |
| Deploy | GitHub Actions (`withastro/action` + `actions/deploy-pages`) |
| Repo layout | Astro project at the repo root |
| Package manager | npm |
| Theme extras kept | Search, tags, archives, OG images |
| Workflow | Changes left uncommitted for manual review (CLAUDE.md §5) |

## Phase 1 — Launch

| # | Step | Verify |
| --- | --- | --- |
| 1.1 | Scaffold from the AstroPaper template; set `site` in `astro.config` | `npm run build` passes |
| 1.2 | Configure Astro i18n: `locales: ["en"]`, `prefixDefaultLocale: true`; move routes under `/en/`; put UI strings in a dictionary file | `/en/` renders; `/` redirects to `/en/` |
| 1.3 | Fit the theme to the 5 sections in the brief; keep search, tags, archives, and OG images | Only the agreed pages exist in `dist/` |
| 1.4 | **Home:** one-line pitch (placeholder) and links to Projects and CV | Text renders |
| 1.5 | **Projects:** new content collection (title, summary, tools, problems, repo URL, CI URL) with one placeholder entry | `/en/projects/<slug>` renders |
| 1.6 | **About/CV:** bio, skills, and a download link to `public/cv.pdf` (placeholder) | The link resolves |
| 1.7 | **Contact:** LinkedIn, GitHub, and `mailto:` links (placeholders) | The links are present |
| 1.8 | `.github/workflows/deploy.yml` using GitHub Actions. You set Pages → Source to "GitHub Actions" in repo settings | The site is live after the merge to `main` |

## Phase 2 — Playwright E2E + CI

| # | Step | Verify |
| --- | --- | --- |
| 2.1 | Add Playwright (TypeScript); `webServer` runs `astro preview` | `npx playwright test` runs locally |
| 2.2 | Specs: navigation between all sections, every page loads with the expected heading, contact links have the correct `href`s, the CV link works, `/` redirects to `/en/` | Specs are green |
| 2.3 | `test.yml` workflow on every push and PR; uploads the HTML report as an artifact | Workflow is green on GitHub |
| 2.4 | Deploy depends on the tests passing | A failing test blocks deploy |
| 2.5 | CI status badge on the homepage, linking to the Actions runs | The badge is visible |

## Phase 3 — Blog

| # | Step | Verify |
| --- | --- | --- |
| 3.1 | Blog posts as Markdown in `src/content/posts/`, served at `/en/blog/<slug>/` | A sample post renders |
| 3.2 | RSS feed and tags (whatever AstroPaper already provides, adjusted for `/en/`) | The feed validates |
| 3.3 | First post, written by you: "Testing my own portfolio site" | Published |
| 3.4 | E2E spec: the blog index lists posts and each post opens | Spec is green |

Cadence after launch: one short post every 2–3 weeks.

## Optional phases (decide later, any order)

Each one adds a CI job, plus a short blog post if it's worth one.

- **Phase 4 — Accessibility:** `@axe-core/playwright` scan on every page; fail on serious or critical violations.
- **Phase 5 — Broken links:** a link checker (e.g. lychee or linkinator) run against the built `dist/`, including external links in blog posts.
- **Phase 6 — Lighthouse CI:** `@lhci/cli` with budgets for performance, accessibility, SEO, and best practices.
- **Phase 7 — Visual regression:** Playwright `toHaveScreenshot`, with baselines generated in CI on Linux (Windows renders fonts differently).
- **Phase 8 — Polish version:** add `pl` to the locales, a language switcher, translated UI strings, and Polish content.
- **Phase 9 — Extras:** custom domain (`CNAME` + DNS), GoatCounter or Umami analytics, Giscus comments.

## Content needed from you

The site uses placeholders for these until you provide them:

- [ ] Pitch line for the homepage
- [ ] Short bio and skills list
- [ ] CV PDF
- [ ] LinkedIn URL and contact email
- [ ] Practice-site project: repo URL, CI URL, what you tested, tools used, problems you hit

> Reminder from the brief: don't let the website become the project. Most of your learning time belongs to test automation; the site is the shop window for it.
