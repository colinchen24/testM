Feature('just do it');

var dateFormat = require('dateformat');

Scenario('monitor nike search', async function(I) {

    // console.log(process.env.TIME)

    var sleeptime=60;

    switch (process.env.TIME){
        case "ss":
            sleeptime=1;
            break;
        case "h":
            sleeptime=30;
            break;
    }

    // console.log(sleeptime);

    var list = await I.MonitorList({"frequency": process.env.TIME});
    list = JSON.parse(list);
    list.push(list[0]);
    console.log(list)

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
    

    for (var k = 0; k < list.length; k++) {

        try {

            await I.amOnPage('https://www.nike.com/cn/w?q=' + list[k].url);

            I.wait(sleeptime);

            if(!"".replaceAll){
                    String.prototype.replaceAll = function(search, replacement) {
                        var target = this;
                        return target.replace(new RegExp(search, 'g'), replacement);
                    };

            var availiabled = await I.executeScript(function(url,size) {
                if(url ==='https://www.nike.com/cn/w/new-shoes-3n82yzy7ok?sort=newest' && document.getElementsByClassName('product-card__body').length >2 && 
                        (document.getElementsByClassName('product-card__body')[0].innerText.replaceAll('\n','').indexOf(size.split('&')[0]) === -1 || document.getElementsByClassName('product-card__body')[1].innerText.replaceAll('\n','').indexOf(size.split('&')[1]) === -1 || document.getElementsByClassName('product-card__body')[2].innerText.replaceAll('\n','').indexOf(size.split('&')[2]) === -1)
                        ){
                        return true;
                }
                else if(document.getElementsByClassName('product-card css-ucpg4q ncss-col-sm-6 ncss-col-lg-4 va-sm-t product-grid__card') && document.getElementsByClassName('product-card css-ucpg4q ncss-col-sm-6 ncss-col-lg-4 va-sm-t product-grid__card').length !== 0){
                    return true;
                } else{
                    return false;
                }

                 }, list[k].url, list[k].size);

            now = getZoneTime();

            if (availiabled) {

                samesizes.push({
                    "url": list[k].url,
                    "size": '',
                    "status": 'enabled',
                    "time": now
                });


            } else{

                samesizes.push({
                    "url": list[k].url,
                    "size": '',
                    "status": 'disabled',
                    "time": now
                });

            }

            if(samesizes.length !== 0){
                await I.track(samesizes); 
                samesizes = [];
            }
            //forever running
            if(k === list.length-1){
                var list = await I.MonitorList({"frequency": process.env.TIME});
                list = JSON.parse(list);
                k = -1;
                // list.push(list[0]);
            }
        } catch (err) {
            console.log(err)
        }


    }


});