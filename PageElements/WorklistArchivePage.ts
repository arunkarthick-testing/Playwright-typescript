import{Page, expect, Locator} from "@playwright/test";
import { DashboardPage } from "./DashboardPage";  

export class WorklistArchivePage{
readonly page: Page;
private rowIndex: number = 1;
private colIndex: number = 7;
readonly MyWorklistTitle: Locator;
readonly CalenderIcon: Locator;
readonly last30days: Locator;
readonly searchBox: Locator;
readonly rippleRoundicon: Locator;
readonly reportingIcon: Locator;
readonly assinLink: Locator;
readonly assignToMeOption: Locator;
readonly statusDropdown: Locator;
 
constructor(page: Page, rowIndex: number = 1, colIndex: number = 7){
    this.page = page;
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.MyWorklistTitle = page.locator('//*[text()="My Worklist"]');
    this.CalenderIcon = page.getByRole('button', { name: 'Open calendar' });
    this.last30days = page.getByText('Last 30 days');
    this.searchBox = page.getByRole('textbox', { name: 'Patient Name/ID, Examination' });
    this.statusDropdown = page.locator('//mat-select/div[descendant::span[text()="All"]]');
    this.rippleRoundicon = page.locator('.mat-focus-indicator.mat-menu-trigger.float-r').first();
    this.reportingIcon = page.locator('button:nth-child(2) > .d-ib');
    this.assinLink = page.locator('xpath=//tbody[1]/tr[1]/td[7]/span/span/img');
    this.assignToMeOption = page.getByRole('menuitem', { name: 'Assign To Me' });
}

async verifyWorklistArchivePage(ExpectedTitle: string){
    await expect(this.MyWorklistTitle).toHaveText(ExpectedTitle);
    console.log('Landed on Worklist Archive page successfully');
};

async ApplyDateFilter(FromDate: string, ToDate: string): Promise<void>{
    const fromDateInput = this.page.locator('input[formcontrolname="fromDate"]');
    const toDateInput = this.page.locator('input[formcontrolname="toDate"]');
    const applyButton = this.page.locator('button:has-text("Apply")');

    await fromDateInput.fill(FromDate);
    await toDateInput.fill(ToDate);
    await applyButton.click();
    console.log(`Applied date filter from ${FromDate} to ${ToDate}`);   
};

async ApplyStatusFilter(Status: string): Promise<void>{
    await this.statusDropdown.click();
    const statusOption = this.page.getByRole('option', { name: Status });
    await statusOption.click();
    console.log(`Applied status filter: ${Status}`);    
}

async ApplyLast30DaysFilter(): Promise<void>{
    await this.CalenderIcon.click();
    await this.last30days.click()
    const fromDateInput = this.page.locator('input[formcontrolname="fromDate"]').getAttribute('min');
    const toDateInput = this.page.locator('input[formcontrolname="toDate"]').getAttribute('max');
    const selectedRange = `${fromDateInput} to ${toDateInput}`;
    console.log('Selected date range:' + selectedRange);
    console.log('Applied Last 30 Days filter');

};

async SearchPatient(searchItem: string): Promise<void>{
    await this.searchBox.click();
    await this.searchBox.clear();
    await this.searchBox.fill(searchItem);
    await this.searchBox.press('Enter');
    console.log(`Searched for patient with ID: ${searchItem}`);  
    const tableBody = this.page.locator('tbody[role="rowgroup"]');
    await tableBody.waitFor({ state: 'visible', timeout: 15000 });
    console.log('Search results are displayed');
};

async getPatientFirstRow(): Promise<Record<string, string>> {
    const rowData : Record<string, string> = {};

    try{
        const targetRow = this.page.locator('tbody[role="rowgroup"] tr').nth(this.rowIndex - 1);  // uses global rowIndex
      await targetRow.waitFor({ state: 'visible', timeout: 15000 });

        const cells = targetRow.locator('[role="cell"]');
        const cellCount = await cells.count();
        console.log(`Total number of columns in the study table: ${cellCount}`);

        for(let i = 0; i < cellCount; i++){
            const cell = cells.nth(i);
            const value = (await cell.getAttribute('aria-label')) ?? (await cell.innerText());
            rowData[`col_${i + 1}`] = value?.trim() ?? '';  // col_1, col_2 ... (1-based)
            console.log(`Cell value at column ${i + 1}: ${rowData[`col_${i + 1}`]}`);
            }
            return rowData;
       }catch(error){
    if(error instanceof Error){
        console.log(`Error in getPatientFirstRow: ${error.message}`);
    }
    return{};
   }
   
}

async getStudyStatus(): Promise<string>{
 try {
    const firstRow = this.page.locator('tbody[role="rowgroup"] tr').nth(this.rowIndex - 0);  // convert 1-based to 0-based index
    await firstRow.waitFor({ state: 'visible', timeout: 15000 });

    const cells = firstRow.locator('[role="cell"]');
    const cellCount = await cells.count();

    if (this.colIndex >= cellCount) {
      console.log(`Column index ${this.colIndex} is out of bounds. Total columns: ${cellCount}`);
      return '';
    }

    const cell = cells.nth(this.colIndex - 1);  // convert 1-based to 0-based index
    const status = (await cell.getAttribute('aria-label')) ?? (await cell.innerText());
    const trimmedStatus = status?.trim() ?? '';

    console.log(`Study status at row ${this.rowIndex}, col ${this.colIndex}: ${trimmedStatus}`);
    return trimmedStatus;

  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error in getStudyStatus: ${error.message}`);
    }
    return '';
  }
}


async verifyCriticalPopupAndNavigateReporting(): Promise<void> {
  try {
    // Click Menu
    await this.rippleRoundicon.waitFor({ state: 'visible', timeout: 10000 });
    await this.rippleRoundicon.click();
    console.log('STEP 1: Menu Clicked');

    // Click Reporting Icon
    await this.reportingIcon.waitFor({ state: 'visible', timeout: 10000 });
    await this.reportingIcon.click();
    console.log('STEP 2: Reporting Icon Clicked');

    // Check for Critical Popup using your exact locator
    const criticalPopup = this.page.locator('app-critical-popup');
    const isPopupVisible = await criticalPopup.isVisible().catch(() => false);

    if (isPopupVisible) {
      // Verify the popup text
      const popupText = await criticalPopup.innerText();

      if (popupText.includes('The study was marked as critical.')) {
        console.log('STEP 3: Critical Popup detected - Study marked as critical');

        //Click Okay Continue button
        const okayBtn = this.page.getByText('Okay, Continue', { exact: false });
        await okayBtn.waitFor({ state: 'visible', timeout: 5000 });
        await okayBtn.click();
        console.log('STEP 4: Clicked Okay Continue on Critical Popup');
      }

    } else {
      //No popup — already navigated to reporting via icon click above
      console.log('STEP 3: No Critical Popup detected. Navigated directly to Reporting.');
    }

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to navigate to Reporting screen: ${error.message}`);
    }
  }

}

async checkStatusAndNavigate(): Promise<void> {
  try{
     const status = await this.getStudyStatus();
     if (status !== 'UNASSIGNED') {
      // Already assigned — go straight to reporting
      console.log(`Study status: ${status}. Proceeding to Reporting.`);
      await this.verifyCriticalPopupAndNavigateReporting();
    } else {
      // Not assigned — assign first, then navigate
      console.log('Study is UNASSIGNED. Assigning study first...');
       await this.assignStudyToMe();
      await this.page.waitForTimeout(1000);
      await this.verifyCriticalPopupAndNavigateReporting();
    }
  }catch(error){
    if (error instanceof Error) {
      console.log(`Error in checkStatusAndNavigate: ${error.message}`);
    }
  }

}

async assignStudyToMe(): Promise<void> {
   await this.page.waitForTimeout(3000);
      await this.assinLink.waitFor({ state: 'visible', timeout: 2000 });
      await this.assinLink.click();
      await this.assignToMeOption.waitFor({ state: 'visible', timeout: 2000 });
      await this.assignToMeOption.click();
}







}