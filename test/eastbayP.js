var puppeteer = require('puppeteer');
var request = require('request');
var dateFormat = require('dateformat');
var q = require('q');

(async () => {
  var availiabled = false;
  var postHTML = '';
  var now = dateFormat(new Date(), "isoDateTime");
  var samesizes = [];
  var sleeptime = 3;

  function MonitorList(body) {
    var defer = q.defer();
    request.post({
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'http://176.122.147.10:2222/test/getmonitor',
      body: JSON.stringify(body)
    }, function(error, response, body) {
      // console.log(response.body)
      if (!response) {
        return defer.resolve([]);
      } else {
        return defer.resolve(response.body);
      }

    });
    return defer.promise;
  };

  function sleep(delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(1)
        } catch (e) {
          reject(0)
        }
      }, delay)
    })
  }

  function track(data) {
    var defer = q.defer();
    request.post({
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'http://176.122.147.10:2222/test/track',
      body: JSON.stringify(data)
    }, function(error, response, body) {
      // console.log(response.body)
      if (!response) {
        return defer.resolve([]);
      } else {
        return defer.resolve(response.body);
      }
    });
    return defer.promise;
  };


  // console.log('xx');
  // await page.goto('https://www.eastbay.com/product/nike-pg-3-mens/2607005.html');
  var list = await MonitorList({
    "frequency": "eb"
  });
  list = JSON.parse(list);

  for (var k = 0; k < list.length; k++) {

    if (k === 0 || list[k].url !== list[k - 1].url) {
      if (samesizes && JSON.stringify(samesizes).indexOf('enabled') !== -1) {
        console.log(samesizes);
        await track(samesizes);
        var samesizes = [];
      }
      // await page.clearCookie();
      // console.log(list[k].url)
      await sleep(1000);

      if(k !== 0){
        await browser.close();
      }
      
      await sleep(2000);
      var browser = await puppeteer.launch({
        headless: false,
        args: ['--proxy-server="http=176.122.147.10:8085"']
      });
      var page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on('request', interceptedRequest => {
        if (interceptedRequest.url().indexOf('www.eastbay.com') === -1 || interceptedRequest.url().indexOf('https://www.eastbay.com/built/29/') !== -1) {
          // console.log(interceptedRequest.url())
          interceptedRequest.abort();
        } else {
          // console.log(interceptedRequest.url())
          interceptedRequest.continue();
        }
      });

      await page.goto(list[k].url);
      await sleep(1000);
      
      postHTML = await page.$eval('.ProductDetails-form__info', ele => ele.innerHTML);
      postHTML = postHTML.toString();
      // console.log(postHTML);
    }

    if (postHTML.toString().indexOf('Size ' + list[k].size + ', out of stock') === -1) {
      availiabled = true;
    } else {
      availiabled = false;
    }
    now = dateFormat(new Date(), "isoDateTime");
    if (availiabled) {
      samesizes.push({
        "url": list[k].url,
        "size": list[k].size,
        "status": 'enabled',
        "time": now
      })
    } else {
      samesizes.push({
        "url": list[k].url,
        "size": list[k].size,
        "status": 'disabled',
        "time": now
      })
    }
    //forever running
    if (k === list.length - 1) {
      var list = await MonitorList({
        "frequency": process.env.TIME
      });
      list = JSON.parse(list);
      k = 0;
    }
    // await browser.close();
  }
  // await browser.close();
})();