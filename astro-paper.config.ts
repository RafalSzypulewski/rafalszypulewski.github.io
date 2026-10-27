import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://rafalszypulewski.github.io/",
    title: "Rafal Szypulewski",
    description:
      "QA automation engineer: Playwright, TypeScript and CI. Projects, notes and blog posts.",
    author: "Rafal Szypulewski",
    profile: "https://github.com/RafalSzypulewski",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Europe/Warsaw",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/RafalSzypulewski/rafalszypulewski.github.io/edit/main/",
    },
    search: "pagefind",
  },
  // TODO: replace placeholder LinkedIn URL and email
  socials: [
    { name: "github",   url: "https://github.com/RafalSzypulewski" },
    { name: "linkedin", url: "https://www.linkedin.com/in/your-profile/" },
    { name: "mail",     url: "mailto:you@example.com" },
  ],
  shareLinks: [
    { name: "linkedin", url: "https://www.linkedin.com/sharing/share-offsite/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
