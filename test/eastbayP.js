const puppeteer = require('puppeteer');
 
(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    if (interceptedRequest.url().indexOf('www.eastbay.com') === -1){
    	console.log(interceptedRequest.url())
      interceptedRequest.abort();
    }
    else{
    	console.log(interceptedRequest.url())
      interceptedRequest.continue();
    }
  });
  console.log('xx');
  // await page.goto('https://www.eastbay.com/product/nike-pg-3-mens/2607005.html');
  await page.goto('https://www.eastbay.com/product/nike-pg-3-mens/2607005.html');
  console.log('yyy');
  await page.screenshot({path: 'example.png'});
 
  await browser.close();
})();