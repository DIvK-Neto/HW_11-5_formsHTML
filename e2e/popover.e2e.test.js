import puppeteer from 'puppeteer';

describe('E2E Popover', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new',
      slowMo: 50,
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('при клике на первую кнопку появляется попап с правильным текстом', async () => {
    const button = await page.waitForXPath('//button[contains(text(), "Нажми, чтобы переключить попап")]', { timeout: 15000 });
    await button.click();
    const popover = await page.waitForSelector('.popover', { visible: true, timeout: 15000 });
    expect(popover).not.toBeNull();

    const title = await page.$eval('.popover-title', el => el.textContent);
    expect(title).toBe('Заголовок попапа');

    const content = await page.$eval('.popover-content', el => el.textContent);
    expect(content).toContain('удивительный контент');
  }, 30000);

  test('повторный клик на ту же кнопку скрывает попап', async () => {
    const button = await page.waitForXPath('//button[contains(text(), "Нажми, чтобы переключить попап")]', { timeout: 15000 });
    await button.click();
    await page.waitForSelector('.popover', { visible: true, timeout: 15000 });

    await button.click();
    await page.waitForSelector('.popover', { hidden: true, timeout: 15000 });

    const popover = await page.$('.popover');
    expect(popover).toBeNull();
  }, 30000);

  test('клик на вторую кнопку закрывает старый попап и открывает новый', async () => {
    const button1 = await page.waitForXPath('//button[contains(text(), "Нажми, чтобы переключить попап")]', { timeout: 15000 });
    const button2 = await page.waitForXPath('//button[contains(text(), "Ещё одна кнопка")]', { timeout: 15000 });

    await button1.click();
    await page.waitForSelector('.popover', { visible: true, timeout: 15000 });
    const title1 = await page.$eval('.popover-title', el => el.textContent);
    expect(title1).toBe('Заголовок попапа');

    await button2.click();
    await page.waitForSelector('.popover', { visible: true, timeout: 15000 });
    const title2 = await page.$eval('.popover-title', el => el.textContent);
    expect(title2).toBe('Другой заголовок');
  }, 30000);
});