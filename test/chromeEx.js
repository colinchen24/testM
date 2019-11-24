// ==UserScript==
// @name         nikeA
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      https://www.nike.com*
// @match        http://*/*
// @grant        none
// ==/UserScript==

function ready(callback) {
    window.onload = setTimeout(callback, 1000);
}

function MonitorList(frequency) {
    return new Promise(resolve => {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                resolve(xhr.response);
            }
        }

        xhr.open('POST', 'https://104.225.156.192:2222/test/getmonitor', false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "frequency": frequency
        }));

    });
}

function track(body) {
    return new Promise(resolve => {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                resolve(xhr.response);
            }
        }

        xhr.open('POST', 'https://104.225.156.192:2222/test/track', false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(body));

    });
}

function clearCookie() {
    return new Promise(resolve => {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        //         console.log("需要删除的cookie名字："+keys);
        if (keys) {
            for (var i =  keys.length; i--;) {
                document.cookie = keys[i] + "=0; expire=" + date.toGMTString() + "; path=/";
            }
        }
        resolve('done')
    });
}

ready(async function() {

    var sleeptime = 2;
    var list = await MonitorList('sh');
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
    console.log('lenght: ' + list.length)
    console.log(k + ': ' + list[k].url)
    var htmlcontext = '';

    console.log('k = 0 or url different ==' + k + " url " + list[k].url + " size " + list[k].size);

    try {
        await clearCookie();
        var url = list[k].url;
        var size = list[k].size;
        var price = list[k].price;

        window.onload = setTimeout(async function() {
            if (!"".replaceAll) {
                String.prototype.replaceAll = function(search, replacement) {
                    var target = this;
                    return target.replace(new RegExp(search, 'g'), replacement);
                };
            }

            if (document.body.innerText.indexOf('NikePlus') === -1 || document.body.innerText.indexOf('Forbidden access') !== -1) {
                // console.log('no document');
                htmlcontext= "Forbidden"
            } else if (window.location.href !== url) {
                htmlcontext= "url changed";
            } else if (url === 'https://www.nike.com/cn/w/new-shoes-3n82yzy7ok?sort=newest' && document.getElementsByClassName('product-card__body').length > 2 &&
                (document.getElementsByClassName('product-card__body')[0].innerText.replaceAll('\n', '').indexOf(size.split('&')[0]) === -1 || document.getElementsByClassName('product-card__body')[1].innerText.replaceAll('\n', '').indexOf(size.split('&')[1]) === -1 || document.getElementsByClassName('product-card__body')[2].innerText.replaceAll('\n', '').indexOf(size.split('&')[2]) === -1)
            ) {
                htmlcontext= 'new updated'
            } else if (price !== '' && price && document.querySelectorAll('[data-test="product-price"]') && document.querySelectorAll('[data-test="product-price"]')[0].innerText.split('￥')[1].replace(',', '') !== price) {
                htmlcontext= 'price updated';
            } else if (document.getElementById('buyTools')) {
                htmlcontext= document.getElementById('buyTools').innerHTML
            } else {
                htmlcontext= "out of stock"
            }

            var availiabled = false;

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
                            console.log(samesizes);
            if (samesizes.length !== 0) {
                console.log('save track: ' + list[k].url);

                await track(samesizes);
                samesizes = [];
            }

            setTimeout(function(){window.location.href = list[k].url;},10000);
        }, 1000);
    } catch (err) {
        console.log(err)
    }
});