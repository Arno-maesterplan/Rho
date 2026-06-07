const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🧪 Testing Delete for "Eerste lach" milestone\n');

  // Navigate to milestones
  await page.goto('http://localhost:3000/milestones', { waitUntil: 'networkidle' });
  console.log('✅ Loaded milestones page');

  // Handle "Wie ben jij?" name modal first
  try {
    const nameInput = await page.locator('input[placeholder*="naam" i]').first();
    if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nameInput.fill('Test');
      await page.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(500);
      console.log('✅ Filled name modal');
    }
  } catch (e) {
    console.log('   (No name modal)');
  }

  // Wait for page to fully load
  await page.waitForTimeout(500);

  // Find milestone card - look for "Eerste lach" text
  const milestones = await page.locator('button:has-text("Eerste lach")');
  const count = await milestones.count();

  if (count === 0) {
    console.log('❌ "Eerste lach" milestone not found');
    await browser.close();
    process.exit(1);
  }

  console.log(`✅ Found ${count} "Eerste lach" milestone(s)`);

  // Click the milestone to view it
  const firstEl = milestones.first();
  await firstEl.click();
  console.log('✅ Clicked milestone');

  // Wait for modal/view to appear
  await page.waitForTimeout(500);

  // Check for "Bewerk" button (edit button shows in view modal if you're allowed to edit)
  const bewerk = await page.locator('button:has-text("Bewerk")').count();
  console.log(`   Bewerk buttons visible: ${bewerk}`);

  if (bewerk > 0) {
    // Click Bewerk to go to edit
    await page.locator('button:has-text("Bewerk")').first().click();
    console.log('✅ Clicked "Bewerk" button');
    await page.waitForTimeout(500);
  }

  // Now look for delete button
  const deleteBtn = await page.locator('button:has-text("Milestone verwijderen")').count();
  console.log(`   Delete buttons visible: ${deleteBtn}`);

  if (deleteBtn > 0) {
    console.log('✅ Found delete button');

    // Set up dialog handler BEFORE clicking delete
    page.on('dialog', async dialog => {
      console.log(`   📋 Dialog: "${dialog.message()}"`);
      await dialog.accept();
      console.log('   ✅ Confirmed deletion');
    });

    // Click delete
    await page.locator('button:has-text("Milestone verwijderen")').first().click();
    console.log('✅ Clicked delete button');

    // Wait for confirmation and deletion
    await page.waitForTimeout(3000);

    // Check if milestone is still there
    const stillExists = await page.locator('text=Eerste lach').count();

    if (stillExists === 0) {
      console.log('\n✅ SUCCESS: "Eerste lach" milestone DELETED');
    } else {
      console.log('\n❌ FAILED: "Eerste lach" milestone still visible after delete');
      console.log('   This suggests the delete query did not work');
    }
  } else {
    console.log('❌ Delete button NOT found - cannot test');
  }

  await page.screenshot({ path: '/tmp/delete-final-test.png' });
  console.log('\n📸 Screenshot: /tmp/delete-final-test.png');

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('❌ Test error:', err.message);
  process.exit(1);
});
