import puppeteer from 'puppeteer';

async function collectProductData(url) {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  
  await page.goto(url);
  
  await page.setViewport({width: 1080, height: 1024});

  //waiting for review section(that is located at the bottom of the page) to ensure that all the data is on the page
  await page.waitForSelector('section[class*="product-review"]');

  //page.evaluate function is executed in browser context that gives us access to document object
  const productData = await page.evaluate(() => {
    const getfilteredValue = (selector) => {
      let filteredValue = '';
      const el = document.querySelector(selector);
      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          filteredValue += node.textContent.trim();
        }
      });

      return filteredValue;
    };

    const getValue = (selector) => {
      const el  = document.querySelector(selector);
      return el  ? el.innerText.trim() : null;
    };
    
    const productName = getfilteredValue('h1');
    const brandName = getfilteredValue('a[class*="product-brand"]');
    const averageRating = getValue('#pdp-review-area > section > div.product-review__pdp-content > div > div > div:nth-child(1) > section > p');
    const numberOfReviews = getValue('#pdp-review-area > section > div.product-review__pdp-content > div > div > div:nth-child(1) > div');
    const availabilityStatus = document.querySelector('#buynowbutton') ? 'inStock' : 'outOfStock';
    const productPrice = getValue('#retailPrice');
    const productPicture = document.querySelector('#img_2').getAttribute('src');

    console.log('hi')

    return {
        productName,
        brandName,
        averageRating,
        numberOfReviews,
        availabilityStatus,
        productPrice,
        productPicture
    };
});
  
  console.log(productData);
}


const productUrl = 'https://www.revolve.com/437-the-v-legging-in-clay-mask/dp/437R-WP4/?d=Womens&page=1&lc=1&itrownum=1&itcurrpage=1&itview=05&hsclk21181=2&hspos=2';
const unavailableProduct = 'https://www.revolve.com/mobile/moon-boot-classic-low-2-bootie-in-pink/dp/MBOO-WZ7/?d=Womens&itrownum=2&itcurrpage=1&itview=01'

collectProductData(productUrl);

// I used Puppeteer to write parsing instruction and test selectors that would collect needed data.
// If the Service uses Puppeteer or other solution (like Cheerio) under the hood, then we only need to provide selectors for the Service to collect the data. 




