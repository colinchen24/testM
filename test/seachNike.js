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

            var availiabled = await I.executeScript(function() {

                if(document.getElementsByClassName('product-card css-ucpg4q ncss-col-sm-6 ncss-col-lg-4 va-sm-t product-grid__card').length !== 0){
                    return true;
                } else{
                    return false;
                }

                 });

            now = getZoneTime();

            if (availiabled) {

                samesizes.push({
                    "url": 'https://www.nike.com/cn/w?q=' + list[k].url,
                    "size": list[k].size,
                    "status": 'enabled',
                    "time": now
                });
                await I.track(samesizes); 
                samesizes = [];


            }
            //forever running
            if(k === list.length-1){
                var list = await I.MonitorList({"frequency": process.env.TIME});
                list = JSON.parse(list);
                k = 0;
            }
        } catch (err) {
            console.log(err)
        }


    }


});