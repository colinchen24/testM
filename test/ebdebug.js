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
      url: 'https://176.122.147.10:2222/test/getmonitor',
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
      url: 'https://176.122.147.10:2222/test/track',
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

  // await page.goto('https://www.eastbay.com/product/nike-pg-3-mens/2607005.html');
  var list = await MonitorList({
    "frequency": "eb"
  });
  list = JSON.parse(list);
  list = [{
        "_id": "5db232126148480b16de7497",
        "discount": "yes",
        "email": "",
        "frequency": "eb",
        "price": "91.00",
        "size": "07.5",
        "url": "https://www.eastbay.com/product/jordan-aj-1-low-mens/53558128.html",
        "__v": 0,
        "time": "2019-10-24T23:23:01.000Z",
        "status": "enabled"
    },{
        "_id": "5db232126148480b16de7497",
        "discount": "yes",
        "email": "",
        "frequency": "eb",
        "price": "90.00",
        "size": "07.5",
        "url": "https://www.eastbay.com/product/jordan-aj-1-low-mens/53558128.html",
        "__v": 0,
        "time": "2019-10-24T23:23:01.000Z",
        "status": "enabled"
    }];

    var k = 0;

  console.log(list);

  // for (var k = 0; k < list.length; k++) {

    if (k === 0 || list[k].url !== list[k - 1].url) {

      if(list.length > 15){
        k = Math.floor(Math.random()*list.length);  
      }
      
      if (samesizes && JSON.stringify(samesizes).indexOf('enabled') !== -1) {
        console.log(samesizes);
        // await track(samesizes);
        var samesizes = [];
      }
      // await page.clearCookie();
      // console.log(list[k].url)
      await sleep(1000);

      if(k !== 0){
        await browser.close();
      }
      
      await sleep(1000);
      var browser = await puppeteer.launch({
        headless: false,
        args: ['--proxy-server="http=176.122.147.10:8085"']
      });
      await sleep(2000);
      var page = await browser.newPage();
      await sleep(2000);
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

      await page.goto(list[k].url,{
        timeout: 60000
      });

      await sleep(1000);
      
      // postHTML = await page.$eval('#ProductDetails', ele => ele.innerHTML);
      postHTML = await page.$eval('#main', ele => ele.innerHTML);
      postHTML = postHTML.toString();
      // message = message.toString();
      console.log(postHTML);
    }
    
    await sleep(1000);
    console.log(list[k].url)

    if (list[k].size !== '' && postHTML.toString().indexOf('Size ' + list[k].size + ', out of stock') === -1 
      && postHTML.toString().indexOf('The product you are trying to view is no longer available') === -1) {
      console.log('size out of stack not shown');
      availiabled = true;
    } else if( (list[k].discount !=='' &&
      postHTML.toString().indexOf('The product you are trying to view is no longer available') === -1
      && postHTML.toString().indexOf('Excluded from discount') === -1) 
      || (list[k].price !== '' 
        && postHTML.toString().indexOf('The product you are trying to view is no longer available') === -1
        && postHTML.toString().split('">$')[1].split('<')[0] !== list[k].price) ){
      console.log((list[k].discount !=='' && postHTML.toString().indexOf('Excluded from discount') === -1) )

      console.log('discount or price is changed');
      console.log((list[k].price !== '' && postHTML.toString().split('">$')[1].split('</span>')[0] !== list[k].price))
      availiabled = true;
    } else {
      console.log('availiabled false');
      availiabled = false;
    }

    now = dateFormat(new Date(), "isoDateTime");
    if(postHTML.indexOf(list[k].url.split('/')[list[k].url.split('/').length -1 ].split(".")[0]) !== -1){
      
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
    } else{
      console.log("missing match searching");
    }
    
    //forever running
    // Math.floor(Math.random()*list.length);

    // console.log(samesizes)

    if (k === list.length - 1) {
      var list = await MonitorList({
        "frequency": "eb"
      });
      list = JSON.parse(list);
      k = 0;
    }
    // await browser.close();
  // }
  // await browser.close();
})();