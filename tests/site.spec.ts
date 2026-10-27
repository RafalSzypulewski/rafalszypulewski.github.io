import { test, expect } from "@playwright/test";
import config from "../astro-paper.config";

const pages = [
  { path: "/en/", heading: "Rafal Szypulewski" },
  { path: "/en/projects/", heading: "Projects" },
  { path: "/en/blog/", heading: "Blog" },
  { path: "/en/about/", heading: "About" },
  { path: "/en/contact/", heading: "Contact" },
];

test("root redirects to /en/", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/en/");
});

for (const { path, heading } of pages) {
  test(`${path} loads with its heading`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  });
}

test("header navigation reaches every section", async ({ page }) => {
  await page.goto("/en/");
  const nav = page.locator("#menu-items");

  for (const { path, heading } of pages.slice(1)) {
    await nav.getByRole("link", { name: heading, exact: true }).click();
    await expect(page).toHaveURL(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  }

  await page.getByRole("link", { name: config.site.title }).first().click();
  await expect(page).toHaveURL("/en/");
});

test("contact links point to the configured profiles", async ({ page }) => {
  await page.goto("/en/contact/");
  const links = page.locator("#main-content ul a");

  await expect(links).toHaveCount(config.socials!.length);
  for (const [i, { url }] of config.socials!.entries()) {
    await expect(links.nth(i)).toHaveAttribute("href", url);
  }
});

test("homepage shows the CI status badge", async ({ page }) => {
  await page.goto("/en/");
  const badge = page.getByRole("img", { name: "Tests and deploy status" });

  await expect(badge).toBeVisible();
  await expect(page.locator("a", { has: badge })).toHaveAttribute(
    "href",
    /\/actions$/
  );
});

test("CV link serves a PDF", async ({ page, request }) => {
  await page.goto("/en/about/");
  const href = await page
    .getByRole("link", { name: /download my cv/i })
    .getAttribute("href");

  const response = await request.get(href!);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});
