
Feature('site monitor');

Scenario('test something', async function(I){

	I.amOnPage('https://www.nike.com/cn/t/air-zoom-pegasus-36-%E7%94%B7%E5%AD%90%E8%B7%91%E6%AD%A5%E9%9E%8B-wdcW2s');
    let disable = await I.executeScript(function(){
        return document.getElementsByName('skuAndSize')[16].disabled;
    });
    console.log('------------');
    console.log(disable);
    if(disable){
        await I.sendEmail('colin.chen@ehealth.com', 'it is disabale');
    }
    let disable2 = await I.executeScript(function(){
        return document.getElementsByName('skuAndSize')[0].disabled;
    });
    console.log('------------');
    console.log(disable2);

});
