const puppeteer = require('puppeteer');


const main = async (url) => {

    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    try {
        await page.goto(url, {waitUntil: 'networkidle2', timeout: 50000});

        await page.click('#atc_pickItUp');

        await page.waitFor(8000);

        const frameHandle = await page.$("iframe[class='thd-overlay-frame']");

        const frame = await frameHandle.contentFrame();

        await frame.waitForSelector('button.test__confirmStoreButton');

        const button = await frame.$('button.test__confirmStoreButton');
        await button.click();

        await page.waitFor(7000);

        await page.goto('https://www.homedepot.com/mycart/home', {waitUntil: 'networkidle2', timeout: 500000});

        await page.waitForSelector('[data-automation-id="promotionHaveAPromoCodeLink"]');

        await page.waitFor(5000);

        const labels = await page.$$('[data-automation-id="promotionHaveAPromoCodeLink"]');

        await labels[0].click();

        await page.waitFor(1000);

        const input = await page.$$('input[data-automation-id="promotionPromoCodeTextBox"]');

        await input[0].type('12345678912345');

        await page.waitFor(1000);

        const buttons = await page.$$('span[data-automation-id="promotionApplyButton"]');

        await buttons[0].click();

        await page.waitFor(3000);

        let cookiesObject = await page._client.send('Network.getAllCookies');

        let cookies = cookiesObject.cookies;

        let cookieStr = '';

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            cookieStr += cookie.name + "=" + cookie.value + ";";
        }

        await browser.close();

        return cookieStr;
    }catch (e) {
        console.log(e);
        await browser.close();
        return null;
    }

};

module.exports.automate = main;