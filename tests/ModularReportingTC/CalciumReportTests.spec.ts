import { test, expect } from '@playwright/test';
import { POManager } from '../../PageElements/POManager';

test.describe.serial('Calcium Report Tests', () => {

    test('Navigate Reporting and load calcium report', async ({ page }) => {
       const pom = new POManager(page);
       await pom.getLoginPage().launchURL();
       await pom.getLoginPage().login('user.0', 'user@0');
       await expect(page).toHaveTitle('RIS | Front Office');
       console.log('Login successful');
       await pom.getDashboardPage().clickOnWorklistArchive();
       await pom.getWorklistArchivePage().verifyWorklistArchivePage('My Worklist');
       // Further steps to navigate to calcium report and verify its loading can be added here
       await pom.getWorklistArchivePage().ApplyLast30DaysFilter();
       await pom.getWorklistArchivePage().ApplyStatusFilter('UNASSIGNED');
       await pom.getWorklistArchivePage().SearchPatient('585521');
       await pom.getWorklistArchivePage().checkStatusAndNavigate();
    });







});