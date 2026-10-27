import { test as base } from "@playwright/test";
import { AboutPage } from "../pages/AboutPage";
import { BlogIndexPage } from "../pages/BlogIndexPage";
import { ContactPage } from "../pages/ContactPage";
import { Header } from "../pages/Header";
import { HomePage } from "../pages/HomePage";
import { SitePage } from "../pages/SitePage";

type Fixtures = {
  header: Header;
  home: HomePage;
  blogIndex: BlogIndexPage;
  about: AboutPage;
  contact: ContactPage;
  /** Page object for any other path, e.g. a blog post. */
  pageAt: (path: string) => SitePage;
};

export const test = base.extend<Fixtures>({
  header: async ({ page }, use) => use(new Header(page)),
  home: async ({ page }, use) => use(new HomePage(page)),
  blogIndex: async ({ page }, use) => use(new BlogIndexPage(page)),
  about: async ({ page }, use) => use(new AboutPage(page)),
  contact: async ({ page }, use) => use(new ContactPage(page)),
  pageAt: async ({ page }, use) => use(path => new SitePage(page, path)),
});

export { expect } from "@playwright/test";
