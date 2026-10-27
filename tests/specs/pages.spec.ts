import { test, expect } from "../fixtures";
import { pages } from "../data/site";

test.describe("Pages", () => {
  test(
    "root redirects to /en/",
    { tag: "@smoke" },
    async ({ page, pageAt }) => {
      await pageAt("/").goto();
      await expect(page).toHaveURL(pages.home.path);
    }
  );

  for (const { path, heading } of Object.values(pages)) {
    test(
      `${path} loads with its heading`,
      { tag: "@smoke" },
      async ({ pageAt }) => {
        const sitePage = pageAt(path);
        const response = await sitePage.goto();

        expect(response?.status()).toBe(200);
        await expect(sitePage.heading).toHaveText(heading);
      }
    );
  }
});
