import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://172.17.1.112:8080/auth/realms/ris-pacs/protocol/openid-connect/auth?client_id=angular-ui&redirect_uri=http%3A%2F%2F172.17.1.112%3A8080%2F&state=4a0b3ac1-1ef9-4d43-826d-e0dcc9a19f68&response_mode=fragment&response_type=code&scope=openid&nonce=f823991b-58d9-49b4-864a-d6311c18ccad');
  await page.getByRole('textbox', { name: 'Username or email' }).click();
  await page.getByRole('textbox', { name: 'Username or email' }).fill('user.0');
  await page.getByRole('textbox', { name: 'Username or email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('user@0');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Worklist Archive' }).click();
  await page.getByRole('button', { name: 'Open calendar' }).click();
  await page.getByText('Last 30 days').click();
  await page.locator('div').filter({ hasText: /^All$/ }).nth(4).click();
  await page.getByText('UNASSIGNED').click();
  await expect(page.locator('tbody')).toContainText('UNASSIGNED');
  await expect(page.locator('.mat-row.cdk-row.ng-tns-c344-47.cursor-p.critical-row > .mat-cell.cdk-cell.ptb-0.plr-0.cdk-column-radiologist > .mat-menu-trigger > .d-ib.mr-10').first()).toBeVisible();
  await page.locator('.mat-row.cdk-row.ng-tns-c344-47.cursor-p.critical-row > .mat-cell.cdk-cell.ptb-0.plr-0.cdk-column-radiologist > .mat-menu-trigger > .d-ib.mr-10').first().click();
  await page.getByRole('menuitem', { name: 'Assign To Me' }).click();
  await page.getByText('Clear Filters').click();
  await page.getByRole('textbox', { name: 'Patient Name/ID, Examination' }).click();
  await page.getByRole('textbox', { name: 'Patient Name/ID, Examination' }).fill('200954');
  await page.locator('.mat-focus-indicator.mat-menu-trigger.float-r').first().click();
  await page.locator('button:nth-child(2) > .d-ib').click();
  await expect(page.locator('app-critical-popup')).toContainText('The study was marked as critical.');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('.mat-focus-indicator.mat-menu-trigger.float-r').first().click();
  await page.locator('button:nth-child(2) > .d-ib').click();
  await page.getByRole('button', { name: 'Okay, Continue' }).click();
  await expect(page.getByText('Report Details')).toBeVisible();
  await page.getByText('Templates:').nth(1).click();
  await page.locator('#mat-tab-label-6-1').getByText('All Templates').click();
  await page.locator('#mat-option-125').getByText('drvijay_final_form').click();
  await page.getByText('Changes not saved').click();
  await expect(page.getByText('Changes not saved')).toBeVisible();
  await page.getByRole('button').filter({ hasText: 'Save' }).click();
  await page.getByRole('button', { name: 'Sign Report' }).click();console.log('Navigated to Reporting page');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'Sign Report' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'Sign Report' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
});


import { Page, Locator } from '@playwright/test';

export class StudyNavigator {
  private page: Page;
  private rowIndex: number = 1;
  private colIndex: number = 7;

