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
    
    var availiabled = false;
    var urlindex = 0;
    var logintime = 0;
    var firstRun = true;

    function getZoneTime(){
        var localtime = new Date();  
        var localmesc = localtime.getTime(); 
        var localOffset = localtime.getTimezoneOffset() * 60000; 
        var utc = localOffset + localmesc; 
        var calctime = utc + (3600000*8);  
        var nd = new Date(calctime);  
        return nd.toDateString()+" "+nd.getHours()+":"+nd.getMinutes()+":"+nd.getSeconds(); 
    }
  var now = getZoneTime();
    

    for (var k = 0; k < list.length; k++) {
        // var k =0;

        try {
            if ((k === 0 && (firstRun || list[k].email !== list[list.length -1].emai)) || (k !==0 && list[k-1].email !== list[k].email)){                
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
                
                
                I.wait(sleeptime);
                // I.saveScreenshot('result0.jpg');
            } 

            if(k !== 0 && list[k-1].url !== list[k].url) {
                console.log(samesizes);
                await I.track(samesizes);  
                samesizes = [];
                
            } 
            if(k===0 && !firstRun){
                console.log(samesizes);
                await I.track(samesizes); 
                samesizes = [];
            }
 
            I.wait(2);
            firstRun = false;
            
            // I.saveScreenshot('result1.jpg');
            await I.amOnPage('https://www.nike.com/cn/favorites');
            I.wait(sleeptime);
            
            
            urlindex = await I.executeScript(function(url) {
                var k = 999;
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
            availiabled = false;
            console.log("urlindex: " + urlindex);
            // I.saveScreenshot('result.jpg');
            I.wait(2);
            if(url !== 999){
                var buttoncontext = await I.executeScript(function(num) {
                if(document.getElementsByClassName('css-1isv87d e1ocvqf40').length !== 0){
                    return document.getElementsByClassName('css-1isv87d e1ocvqf40')[num].innerText;    
                } else{
                    return "not found"
                }
                
                }, urlindex);
    
                console.log(buttoncontext);
    
                I.wait(3);
    
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
            }
            

            now = getZoneTime();

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