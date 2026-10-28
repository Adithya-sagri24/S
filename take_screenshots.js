const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 950, deviceScaleFactor: 1 });

  const filePath = path.resolve(__dirname, 'index.html');
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

  // Screenshot 1: functionality.png
  // Captures top-left name, navigation bar, About Me, and Skills (all 5)
  console.log('Capturing functionality.png...');
  await page.screenshot({ path: path.resolve(__dirname, 'functionality.png') });
  console.log('Saved functionality.png');

  // Navigate / scroll to recommendations section
  await page.evaluate(() => {
    const el = document.getElementById('recommendations');
    if (el) el.scrollIntoView();
  });

  // Type recommendation
  const testText = "Adithya is an exceptional full-stack developer! His dedication to clean code, responsive design, and rapid delivery makes him a top-tier engineer. Highly recommended!";
  await page.type('#new_recommendation', testText);

  // Click submit button
  await page.click('#recommend_btn');

  // Wait for popup to become visible
  await page.waitForFunction(() => {
    const popup = document.getElementById('popup');
    return popup && window.getComputedStyle(popup).visibility === 'visible';
  });

  // Small delay for smooth rendering
  await new Promise(r => setTimeout(r, 600));

  // Screenshot 2: new_recommendation.png
  console.log('Capturing new_recommendation.png...');
  await page.screenshot({ path: path.resolve(__dirname, 'new_recommendation.png') });
  console.log('Saved new_recommendation.png');

  await browser.close();
  console.log('Done!');
})();

