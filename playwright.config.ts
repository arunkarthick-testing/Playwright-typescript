// @ts-check
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  
  testDir: './tests',
  timeout: 50*1000,
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    trace: "on",
    storageState: '../../.auth/drvijay.json',
  },
  //The reporter output paths must match what you wrote in the Jenkinsfile. Make sure your config has this:
  //open: 'never' is important — without it, Playwright tries to open the browser report automatically, which will hang your Jenkins build forever.
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright'],
],
  
});

