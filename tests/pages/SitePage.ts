import type { Locator, Page } from "@playwright/test";

/** Any page at a fixed path with one h1. Specific pages extend it. */
export class SitePage {
  readonly heading: Locator;

  constructor(
    protected readonly page: Page,
    readonly path: string
  ) {
    this.heading = page.getByRole("heading", { level: 1 });
  }

  goto() {
    return this.page.goto(this.path);
  }
}
