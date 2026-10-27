import { test, expect } from "../fixtures";
import { sitemapPaths } from "../data/site";

const BLOCKING_IMPACTS = ["serious", "critical"];

// Both themes, since colour contrast differs between them.
for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`Accessibility (${colorScheme} theme)`, () => {
    test.use({ colorScheme });

    for (const path of sitemapPaths) {
      test(`${path} has no serious or critical violations`, async ({
        pageAt,
        makeAxeBuilder,
      }, testInfo) => {
        await pageAt(path).goto();
        const results = await makeAxeBuilder().analyze();

        await testInfo.attach("axe-results", {
          body: JSON.stringify(results.violations, null, 2),
          contentType: "application/json",
        });

        const blocking = results.violations
          .filter(({ impact }) => BLOCKING_IMPACTS.includes(impact ?? ""))
          .map(({ id, impact, help, nodes }) => ({
            id,
            impact,
            help,
            targets: nodes.map(({ target }) => target.join(" ")),
          }));
        expect(blocking).toEqual([]);
      });
    }
  });
}
