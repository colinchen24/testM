Feature('just do it');

var dateFormat = require('dateformat');

Scenario('monitor nike', async function(I) {

    // console.log(process.env.TIME)

    var sleeptime=10;

    switch (process.env.TIME){
        case "sh":
            sleeptime=1;
            break;
        case "sc":
            sleeptime=3;
            break;
    }

    // console.log(sleeptime);

    var list = await I.MonitorList({"frequency": process.env.TIME});
    list = JSON.parse(list);
    console.log(list)

    var samesizes = [];
    var isSameUrl = false;
    var availiabled = false;
    var urlindex = 0;
    var logintime = 0;

    var now = dateFormat(new Date(), "isoDateTime");
    

    for (var k = 0; k < list.length; k++) {
        // var k =0;

        try {
            if (k !== 0 && (list[k-1].url === list[k].url)){
                console.log('url is the same with last one.');
                isSameUrl = true;
            } else {
                console.log('save track: ' + list[k].url);
                if(k !==0 ) {
                    console.log(samesizes);
                    // await I.track(samesizes);  
                }
                isSameUrl = false;
                samesizes = [];
                // I.wait(2)
                if( logintime === 0 || logintime > 1000){
                    if(logintime > 1000){
                        logintime = 0;
                    }
                    await I.clearCookie();
                    await I.amOnPage('https://www.nike.com/cn/login'); 
                    I.wait(5);
                    var login = await I.executeScript(function(email, pw) {
                        document.getElementsByClassName("nike-unite-component action-link mobileNumberToEmailLoginLink toggle-action-link")[0].firstElementChild.click();
                        document.getElementsByName('emailAddress')[0].value = email;
                        document.getElementsByName('password')[0].value = pw;
                        document.getElementsByClassName("nike-unite-submit-button loginSubmit nike-unite-component")[0].firstElementChild.click();
                        setTimeout(function(){ 
                            if(document.getElementsByClassName("nike-unite-error-close")){
                                document.getElementsByClassName("nike-unite-error-close")[0].firstElementChild.click()
                                document.getElementsByName('emailAddress')[0].value = email;
                                document.getElementsByName('password')[0].value = pw;
                                document.getElementsByClassName("nike-unite-submit-button loginSubmit nike-unite-component")[0].firstElementChild.click();
                            }     
                        }, 6000);
                        return true;
        
                    }, list[k].email, 'Pzz1990.');   
                }
                
                // I.saveScreenshot('result.jpg');
                I.wait(sleeptime);
            }

 
            I.wait(2);
            // I.saveScreenshot('result1.jpg');
            await I.amOnPage('https://www.nike.com/cn/favorites');
            I.wait(sleeptime);
            // I.saveScreenshot('result.jpg');
            
            urlindex = await I.executeScript(function(url) {
                var k = 0;
                if(document.getElementsByClassName('ncss-col-sm-6 ncss-col-lg-4 product-card css-5qttql') && document.getElementsByClassName('ncss-col-sm-6 ncss-col-lg-4 product-card css-5qttql').length >0){
                    for(var i=0; i<document.getElementsByClassName('ncss-col-sm-6 ncss-col-lg-4 product-card css-5qttql').length; i++){
                        if (document.getElementsByClassName('ncss-col-sm-6 ncss-col-lg-4 product-card css-5qttql')[i].getAttribute("pdpurl").split('/')[document.getElementsByClassName('ncss-col-sm-6 ncss-col-lg-4 product-card css-5qttql')[i].getAttribute("pdpurl").split('/').length -1] === url.split('/')[url.split('/').length - 1]){
                            k = i;
                        }
                    }
                }
                return k;
                
            }, list[k].url);

            I.wait(1);
            console.log("urlindex: " + urlindex);

            var buttoncontext = await I.executeScript(function(num) {
                return document.getElementsByClassName('css-1isv87d e1ocvqf40')[num].innerText;
            }, urlindex);

            I.wait(10);

            switch(buttoncontext){
                case "已售罄":
                    availiabled = false;
                case "加入购物车":
                    availiabled = true;
            }

            if(buttoncontext === "选择尺码"){
                var sizehtml = await I.executeScript(function(num) {
                    document.getElementsByClassName('ncss-col-sm-12 css-1pzxakv wishlist-grid-actions')[num].firstElementChild.click();
                    return document.getElementsByClassName('size-selector-wrapper e109n9an3 css-9be9yh')[0].innerHTML
                }, urlindex);
                
                // console.log(sizehtml);
                I.wait(1);

                if (sizehtml.split('"'+ list[k].size + '"')[1].split('>'+ list[k].size + '<')[0].indexOf('disabled=""') === -1){
                    availiabled = true
                } else{
                    availiabled = false
                }
            }

            now = dateFormat(new Date(), "isoDateTime");

            await I.executeScript(function(){
                document.location.reload();
            })

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
                logintime ++;
                var list = await I.MonitorList({"frequency": process.env.TIME});
                list = JSON.parse(list);
                k = 0;
            }
        } catch (err) {
            console.log(err)
        }


    }


});