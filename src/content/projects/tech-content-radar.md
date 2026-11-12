---
title: "Tech Content Radar"
description: "A bot that collects, ranks and digests tech content about testing, test automation and AI."
tools:
  [
    "Python",
    "pytest",
    "respx",
    "Ruff",
    "GitHub Actions",
    "Claude Code CLI",
    "sentence-transformers",
    "SQLite",
  ]
repoUrl: "https://github.com/RafalSzypulewski/tech-content-radar"
ciUrl: "https://github.com/RafalSzypulewski/tech-content-radar/actions/workflows/tests.yml"
order: 2
---

## What it does

Every 6 hours, a GitHub Actions job collects new items from about 40 sources: blogs, YouTube channels, podcasts, GitHub releases and Hacker News, in English and Polish. It canonicalizes URLs, removes duplicates, detects the language, and drops off-topic items with a weighted keyword score.

A local run then ranks what's left. It pre-ranks items with multilingual embeddings, scores the best ones with an LLM through the `claude` CLI, and groups near-duplicate stories into clusters. It writes a Markdown review digest and sends me an email when it's ready. I tick `keep`, `skip` or `write` for each item. The next run learns from those ticks, and items marked `write` become a roundup draft for this blog.

## What I tested

- A pytest suite of 22 test modules, one per part of the pipeline: collectors (RSS, Hacker News), URL canonicalization, text extraction, language detection, keyword pre-filter, ranking, feedback parsing, digest, drafts, email and CLI.
- No test touches the network or the real LLM. HTTP calls are mocked with `respx`, feeds and pages come from fixtures, and the `claude` CLI is mocked.
- Ruff lint and pytest run on every push and pull request in GitHub Actions.

## Problems I hit

- **Feeds blocking CI runners:** some feeds (Substack among them) reject requests from GitHub Actions. I made the local run collect as well, and set a `.gitattributes` merge rule so raw data files written in both places merge without conflicts.
- **Merge conflicts between CI and local runs:** both sides commit to the same repo. I fixed this with an ownership rule: Actions writes only `data/raw/`, the local run writes only the enriched data, digests and drafts, and both `git pull --rebase` before pushing.
- **Noisy keyword filter:** a plain keyword match let too much through. I replaced it with weighted keyword groups, where generic groups (languages, CI/CD) only count next to a keyword from another group.
- **LLM cost:** scoring runs through the `claude` CLI on a subscription, never the paid API. Every LLM command refuses to run if `ANTHROPIC_API_KEY` is set, so it can't switch to API billing by accident.
