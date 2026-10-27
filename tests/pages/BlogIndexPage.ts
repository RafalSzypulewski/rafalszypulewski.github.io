import type { Locator, Page } from "@playwright/test";
import { pages } from "../data/site";
import { SitePage } from "./SitePage";

export class BlogIndexPage extends SitePage {
  readonly postLinks: Locator;

  constructor(page: Page) {
    super(page, pages.blog.path);
    this.postLinks = page.locator("#main-content > ul > li > a");
  }

  postLink(title: string) {
    return this.postLinks.filter({ hasText: title });
  }
}
