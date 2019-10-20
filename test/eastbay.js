Feature('just do it');

var dateFormat = require('dateformat');

Scenario('monitor nike', async function(I) {

    // console.log(process.env.TIME)

    var sleeptime=60;

    switch (process.env.TIME){
        case "sh":
            sleeptime=3;
            break;
        case "eb":
            sleeptime=3;
            break;
    }

    // console.log(sleeptime);

    var list = await I.MonitorList({"frequency": process.env.TIME});
    list = JSON.parse(list);

    list = [{"url" : "https://www.eastbay.com/product/nike-pg-3-mens/2607005.html", "size": "07.0"},
            {"url" : "https://www.eastbay.com/product/nike-pg-3-mens/2607005.html", "size": "07.5"},
            {"url" : "https://www.eastbay.com/product/nike-pg-3-mens/2607005.html", "size": "08.0"},
            {"url" : "https://www.eastbay.com/product/nike-pg-3-mens/2607005.html", "size": "08.5"},
            {"url" : "https://www.eastbay.com/product/nike-pg-3-mens/2607005.html", "size": "09.0"}]

    var samesizes = [];

    var availiabled = false;

    var now = dateFormat(new Date(), "isoDateTime");

    I.amOnPage('https://www.eastbay.com/category/shoes/nike.html');
    

    for (var k = 0; k < list.length; k++) {

        try {
            if (k === 0 || (list[k-1].url !== list[k].url)){
                if(k !==0){
                    I.track(samesizes);
                    samesizes = [];
                }
                
                var productHtml = await I.executeScript(function(url) {
                    var xmlHttp = new XMLHttpRequest();
                    // var result = '';
                    
                    xmlHttp.open("GET", 'https://www.eastbay.com/product/nike-pg-3-mens/2607005.html', true); // true for asynchronous 
                    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    xmlHttp.send();

                    var result = xmlHttp.onreadystatechange = function() {
                        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                            result = xmlHttp.responseText.split("\"c-form-field\"")[1].split("ProductDetails-form__label")[0];
                            // console.log(result);
                            return result;
                        }
                    // console.log(xmlHttp.responseText)
                    }
                    
                    setTimeout(function(){return result;},1000)

                    // return result;
                 
                }, list[k].url);
            }

            console.log(productHtml);

            if(productHtml.indexOf('Size ' + list[k].size + ', out of stock') === -1){
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
            if(k === list.length-1){
                var list = await I.MonitorList({"frequency": process.env.TIME});
                list = JSON.parse(list);
                k = 0;
            }
        } catch (err) {
            console.log(err)
        }


    }


});