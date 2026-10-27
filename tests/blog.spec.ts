import { test, expect, type Page } from "@playwright/test";

async function listedPosts(page: Page) {
  await page.goto("/en/blog/");
  const links = page.locator("#main-content > ul > li > a");
  await expect(links.first()).toBeVisible();

  return Promise.all(
    (await links.all()).map(async link => ({
      title: (await link.innerText()).trim(),
      href: (await link.getAttribute("href"))!,
    }))
  );
}

test("blog index lists posts and each one opens", async ({ page }) => {
  const posts = await listedPosts(page);

  for (const { title, href } of posts) {
    const response = await page.goto(href);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
  }
});

test("clicking a post on the index opens it", async ({ page }) => {
  const [{ title, href }] = await listedPosts(page);

  await page.getByRole("link", { name: title }).first().click();
  await expect(page).toHaveURL(href);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
});

test("RSS feed lists the posts", async ({ page, request }) => {
  const posts = await listedPosts(page);
  const response = await request.get("/en/rss.xml");
  expect(response.status()).toBe(200);

  const feed = await response.text();
  for (const { title, href } of posts) {
    expect(feed).toContain(`<title>${title}</title>`);
    expect(feed).toContain(`${href}</link>`);
  }
});
