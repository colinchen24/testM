Feature('just do it');

var dateFormat = require('dateformat');

Scenario('monitor nike', async function(I) {

    // console.log(process.env.TIME)

    var sleeptime = 60;

    switch (process.env.TIME) {
        case "sh":
            sleeptime = 3;
            break;
        case "eb":
            sleeptime = 3;
            break;
    }
    // console.log(sleeptime);
    var list = await I.MonitorList({
        "frequency": process.env.TIME
    });
    list = JSON.parse(list);

    var availiabled = false;
    var postHTML = '';
    var now = dateFormat(new Date(), "isoDateTime");
    var samesizes = [];

    for (var k = 0; k < list.length; k++) {
        if (k === 0 || list[k].url !== list[k - 1].url) {
            console.log(samesizes);
            if (samesizes && JSON.stringify(samesizes).indexOf('enabled') !== -1) {
                await I.track(samesizes);
                var samesizes = [];
            }
            await I.clearCookie();
            I.amOnPage(list[k].url);
            I.wait(3);
            postHTML = await I.grabHTMLFrom('.c-form-field');
            postHTML = postHTML.toString();
            // console.log(postHTML);
        }

        if (postHTML.toString().indexOf('Size ' + list[k].size +', out of stock') === -1) {
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
            var list = await I.MonitorList({
                "frequency": process.env.TIME
            });
            list = JSON.parse(list);
            k = 0;
        }
    }

});