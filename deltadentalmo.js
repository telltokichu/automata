import puppeteer from "puppeteer-extra";

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin())

const init = async () => {
    let path_to_extension = "https://chrome.google.com/webstore/detail/buster-captcha-solver-for/mpbjkejclgfgadiemmefgebjfooflfhl";
    const browser = await puppeteer.launch({
        slowMo: 10,
        headless: false,
        defaultViewport: null,
        args: [
            '--start-maximized',
            // `--disable-extensions-except=${path_to_extension}`,
            // `--load-extension=${path_to_extension}`
        ]
    });
    const page = await browser.newPage();

    await page.setViewport({ width: 1919, height: 1079 });
    await page.evaluate(() => {
        document.body.style.width = '100%';
    });
    await page.goto('https://www.deltadentalmo.com/Providers/Login')

    const recaptchaFrameSelector = 'iframe[title="reCAPTCHA"]'
    const frameHandle = await page.$(recaptchaFrameSelector)
    const frame = await frameHandle.contentFrame();

    const selector = '.rc-anchor-content .recaptcha-checkbox'
    await frame.waitForSelector(selector);
    await frame.click(selector);

    const propmtFrameSelector = 'body iframe[title="recaptcha challenge expires in two minutes"]'
    await page.waitForSelector(propmtFrameSelector);
    const propmtFrameHandle = await page.$(propmtFrameSelector)
    const propmtFrame = await propmtFrameHandle.contentFrame();
    const audioSelector = '.audio-button-holder button'
    await propmtFrame.waitForSelector(audioSelector);
    await propmtFrame.click(audioSelector);
    try {

        const audioELSelector = '.rc-audiochallenge-control audio';
        const audioElement = await propmtFrame.waitForSelector(audioELSelector);
        const audioSrc = await propmtFrame.evaluate((audio) => {
            return audio.getAttribute('src');
        }, audioElement);

        console.log('Audio source:', audioSrc);

    } catch (error) {
        console.log('error: ', error);

    }
    // await page.close()
    // await browser.close()

}

init()