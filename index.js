import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] });
    const page = await browser.newPage();
    const timeout = 5000;
    page.setDefaultTimeout(timeout);
    // Set the viewport width to match the desired full-width size
    await page.setViewport({ width: 1920, height: 1080 }); // You can adjust the width and height as needed

    // Set the page width to match the viewport width
    await page.evaluate(() => {
        // This sets the page's width to match the viewport's width
        document.body.style.width = '100%';
    });
    {
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(page.waitForNavigation());
        }
        startWaitingForEvents();
        await page.goto('https://pptr.dev/');
        await Promise.all(promises);
    }
    // {
    //     await page.locator.race([
    //         page.locator('::-p-aria(Configuration)'),
    //         page.locator('li:nth-of-type(2) li:nth-of-type(1) > a'),
    //         page.locator('::-p-xpath(//*[@id=\\"__docusaurus_skipToContent_fallback\\"]/div/aside/div/div/nav/ul/li[2]/ul/li[1]/a)'),
    //         page.locator(':scope >>> li:nth-of-type(2) li:nth-of-type(1) > a')
    //     ])
    //         .setTimeout(timeout)
    //         .click({
    //             offset: {
    //                 x: 188,
    //                 y: 27,
    //             },
    //         });
    // }
    // {
    //     
    //     await page.locator.race([
    //         page.locator('::-p-aria(Examples)'),
    //         page.locator('li:nth-of-type(1) > ul a'),
    //         page.locator('::-p-xpath(//*[@id=\\"__docusaurus_skipToContent_fallback\\"]/div/main/div/div/div[2]/div/ul/li[1]/ul/li/a)'),
    //         page.locator(':scope >>> li:nth-of-type(1) > ul a')
    //     ])
    //         .setTimeout(timeout)
    //         .click({
    //             offset: {
    //                 x: 15.5,
    //                 y: 13.890625,
    //             },
    //         });
    // }
    // {
    //     
    //     await page.locator.race([
    //         page.locator('::-p-aria(Evaluate JavaScript)'),
    //         page.locator('li:nth-of-type(2) li:nth-of-type(4) > a'),
    //         page.locator('::-p-xpath(//*[@id=\\"__docusaurus_skipToContent_fallback\\"]/div/aside/div/div/nav/ul/li[2]/ul/li[4]/a)'),
    //         page.locator(':scope >>> li:nth-of-type(2) li:nth-of-type(4) > a'),
    //         page.locator('::-p-text(Evaluate JavaScript)')
    //     ])
    //         .setTimeout(timeout)
    //         .click({
    //             offset: {
    //                 x: 196,
    //                 y: 15,
    //             },
    //         });
    // }

    // await browser.close();

})().catch(err => {
    console.error(err);
    process.exit(1);
});
