import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] });
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });
    await page.evaluate(() => {
        document.body.style.width = '100%';
    });
    await page.goto('https://www.moneycontrol.com/markets/indian-indices/');


    const data = await page.evaluate(() => {
        const thr = document.querySelector('#indicesTableData thead tr');
        const thEl = Array.from(thr.querySelectorAll('th'));
        const keys = thEl.map((td) => td.textContent.trim());

        const tbody = document.querySelector('#indicesTableData tbody');
        const allRows = Array.from(tbody.querySelectorAll('tr'));
        let allData = []
        allRows.map((tr) => {
            const tds = Array.from(tr.querySelectorAll('td'));
            let trow = {}
            tds.map((td, index) => {
                trow[`${keys[index]}`] = td.textContent.trim()
            })
            allData.push(trow)
        })
        return allData;
    });
    console.log('data: ', data);
})();
