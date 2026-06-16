import { Page } from "@playwright/test";
import { DashboardPage } from "./DashboardPage";
import { LoginPage } from "./LoginPage";
import { WorklistArchivePage } from "./WorklistArchivePage";


export class POManager{
readonly page: Page;
readonly loginPage: LoginPage;
readonly dashboardPage: DashboardPage;
readonly worklistArchivePage: WorklistArchivePage;
    constructor(page: Page){
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.worklistArchivePage = new WorklistArchivePage(page);
    
}

getLoginPage(): LoginPage{
    return this.loginPage;
}

getDashboardPage(): DashboardPage{
    return this.dashboardPage;
}

getWorklistArchivePage(): WorklistArchivePage{
    return this.worklistArchivePage;
}


}