Feature('just do it');


Scenario('monitor nike', async function(I) {

    var list = await I.MonitorList();

    list = JSON.parse(list);

    for (var k = 0; k < list.length; k++) {
        try {
            I.amOnPage(list[k].url);
            let availiabled = await I.executeScript(function(size) {
                for (var i = 0; i < document.getElementsByName('skuAndSize').length; i++) {
                    if (document.getElementsByName('skuAndSize')[i].getAttribute('aria-label') === size && document.getElementsByName('skuAndSize')[i].getAttribute('disabled') != "") {
                        return true;
                    }
                }
                return false;
            }, list[k].size);

            if (availiabled) {
                await I.sendEmail('colin.chen@ehealth.com', 'ready for shopping!');
            }

        } catch (err) {
            console.log(err)
        }

    }


});