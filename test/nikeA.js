Feature('just do it');

var dateFormat = require('dateformat');

Scenario('monitor nike', async function(I) {

    // console.log(process.env.TIME)

    var sleeptime = 60;

    switch (process.env.TIME) {
        case "sh":
            sleeptime = 1;
            break;
        case "h":
            sleeptime = 30;
            break;
    }

    // console.log(sleeptime);

    var list = await I.MonitorList({
        "frequency": process.env.TIME
    });
    list = JSON.parse(list);

    var slist = [];

    for (var i = 0; i < list.length; i++) {
        slist.push(list[i])
    }

    list = slist;
    var samesizes = [];


    function getZoneTime() {
        var localtime = new Date();
        var localmesc = localtime.getTime();
        var localOffset = localtime.getTimezoneOffset() * 60000;
        var utc = localOffset + localmesc;
        var calctime = utc + (3600000 * 8);
        var nd = new Date(calctime);
        return nd.toDateString() + " " + nd.getHours() + ":" + nd.getMinutes() + ":" + nd.getSeconds();
    }
    var now = getZoneTime();
    var k = Math.floor(Math.random() * Math.floor(list.length))
    var htmlcontext = '';
    for (k; k < list.length; k++) {

        console.log('k = 0 or url different ==' + k + "url " + list[k].url + " size " + list[k].size);

        try {
            if (k === 0 || (k !== 0 && list[k - 1].url !== list[k].url)) {


                if (samesizes.length !== 0) {
                    console.log('save track: ' + list[k].url);
                    await I.track(samesizes);
                    samesizes = [];
                }
                await I.clearCookie();


                // I.wait(2)
                // I.wait(sleeptime);
                await I.amOnPage(list[k].url);
                // I.saveScreenshot('result.jpg');
                I.wait(sleeptime);
                htmlcontext = await I.executeScript(function(url, size, price) {
                    if (!"".replaceAll) {
                        String.prototype.replaceAll = function(search, replacement) {
                            var target = this;
                            return target.replace(new RegExp(search, 'g'), replacement);
                        };
                    }

                    if (document.body.innerText.indexOf('NikePlus') === -1 || document.body.innerText.indexOf('Forbidden access') !== -1) {
                        // console.log('no document');
                        return "Forbidden"
                    } else if (window.location.href !== url) {
                        return "url changed";
                    } else if (url === 'https://www.nike.com/cn/w/new-shoes-3n82yzy7ok?sort=newest' && document.getElementsByClassName('product-card__body').length > 2 &&
                        (document.getElementsByClassName('product-card__body')[0].innerText.replaceAll('\n', '').indexOf(size.split('&')[0]) === -1 || document.getElementsByClassName('product-card__body')[1].innerText.replaceAll('\n', '').indexOf(size.split('&')[1]) === -1 || document.getElementsByClassName('product-card__body')[2].innerText.replaceAll('\n', '').indexOf(size.split('&')[2]) === -1)
                    ) {
                        return 'new updated'
                    } else if (price !== '' && price && document.querySelectorAll('[data-test="product-price"]') && document.querySelectorAll('[data-test="product-price"]')[0].innerText.split('￥')[1].replace(',', '') !== price) {
                        return 'price updated';
                    } else if (document.getElementById('buyTools')) {
                        return document.getElementById('buyTools').innerHTML
                    } else {
                        return "out of stock"
                    }
                }, list[k].url, list[k].size, list[k].price)

            }

            availiabled = false;
            console.log(htmlcontext);
            if (htmlcontext !== "Forbidden") {
                console.log('access');

                if (htmlcontext === "url changed" || htmlcontext === "out of stock") {
                    console.log('==== 1');
                    availiabled = false;
                } else if (htmlcontext === 'new updated') {
                    console.log('==== 2');
                    availiabled = true;
                } else if (htmlcontext === 'price updated') {
                    console.log('==== 3');
                    availiabled = true;
                } else if (htmlcontext.split(list[k].size + '"').length > 1 && htmlcontext.split(list[k].size + '"')[1].split("class=")[0].indexOf('disabled') === -1) {
                    console.log('==== 4');
                    availiabled = true;
                } else {
                    console.log('==== 5');
                    availiabled = false;
                }

                var now = getZoneTime();
                if (availiabled) {

                    samesizes.push({
                        "url": list[k].url,
                        "size": list[k].size,
                        "status": 'enabled',
                        "time": now,
                        "utctime": now
                    })

                } else {
                    samesizes.push({
                        "url": list[k].url,
                        "size": list[k].size,
                        "status": 'disabled',
                        "time": now,
                        "utctime": now
                    })
                }
            }
            //forever running
            if (k === list.length - 1) {
                var list = await I.MonitorList({
                    "frequency": process.env.TIME
                });
                list = JSON.parse(list);
                k = -1;
            }
        } catch (err) {
            console.log(err)
        }


    }


});