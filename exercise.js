import puppeteer from "puppeteer";
import fs from 'fs/promises';

const browser = await puppeteer.launch({ headless: "new", defaultViewport: null, args: ['--start-maximized'] });

const getIndexData = async (url) => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(`#indicesTable tbody tr`);
    const indexDetails = await page.$$eval(
        "#indicesTable tbody tr",
        (rows) =>
            rows.map((row) => {
                if (row.querySelector("td:nth-child(2)")) {
                    return {
                        name: row.querySelector("td").textContent.trim(),
                        lastTradedPrice: row.querySelector("td:nth-child(2)").textContent.trim(),
                        change_percentage:
                            row.querySelector("td:nth-child(3)").textContent.trim(),
                        volume: row.querySelector("td:nth-child(4)").textContent.trim(),
                        buy_price: row.querySelector("td:nth-child(5)").textContent.trim(),
                        sell_price: row.querySelector("td:nth-child(6)").textContent.trim(),
                        buy_qty: row.querySelector("td:nth-child(7)").textContent.trim(),
                        sell_qty: row.querySelector("td:nth-child(8)").textContent.trim(),
                    };
                } else {
                    return {
                        name: '',
                        lastTradedPrice: '',
                        change_percentage: '',
                        volume: '',
                        buy_price: '',
                        sell_price: '',
                        buy_qty: '',
                        sell_qty: '',
                    }
                }
            })
    );
    page.close();
    return indexDetails;
}

const getIndicesData = async (page) => {
    return await page.$$eval('.ntlist li', (indices) => indices.map((i) => ({
        name: i.textContent.trim(),
        url: i.querySelector('h2 a').href
    })));
}

const saveAsJson = async (data) => {
    try {
        await fs.writeFile('indices.json', JSON.stringify(data, null, 4));
        console.log("File written succesfully")
    } catch (err) {
        console.error(err);
    }
}

const initialize = async () => {
    console.log("======= Scrapping Started =======")
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.evaluate(() => document.body.style.width = '100%');
    await page.goto('https://www.moneycontrol.com/markets/indian-indices/');
    let masterData = {};
    const indices = await getIndicesData(page);
    console.log("Retrived Indices Data")
    for (let i = 0; i < indices.length; i++) {
        masterData[indices[i].name] = await getIndexData(indices[i].url)
        console.log(`Scrapping - ${indices[i].name} data`)
    }
    await saveAsJson(masterData)
    console.log("======= Scrapping Finished =======")
    await browser.close()
}

initialize();