var desktopBrowsers =[,{
    "browser": "chrome",
    "desiredCapabilities":{
        'os' : 'Windows',
        'os_version' : '10',
        'browserName':'Chrome',
        'browser_version':'72.0',
        'browserstack.debug' : 'true',
        'browserstack.local' : 'false',
        'project':'windows-chrome'
    }
},{
    "browser": "firefox",
    "desiredCapabilities":{
        'os' : 'Windows',
        'os_version' : '10',
        'browserName':'Firefox',
        'browser_version':'68.0',
        'browserstack.debug' : 'true',
        'browserstack.local' : 'false',
        'project':'windows-ff'
    }
},{
    "browser": "IE",
    "desiredCapabilities":{
        'os' : 'Windows',
        'os_version' : '10',
        'browserName':'IE',
        'browser_version':'11.0',
        'browserstack.debug' : 'true',
        'browserstack.local' : 'false',
        'project':'windows-ie11'
    }
},{
    "browser": "safari",
    "desiredCapabilities":{
        'os' : 'OS X',
        'os_version' : 'Mojave',
        'browserName':'Safari',
        'browser_version':'12.0',
        'browserstack.debug' : 'true',
        'browserstack.local' : 'false',
        'project':'os-safari'
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
            'browser': 'chrome',
            'protocol': 'http',
            desiredCapabilities: {
                'os' : 'Windows',
                'os_version' : '10',
                'browserName':'Chrome',
                'browser_version':'11.0',
                'browserstack.debug' : 'true',
                'browserstack.local' : 'false',
                'project':'Medicare Multi-browser Test'
            }
        }
    },
    "name": "layer-x",
    "multiple": {
        "parallel": {
            "chunks": 32,
            "browsers": desktopBrowsers
        }
    }
}