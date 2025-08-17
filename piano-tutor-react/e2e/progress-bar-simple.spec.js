import { test, expect } from '@playwright/test';

test.describe('Progress Bar Click-to-Seek - Core Functionality', () => {
    test('should demonstrate click-to-seek feature with visual verification', async ({ page }) => {
        // Navigate to the app
        await page.goto('/');

        // Wait for the app to load and dismiss the start overlay
        await page.waitForTimeout(2000);

        const startButton = page.locator('button:has-text("Start Learning")');
        if (await startButton.isVisible()) {
            await startButton.click();
            await page.waitForTimeout(1000);
        }

        // Wait for the main interface
        await page.waitForSelector('[role="progressbar"]', { timeout: 10000 });

        // Take initial screenshot
        await page.screenshot({
            path: 'e2e/screenshots/01-initial-state.png',
            fullPage: true
        });

        const progressBar = page.locator('[role="progressbar"]');
        await expect(progressBar).toBeVisible();

        // Get progress bar dimensions
        const progressBarBox = await progressBar.boundingBox();
        console.log('Progress bar dimensions:', progressBarBox);

        // Test click at different positions
        const testPositions = [25, 50, 75];

        for (let i = 0; i < testPositions.length; i++) {
            const percent = testPositions[i];
            const clickX = progressBarBox.x + (progressBarBox.width * percent / 100);
            const clickY = progressBarBox.y + (progressBarBox.height / 2);

            console.log(`\n🎯 Testing ${percent}% position click at (${clickX}, ${clickY})`);

            // Listen for console logs
            const consoleLogs = [];
            page.on('console', msg => {
                if (msg.text().includes('Progress bar clicked') ||
                    msg.text().includes('attachToNearestNote') ||
                    msg.text().includes('Attached to position')) {
                    consoleLogs.push(msg.text());
                }
            });

            // Click on progress bar
            await page.mouse.click(clickX, clickY);

            // Wait for processing
            await page.waitForTimeout(500);

            // Take screenshot
            await page.screenshot({
                path: `e2e/screenshots/02-click-${percent}percent.png`,
                fullPage: true
            });

            // Log results
            console.log(`📊 Console logs for ${percent}% click:`, consoleLogs);

            // Check if staff notation moved
            const notesContainer = page.locator('.notes-container');
            if (await notesContainer.isVisible()) {
                const transform = await notesContainer.evaluate(el =>
                    window.getComputedStyle(el).transform
                );
                console.log(`🎼 Notes container transform: ${transform}`);
            }

            // Check progress bar state
            const progressFill = page.locator('.progress-fill');
            if (await progressFill.isVisible()) {
                const fillWidth = await progressFill.evaluate(el =>
                    window.getComputedStyle(el).width
                );
                console.log(`📏 Progress fill width: ${fillWidth}`);
            }

            // Clear console listeners for next iteration
            page.removeAllListeners('console');
        }

        console.log('\n✅ Click-to-seek test completed! Check screenshots in e2e/screenshots/');
    });

    test('should verify progress bar interaction classes', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(2000);

        const startButton = page.locator('button:has-text("Start Learning")');
        if (await startButton.isVisible()) {
            await startButton.click();
            await page.waitForTimeout(1000);
        }

        await page.waitForSelector('[role="progressbar"]', { timeout: 10000 });

        const progressBar = page.locator('[role="progressbar"]');
        const progressBarBox = await progressBar.boundingBox();

        // Test drag interaction
        const startX = progressBarBox.x + (progressBarBox.width * 0.2);
        const startY = progressBarBox.y + (progressBarBox.height / 2);
        const endX = progressBarBox.x + (progressBarBox.width * 0.8);

        // Start drag
        await page.mouse.move(startX, startY);
        await page.mouse.down();

        // Check for dragging class
        const hasDraggingClass = await progressBar.evaluate(el =>
            el.classList.contains('dragging')
        );
        console.log('🖱️ Has dragging class during drag:', hasDraggingClass);

        // Move mouse
        await page.mouse.move(endX, startY);

        // End drag
        await page.mouse.up();
        await page.waitForTimeout(300);

        // Check dragging class is removed
        const stillHasDraggingClass = await progressBar.evaluate(el =>
            el.classList.contains('dragging')
        );
        console.log('🖱️ Still has dragging class after drag:', stillHasDraggingClass);

        expect(hasDraggingClass).toBe(true);
        expect(stillHasDraggingClass).toBe(false);
    });

    test('should verify accessibility attributes', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(2000);

        const startButton = page.locator('button:has-text("Start Learning")');
        if (await startButton.isVisible()) {
            await startButton.click();
            await page.waitForTimeout(1000);
        }

        await page.waitForSelector('[role="progressbar"]', { timeout: 10000 });

        const progressBar = page.locator('[role="progressbar"]');

        // Check accessibility attributes
        await expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        await expect(progressBar).toHaveAttribute('aria-valuemax', '100');
        await expect(progressBar).toHaveAttribute('aria-valuenow');
        await expect(progressBar).toHaveAttribute('aria-label');

        const ariaLabel = await progressBar.getAttribute('aria-label');
        console.log('♿ Accessibility label:', ariaLabel);

        expect(ariaLabel).toContain('Playback progress');
    });
});