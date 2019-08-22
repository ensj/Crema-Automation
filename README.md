# Crema-Automation

Crema-Automation is a web testing automation framework created for [CREMA (Creative Marketing Solution)](https://www.crema.me/). It is built in conjunction with [selenium-webdriver](https://seleniumhq.github.io/selenium/docs/api/javascript/index.html) and [mocha](https://mochajs.org/).

## Table of Contents

- [Installation](#installation)
- [Word of Note](#word-of-note)
- [Example of Usage](#example-of-usage)
- [Commands](#commands)
- [Sub-mall Commands](#sub-mall-commands)
- [Authors](#authors)

## Installation

In order to run this test framework, Node.js and Selenium-Webdriver will need to be installed on the computer. Node.js can be installed [here](https://nodejs.org/en/). 

Once Node.js is installed, download this repository. Enter the repository with the following command in the command prompt/terminal:

```bash
cd /Path/to/repo
```

After this, you need to install all the modules required for the framework to run:

```bash
npm install
```

In order for Selenium-webdriver to run tests, it needs something called a browser driver. Crema-Automation only supports chrome at the current moment, so we'll simply install that for now. Chromedriver can be found [here](https://sites.google.com/a/chromium.org/chromedriver/).

Once a chromedriver that matches your Google Chrome's version is downloaded, all you need to do is to add the chromedriver file into a safe folder. Call the folder something like selenium-drivers, and store it somewhere safe. 

Now, we need to add the selenium-drivers folder onto the PATH variable. On a mac, all you need to do is this:

```bash
export PATH=$PATH:/path/to/selenium-drivers
```

Finally, you can start up your tests by typing:

```bash
npm test
```

**NOTE:** The program requires a file called `credentials.json` in order to run, which is contained within the utils folder. The general format of the json file looks like this:

```json
{
  "apiCreds": {
    "client": {
      "id": "an-oauth2-id",
      "secret": "secret-password"
    },
    "auth":{
      "tokenHost": "a-tokenhost-url"
    }
  },

  "mall": { 
    "cafe24": { 
      "url": "mall url",
      "id": "mall id (on crema)",
      "userID": "mall's crema login id",
      "userPW": "mall's crema login password"
    },
    "godo": { 
      "url": "mall url",
      "id": "mall id (on crema)",
      "userID": "mall's crema login id",
      "userPW": "mall's crema login password"
    },
    "makeshop": { 
      "url": "mall url",
      "id": "mall id (on crema)",
      "reviews": "/board/board.html?code=jason006_board17", 
      "userID": "mall's crema login id",
      "userPW": "mall's crema login password"
    }
  }
}
```

## Word of Note

Crema-Automation performs operations through Selenium-webdriver, and performs tests using mocha, meaning the following things:

* All web related operations run through Selenium-webdriver.
  * For a detailed guide on how to use Selenium-webdriver, refer to its [javascript documentation](https://seleniumhq.github.io/selenium/docs/api/javascript/index.html).
  * Selenium-webdriver related functions are all contained within the [mall.base.js](./lib/mall.base.js) and its children, mall.cafe24.js and etc.
  * The framework abstracts Selenium-webdriver in the form of a page object. By limiting the number of potential functions the user can access, the hope is that it will make the framework easier to understand for the user. Of course, the user may choose to default to the selenium-webdriver's driver object if need be.
  * Selenium-webdriver alone cannot attain the information needed to automate all test work. In order to attain information such as getting a random product page from a mall, selenium relies on [api.js](./lib/api.js) which in turn works through [request-promise](https://github.com/request/request-promise) and [simple-oauth2](https://github.com/lelylan/simple-oauth2).
  * Many of the current tests created in the test folder use properties such as xpath in order to perform its operations, and therefore are very sensitive to any potential changes in mall solutions such as cafe24 or makeshop. When this happens, refer to the respective sub mall file (mall.solutionName.js) or the solution's respective locator file (locator.solutionName.js contained in the [utils folder](./utils)) in order to make changes.

* All test related operations run through Mocha.
  * For a detailed tutorial on how to use Mocha (and perhaps an assertion library such as chai), visit [mocha](https://mochajs.org/) and [chai](https://www.chaijs.com)'s websites.


## Example of Usage

See the [test folder](./test).

## Commands
**In order to read specifics about return types and what happens during a given operation, refer to the source code and the Selenium-webdriver documentation.**

### Initialize the mall object with credentials.
```javascript
const chrome = require('selenium-webdriver/chrome');
const { mall } = require("../utils/credentials.json");

var o = new chrome
      .Options()
      .addArguments('disable-infobars')
      .setUserPreferences({ credential_enable_service: false });

Page = require('../lib/mall.subMall');
page = new Page(o);
driver = page.driver;

id = mall.cafe24.id; 
url = mall.cafe24.url; 
```

### Navigate to a given URL.
Returns the selenium driver.
```javascript
page.get("url");
```
returns `Promise<undefined>`

### Find Elements on web page
#### Find by id
Returns the first element with the given id on the web page.
```javascript
page.findById("id");
```
returns `WebElementPromise`

#### Find by name
Returns the first element with the given name on the web page.
```javascript
page.findByName("name");
```
returns `WebElementPromise`

#### Find by xpath
Returns the first element with the given xpath on the web page.
```javascript
page.findByXPath("xpath");
```
returns `WebElementPromise`

### Input letters into elements
#### Write input
Writes input into a given element.
```javascript
page.write(element, "input");
```
returns `Promise<undefined>`

#### Clear input
Clears any input in a given element.
```javascript
page.clear(element);
```
returns `Promise<undefined>`

### Execute javascript on web page
Executes a javascript script on a web page.
```javascript
page.executeScript("script");
```
returns `IThenable<(T|null)>`

### Get Alert
Gets, and returns, any alerts that are found on the web page.
```javascript
page.getAlert();
```
returns `AlertPromise`

### Wait for url to become input
Waits 10 seconds until the url becomes the specified input.
```javascript
page.waitUrl("url");
```
returns `Promise<undefined>`

### Check for crema widget/popup to appear on the website.
Waits until a popup for a widget to appear on the website.
```javascript
// check pop up
page.check({'type':'popup'});
// check widget
page.check({'type':'widget'});
```
returns `Promise<undefined>`

### Quit driver
Quits out of the browser.
```javascript
page.quit();
```

## Sub-mall Commands
### Login to mall
Logs into the mall using given credentials.
```javascript
page.login(url);
```
returns `webdriver`

### Get Product Page
Grabs a random product page from the mall.
```javascript
page.getProduct(url, id); // id is the mall's given id (crema)
```
returns `Promise<undefined>`

## Authors

Junhyun Lim