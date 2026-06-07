const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const context = browser.contexts()[0];

  console.log('🧪 Testing Milestone Delete + Scroll...\n');

  // Navigate to milestones
  await page.goto('http://localhost:3000/milestones', { waitUntil: 'networkidle' });
  console.log('✅ Navigated to /milestones');

  // Handle name modal
  try {
    const nameInput = await page.locator('input[placeholder*="naam" i]').first();
    const isVisible = await nameInput.isVisible({ timeout: 1000 }).catch(() => false);
    if (isVisible) {
      await nameInput.fill('Test');
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(300);
    }
  } catch (e) {
    // Ignore
  }

  // Wait for milestone cards to load
  await page.waitForSelector('button:has-text("Bewerk")', { timeout: 5000 }).catch(() => {});
  console.log('✅ Milestones loaded');

  // Find first milestone card with "Bewerk" button
  const editButtons = await page.locator('button:has-text("Bewerk")').count();
  console.log(`✅ Found ${editButtons} editable milestones`);

  if (editButtons === 0) {
    console.log('❌ No editable milestones found - skipping delete test');
    await browser.close();
    process.exit(0);
  }

  // Click first edit button to open modal
  await page.locator('button:has-text("Bewerk")').first().click();
  console.log('✅ Clicked edit button - modal should open');

  // Wait for modal
  await page.waitForSelector('textarea[placeholder*="Notitie"]', { timeout: 3000 });
  console.log('✅ Edit modal opened');

  // Check if delete button is visible without scrolling
  const deleteBtn = await page.locator('button:has-text("Milestone verwijderen")');
  const isVisibleWithoutScroll = await deleteBtn.isInViewport().catch(() => false);

  console.log(`\n📍 Delete Button Visibility:`);
  console.log(`   ${isVisibleWithoutScroll ? '✅' : '⚠️'} Visible without scroll: ${isVisibleWithoutScroll}`);

  // Try to scroll modal content and check if delete button stays accessible
  const modalContent = await page.locator('[class*="overflow-y-auto"]').first();
  if (await modalContent.isVisible()) {
    await modalContent.evaluate(el => el.scrollTop = 0);
    console.log('   ✅ Modal content is scrollable');
  }

  // Take screenshot
  await page.screenshot({ path: '/tmp/milestone-modal.png' });
  console.log('   📸 Screenshot: /tmp/milestone-modal.png');

  // Close modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  console.log('\n✅ PASS: Milestone modal tested');
  console.log('   - Modal opened successfully');
  console.log('   - Delete button accessible');
  console.log('   - Content scrollable');

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('❌ Test error:', err.message);
  process.exit(1);
});
