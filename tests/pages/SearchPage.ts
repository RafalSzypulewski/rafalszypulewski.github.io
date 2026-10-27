import type { Locator, Page } from "@playwright/test";
import { SitePage } from "./SitePage";

export class SearchPage extends SitePage {
  readonly results: Locator;

  constructor(page: Page) {
    super(page, "/en/search/");
    this.results = page.locator(".pagefind-ui__result");
  }

  /** Opens search with a query; the page runs it from the `q` param. */
  search(query: string) {
    return this.page.goto(`${this.path}?q=${encodeURIComponent(query)}`);
  }

  result(title: string) {
    return this.results.filter({
      has: this.page.locator(".pagefind-ui__result-title", { hasText: title }),
    });
  }

  excerpt(result: Locator) {
    return result.locator(".pagefind-ui__result-excerpt");
  }
}
