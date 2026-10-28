# rafalszypulewski.github.io

[![Tests and deploy](https://github.com/RafalSzypulewski/rafalszypulewski.github.io/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/RafalSzypulewski/rafalszypulewski.github.io/actions)

Personal portfolio and blog of a QA automation engineer, live at
**https://rafalszypulewski.github.io**.

The site is also a test automation project: every change is linted, link-checked,
end-to-end tested, scanned for accessibility and audited with Lighthouse before it
deploys, then smoke-tested again on the live site.

## Stack

- [Astro](https://astro.build) (TypeScript) on the [AstroPaper](https://github.com/satnaing/astro-paper) theme
- Tailwind CSS, Pagefind search, RSS, generated OG images
- Playwright, axe-core, linkinator, Lighthouse CI
- GitHub Actions and GitHub Pages

## Getting started

Requires Node.js 22.12 or newer.

```bash
npm ci
npm run dev       # http://localhost:4321
npm run build     # type-check, build to dist/, build the search index
npm run preview   # serve dist/
```

All pages live under `/en/`; `/` redirects there. The structure is ready for a
Polish version under `/pl/`.

## Scripts

| Script                        | What it does                                               |
| ----------------------------- | ---------------------------------------------------------- |
| `npm run dev`                 | Dev server with hot reload                                 |
| `npm run build`               | `astro check`, production build to `dist/`, Pagefind index |
| `npm run preview`             | Serves the built `dist/`                                   |
| `npm run lint`                | ESLint, including Playwright rules for `tests/`            |
| `npm run format:check`        | Prettier check (`npm run format` to fix)                   |
| `npm run test:e2e`            | All Playwright tests against the local build               |
| `npm run test:smoke`          | Only the `@smoke` tests                                    |
| `npm run test:links`          | Internal links and `#anchors` in `dist/`                   |
| `npm run test:links:external` | Internal and external links (reports only in CI)           |
| `npm run test:lighthouse`     | Lighthouse on 5 key pages, reports to `lighthouse-report/` |

The test scripts work on the built site, so run `npm run build` first.

## Tests

Playwright tests live in `tests/`:

```text
tests/
├── data/       expected values read from the site's own source
├── fixtures/   test.extend fixtures: page objects, pageAt(path), makeAxeBuilder
├── pages/      page objects (SitePage base, Home, BlogIndex, About, Contact, Search, Header)
└── specs/      one file per area
```

- **Data from source:** headings and labels come from `src/i18n/lang/en.ts`, links
  from `astro-paper.config.ts`, posts from their frontmatter, and the page list
  from the built sitemap. Adding a post or renaming a label needs no test changes.
- **One test per item:** each page, nav link, contact link and post gets its own
  test, so one failure doesn't hide the rest.
- **Accessibility:** every sitemap page is scanned with axe (WCAG 2.1 A and AA) in
  light and dark themes; serious or critical violations fail.
- **Failures** keep a screenshot and a trace in the HTML report
  (`npx playwright show-report`).
- **Live site:** set `BASE_URL` to test a deployed site instead of the local build:

  ```bash
  BASE_URL=https://rafalszypulewski.github.io npm run test:smoke
  ```

Lighthouse budgets (`lighthouserc.json`): accessibility, best practices and SEO
must score at least 95; performance below 90 only warns because CI runners are noisy.

## CI/CD

- **`test.yml`** runs on every pull request (opened, reopened, new commits): lint,
  format check, build, internal links (blocking), external links (report only),
  Playwright, Lighthouse. Reports are uploaded as `playwright-report` and
  `lighthouse-report` artifacts.
- **`deploy.yml`** runs on every push to `main`: the same tests, then build and
  deploy to GitHub Pages, then the `@smoke` tests against the live URL
  (`smoke-report` artifact). A failing test blocks the deploy; a failing smoke test
  turns the run and the badge red.

## Content

| What                    | Where                        |
| ----------------------- | ---------------------------- |
| Blog posts              | `src/content/posts/*.md`     |
| Projects                | `src/content/projects/*.md`  |
| About page              | `src/content/pages/about.md` |
| CV                      | `public/cv.pdf`              |
| Title, socials, options | `astro-paper.config.ts`      |
| UI strings              | `src/i18n/lang/en.ts`        |

Posts with `draft: true` or a future `pubDatetime` aren't published.

## Roadmap

See [PLAN.md](PLAN.md) for the phases done so far and what's next.

## Notes for Windows

With `core.autocrlf=true`, files are checked out with CRLF line endings, so
`npm run format:check` flags many files locally. CI checks out LF endings, where
the same check passes.

## License

[MIT](LICENSE). Based on the AstroPaper theme by Sat Naing.
