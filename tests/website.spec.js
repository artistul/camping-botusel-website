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

test("mobile header avoids redundant menu chrome", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/index.html");

  await expect(page.getByRole("button", { name: "Meniu" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Vezi locul" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Întreabă de disponibilitate/ }).first()).toBeVisible();
});

test("desktop section shortcuts leave breathing room below the header", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await page.getByLabel("Navigație principală").getByRole("link", { name: "Galerie" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#galerie");
  await page.waitForTimeout(500);

  const metrics = await page.evaluate(() => {
    const header = document.querySelector(".site-header").getBoundingClientRect();
    const section = document.querySelector("#galerie").getBoundingClientRect();
    return {
      headerBottom: header.bottom,
      sectionTop: section.top
    };
  });

  expect(metrics.sectionTop).toBeGreaterThanOrEqual(metrics.headerBottom + 40);
});

test("small mobile keeps CTA and section navigation usable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/index.html");

  const primaryCta = page.getByRole("link", { name: /Întreabă de disponibilitate/ }).first();
  const ctaBox = await primaryCta.boundingBox();
  expect(ctaBox.height).toBeGreaterThanOrEqual(44);
  expect(ctaBox.y + ctaBox.height).toBeLessThanOrEqual(568);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.getByRole("link", { name: "Vezi locul" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#locul");
  await page.waitForTimeout(500);

  const metrics = await page.evaluate(() => {
    const section = document.querySelector("#locul").getBoundingClientRect();
    const sectionNav = document.querySelector(".product-nav").getBoundingClientRect();
    const sectionNavLinks = [...document.querySelectorAll(".product-nav a")].map((link) => link.getBoundingClientRect().height);
    return {
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      sectionTop: section.top,
      sectionNavBottom: sectionNav.bottom,
      sectionNavHeight: sectionNav.height,
      minSectionNavLinkHeight: Math.min(...sectionNavLinks)
    };
  });

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewportWidth);
  expect(metrics.sectionNavHeight).toBeLessThanOrEqual(60);
  expect(metrics.minSectionNavLinkHeight).toBeGreaterThanOrEqual(44);
  expect(metrics.sectionTop).toBeGreaterThanOrEqual(metrics.sectionNavBottom - 1);

  await page.locator(".product-nav").getByRole("link", { name: "Galerie" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#galerie");
  await page.waitForTimeout(500);

  const galleryMetrics = await page.evaluate(() => {
    const section = document.querySelector("#galerie").getBoundingClientRect();
    const sectionNav = document.querySelector(".product-nav").getBoundingClientRect();
    return {
      sectionTop: section.top,
      sectionNavBottom: sectionNav.bottom
    };
  });

  expect(galleryMetrics.sectionTop).toBeGreaterThanOrEqual(galleryMetrics.sectionNavBottom + 24);
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
