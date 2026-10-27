import type { Locator, Page } from "@playwright/test";
import { pages } from "../data/site";
import { SitePage } from "./SitePage";

export class HomePage extends SitePage {
  readonly ciBadge: Locator;
  readonly ciBadgeLink: Locator;

  constructor(page: Page) {
    super(page, pages.home.path);
    this.ciBadge = page.getByRole("img", { name: "Tests and deploy status" });
    this.ciBadgeLink = page.locator("a", { has: this.ciBadge });
  }
}
