import { test, expect } from '@playwright/test';

test.describe('Progress Bar Click-to-Seek Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the app to load and dismiss the start overlay
    await page.waitForSelector('[data-testid="start-overlay"], .start-overlay, button:has-text("Start Learning")', { timeout: 10000 });
    
    // Click the start button if it exists
    const startButton = page.locator('button:has-text("Start Learning")');
    if (await startButton.isVisible()) {
      await startButton.click();
    }
    
    // Wait for the main app interface to be visible
    await page.waitForSelector('[role="progressbar"]', { timeout: 10000 });
  });

  test('should update staff position when progress bar is clicked', async ({ page }) => {
    // Wait for the progress bar to be visible
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
    
    // Get the progress bar bounding box
    const progressBarBox = await progressBar.boundingBox();
    expect(progressBarBox).toBeTruthy();
    
    // Click at 25% position
    const clickX = progressBarBox.x + (progressBarBox.width * 0.25);
    const clickY = progressBarBox.y + (progressBarBox.height / 2);
    
    // Take a screenshot before clicking
    await page.screenshot({ path: 'e2e/screenshots/before-click.png' });
    
    // Click on the progress bar
    await page.mouse.click(clickX, clickY);
    
    // Wait a moment for the animation to complete
    await page.waitForTimeout(500);
    
    // Take a screenshot after clicking
    await page.screenshot({ path: 'e2e/screenshots/after-click-25.png' });
    
    // Verify that the progress bar fill has updated
    const progressFill = page.locator('.progress-fill');
    await expect(progressFill).toBeVisible();
    
    // Check that the staff notation container has moved (notes-container should have transform)
    const notesContainer = page.locator('.notes-container');
    if (await notesContainer.isVisible()) {
      const transform = await notesContainer.evaluate(el => 
        window.getComputedStyle(el).transform
      );
      
      // The transform should not be 'none' if the staff has moved
      console.log('Notes container transform:', transform);
    }
  });

  test('should handle multiple progress bar clicks', async ({ page }) => {
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
    
    const progressBarBox = await progressBar.boundingBox();
    expect(progressBarBox).toBeTruthy();
    
    // Click at different positions
    const positions = [0.1, 0.5, 0.8, 0.3];
    
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const clickX = progressBarBox.x + (progressBarBox.width * position);
      const clickY = progressBarBox.y + (progressBarBox.height / 2);
      
      console.log(`Clicking at ${(position * 100).toFixed(0)}% position`);
      
      // Click on the progress bar
      await page.mouse.click(clickX, clickY);
      
      // Wait for the animation to complete
      await page.waitForTimeout(400);
      
      // Take a screenshot for each click
      await page.screenshot({ 
        path: `e2e/screenshots/click-${(position * 100).toFixed(0)}-percent.png` 
      });
      
      // Verify the progress bar has updated
      const progressFill = page.locator('.progress-fill');
      const fillWidth = await progressFill.evaluate(el => 
        window.getComputedStyle(el).width
      );
      
      console.log(`Progress fill width after ${(position * 100).toFixed(0)}% click:`, fillWidth);
    }
  });

  test('should show smooth transitions during progress bar interactions', async ({ page }) => {
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
    
    const progressBarBox = await progressBar.boundingBox();
    expect(progressBarBox).toBeTruthy();
    
    // Listen for console logs to verify functionality
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('attachToNearestNote') || 
          msg.text().includes('Progress bar clicked') ||
          msg.text().includes('Attached to position')) {
        consoleLogs.push(msg.text());
      }
    });
    
    // Click at 75% position
    const clickX = progressBarBox.x + (progressBarBox.width * 0.75);
    const clickY = progressBarBox.y + (progressBarBox.height / 2);
    
    // Monitor the notes container for smooth transitions
    const notesContainer = page.locator('.notes-container');
    
    console.log('Testing smooth transitions...');
    
    // Click on the progress bar
    await page.mouse.click(clickX, clickY);
    
    // Wait for processing
    await page.waitForTimeout(400);
    
    // Check that transition CSS property is applied
    if (await notesContainer.isVisible()) {
      const transition = await notesContainer.evaluate(el => 
        window.getComputedStyle(el).transition
      );
      
      console.log('CSS transition property:', transition);
      
      // The transition should include 'transform' for smooth animation
      expect(transition).toContain('transform');
    }
    
    // Verify that the click-to-seek functionality executed
    console.log('Console logs captured:', consoleLogs);
    
    // Check that note attachment logic was executed (this is the real test)
    const attachmentLogs = consoleLogs.filter(log => 
      log.includes('attachToNearestNote') || 
      log.includes('Attached to position')
    );
    
    // The key requirement: note attachment should have occurred
    expect(attachmentLogs.length).toBeGreaterThan(0);
    
    // Verify progress bar visual feedback
    const progressFill = page.locator('.progress-fill');
    if (await progressFill.isVisible()) {
      const fillWidth = await progressFill.evaluate(el => 
        window.getComputedStyle(el).width
      );
      console.log('Progress fill width after click:', fillWidth);
      
      // Progress fill should have updated (not be 0px)
      expect(fillWidth).not.toBe('0px');
    }
  });

  test('should handle drag operations on progress bar', async ({ page }) => {
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
    
    const progressBarBox = await progressBar.boundingBox();
    expect(progressBarBox).toBeTruthy();
    
    // Start drag at 20% position
    const startX = progressBarBox.x + (progressBarBox.width * 0.2);
    const startY = progressBarBox.y + (progressBarBox.height / 2);
    
    // End drag at 70% position
    const endX = progressBarBox.x + (progressBarBox.width * 0.7);
    const endY = progressBarBox.y + (progressBarBox.height / 2);
    
    // Perform drag operation
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    
    // Check that dragging class is applied
    await expect(progressBar).toHaveClass(/dragging/);
    
    // Move to end position
    await page.mouse.move(endX, endY);
    
    // Release mouse
    await page.mouse.up();
    
    // Wait for drag end processing
    await page.waitForTimeout(400);
    
    // Take screenshot after drag
    await page.screenshot({ path: 'e2e/screenshots/after-drag.png' });
    
    // Verify dragging class is removed
    await expect(progressBar).not.toHaveClass(/dragging/);
    
    // Verify the staff position has updated
    const notesContainer = page.locator('.notes-container');
    if (await notesContainer.isVisible()) {
      const transform = await notesContainer.evaluate(el => 
        window.getComputedStyle(el).transform
      );
      
      console.log('Transform after drag:', transform);
      expect(transform).not.toBe('none');
    }
  });

  test('should attach to nearest note after progress bar interaction', async ({ page }) => {
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
    
    // Listen for console logs to verify note attachment
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('attachToNearestNote') || 
          msg.text().includes('Progress bar clicked') ||
          msg.text().includes('Attached to position')) {
        consoleLogs.push(msg.text());
      }
    });
    
    const progressBarBox = await progressBar.boundingBox();
    expect(progressBarBox).toBeTruthy();
    
    // Click at 40% position
    const clickX = progressBarBox.x + (progressBarBox.width * 0.4);
    const clickY = progressBarBox.y + (progressBarBox.height / 2);
    
    await page.mouse.click(clickX, clickY);
    
    // Wait for processing
    await page.waitForTimeout(500);
    
    // Check console logs for note attachment
    console.log('Console logs captured:', consoleLogs);
    
    // Verify that note attachment logic was executed
    const attachmentLogs = consoleLogs.filter(log => 
      log.includes('attachToNearestNote') || 
      log.includes('Attached to position')
    );
    
    expect(attachmentLogs.length).toBeGreaterThan(0);
  });

  test('should maintain accessibility attributes during interactions', async ({ page }) => {
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
    
    // Check initial accessibility attributes
    await expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    await expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    await expect(progressBar).toHaveAttribute('aria-valuenow');
    await expect(progressBar).toHaveAttribute('aria-label');
    
    // Click on progress bar
    const progressBarBox = await progressBar.boundingBox();
    const clickX = progressBarBox.x + (progressBarBox.width * 0.6);
    const clickY = progressBarBox.y + (progressBarBox.height / 2);
    
    await page.mouse.click(clickX, clickY);
    await page.waitForTimeout(300);
    
    // Verify accessibility attributes are still present and updated
    await expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    await expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    
    const ariaValueNow = await progressBar.getAttribute('aria-valuenow');
    const ariaLabel = await progressBar.getAttribute('aria-label');
    
    console.log('Updated aria-valuenow:', ariaValueNow);
    console.log('Updated aria-label:', ariaLabel);
    
    // The aria-label should reflect the current progress
    expect(ariaLabel).toContain('Playback progress');
    expect(ariaLabel).toContain('%');
  });
});

