import type { Locator, Page } from "@playwright/test";
import { pages } from "../data/site";
import { SitePage } from "./SitePage";

export class AboutPage extends SitePage {
  readonly cvLink: Locator;

  constructor(page: Page) {
    super(page, pages.about.path);
    this.cvLink = page.getByRole("link", { name: /download my cv/i });
  }
}
