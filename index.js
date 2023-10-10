import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] });
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });
    await page.evaluate(() => {
        document.body.style.width = '100%';
    });
    await page.goto('https://www.moneycontrol.com/markets/indian-indices/');
    // await page.goto('https://pptr.dev/api/puppeteer.page.waitfornavigation/');
    const getTableData = async () => {
        console.log("vanten")
        const data = await page.evaluate(() => {
            let allData = []
            const table = document.querySelector('#indicesTableData');
            const headers = Array.from(table.querySelectorAll('thead th')).map((td) => td.textContent.trim());
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            rows.map((tr) => {
                const cells = Array.from(tr.querySelectorAll('td'));
                let trow = {}
                cells.map((td, index) => {
                    trow[`${headers[index]}`] = td.textContent.trim()
                })
                allData.push(trow)
            })
            return allData;
        });
        return data;
    }

    let tableData = []
    let masterData = []
    const selector = '.ntlist li';
    await page.waitForSelector(selector);
    const list = await page.$$(selector)
    for (const liElement of list) {
        console.log('liElement: ', liElement);
        if (liElement) {
            await liElement.click();
            await new Promise(resolve => setTimeout(() => { resolve(true) }, 5000));
            // tableData = await getTableData()
            // masterData.push({
            //     [`${liElement.textContent.trim()}`]: tableData
            // })
        }
    }

})();
