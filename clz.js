const puppeteer = require('puppeteer');
const scrape = async (body, post, minYear, maxPrice) => {
    recreate_table();
     const browser = await puppeteer.launch({
        headless: false
    });
    //open a new page
    const page = await browser.newPage();
    //Go to autotrader website
    await page.goto('https://www.hermes.com/ca/en/');
    
    }