var config = require("config");
var host = config.get('host');
var port = config.get('port');
var chromeOptions = {
    "useAutomationExtension": false,
    "args": ["--window-size=1800,1600"]
    // "args": ["--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X) AppleWebKit/602.2.14 (KHTML, like Gecko)","--window-size=375,812"]
};

var user = "YQA31646966805444316"
var password = "rdaPLnjjA2ADXUB6"
var host = "dyn.horocn.com"
var port = 50000

var proxyUrl = "http://" + user + ":" + password + "@" + host + ":" + port;

if(process.profile == 'Tracking/*.js'){
// if(process.profile == 'Tracking/enrollmentTracking.js'){
    host = "10.8.77.15";//username: SJTSTSEL03-WIN7\trackUser pw: Medicare.1234
    port = "4445";//report address: C:\Users\trackUser\Downloads\medicare-2019-xx-xx-xx-xx.html
    chromeOptions = {
        "binary": "C:/cherrieg/chrome-win32-70/chrome.exe",
        "args": ["--load-extension=" + "C:/cherrieg/Katie-Tracking/Tracking","--window-size=1800,1600"]
    }
}

exports.config = {
  
    //"tests": "./test/" + String(process.profile).split("|")[0],
    "tests": process.profile,
    "timeout": 100000,
    "output": "./output",
    "include": {
    },
    "helpers": {
      // "BifrostHelper": {
      //   "require": "./node_modules/bifrost-io/codeceptjs/dashboard_helper.js"
      // },
        sendEmail:{
          require: "./helper/sendEmail.js"
        },
        WebDriverIO: {
            "url": "https://",
            "browser": "chrome",
            "restart": false,
            "keepBrowserState": false,
            "keepCookies": false,
            "waitForTimeout": 10000,
            "smartWait": 100,
            // "host": host,
            // "port": port,
            // "seleniumAddress": host +":"+ port,
            //"host": '10.8.77.14',
            //"port": '4445',
            //"seleniumAddress": '10.8.77.14' +":"+ '4445',
            "desiredCapabilities": {
                "browserName": "chrome",
                "version":"77.0",
                "enableVNC":true,
                "enableVideo":false,
                "name":"Medicare XM E2E",
                "build":"Medicare XM Team",
                "chromeOptions": chromeOptions,
                "proxy": {
                  "proxyType": "manual",
                  "httpProxy": '104.225.156.192:8085'
                  // "noProxy": "127.0.0.1,localhost"
                }
              }
        }
    },
    "name": "layer-x",
    "mocha": {
        "reporterOptions": {
          "codeceptjs-cli-reporter": {
            "stdout": "-",
            "options": {
              "verbose": true,
              "steps": true,
            }
          },
          "mochawesome": {
           "stdout": "./output/console.log",
           "options": {
             "reportDir": "./output",
             "reportFilename": "report"
          }
        }
      }
    },
    "multiple": {
        "parallel": {
            "chunks": 32,
            "browsers": [{
                "browser": "chrome"
            }]
        }
    }/*,
    plugins: {
      testrail: {
         require: './codeceptjs-testrail',
         host: 'testrail.ehealthinsurance.com',
         user: 'testrail@ehealth.com',
         password: 'qwe123',
         suiteId: 6,
         projectId: 3,
         runId: (String(process.profile).split("|")[1]),
         runName: 'cm regression',
         enabled: (String(process.profile).split("|")[1] == 1?false:true)
   }
  }*/
}
