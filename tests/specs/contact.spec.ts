import { test, expect } from "../fixtures";
import { site } from "../data/site";

test.describe("Contact", () => {
  test.beforeEach(async ({ contact }) => {
    await contact.goto();
  });

  test("lists one link per configured profile", async ({ contact }) => {
    await expect(contact.links).toHaveCount(site.socials.length);
  });

  for (const [i, { name, url }] of site.socials.entries()) {
    test(`${name} link points to ${url}`, async ({ contact }) => {
      await expect(contact.links.nth(i)).toHaveAttribute("href", url);
    });
  }
});
