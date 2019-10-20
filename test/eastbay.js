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

    I.amOnPage('https://www.eastbay.com/product/nike-pg-3-mens/2607005.html');  
    let postHTML = await I.grabHTMLFrom('.c-form-field');
    console.log(postHTML)

});