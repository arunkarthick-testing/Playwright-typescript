
import {test, expect, Page} from '@playwright/test'
import { POManager } from '../../PageElements/POManager';


test('ValidateHODLogin',async({page})=>{
    const pom = new POManager(page);
    const loginData: any = await pom.getLoginPage().loginAndVerifyRoles('user.0','user@0');
    console.log(await page.title());
    expect(loginData.actualRoles).toEqual(expect.arrayContaining(['radiologist','hod']));
    await pom.getDashboardPage().ValidateLoginnedUser('Dr. Vijay Sadasivam DMRD, DNB.');
    
});

test('ValidateDutyRadiologistLogin',async({page})=>{
    const pom = new POManager(page);
    const loginData: any = await pom.getLoginPage().loginAndVerifyRoles('user.14','user@14');
    console.log(await page.title());
    expect(loginData.actualRoles).toEqual(expect.arrayContaining(['radiologist','duty radiologist']));
    await pom.getDashboardPage().ValidateLoginnedUser('Dr. R. Sandhiya, MDRD., DNB');
});

test('ValidateJuniorRadiologistLogin',async({page})=>{
    const pom = new POManager(page);
    const loginData: any = await pom.getLoginPage().loginAndVerifyRoles('user.11','user@11');
    console.log(await page.title());
    expect(loginData.actualRoles).toEqual(expect.arrayContaining(['radiologist','junior radiologist']));
    await pom.getDashboardPage().ValidateLoginnedUser('Dr. Alexander Graham Bell DNRD MD(RADIODIAGNOSIS-AIIMS).,');
});

test('ValidatePGLogin',async({page})=>{
    const pom = new POManager(page);
    const loginData: any =await pom.getLoginPage().loginAndVerifyRoles('user.6','user@6');
    console.log(await page.title());
    expect(loginData.actualRoles).toEqual(expect.arrayContaining(['radiologist','pg students']));
    await pom.getDashboardPage().ValidateLoginnedUser('Dr. Aravindhan A MBBS.,');
});

test('ValidateSonologistLogin',async({page})=>{
    const pom = new POManager(page);
    const loginData: any =await pom.getLoginPage().loginAndVerifyRoles('user.10','user@10');
    console.log(await page.title());
    expect(loginData.actualRoles).toEqual(expect.arrayContaining(['radiologist','sonologist']));
    await pom.getDashboardPage().ValidateLoginnedUser('Adam Transcriptionist');
});

test('ValidateReferringDoctorLogin',async({page})=>{
    const pom = new POManager(page);
    const loginData: any =await pom.getLoginPage().loginAndVerifyRoles('user.501','user501');
    console.log(await page.title());
    expect(loginData.actualRoles).toEqual(expect.arrayContaining(['referring doctor']));
    await pom.getDashboardPage().ValidateLoginnedUser('Dr Nishanth MBBS');
});

test('ValidateAdminLogin',async({page})=>{
    const pom = new POManager(page);
    const loginData: any = await pom.getLoginPage().loginAndVerifyRoles('raster','raster');
    console.log(await page.title());
    expect(loginData.actualRoles).toEqual(expect.arrayContaining(['admin']));
    await pom.getDashboardPage().ValidateLoginnedUser('Administrator');
});

test('ValidateGatekeeperLogin',async({page})=>{
    const pom = new POManager(page);
    const loginData: any = await pom.getLoginPage().loginAndVerifyRoles('user.201','user201');
    console.log(await page.title());
    expect(loginData.actualRoles).toEqual(expect.arrayContaining(['gatekeeper']));
    await pom.getDashboardPage().ValidateLoginnedUser('Vijayan R');
});

test('ValidateTechnicianLogin',async({page})=>{
    const pom = new POManager(page);
    const loginData: any = await pom.getLoginPage().loginAndVerifyRoles('tech','123');
    console.log(await page.title());
    expect(loginData.actualRoles).toEqual(expect.arrayContaining(['technician']));
    await pom.getDashboardPage().ValidateLoginnedUser('Ramesh Kumar. J Technician');
});

test('ValidateTranscriptionistLogin',async({page})=>{
    const pom = new POManager(page);
    const loginData: any = await pom.getLoginPage().loginAndVerifyRoles('padma.s','123');
    console.log(await page.title());
    expect(loginData.actualRoles).toEqual(expect.arrayContaining(['transcriptionist']));
    await pom.getDashboardPage().ValidateLoginnedUser('Padmavathi.S');
});

test('ValidateWardUserLogin',async({page})=>{
    const pom = new POManager(page);
     const loginData: any = await pom.getLoginPage().loginAndVerifyRoles('user.701','user701');
    console.log(await page.title());
    expect(loginData.actualRoles).toEqual(expect.arrayContaining(['ward user']));
    await pom.getDashboardPage().ValidateLoginnedUser('PWD SKS');
});