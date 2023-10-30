import puppeteer from "puppeteer";
import fs from 'fs';

const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] });

// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const AnonymizeUAPlugin = require('puppeteer-extra-plugin-anonymize-ua');

// puppeteer.use(StealthPlugin());
// puppeteer.use(AnonymizeUAPlugin());

// (async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   await page.goto('https://provideraccess.dentaquest.com/');
//   // ... your login code here

//   // Store the session
// //   const session = await page.cookies();

//   // Save the session to a file or database
//   // Example: Save to a file
// //   const fs = require('fs');
// //   fs.writeFileSync('session.json', JSON.stringify(session, null, 2));

//   await browser.close();
// })();
const loginAndStoreSession = async (page) => {
    const userNameInputSelector = "input[name='USER']"
    const passwordInputSelector = "input[name='PASSWORD']"
    const submitSelector = "input[name='btnSubmit']"
    await page.waitForSelector(userNameInputSelector)
    await page.waitForSelector(passwordInputSelector)
    await page.type(userNameInputSelector, 'humble');
    await page.type(passwordInputSelector, 'Element25!');
    await page.click(submitSelector);

    const eligibilitySubmitSelector = "a[id='searchClick']"
    await page.waitForSelector(eligibilitySubmitSelector)
    const session = await page.cookies();
    try {
        fs.writeFileSync('session.json', JSON.stringify(session, null, 4));
        console.log("File written succesfully")
    } catch (err) {
        console.error(err);
    }
}
const useSession = async (page) => {
    const sessionData = fs.readFileSync('session.json');
    const session = JSON.parse(sessionData);
    await page.setCookie(...session);
    await page.goto('https://provideraccess.dentaquest.com/');
}
const initialize = async () => {
    console.log("======= Scrapping Started =======")
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.evaluate(() => document.body.style.width = '100%');
    await page.goto('https://provideraccess.dentaquest.com/');

    // await loginAndStoreSession(page); 
    await useSession(page);
    // const session = await page.cookies();
    console.log("======= Scrapping Finished =======")
    // await browser.close()
}

initialize();