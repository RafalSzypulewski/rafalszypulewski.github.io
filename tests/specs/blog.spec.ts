import { test, expect } from "../fixtures";
import { posts, postsPerPage } from "../data/site";

test.describe("Blog", () => {
  test("index lists the newest posts", async ({ blogIndex }) => {
    await blogIndex.goto();

    await expect(blogIndex.postLinks).toHaveCount(
      Math.min(posts.length, postsPerPage)
    );
  });

  test("clicking a post on the index opens it", async ({
    page,
    blogIndex,
    pageAt,
  }) => {
    const first = blogIndex.postLinks.first();
    let title = "";
    let href = "";

    await test.step("open the blog index", async () => {
      await blogIndex.goto();
      title = (await first.innerText()).trim();
      href = (await first.getAttribute("href"))!;
    });

    await test.step("click the first post", async () => {
      await first.click();
    });

    await test.step("the post opens with its title", async () => {
      await expect(page).toHaveURL(href);
      await expect(pageAt(href).heading).toHaveText(title);
    });
  });

  for (const { title, path } of posts) {
    test.describe(`post "${title}"`, () => {
      test(`opens at ${path}`, async ({ pageAt }) => {
        const post = pageAt(path);
        const response = await post.goto();

        expect(response?.status()).toBe(200);
        await expect(post.heading).toHaveText(title);
      });

      test("is in the RSS feed", async ({ request }) => {
        const response = await request.get("/en/rss.xml");
        expect(response.status()).toBe(200);

        const feed = await response.text();
        expect(feed).toContain(`<title>${title}</title>`);
        expect(feed).toContain(`${path}</link>`);
      });
    });
  }
});
