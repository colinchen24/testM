Feature('just do it');

var dateFormat = require('dateformat');

Scenario('monitor nike', async function(I) {

    // console.log(process.env.TIME)

    var sleeptime=120;

    switch (process.env.TIME){
        case "sh":
            sleeptime=30;
            break;
        case "h":
            sleeptime=60;
            break;
    }

    // console.log(sleeptime);

    var list = await I.MonitorList({"frequency": process.env.TIME});

    var now = dateFormat(new Date(), "isoDateTime");

    list = JSON.parse(list);

    for (var k = 0; k < list.length; k++) {

        k = Math.floor(Math.random() * list.length);

        try {
            if (await I.grabCurrentUrl() === list[k].url) {
                console.log('url is the same with last one.');
            } else {
                await I.clearCookie();
                I.wait(2)
                I.amOnPage(list[k].url);
                // I.saveScreenshot('result.jpg');
                I.wait(sleeptime);
            }

            var availiabled = await I.executeScript(function(size) {
                if(!document) {
                    return false
                } else if (size === 'outOfStock') {
                    if (document && document.getElementById('RightRail') && document.getElementById('RightRail').innerText && document.getElementById('RightRail').innerText !== "" && document.getElementById('RightRail').innerText.indexOf('售罄') === -1) {
                        return true;
                    }
                } 
                else if (document.getElementsByClassName('exp-gridwall-header-titles')[0] && document.getElementsByClassName('exp-gridwall-header-titles')[0].innerText.indexOf('耐克产品 (') !== -1 && document.getElementsByClassName('exp-gridwall-header-titles')[0].innerText.indexOf('耐克产品 (' + size) === -1){
                    return true;
                } 
                else {
                    for (var i = 0; i < document.getElementsByName('skuAndSize').length; i++) {
                        if (document.getElementsByName('skuAndSize')[i].getAttribute('aria-label') === size && document.getElementsByName('skuAndSize')[i].getAttribute('disabled') != "") {
                            return true;
                        }
                    }
                }
                return false;
                 }, list[k].size);

            now = dateFormat(new Date(), "isoDateTime");

            if (availiabled) {
                // I.saveScreenshot('result.jpg');
                // await I.sendEmail('colin.chen@ehealth.com', 'ready for shopping: ' + list[k].url + " size: " + list[k].size);
                I.track({
                    "url": list[k].url,
                    "size": list[k].size,
                    "status": 'enabled',
                    "time": now
                })
            } else {
                I.track({
                    "url": list[k].url,
                    "size": list[k].size,
                    "status": 'disabled',
                    "time": now
                })
            }
            //forever running
            if(k === list.length-1){
                k = 0;
            }
        } catch (err) {
            now = dateFormat(new Date(), "isoDateTime");
            console.log(err)
            I.track({
                "url": list[k].url,
                "size": list[k].size,
                "status": 'error',
                "time": now
            })
        }


    }


});