import { test, expect } from "../fixtures";
import { navLinks, pages } from "../data/site";

test.describe("Header navigation", () => {
  for (const { label, page: target } of navLinks) {
    test(`"${label}" opens ${target.path}`, async ({
      page,
      home,
      header,
      pageAt,
    }) => {
      await home.goto();
      await header.navLink(label).click();

      await expect(page).toHaveURL(target.path);
      await expect(pageAt(target.path).heading).toHaveText(target.heading);
    });
  }

  test("site title returns home", async ({ page, contact, header }) => {
    await contact.goto();
    await header.homeLink.click();

    await expect(page).toHaveURL(pages.home.path);
  });
});
