const { test, expect } = require("@playwright/test");

const viewports = [
  { name: "small-mobile", width: 320, height: 568 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 }
];

for (const viewport of viewports) {
  test(`home renders without horizontal overflow / ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/index.html");
    await expect(page.locator("#hero-title")).toBeVisible();
    await expect.poll(() => page.locator(".hero-media img").evaluate((image) =>
      Boolean(image.currentSrc && image.naturalWidth > 0)
    )).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test("navigation and contact links are intact", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.getByLabel("Navigație principală").getByRole("link", { name: "Contact" })).toHaveAttribute("href", "contact/");
  await expect(page.getByRole("link", { name: /Întreabă de disponibilitate/ })).toHaveAttribute("href", /mailto:gratiela_smi@yahoo\.com/);
  await page.goto("/contact/");
  await expect(page).toHaveTitle("Contact | Camping Botușel");
  await expect(page.getByRole("link", { name: /gratiela_smi@yahoo\.com/ })).toHaveAttribute("href", /mailto:gratiela_smi@yahoo\.com/);
  await expect(page.getByRole("link", { name: /tonegari\.stefan@gmail\.com/ })).toHaveAttribute("href", /mailto:tonegari\.stefan@gmail\.com/);
});

test("mobile menu is touch friendly and closes from a link", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/index.html");
  const menu = page.getByRole("button", { name: "Meniu" });
  const menuBox = await menu.boundingBox();
  expect(menuBox.width).toBeGreaterThanOrEqual(44);
  expect(menuBox.height).toBeGreaterThanOrEqual(44);
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#primary-nav")).toHaveClass(/is-open/);
  await page.getByRole("link", { name: "Galerie" }).first().click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("visible image assets load on home and contact", async ({ page }) => {
  for (const path of ["/index.html", "/contact/"]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path);
    await page.evaluate(async () => {
      for (const y of [0, document.body.scrollHeight / 2, document.body.scrollHeight]) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    });
    await expect.poll(() => page.locator("img").evaluateAll((images) =>
      images.every((image) => image.currentSrc && image.naturalWidth > 0)
    )).toBe(true);
  }
});