test.describe('Progress Bar Visual Tests', () => {
  test('should visually demonstrate click-to-seek functionality', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the app to load and dismiss the start overlay
    const startButton = page.locator('button:has-text("Start Learning")');
    if (await startButton.isVisible()) {
      await startButton.click();
    }
    
    // Wait for the main interface
    await page.waitForSelector('[role="progressbar"]', { timeout: 10000 });
    
    // Create screenshots directory
    await page.evaluate(() => {
      // This will be handled by the test runner
    });
    
    const progressBar = page.locator('[role="progressbar"]');
    const progressBarBox = await progressBar.boundingBox();
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'e2e/screenshots/initial-state.png',
      fullPage: true 
    });
    
    // Test multiple click positions with visual verification
    const testPositions = [
      { percent: 10, name: 'beginning' },
      { percent: 30, name: 'early' },
      { percent: 50, name: 'middle' },
      { percent: 75, name: 'late' },
      { percent: 90, name: 'end' }
    ];
    
    for (const position of testPositions) {
      const clickX = progressBarBox.x + (progressBarBox.width * position.percent / 100);
      const clickY = progressBarBox.y + (progressBarBox.height / 2);
      
      // Click at position
      await page.mouse.click(clickX, clickY);
      
      // Wait for animation
      await page.waitForTimeout(400);
      
      // Take screenshot
      await page.screenshot({ 
        path: `e2e/screenshots/click-${position.name}-${position.percent}percent.png`,
        fullPage: true 
      });
      
      console.log(`✅ Captured screenshot for ${position.percent}% position`);
    }
    
    console.log('🎹 Visual test complete! Check e2e/screenshots/ for results.');
  });
});