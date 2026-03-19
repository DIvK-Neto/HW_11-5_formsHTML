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
    page = await browser.newPage();
    await page.goto('http://localhost:8080');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('при клике на первую кнопку появляется попап с правильным текстом', async () => {
    await page.waitForSelector('[data-toggle="popover"]');
    const button = await page.$('[data-toggle="popover"]');
    await button.click();

    const popover = await page.waitForSelector('.popover', { timeout: 5000 });
    expect(popover).not.toBeNull();

    const title = await page.$eval('.popover-title', el => el.textContent);
    expect(title).toBe('Заголовок попапа');

    const content = await page.$eval('.popover-content', el => el.textContent);
    expect(content).toContain('удивительный контент');
  }, 10000);

  test('повторный клик на ту же кнопку скрывает попап', async () => {
    const button = await page.$('[data-toggle="popover"]');
    await button.click();
    await page.waitForSelector('.popover'); 
    await button.click(); 

    await page.waitForFunction(
      () => !document.querySelector('.popover'),
      { timeout: 30000 }
    );

    const popover = await page.$('.popover');
    expect(popover).toBeNull();
  }, 40000);

  test('клик на другую кнопку закрывает старый попап и открывает новый', async () => {
    const buttons = await page.$$('[data-toggle="popover"]');
    expect(buttons.length).toBe(2);

    await buttons[0].click();
    await page.waitForSelector('.popover');
    const title1 = await page.$eval('.popover-title', el => el.textContent);
    expect(title1).toBe('Заголовок попапа');

    await buttons[1].click();
    await page.waitForSelector('.popover', { timeout: 30000 });
    const title2 = await page.$eval('.popover-title', el => el.textContent);
    expect(title2).toBe('Другой заголовок');
  }, 40000);
});