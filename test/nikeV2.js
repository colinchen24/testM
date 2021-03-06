Feature('just do it');

var dateFormat = require('dateformat');

Scenario('monitor nike', async function(I) {

    // console.log(process.env.TIME)

    var sleeptime=60;

    switch (process.env.TIME){
        case "sh":
            sleeptime=1;
            break;
        case "h":
            sleeptime=30;
            break;
    }

    // console.log(sleeptime);

    var list = await I.MonitorList({"frequency": process.env.TIME});
    list = JSON.parse(list);

    var slist =[];

    for(var i=parseInt(list.length/4)*2; i< list.length; i++){
        slist.push(list[i])
    }

    list = slist;

    var samesizes = [];
    var isSameUrl = false;

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
  var htmlcontext = '';
    

    for (var k = 0; k < list.length; k++) {

        try {
            if (k !== 0 && (list[k-1].url === list[k].url)){
                console.log('url is the same with last one.');
                isSameUrl = true;
            } else {
                console.log('save track: ' + list[k].url);
                if(k !==0 && samesizes.length !== 0){
                    await I.track(samesizes);    
                }
                await I.clearCookie();
                isSameUrl = false;
                samesizes = [];
                // I.wait(2)
                await I.amOnPage(list[k].url);
                // I.saveScreenshot('result.jpg');
                I.wait(sleeptime);
                htmlcontext = await I.executeScript(function(url,size){
                    if(!"".replaceAll){
                    String.prototype.replaceAll = function(search, replacement) {
                        var target = this;
                        return target.replace(new RegExp(search, 'g'), replacement);
                    };
                    }
    
                    if(!document) {
                        // console.log('no document');
                        return "no document"
                    } else if(window.location.href !== url){
                        return "url changed";
                    } else if(url ==='https://www.nike.com/cn/w/new-shoes-3n82yzy7ok?sort=newest' && 
                        (document.getElementsByClassName('product-card__body')[0].innerText.replaceAll('\n','').indexOf(size.split('&')[0]) === -1 || document.getElementsByClassName('product-card__body')[1].innerText.replaceAll('\n','').indexOf(size.split('&')[1]) === -1 || document.getElementsByClassName('product-card__body')[2].innerText.replaceAll('\n','').indexOf(size.split('&')[2]) === -1)
                        ){
                        return 'new updated'
                    } else if(document.getElementById('buyTools')){
                        return document.getElementById('buyTools').innerHTML
                    } else{
                        return "out of stock"
                    }
                },list[k].url,list[k].size)

            }
        console.log(htmlcontext);

        if(htmlcontext === "no document" || htmlcontext === "url changed" || htmlcontext === "out of stock"){
            console.log('==== 1');
            availiabled = false;
        } else if(htmlcontext === 'new updated'){
            console.log('==== 2');
            availiabled = true;
        } else if(htmlcontext.split(list[k].size + '"').length > 1 && htmlcontext.split(list[k].size + '"')[1].split("class=")[0].indexOf('disabled') === -1){
            console.log('==== 3');
            availiabled = true;
        } else{
            console.log('==== 4');
            availiabled =false;
        }

        now = getZoneTime();

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
                slist =[];

                for(var i=parseInt(list.length/4)*2; i< list.length; i++){
                    slist.push(list[i])
                }
            
                list = slist;
            }
        } catch (err) {
            console.log(err)
        }


    }


});