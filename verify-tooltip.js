const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🧪 Testing Growth Chart Tooltip...\n');

  // Navigate to growth page
  await page.goto('http://localhost:3000/groei', { waitUntil: 'networkidle' });
  console.log('✅ Navigated to /groei');

  // Handle "Wie ben jij" modal if present
  try {
    const nameInput = await page.locator('input[placeholder*="naam" i]').first();
    const isVisible = await nameInput.isVisible({ timeout: 1000 }).catch(() => false);
    if (isVisible) {
      await nameInput.fill('Test');
      await page.locator('button[type="submit"]').click();
      console.log('✅ Submitted name form');
      await page.waitForTimeout(500);
    }
  } catch (e) {
    // Modal might not be present
  }

  // Wait for chart to load
  await page.waitForSelector('svg text:has-text("Weken oud")', { timeout: 5000 });
  console.log('✅ Chart loaded');

  // Get all data points (circles in the chart)
  const dataPoints = await page.locator('circle[r="7"]').count();
  console.log(`✅ Found ${dataPoints} data points (dots) on chart`);

  if (dataPoints === 0) {
    console.log('❌ FAIL: No data points found!');
    await browser.close();
    process.exit(1);
  }

  // Hover over first data point
  const firstDot = page.locator('circle[r="7"]').first();
  await firstDot.hover();
  console.log('✅ Hovered over first data point');

  // Wait for tooltip to appear
  await page.waitForTimeout(500);

  // Check for tooltip content
  const tooltipExists = await page.locator('text=/[0-9]{2}-[0-9]{2}-[0-9]{4}/').count() > 0;
  const hasValue = await page.locator('text=/[0-9]+\.[0-9]{2}/').count() > 0;
  const hasPercentile = await page.locator('text=/Percentiel.*P[0-9]+/').count() > 0;

  console.log(`\n📊 Tooltip Content Check:`);
  console.log(`   ${tooltipExists ? '✅' : '❌'} Date format (dd-mm-yyyy)`);
  console.log(`   ${hasValue ? '✅' : '❌'} Value displayed`);
  console.log(`   ${hasPercentile ? '✅' : '❌'} Percentile displayed`);

  // Take screenshot for evidence
  await page.screenshot({ path: '/tmp/growth-chart-tooltip.png' });
  console.log('\n📸 Screenshot saved: /tmp/growth-chart-tooltip.png');

  if (tooltipExists && hasValue && hasPercentile) {
    console.log('\n✅ PASS: Tooltip shows date, value, and percentile on hover');
    process.exit(0);
  } else {
    console.log('\n❌ FAIL: Tooltip missing required information');
    process.exit(1);
  }

  await browser.close();
})().catch(err => {
  console.error('❌ Test error:', err);
  process.exit(1);
});
