import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:5175';

const devices = [
  { name: 'iPhone-SE', width: 320, height: 568 },
  { name: 'Pixel-4', width: 360, height: 780 },
  { name: 'iPhone-14', width: 390, height: 844 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 900 },
];

for (const d of devices) {
  test.describe(`${d.name} viewport (${d.width}x${d.height})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: d.width, height: d.height });
    });

    test(`home — hero heading, CTA height and layout`, async ({ page }) => {
      await page.goto(BASE, { waitUntil: 'networkidle' });

      const heroTitle = page.locator('#hero h1');
      await expect(heroTitle).toBeVisible({ timeout: 5000 });

      const fontSize = await heroTitle.evaluate((el) => {
        return parseFloat(getComputedStyle(el).fontSize || '0');
      });

      if (d.width <= 420) {
        expect(fontSize).toBeLessThanOrEqual(44); // ensure hero heading is not excessively large
      } else {
        expect(fontSize).toBeGreaterThan(28);
      }

      const projectCTA = page.locator('#hero button', { hasText: 'View Projects' }).first();
      await expect(projectCTA).toBeVisible();
      const ctaHeight = await projectCTA.evaluate((el) => el.getBoundingClientRect().height);
      expect(ctaHeight).toBeGreaterThanOrEqual(d.width <= 420 ? 40 : 36);

      await page.screenshot({ path: `tests/screenshots/hero-${d.name}.png`, fullPage: false });
    });

    // Mobile-only: verify push-down mobile menu toggles and pushes content
    if (d.width <= 420) {
      test('mobile nav — push-down toggle & presence', async ({ page }) => {
        await page.goto(BASE, { waitUntil: 'networkidle' });

        const hero = page.locator('#hero');
        const beforeY = await hero.evaluate((el) => el.getBoundingClientRect().y);

        const menuBtn = page.locator('button[aria-controls="mobile-nav"]');
        await expect(menuBtn).toBeVisible();
        await menuBtn.click();

        const mobileNav = page.locator('#mobile-nav');
        await expect(mobileNav).toBeVisible();

        // mobile-nav should expand (height > 0) and push the hero down
        const navHeight = await mobileNav.evaluate((el) => el.getBoundingClientRect().height);
        expect(navHeight).toBeGreaterThan(0);

        // full expansion — the last link should be visible without scrolling
        const testimonialsLink = mobileNav.locator('a', { hasText: 'Testimonials' });
        await expect(testimonialsLink).toBeVisible();

        // show visible bottom fade when content overflows
        const fadeBottom = mobileNav.locator('.mobile-nav-fade-bottom');
        await expect(fadeBottom).toBeVisible();

        const afterY = await hero.evaluate((el) => el.getBoundingClientRect().y);
        expect(afterY).toBeGreaterThan(beforeY);

        // scroll the menu to the bottom and ensure top fade appears / bottom fades
        const mobileScroll = page.locator('#mobile-nav .mobile-nav-scroll');
        await mobileScroll.evaluate((el) => el.scrollTo({ top: el.scrollHeight }));
        await page.waitForTimeout(120);
        await expect(mobileNav.locator('.mobile-nav-fade-top')).toBeVisible();
        await expect(mobileNav.locator('.mobile-nav-fade-bottom')).not.toBeVisible();

        // close menu and wait for collapse transition to finish
        await menuBtn.click();
        await page.waitForFunction(() => {
          const el = document.getElementById('mobile-nav');
          return !!el && el.getBoundingClientRect().height < 8;
        }, { timeout: 1200 });
        const closedHeight = await mobileNav.evaluate((el) => el.getBoundingClientRect().height);
        expect(closedHeight).toBeLessThan(8);

        await page.screenshot({ path: `tests/screenshots/mobile-nav-${d.name}.png` });
      });

      test('home-focus — selecting pillar opens mobile-nav & highlights link', async ({ page }) => {
        await page.goto(BASE, { waitUntil: 'networkidle' });

        const automationBtn = page.locator('#home-focus button', { hasText: 'Automation' }).first();
        await expect(automationBtn).toBeVisible();
        await automationBtn.click();

        const mobileNav = page.locator('#mobile-nav');
        await expect(mobileNav).toBeVisible();

        const highlighted = mobileNav.locator('a[data-highlighted="true"]');
        await expect(highlighted).toHaveCount(1);
        await expect(highlighted).toHaveText('Gallery');

        await page.screenshot({ path: `tests/screenshots/home-focus-mobile-${d.name}.png` });
      });
    }

    test(`projects — grid responsiveness`, async ({ page }) => {
      // app uses HashRouter — navigate using the hash
      await page.goto(`${BASE}/#/projects`, { waitUntil: 'networkidle' });
      const grid = page.locator('#projects [data-testid="projects-grid"]');
      await expect(grid).toBeVisible();

      // measure first card width vs container width to infer column collapse on small devices
      const containerWidth = await grid.evaluate((el) => el.getBoundingClientRect().width);
      const firstCard = grid.locator('.project-card').first();
      await expect(firstCard).toBeVisible();
      const cardWidth = await firstCard.evaluate((el) => el.getBoundingClientRect().width);

      if (d.width <= 420) {
        // card should roughly span the container (single-column)
        expect(Math.abs(cardWidth - containerWidth)).toBeLessThanOrEqual(6);
      } else if (d.width < 768) {
        // medium devices may show 2-column layout (card width ~ half container)
        expect(cardWidth).toBeGreaterThanOrEqual(containerWidth / 3);
      }

      await page.screenshot({ path: `tests/screenshots/projects-${d.name}.png`, fullPage: false });
    });
  });
}
