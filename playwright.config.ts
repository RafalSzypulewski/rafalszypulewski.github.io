import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
// Set BASE_URL to test a deployed site instead of the local build.
const baseURL = process.env.BASE_URL ?? "http://localhost:4321";

export default defineConfig({
  testDir: "./tests/specs",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["html", { open: "never" }], ["github"]] : "html",
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Serves the existing dist/ build, so run `npm run build` first.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run preview",
        url: "http://localhost:4321/en/",
        reuseExistingServer: !isCI,
      },
});
