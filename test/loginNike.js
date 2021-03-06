Feature('just do it');

var dateFormat = require('dateformat');

Scenario('monitor nike', async function(I) {

    // console.log(process.env.TIME)

    var sleeptime = 1;

    switch (process.env.TIME) {
        case "sh":
            sleeptime = 1;
            break;
        case "sc":
            sleeptime = 1;
            break;
    }

    // console.log(sleeptime);

    var list = await I.MonitorList({
        "frequency": process.env.TIME
    });
    list = JSON.parse(list);
    list.push(list[0]);
    console.log(list)

    var samesizes = [];

    var availiabled = false;
    var urlindex = 0;
    var logintime = 0;
    var firstRun = true;

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


    for (var k = 0; k < list.length; k++) {
        // var k =0;

        try {
            if ((k === 0 && firstRun) || (k !== 0 && list[k - 1].email !== list[k].email) || (!firstRun && k === 0 && list[k].email !== list[list.length -1].email)) {
                await I.clearCookie();
                firstRun = false;
                await I.amOnPage('https://www.nike.com/cn/login');
                I.wait(1);
                var login = await I.executeScript(function(email, pw) {
                    if(document.getElementsByClassName("nike-unite-component action-link mobileNumberToEmailLoginLink toggle-action-link").length > 0){
                    document.getElementsByClassName("nike-unite-component action-link mobileNumberToEmailLoginLink toggle-action-link")[0].firstElementChild.click();
                    document.getElementsByName('emailAddress')[0].value = email;
                    document.getElementsByName('password')[0].value = pw;
                    document.getElementsByClassName("nike-unite-submit-button loginSubmit nike-unite-component")[0].firstElementChild.click();
                }
                    return true;
                }, list[k].email, 'Pzz1990.');


                I.wait(3);
                var loginAgain = false;

                loginAgain = await I.executeScript(function(){
                    if(document.getElementsByClassName("nike-unite-submit-button loginSubmit nike-unite-component").length > 0 || document.getElementsByName('password').length > 0){
                        return true;
                    } else{
                        return false;
                    }
                })
                // I.saveScreenshot('result0.jpg');
                await I.amOnPage('https://www.nike.com/cn/favorites');

                I.wait(1);
                if(!loginAgain){
                loginAgain = await I.executeScript(function(){
                    if(document.getElementsByClassName("nike-unite-submit-button loginSubmit nike-unite-component").length > 0 || document.getElementsByName('password').length > 0){
                        return true;
                    } else{
                        return false;
                    }
                })
                }
                console.log("=======" + loginAgain)
            }
            if(loginAgain){
                console.log('login failed');
                firstRun=true;
                k=-1;
            }
            I.scrollPageToBottom();
            I.wait(3);
            console.log(samesizes);
            if (k !== 0 && list[k - 1].url !== list[k].url && samesizes.length !== 0) {
                // console.log(samesizes);
                await I.track(samesizes);
                samesizes = [];

            }
            if (k === 0 && !firstRun && samesizes.length !== 0) {
                // console.log(samesizes);
                await I.track(samesizes);
                samesizes = [];
            }

            // I.wait(2);
            

            urlindex = await I.executeScript(function(url) {
                var k = 999;
                if (document.getElementsByClassName('ncss-col-sm-6 ncss-col-lg-4 product-card css-5qttql') && document.getElementsByClassName('ncss-col-sm-6 ncss-col-lg-4 product-card css-5qttql').length > 0) {
                    for (var i = 0; i < document.getElementsByClassName('ncss-col-sm-6 ncss-col-lg-4 product-card css-5qttql').length; i++) {
                        if (document.getElementsByClassName('ncss-col-sm-6 ncss-col-lg-4 product-card css-5qttql')[i].getAttribute("pdpurl").split('/')[document.getElementsByClassName('ncss-col-sm-6 ncss-col-lg-4 product-card css-5qttql')[i].getAttribute("pdpurl").split('/').length - 1] === url.split('/')[url.split('/').length - 1]) {
                            k = i;
                        }
                    }
                }
                return k;

            }, list[k].url);

            // I.wait(1);
            availiabled = false;
            console.log("urlindex: " + urlindex);
            // I.saveScreenshot('result.jpg');
            
            if (urlindex !== 999) {
                // I.wait(1);
                var buttoncontext = await I.executeScript(function(num) {
                    if (document.getElementsByClassName('css-1isv87d e1mo9wgj0').length !== 0) {
                        return document.getElementsByClassName('css-1isv87d e1mo9wgj0')[num].innerText;
                    } else {
                        return "not found"
                    }

                }, urlindex);

                console.log(buttoncontext);

                // I.wait(1);

                if (buttoncontext === "已售罄") {
                    availiabled = false;
                } else if (buttoncontext === "加入购物车") {
                    availiabled = true;
                } else if (buttoncontext === "选择尺码") {
                    var sizehtml = await I.executeScript(function(num) {
                        document.getElementsByClassName('ncss-col-sm-12 css-1pzxakv wishlist-grid-actions')[num].firstElementChild.click();
                        return document.getElementsByClassName('size-selector-wrapper e1cwsdoj3 css-9be9yh')[0].innerHTML
                    }, urlindex);

                    // console.log(sizehtml);
                    // I.wait(1);

                    if (sizehtml.split(list[k].size + '</label>').length > 1 && sizehtml.split(list[k].size + '</label>')[0].split("<input")[sizehtml.split(list[k].size + '</label>')[0].split("<input").length - 1].indexOf('disabled') === -1) {
                        availiabled = true
                    } else {
                        availiabled = false
                    }
                }

                now = getZoneTime();
                // console.log("======" + availiabled)
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
            }

            //forever running
            if (k === list.length - 1) {
                logintime++;
                var list = await I.MonitorList({
                    "frequency": process.env.TIME
                });
                list = JSON.parse(list);
                list.push(list[0]);
                k = -1;
                await I.amOnPage('https://www.nike.com/cn/favorites');
                I.wait(sleeptime);
                console.log(await I.grabCurrentUrl());
            }
        } catch (err) {
            console.log(err)
        }


    }


});