
Feature('just do it');

var dateFormat = require('dateformat');

Scenario('monitor nike', async function(I) {

    var list = await I.MonitorList();

    var now =dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT");

    list = JSON.parse(list);

    for (var k = 0; k < list.length; k++) {
        try {
            I.wait(10);
            I.amOnPage(list[k].url);
            let availiabled = await I.executeScript(function(size) {
                for (var i = 0; i < document.getElementsByName('skuAndSize').length; i++) {
                    if (document.getElementsByName('skuAndSize')[i].getAttribute('aria-label') === size && document.getElementsByName('skuAndSize')[i].getAttribute('disabled') != "") {
                        return true;
                    }
                }
                return false;
            }, list[k].size);
            if (!availiabled) {
                I.saveScreenshot('result.jpg');
                await I.sendEmail('colin.chen@ehealth.com', 'ready for shopping: ' + list[k]);
                I.track({"url": list[k].url, "size": list[k].size, "status": 'enabled', "time": now})
            } else {
                I.track({"url": list[k].url, "size": list[k].size, "status": 'disabled', "time": now})
            }

        } catch (err) {
            console.log(err)
            I.track({"url": list[k].url, "size": list[k].size, "status": 'error', "time": now})
        }

    }


});