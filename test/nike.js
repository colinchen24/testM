Feature('just do it');

var dateFormat = require('dateformat');

Scenario('monitor nike', async function(I) {

    // console.log(process.env.TIME)

    var sleeptime=60;

    switch (process.env.TIME){
        case "sh":
            sleeptime=3;
            break;
        case "h":
            sleeptime=30;
            break;
    }

    // console.log(sleeptime);

    var list = await I.MonitorList({"frequency": process.env.TIME});
    list = JSON.parse(list);

    var samesizes = [];
    var isSameUrl = false;

    var now = dateFormat(new Date(), "isoDateTime");
    

    for (var k = 0; k < list.length; k++) {

        try {
            if (k !== 0 && (list[k-1].url === list[k].url)){
                console.log('url is the same with last one.');
                isSameUrl = true;
            } else {
                console.log(samesizes);
                if(k !==0 ){
                    I.track(samesizes);    
                }
                await I.clearCookie();
                isSameUrl = false;
                samesizes = [];
                // I.wait(2)
                I.amOnPage(list[k].url);
                // I.saveScreenshot('result.jpg');
                I.wait(sleeptime);
            }

            var availiabled = await I.executeScript(function(size, url) {
                if(!"".replaceAll){
                    String.prototype.replaceAll = function(search, replacement) {
                        var target = this;
                        return target.replace(new RegExp(search, 'g'), replacement);
                    };
                }

                if(!document) {
                    return false
                } else if(window.location.href !== url){
                    console.log('url changed')
                    return false;
                }
                else if (size === 'outOfStock') {
                    if (document && document.getElementById('RightRail') && document.getElementById('RightRail').innerText && document.getElementById('RightRail').innerText !== "" && document.getElementById('RightRail').innerText.indexOf('售罄') === -1) {
                        return true;
                    }
                } 
                else if (document.getElementsByClassName('exp-gridwall-header-titles')[0] && document.getElementsByClassName('exp-gridwall-header-titles')[0].innerText.indexOf('耐克产品 (') !== -1 
                        && document.getElementsByClassName('grid-item-box') && document.getElementsByClassName('grid-item-box')[0] 
                        && (size.split('&').length ===3) 
                        && (document.getElementsByClassName('grid-item-box')[0].innerText.replaceAll('\n','').indexOf(size.split('&')[0]) === -1 || document.getElementsByClassName('grid-item-box')[1].innerText.replaceAll('\n','').indexOf(size.split('&')[1]) === -1 || document.getElementsByClassName('grid-item-box')[2].innerText.replaceAll('\n','').indexOf(size.split('&')[2]) === -1)
                        ){
                    return true;
                } 
                else {
                    for (var i = 0; i < document.getElementsByName('skuAndSize').length; i++) {
                        if ((document.getElementsByName('skuAndSize')[i].getAttribute('aria-label') === size || document.getElementsByName('skuAndSize')[i].getAttribute('aria-label') === 'EU ' + size) && document.getElementsByName('skuAndSize')[i].getAttribute('disabled') != "") {
                            return true;
                        }
                    }
                }
                return false;
                 }, list[k].size, list[k].url);

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