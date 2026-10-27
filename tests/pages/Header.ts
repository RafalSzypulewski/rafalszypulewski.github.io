import type { Locator, Page } from "@playwright/test";
import { site } from "../data/site";

export class Header {
  readonly homeLink: Locator;
  private readonly menu: Locator;

  constructor(page: Page) {
    this.homeLink = page
      .locator("header")
      .getByRole("link", { name: site.title, exact: true });
    this.menu = page.locator("#menu-items");
  }

  navLink(label: string) {
    return this.menu.getByRole("link", { name: label, exact: true });
  }
}
