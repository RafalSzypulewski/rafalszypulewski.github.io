import { test, expect } from "../fixtures";

test.describe("About", () => {
  test(
    "CV link serves a PDF",
    { tag: "@smoke" },
    async ({ about, request }) => {
      await about.goto();
      const href = await about.cvLink.getAttribute("href");

      const response = await request.get(href!);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("application/pdf");
    }
  );
});
