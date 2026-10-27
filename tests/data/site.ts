// Expected values read from the site's own source, so content changes don't need test edits.
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import config from "../../astro-paper.config";
import t from "../../src/i18n/lang/en";

const SCHEDULED_POST_MARGIN =
  config.posts?.scheduledPostMargin ?? 15 * 60 * 1000;

function frontmatter(file: string): Record<string, unknown> {
  const match = readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? parse(match[1]) : {};
}

export const site = {
  title: config.site.title,
  socials: config.socials ?? [],
  editPageLabel: t.post.editPage,
};

export const pages = {
  home: { path: "/en/", heading: config.site.title },
  projects: { path: "/en/projects/", heading: t.nav.projects },
  blog: { path: "/en/blog/", heading: t.pages.postsTitle },
  about: {
    path: "/en/about/",
    heading: String(frontmatter("src/content/pages/about.md").title),
  },
  contact: { path: "/en/contact/", heading: t.nav.contact },
};

export const navLinks = [
  { label: t.nav.projects, page: pages.projects },
  { label: t.nav.posts, page: pages.blog },
  { label: t.nav.about, page: pages.about },
  { label: t.nav.contact, page: pages.contact },
];

const POSTS_DIR = "src/content/posts";

// Mirrors src/utils/postFilter.ts: no drafts, no posts scheduled for later.
export const posts = readdirSync(POSTS_DIR)
  .filter(file => /^[^_].*\.mdx?$/.test(file))
  .map(file => {
    const data = frontmatter(`${POSTS_DIR}/${file}`);
    const slug = file.replace(/\.mdx?$/, "").toLowerCase();
    return {
      slug,
      path: `/en/blog/${slug}/`,
      title: String(data.title),
      draft: data.draft === true,
      pubDatetime: new Date(String(data.pubDatetime)),
    };
  })
  .filter(
    ({ draft, pubDatetime }) =>
      !draft && pubDatetime.getTime() - SCHEDULED_POST_MARGIN < Date.now()
  );

export const postsPerPage = config.posts?.perPage ?? 4;

// Every page the site publishes, from the built sitemap (needs `npm run build`).
export const sitemapPaths = readdirSync("dist")
  .filter(file => /^sitemap-\d+\.xml$/.test(file))
  .flatMap(file =>
    [
      ...readFileSync(`dist/${file}`, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g),
    ].map(([, url]) => new URL(url).pathname)
  );
