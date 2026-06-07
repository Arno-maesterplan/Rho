const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🧪 Testing Milestone Delete (Eerste Lach)...\n');

  // Navigate to milestones
  await page.goto('http://localhost:3000/milestones', { waitUntil: 'networkidle' });
  console.log('✅ Navigated to milestones');

  // Handle name modal
  try {
    const input = await page.locator('input[placeholder*="naam" i]').first();
    if (await input.isVisible({ timeout: 1000 }).catch(() => false)) {
      await input.fill('Test');
      await page.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(300);
      console.log('✅ Handled name modal');
    }
  } catch (e) {}

  // Find "Eerste lach" milestone
  const firsteLach = await page.locator('button:has-text("Eerste lach")').first();
  if (await firsteLach.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('✅ Found "Eerste lach" milestone');

    // Click to open it
    await firsteLach.click();
    await page.waitForTimeout(500);

    // Look for edit button or delete button
    const editBtn = await page.locator('button:has-text("Bewerk")').first();
    if (await editBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('✅ Clicked to view milestone');
      await editBtn.click();
      console.log('✅ Clicked "Bewerk" button');
      await page.waitForTimeout(500);

      // Now find delete button
      const deleteBtn = await page.locator('button:has-text("Milestone verwijderen")');
      if (await deleteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('✅ Found delete button');

        // Handle confirmation dialog
        page.on('dialog', async dialog => {
          console.log(`📋 Dialog: ${dialog.message()}`);
          await dialog.accept();
        });

        // Click delete
        await deleteBtn.click();
        console.log('✅ Clicked delete button (should confirm in dialog)');
        await page.waitForTimeout(2000);

        // Check if milestone is gone
        const stillThere = await page.locator('button:has-text("Eerste lach")').count();
        if (stillThere === 0) {
          console.log('✅ PASS: Milestone deleted successfully');
        } else {
          console.log('❌ FAIL: Milestone still visible after delete');
        }
      } else {
        console.log('❌ Delete button not found');
      }
    } else {
      console.log('❌ Bewerk button not found');
    }
  } else {
    console.log('❌ "Eerste lach" milestone not found');
  }

  await page.screenshot({ path: '/tmp/delete-test.png' });
  console.log('\n📸 Screenshot: /tmp/delete-test.png');

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
