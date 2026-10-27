import { test, expect } from "../fixtures";
import { posts, site } from "../data/site";

test.describe("Search", () => {
  for (const { title } of posts) {
    test(`finds "${title}" without page chrome in the excerpt`, async ({
      search,
    }) => {
      await search.search(title);
      const result = search.result(title);

      await expect(result).toBeVisible();
      await expect(search.excerpt(result)).not.toContainText(
        site.editPageLabel
      );
    });
  }
});
