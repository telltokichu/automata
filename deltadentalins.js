import puppeteer from "puppeteer";
import fs from 'fs';

const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] });
let urls = [
    "https://www.deltadentalins.com/RSO/signon.do",
    "https://www.deltadentalins.com/providertools/faces/Main.jspx",
    "https://www.deltadentalins.com/providertools/faces/Main.jspx?_afrLoop=3735865138192039&_afrWindowMode=0&_afrWindowId=lzatbw86t&_adf.ctrl-state=18ic7azzj7_1"
]
const loginAndStoreSession = async (page) => {
    const userNameInputSelector = "input[id='username']"
    const passwordInputSelector = "input[id='password']"
    const submitSelector = "input[id='loginButton']"
    await page.waitForSelector(userNameInputSelector)
    await page.waitForSelector(passwordInputSelector)
    await page.type(userNameInputSelector, 'TEAMIE');
    await page.type(passwordInputSelector, 'Inlandempire2');
    await page.click(submitSelector);

    // const eligibilitySubmitSelector = "a[id='My patients']"
    // await page.waitForSelector(eligibilitySubmitSelector)
    const session = await page.cookies();
    try {
        fs.writeFileSync('session.json', JSON.stringify(session, null, 4));
        console.log("File written succesfully")
    } catch (err) {
        console.error(err);
    }
    await browser.close()
}
const useSession = async (page) => {
    await page.goto('https://www1.deltadentalins.com/login.html');
    const sessionData = fs.readFileSync('session.json');
    const session = JSON.parse(sessionData);
    await page.setCookie(...session);
    await page.goto('https://www.deltadentalins.com/providertools/faces/Main.jspx');
}
const initialize = async () => {
    console.log("======= Scrapping Started =======")
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.evaluate(() => document.body.style.width = '100%');
    // await page.goto('https://www1.deltadentalins.com/login.html');

    // await loginAndStoreSession(page);
    await useSession(page);
    // const session = await page.cookies();
    console.log("======= Scrapping Finished =======")
    // await browser.close()
}

initialize();