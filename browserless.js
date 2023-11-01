import puppeteer from "puppeteer";
import fetch from "node-fetch";

let browser;
let apiToken = "24468ecc-684f-4a64-9f99-07ec7f8282fd";
let trackingId = "eb5863b8-4496-4f87-b1cb-7ededa995d4b";

const initialize = async () => {
    try {
        browser = await puppeteer.connect({
            browserWSEndpoint: `ws://localhost:3000?keepalive=300000&trackingId=${trackingId}&headless=false`,
        });
        const page = await browser.newPage();
        await page.goto("http://github.com");
        console.log("Title", await page.title());
    } catch (error) {
        console.log("error: ", error);
    } finally {
        if (browser) {
            browser.disconnect();
        }
    }
};

initialize();