  // Locators — replace with your actual selectors
  private rippleRoundMenuItem: Locator;
  private reportingIcon: Locator;
  private assignIcon: Locator;
  private assignToMeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rippleRoundMenuItem = page.locator('/* ripple round menu item selector */');
    this.reportingIcon = page.locator('/* reporting icon selector */');
    this.assignIcon = page.locator('/* assign icon selector */');
    this.assignToMeButton = page.locator('/* assign to me button selector */');
  }

  // ─────────────────────────────────────────────
  // STEP 1: Check assignment status and navigate
  // ─────────────────────────────────────────────
  async checkStatusAndNavigate(): Promise<void> {
    await this.page.waitForTimeout(3000);

    try {
      const tableRow = this.page.locator('tbody[role="rowgroup"] tr').first();
      await tableRow.waitFor({ state: 'visible', timeout: 30000 });

      const colList = tableRow.locator('[role="cell"]');
      const colCount = await colList.count();
      console.log(`Total number of columns in the study table: ${colCount}`);

      if (this.colIndex < colCount) {
        const cell = colList.nth(this.colIndex);
        const cellValue = (await cell.getAttribute('aria-label')) ?? (await cell.innerText());
        const trimmedValue = cellValue?.trim();

        console.log(`Cell value at row: ${this.rowIndex}, column: ${this.colIndex} is: ${trimmedValue}`);

        if (trimmedValue && trimmedValue !== 'UNASSIGNED') {
          // Already assigned — go straight to reporting
          console.log("Study is assigned. Proceeding to Reporting.");
          await this.verifyCriticalPopupAndNavigateReporting();
        } else {
          // Not assigned — assign first, then navigate
          console.log("Study is UNASSIGNED. Assigning study first...");
          await this.page.waitForTimeout(3000);
          await this.assignStudyToMe(1, 6);
          await this.page.waitForTimeout(1000);
          await this.verifyCriticalPopupAndNavigateReporting();
        }
      } else {
        console.log(`Column index ${this.colIndex} is out of bounds for row ${this.rowIndex}`);
      }

    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error in checkStatusAndNavigate: ${error.message}`);
      }
    }
  }

  // ─────────────────────────────────────────────
  // STEP 2: Assign study to current user
  // ─────────────────────────────────────────────
  async assignStudyToMe(rowIndex: number, colIndex: number): Promise<void> {
    try {
      // Click Assign icon
      await this.assignIcon.waitFor({ state: 'visible', timeout: 10000 });
      await this.assignIcon.click();
      await this.page.waitForTimeout(2000);

      // Click Assign To Me button
      await this.assignToMeButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.assignToMeButton.click();
      await this.page.waitForTimeout(2000);

      // Verify assignment by reading col[6] value
      const tableRow = this.page.locator('tbody[role="rowgroup"] tr').first();
      await tableRow.waitFor({ state: 'visible', timeout: 30000 });

      const colList = tableRow.locator('td');
      const colCount = await colList.count();

      if (colIndex < colCount) {
        const cell = colList.nth(colIndex);
        const cellValue = (await cell.getAttribute('aria-label')) ?? (await cell.innerText());
        await this.page.waitForTimeout(3000);
        console.log(`Study Assigned to Radiologist: ${cellValue?.trim()}`);
      } else {
        console.log(`Column index ${colIndex} is out of bounds for row ${rowIndex}`);
      }

    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error in assignStudyToMe: ${error.message}`);
      }
    }
  }

  // ─────────────────────────────────────────────
  // STEP 3: Navigate to Reporting + handle popup
  // ─────────────────────────────────────────────
  async verifyCriticalPopupAndNavigateReporting(): Promise<void> {
    try {
      // Click Menu
      await this.rippleRoundMenuItem.waitFor({ state: 'visible', timeout: 10000 });
      await this.rippleRoundMenuItem.click();
      console.log('STEP 1: Menu Clicked');

      // Click Reporting Icon
      await this.reportingIcon.waitFor({ state: 'visible', timeout: 10000 });
      await this.reportingIcon.click();
      console.log('STEP 2: Reporting Icon Clicked');

      // Check for Critical Popup
      try {
        const popupLocator = this.page.locator('app-critical-popup.ng-star-inserted');
        const isPopupVisible = await popupLocator.isVisible().catch(() => false);

        if (isPopupVisible) {
          console.log('STEP 3: Critical Popup Detected');
          const continueBtn = this.page.getByText('Okay, Continue', { exact: false });
          await continueBtn.click();
          console.log('STEP 4: Clicked Continue on Popup');
        } else {
          console.log('STEP 3: No Critical Popup detected, proceeding directly');
        }

      } catch (popupError) {
        if (popupError instanceof Error) {
          console.log(`Popup check error: ${popupError.message}`);
        }
      }

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to navigate to Reporting screen: ${error.message}`);
      }
    }
  }
}