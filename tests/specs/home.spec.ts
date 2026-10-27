import { test, expect } from "../fixtures";

test.describe("Home", () => {
  test("shows the CI status badge", async ({ home }) => {
    await home.goto();

    await expect(home.ciBadge).toBeVisible();
    await expect(home.ciBadgeLink).toHaveAttribute("href", /\/actions$/);
  });
});
