---
title: "PW Practice Lab"
description: "A static practice website for test automation, with its own Playwright and k6 test suites."
tools:
  [
    "Playwright",
    "TypeScript",
    "k6",
    "axe-core",
    "ESLint",
    "GitHub Actions",
    "GitHub Pages",
  ]
repoUrl: "https://github.com/RafalSzypulewski/TrainingWebsite"
ciUrl: "https://github.com/RafalSzypulewski/TrainingWebsite/actions/workflows/tests.yml"
order: 3
---

## What it is

A website I built to practice test automation on, live at [rafalszypulewski.github.io/TrainingWebsite](https://rafalszypulewski.github.io/TrainingWebsite/). It's plain HTML, CSS and vanilla JavaScript with no backend: state lives in `localStorage`, `sessionStorage` and cookies, and static JSON files play the server.

The pages cover what UI tests usually have to deal with: forms and login validation, dynamic content, tables, alerts, windows and frames, mouse and keyboard actions, downloads, mocked network calls, accessibility, responsive layouts, and a "tricky" page with hard-to-automate elements. A mini shop adds a full flow (catalogue, product, cart, checkout, confirmation), and the Performance pages work against a local practice API built for k6 load testing.

## What I tested

- About 300 Playwright tests in 27 spec files, grouped like the site's navigation menu, plus contract tests for the practice API.
- A custom fixture fails any test in which the page logs a `console.error` or throws an uncaught exception, so silent JavaScript bugs show up as failures. Tests that trigger errors on purpose allow them narrowly, per endpoint.
- A crawl test requests every internal link, image, script, stylesheet and frame, and axe-core checks accessibility.
- `@smoke` tests run against the live site after every deploy, and a nightly workflow runs the whole suite three times against it, reporting tests that only pass on retry as flaky.
- k6 smoke, load and stress scripts written in TypeScript, plus six guided exercises (thresholds, data correlation, custom metrics, open vs closed models, resilience) with solutions that run in CI.
- Strict TypeScript type-checking and ESLint with Playwright rules, including `no-floating-promises` to catch un-awaited actions, run before the tests in CI.

## Problems I hit

- **Flaky k6 timing check:** the smoke script asserted that `/api/slow?ms=100` took at least 100 ms. Node timers can fire a few milliseconds early on a busy Linux runner, so it sometimes measured 99.x ms and failed. The check now uses the delay the server reports, with a 90 ms sanity bound.
- **Unclear k6 failures in CI:** when a k6 script failed, the only thing CI showed was the exit code. The runner now explains which thresholds or checks failed, with the observed values, and adds GitHub annotations so the reason shows on the pull request.
- **Duplicated page scripts:** the same helpers were copied across up to 16 files. I moved them into one shared library and added tests for it.
- **Testing a static site against a real server:** the Performance pages had to find the local practice API without making any failing requests on GitHub Pages. The practice server marks its responses with a `Server-Timing` header, and the pages look for it.
