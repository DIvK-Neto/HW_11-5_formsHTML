import puppeteer from 'puppeteer';
import { execSync } from 'child_process';

describe('E2E Popover', () => {
  let browser;
  let page;

  beforeAll(async () => {
    // На Windows убиваем все процессы Chrome, которые могут мешать
    if (process.platform === 'win32') {
      try {
        execSync('taskkill /F /IM chrome.exe', { stdio: 'ignore' });
      } catch {
        // Игнорируем, если процесс не найден
      }
      try {
        execSync('taskkill /F /IM "Google Chrome for Testing.exe"', { stdio: 'ignore' });
      } catch {
        // Игнорируем
      }
    }

    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new', // используем новый headless режим
      slowMo: 50,
    });
    page = await browser.newPage();
    await page.goto('http://localhost:8080');
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('при клике на первую кнопку появляется попап с правильным текстом', async () => {
    await page.waitForSelector('[data-toggle="popover"]');
    const button = await page.$('[data-toggle="popover"]');
    await button.click();

    const popover = await page.waitForSelector('.popover', { timeout: 3000 });
    expect(popover).not.toBeNull();

    const title = await page.$eval('.popover-title', (el) => el.textContent);
    const content = await page.$eval('.popover-content', (el) => el.textContent);

    expect(title).toBe('Заголовок попапа');
    expect(content).toContain('удивительный контент');
  });

  test('повторный клик на ту же кнопку скрывает попап', async () => {
    const button = await page.$('[data-toggle="popover"]');
    await button.click(); // открыли
    await page.waitForSelector('.popover'); // убедились, что открыт
    await button.click(); // закрыли
    await page.waitForSelector('.popover', { hidden: true });
    const popover = await page.$('.popover');
    expect(popover).toBeNull();
  });

  test('клик на другую кнопку закрывает старый попап и открывает новый', async () => {
    const buttons = await page.$$('[data-toggle="popover"]');
    expect(buttons.length).toBe(2);

    // Кликаем на первую
    await buttons[0].click();
    await page.waitForSelector('.popover');
    const title1 = await page.$eval('.popover-title', (el) => el.textContent);
    expect(title1).toBe('Заголовок попапа');

    // Кликаем на вторую
    await buttons[1].click();
    // Ждём, что старый попап исчез, а новый появился
    await page.waitForSelector('.popover', { hidden: false });
    const title2 = await page.$eval('.popover-title', (el) => el.textContent);
    expect(title2).toBe('Другой заголовок');
  });
});
