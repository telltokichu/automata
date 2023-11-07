import puppeteer from "puppeteer";
import fetch from "node-fetch";

// let apiToken = "24468ecc-684f-4a64-9f99-07ec7f8282fd";
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
        await page.type(emailInputSelector, 'abc');
        await page.screenshot({
            path: 'screenshot.jpg'
        });
        browser.disconnect();
    } catch (error) {
        console.log("error: ", error);
    }
};

const checkSession = async () => {
    try {
        const browser = await puppeteer.connect({
            "browserWSEndpoint": "ws://0.0.0.0:3000/devtools/browser/9ee52478-caf9-4d5e-a7c2-e60f2e3ba28c"
        });
        const pages = await browser.pages();
        for (let i = 0; i < pages.length; i++) {
            if (pages[i].url().includes('accounts.google.com')) {
                await pages[i].bringToFront();
                const emailInputSelector = 'input[type="email"]';
                await pages[i].waitForSelector(emailInputSelector);
                await pages[i].type(emailInputSelector, '@gmail.com');
                await pages[i].screenshot({
                    path: 'screenshot-check.jpg'
                });
            }
        }
        browser.disconnect();
    } catch (error) {
        console.log("error: ", error);
    }
};

// checkSession();
initialize();
