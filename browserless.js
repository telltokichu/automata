import puppeteer from "puppeteer";
import fetch from "node-fetch";

let apiToken = "24468ecc-684f-4a64-9f99-07ec7f8282fd";
let trackingId = "eb5863b8-4496-4f87-b1cb-7ededa995d4b";

const initialize = async () => {
    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: `ws://localhost:3000?keepalive=3000000&trackingId=${trackingId}&headless=false`,
        });
        const page = await browser.newPage();
        await page.goto(
            "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Faccounts.google.com%2F&followup=https%3A%2F%2Faccounts.google.com%2F&ifkv=AVQVeyxxvTvqDCiIGC3rNzmzOC0sa_eJGM9rfyZT5gIjAs4Z1BA6UbAB-5gHxMmOJ04iVD60Qj8rwQ&passive=1209600&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S687925151%3A1698923301279918&theme=glif"
        );
        const emailInputSelector = 'input[type="email"]';
        await page.waitForSelector(emailInputSelector);
        await page.type(emailInputSelector, 'telltokichu');
        await page.screenshot({
            path: 'screenshot.jpg'
        });
        console.log("Title", await page.title());
        browser.disconnect();
    } catch (error) {
        console.log("error: ", error);
    }
};

const checkSession = async () => {
    try {
        const browser = await puppeteer.connect({
            "browserWSEndpoint": "ws://0.0.0.0:3000/devtools/browser/460e062b-5852-4f06-9614-a38ba6891d26"
        });
        const pages = await browser.pages();
        pages.map((page) => {
            console.log('page: ', page);

        })
        // const page = await browser.newPage();
        // await page.goto(
        //     "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Faccounts.google.com%2F&followup=https%3A%2F%2Faccounts.google.com%2F&ifkv=AVQVeyxxvTvqDCiIGC3rNzmzOC0sa_eJGM9rfyZT5gIjAs4Z1BA6UbAB-5gHxMmOJ04iVD60Qj8rwQ&passive=1209600&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S687925151%3A1698923301279918&theme=glif"
        // );
        // await page.screenshot({
        //     path: 'screenshot-check.jpg'
        // });
        // console.log("Title", await page.title());
        browser.disconnect();
    } catch (error) {
        console.log("error: ", error);
    }
};
checkSession();
// initialize();
