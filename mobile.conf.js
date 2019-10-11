var browsers = [{
    "browser": "safari",
    "desiredCapabilities": {
        'os_version' : '12',
        'device' : 'iPhone XS',
        'browserName':'safari',
        'real_mobile' : 'true',
        'browserstack.debug' : 'true',
        'browserstack.local' : 'false',
        'project':'iphone'
    }
},{
    "browser": "safari",
    "desiredCapabilities":{
        'os_version' : '12',
        'device' : 'iPad Pro 11 2018',
        'browserName':'safari',
        'real_mobile' : 'true',
        'browserstack.debug' : 'true',
        'browserstack.local' : 'false',
        'project':'ipad'
    }
},{
    "browser": "chrome",
    "desiredCapabilities":{
        'os_version' : '9.0',
        'device' : 'Google Pixel 2',
        'browserName':'chrome',
        'real_mobile' : 'true',
        'browserstack.debug' : 'true',
        'browserstack.local' : 'false',
        'project':'android'
    }
},{
    "browser": "chrome",
    "desiredCapabilities":{
        'os_version' : '8.1',
        'device' : 'Samsung Galaxy Tab S4',
        'browserName':'chrome',
        'real_mobile' : 'true',
        'browserstack.debug' : 'true',
        'browserstack.local' : 'false',
        'project':'android tablet'
    }
}]
exports.config = {
    "tests": "./test/" + process.profile,
    "timeout": 100000,
    "output": "./output",
    "include": {
        "censusPage": "./pages/censusPage.js",
        "phonePage": "./pages/phonePage.js",
        "leadPage": "./pages/leadPage.js",
        "quotePage": "./pages/quotePage.js",
        "minisitePage": "./pages/minisitePage.js",
        "doctorPage": "./pages/doctorPage.js",
        "drugPage": "./pages/drugPage.js",
        "pharmacyPage": "./pages/pharmacyPage.js",
        "currentPlanPage": "./pages/currentPlanPage.js",
        "compareV2Page": "./pages/compareV2Page.js",
        "detailV2Page": "./pages/detailV2Page.js",
        "mosePage": "./pages/mosePage.js"
    },
    "helpers": {
        WebDriverIO: {
            url: "colinchen4:xrnHsgpoYCcC3HHMCFQL@hub.browserstack.com",
            user: "colinchen4",
            key: "xrnHsgpoYCcC3HHMCFQL",
            'browser': 'safari',//safari
            'protocol': 'http',//Can't connect to WebDriver. Error: socket hang up
            desiredCapabilities: {
                'os_version' : '12',
                'device' : 'iPhone XS Max',
                'browserName':'safari',
                'real_mobile' : 'true',
                'browserstack.debug' : 'true',
                'browserstack.local' : 'false',
                'browserstack.video' : 'true',
                // 'browserstack.appium_version' : '1.9.1',
                // 'name':'Medicare',
                'project':'Medicare Multi-device Test'

                // 'os' : 'Windows',
                // 'os_version' : '10',
                // 'browserName':'IE',
                // 'browser_version':'11.0',
                // 'browserstack.debug' : 'true',
                // 'browserstack.local' : 'false',
                // 'project':'windows-ie'
            }
        }
    },
    "name": "layer-x",
    "multiple": {
        "parallel": {
            "chunks": 32,
            "browsers": browsers
        }
    }
}