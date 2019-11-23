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
    var htmlcontext = 'htmlcontext';
    var falseFlag = false;
    var clearcash = false;
    for (k; k < list.length; k++) {



        try {
            if (k === 0 || (k !== 0 && list[k - 1].url !== list[k].url)) {


                console.log('k = 0 or url different == ' + k + " url " + list[k].url + " size " + list[k].size);

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
                // I.wait(sleeptime);
                htmlcontext = "htmlcontext";

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
                    } else if (url.split('/')[url.split('/').length-1].length > 20 || window.location.href.indexOf(url.split('/')[url.split('/').length-1]) === -1) {
                        return "url changed";
                    } else if (url === 'https://www.nike.com/cn/w/new-shoes-3n82yzy7ok?sort=newest' && document.getElementsByClassName('product-card__body').length > 2 &&
                        (document.getElementsByClassName('product-card__body')[0].innerText.replaceAll('\n', '').indexOf(size.split('&')[0]) === -1 || document.getElementsByClassName('product-card__body')[1].innerText.replaceAll('\n', '').indexOf(size.split('&')[1]) === -1 || document.getElementsByClassName('product-card__body')[2].innerText.replaceAll('\n', '').indexOf(size.split('&')[2]) === -1)
                    ) {
                        return 'new updated'
                    } else if (price !== '' && price && document.querySelectorAll('[data-test="product-price"]') && document.querySelectorAll('[data-test="product-price"]')[0].innerText.split('￥')[1].replace(',', '') !== price) {
                        return 'price updated';
                    } else if (document.getElementById('buyTools')) {

                        return document.getElementById('buyTools').innerHTML;

                    } else if (document.getElementById('RightRail') && document.getElementById('RightRail').innerText.indexOf('售罄：') !== -1) {
                        return "out of stock"
                    } else {
                        return "htmlcontext"
                    }
                }, list[k].url, list[k].size, list[k].price);

                if (htmlcontext !== "Forbidden" && htmlcontext !== "htmlcontext") {
                    if (sleeptime > 0) {
                        sleeptime--;
                    }
                } else if (htmlcontext === "Forbidden") {
                    if (sleeptime < 5) {
                        sleeptime++;
                    }
                }

                // console.log("====================" + sleeptime + "====================");
                if (sleeptime > 0) {
                    I.wait(sleeptime);
                }

            }

            availiabled = false;
            falseFlag = false;

            if (htmlcontext !== "Forbidden" && htmlcontext !== "htmlcontext") {
                // console.log('access');

                if (htmlcontext === "url changed" || htmlcontext === "out of stock") {
                    // console.log('==== 1');
                    availiabled = false;
                    falseFlag = true;
                } else if (htmlcontext === 'new updated') {
                    // console.log('==== 2');
                    availiabled = true;
                } else if (htmlcontext === 'price updated') {
                    // console.log('==== 3');
                    availiabled = true;
                } else if (htmlcontext && htmlcontext.indexOf(list[k].size + '</label>') === -1) {
                    I.wait(2);

                    console.log('re get the right html context');
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

                            return document.getElementById('buyTools').innerHTML;

                        } else if (document.getElementById('RightRail') && document.getElementById('RightRail').innerText.indexOf('售罄：') !== -1) {
                            return "out of stock"
                        }
                    }, list[k].url, list[k].size, list[k].price);

                    // console.log("======" + htmlcontext);

                    if (htmlcontext.split(list[k].size + '</label>').length > 1 && htmlcontext.split(list[k].size + '</label>')[0].split("<input")[htmlcontext.split(list[k].size + '</label>')[0].split("<input").length - 1].indexOf('disabled') === -1) {
                        availiabled = true;
                    } else if (htmlcontext.split(list[k].size + '</label>').length > 1 && htmlcontext.split(list[k].size + '</label>')[0].split("<input")[htmlcontext.split(list[k].size + '</label>')[0].split("<input").length - 1].indexOf('disabled') !== -1) {
                        falseFlag = true;
                    } 

                } else if (htmlcontext.split(list[k].size + '</label>').length > 1 && htmlcontext.split(list[k].size + '</label>')[0].split("<input")[htmlcontext.split(list[k].size + '</label>')[0].split("<input").length - 1].indexOf('disabled') === -1) {
                        availiabled = true;
                } else if (htmlcontext.split(list[k].size + '</label>').length > 1 && htmlcontext.split(list[k].size + '</label>')[0].split("<input")[htmlcontext.split(list[k].size + '</label>')[0].split("<input").length - 1].indexOf('disabled') !== -1) {
                        falseFlag = true;
                } 

                var now = getZoneTime();
                console.log( list[k].url + " ----- " + list[k].size + " ----- " + availiabled + " ----- " + now + " ----- " +  htmlcontext);
                
                if (availiabled) {

                    samesizes.push({
                        "url": list[k].url,
                        "size": list[k].size,
                        "status": 'enabled',
                        "time": now,
                        "utctime": now
                    })

                    clearcash = await I.executeScript(function() {
                        return localStorage.clear();
                    });

                } else if (falseFlag) {
                    samesizes.push({
                        "url": list[k].url,
                        "size": list[k].size,
                        "status": 'disabled',
                        "time": now,
                        "utctime": now
                    })
                    clearcash = await I.executeScript(function() {
                        return localStorage.clear();
                    });
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