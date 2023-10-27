import puppeteer from "puppeteer";
import fs from 'fs';

const browser = await puppeteer.launch({ headless: "new" });
async function individualStocks(url) {
    const page = await browser.newPage();
    await page.goto(url);
    const stocksDetails = await page.$$eval(
        "#indicesTable tbody tr",
        (elements) =>
            elements.map((e) => {
                if (e.querySelector("td:nth-child(2)")) {
                    return {
                        title: e.querySelector("td a").innerText,
                        LTP: e.querySelector("td:nth-child(2)").innerText,
                        changePercentage:
                            e.querySelector("td:nth-child(3)").innerText + "%",
                        volume: e.querySelector("td:nth-child(4)").innerText,
                        buyPrice: e.querySelector("td:nth-child(5)").innerText,
                        sellPrice: e.querySelector("td:nth-child(6)").innerText,
                        buyQTY: e.querySelector("td:nth-child(7)").innerText,
                        sellQTY: e.querySelector("td:nth-child(8)").innerText,
                    };
                } else {
                    return {
                        data: e.querySelector("td").innerText,
                    };
                }
            })
    );
    page.close();
    return stocksDetails;
}
async function allStocksInIndividualIndices(page, index) {
    const stocksCategories = await page.$$eval(".ntlist li", (elements) =>
        elements.map((e) => ({
            title: e.querySelector("h2 a").innerText,
            url: e.querySelector("h2 a").href,
        }))
    );
    let allStocks = {};
    for (let i = 0; i < stocksCategories.length; i++) {
        console.log(index + " -> " + stocksCategories[i].title + " started");
        allStocks[stocksCategories[i].title] = await individualStocks(
            stocksCategories[i].url
        );
    }
    return allStocks;
}
async function allStocks() {
    const page = await browser.newPage();
    await page.goto("https://www.moneycontrol.com/markets/indian-indices");

    const indices = await page.$$eval("select#indicesDropdown option", (all) =>
        all.map((a) => ({ index: a.textContent, value: a.value }))
    );
    console.log();
    let allStocks = {};
    for (let i = 0; i < indices.length; i++) {
        console.log(indices[i].index + " started");
        console.log("<---------------------------------------->");
        await page.select("select#indicesDropdown", indices[i].value);
        await page.waitForSelector("#indicesDropdown");
        allStocks[indices[i].index] = await allStocksInIndividualIndices(
            page,
            indices[i].index
        );
        console.log("<---------------------------------------->");
    }
    fs.writeFileSync("stocks.json", JSON.stringify(allStocks), (err) => {
        if (err) throw err;
        console("data written in file ");
    });
    await browser.close();
}

allStocks();