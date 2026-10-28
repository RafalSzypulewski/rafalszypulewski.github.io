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

## Phase 4 — Refactor Playwright tests

Restructure the Phase 2–3 specs around recommended Playwright patterns. Coverage stays the same; how it's organised, where the data comes from, and how failures are reported change. Starts after Phase 3 (`tests/blog.spec.ts`) is merged.

| # | Step | Verify |
| --- | --- | --- |
| 4.1 | **Folder layout:** `tests/specs/`, `tests/pages/`, `tests/fixtures/`, `tests/data/`; point `testDir` at `tests/specs` | Same tests, all green |
| 4.2 | **Data from source:** `tests/data/` exports expected values read from the app instead of hardcoded strings: headings and nav labels from `src/i18n/lang/en.ts`, socials and title from `astro-paper.config.ts`, the post list (slug, title, draft) from `src/content/posts/` frontmatter | Changing a nav label or adding a post needs no test edits |
| 4.3 | **Page objects:** a base `SitePage` (path, `goto()`, h1) used directly for posts and other plain pages, extended by `HomePage`, `BlogIndexPage`, `AboutPage`, `ContactPage`; plus a `Header` component. Selectors live only here (current CSS ids kept; role-based locators not in scope) | No `page.locator(...)` or raw selectors left in specs |
| 4.4 | **Custom fixtures:** `test.extend` provides the page objects, plus `pageAt(path)` for any other page; specs import `test`/`expect` from `tests/fixtures` | Specs take page objects as fixture args, e.g. `({ blogIndex }) =>` |
| 4.5 | **One test per item:** generate a separate test per page, nav link, contact link, and post from 4.2 data, replacing the loops inside single tests | One broken page or post fails only its own test |
| 4.6 | **describe, step, tags:** group by area with `test.describe`; `test.step` in multi-step flows (navigation, post click-through); tag redirect, headings and CV link `@smoke` | `npx playwright test --grep @smoke` runs only the smoke subset; steps show in the HTML report |
| 4.7 | **Config:** `screenshot: "only-on-failure"`, `trace: "retain-on-failure"`; `BASE_URL` env var overrides `baseURL` and skips `webServer` | A forced failure leaves a screenshot and trace in the report; `BASE_URL=https://rafalszypulewski.github.io npx playwright test --grep @smoke` passes against the live site |
| 4.8 | **Tooling:** `eslint-plugin-playwright` (recommended rules) for `tests/**`; add `tests/` and `playwright.config.ts` to the `.prettierignore` allowlist; run `npm run lint` and `npm run format:check` in `test.yml` before Playwright | Lint and format pass locally; a lint error fails the Tests workflow |

Not in scope (considered and left out): role-based locators or `data-testid` attributes, a mobile viewport project, Firefox and WebKit, removing `!` non-null assertions.

**Post-deploy smoke tests** ✅ (follow-up to 4.7): a `smoke` job in `deploy.yml` runs after `deploy` and runs `npm run test:smoke` (`@smoke` tests) against the deployed URL via `BASE_URL`; HTML report uploaded as the `smoke-report` artifact. The site is already live when it runs, so a failure doesn't roll back, but it turns the run and the homepage badge red.

## Optional phases (decide later, any order)

Each one adds a CI job, plus a short blog post if it's worth one.

- **Phase 5 — Accessibility:** ✅ `@axe-core/playwright` scan (WCAG 2.1 A/AA) of every page in the built sitemap, in light and dark themes; fails on serious or critical violations; full results attached to the HTML report. `makeAxeBuilder` fixture, `tests/specs/accessibility.spec.ts`.
- **Phase 6 — Broken links:** ✅ linkinator crawls the built `dist/`. `npm run test:links` checks internal links and `#fragments` and fails the Tests workflow; `npm run test:links:external` also checks external links but only reports (`continue-on-error`), skipping the site's own domain (covered by the internal check) and LinkedIn share links (bot-blocked). Configs: `linkinator.config.json`, `linkinator.external.json`. Found and removed a dead `favicon.ico` link.
- **Phase 7 — Lighthouse CI:** ✅ `@lhci/cli` audits 5 key pages (home, blog index, a post, projects, about) from `dist/`, 3 runs each, median run scored, mobile emulation. Accessibility, best practices and SEO must be ≥ 95 or the Tests workflow fails; performance < 90 only warns (CI runner noise). HTML reports uploaded as the `lighthouse-report` artifact. Config: `lighthouserc.json`; run with `npm run test:lighthouse`. Baseline: performance 98–99, everything else 100.
- **Phase 8 — Visual regression:** Playwright `toHaveScreenshot`, with baselines generated in CI on Linux (Windows renders fonts differently).
- **Phase 9 — Polish version:** add `pl` to the locales, a language switcher, translated UI strings, and Polish content.
- **Phase 10 — Extras:** custom domain (`CNAME` + DNS), GoatCounter or Umami analytics, Giscus comments.

## Content needed from you

The site uses placeholders for these until you provide them:

- [ ] Pitch line for the homepage
- [ ] Short bio and skills list
- [ ] CV PDF
- [ ] LinkedIn URL and contact email
- [ ] Practice-site project: repo URL, CI URL, what you tested, tools used, problems you hit

> Reminder from the brief: don't let the website become the project. Most of your learning time belongs to test automation; the site is the shop window for it.
