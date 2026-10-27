import type { Locator, Page } from "@playwright/test";
import { pages } from "../data/site";
import { SitePage } from "./SitePage";

export class ContactPage extends SitePage {
  readonly links: Locator;

  constructor(page: Page) {
    super(page, pages.contact.path);
    this.links = page.locator("#main-content ul a");
  }
}
