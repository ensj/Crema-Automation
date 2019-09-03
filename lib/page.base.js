const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const ie = require('selenium-webdriver/ie');

var Page = function(opts) {
    /**
    * Builds a new webdriver instance with the given options. 
    */
    this.type = opts['type'];

    if(opts['type'] === 'chrome') {
        this.driver = new Builder()
        .setChromeOptions(new chrome.Options()
            .addArguments('disable-infobars')
            .setUserPreferences({ credential_enable_service: false })
            //.headless() // Enables headless mode.
            //.windowSize({ width: 640, height: 480 })
        )
        .forBrowser('chrome')
        .build();
    }else if(opts['type'] === 'ie') {
        this.driver = new Builder()
        .setIeOptions(new ie.Options())
        .forBrowser('ie')
        .build();
    }else if(opts['type'] === 'mobile') {
        this.driver = new Builder()
        .setChromeOptions(new chrome.Options()
            .setMobileEmulation({deviceName: 'Galaxy S5'})
            .windowSize({ width: 320, height: 765 })
            //.androidChrome() // for proper android emulation.
        )
        .forBrowser('chrome')
        .build();
    }



    /**
    * Navigates to the given url in the parameter.
    */
	this.get = async function(url) {
		return await this.driver.get(url);
	};



    /**
    * Terminates the browser session. The current instance of Page will not be able
    * to be used again.
    */
	this.quit = async function() {
		return await this.driver.quit();
	};



    /**
    * The following findBy... functions all find a WebElement using the given parameter.
    * 
    * the "find" functions will always return a timeout error if the element
    * is not found. There needs to be a catch for all the errors in the wait function 
    * calls. The waits are needed to wait for elements that do not load in time,
    */
    this.findById = async function(id) {
        await this.driver.wait(until.elementLocated(By.id(id)), 2000, 'Looking for element (id): ' + id);
        return await this.driver.findElement(By.id(id));
    };

    this.findByName = async function(name) {
        await this.driver.wait(until.elementLocated(By.name(name)), 2000, 'Looking for element (id): ' + name);
        return await this.driver.findElement(By.name(name));
    };

    this.findByXPath = async function(xpath) {
		await this.driver.wait(until.elementLocated(By.xpath(xpath)), 2000, 'Looking for element (xpath): ' + xpath);
        return await this.driver.findElement(By.xpath(xpath));
    };



    /**
    * Clears the current element of any text that it may have in the input field.
    */
    this.clear = async function(el) {
        return await el.clear();
    }



    /**
    * Sends the given txt as an input to the given element, el.
    */
    this.write = async function (el, txt) {
        return await el.sendKeys(txt);
    };



    /**
    * Executes the given javascript snippet to the current browser session.
    */
    this.executeScript = async function(script) {
        return await this.driver.executeScript(script);
    };  



    /**
    * Finds an alert on the browser, and returns it to the user as an AlertPromise.
    * 
    * Solution to the deleteReview/Question problem is here. It's rather crude, 
    * but it works.
    */
    this.getAlert = async function() {
        let self = this;
    	await this.driver.wait(until.alertIsPresent(), 2000, 'Looking for alert')
            .catch(function() {
                return self.driver.wait(until.alertIsPresent(), 2000, 'Looking for alert');
            });
        return await this.driver.switchTo().alert();
    };



    /**
    * Waits until the url of the browser contains the given parameter.
    */
    this.waitUrl = async function(url) {
        return this.driver.wait(until.urlContains(url), 10000, 'Waiting for page load: ' + url);
    };



    /**
    * Waits until the title of the web page becomes the given parameter.
    */
    this.waitTitle = async function(title) {
        return this.driver.wait(until.titleIs(title), 3000, 'Waiting for title' + title);
    };



    /**
    * Checks if a specific CREMA widget/popup is in the html code, and if
    * it is being displayed properly.
    * 
    * This function cannot distinguish between widgets at the current moment. 
    */
    this.check = async function(opts) {
        if(opts['type'] === 'popup') {
            return await this.driver.wait(until.elementLocated(By.xpath(".//*[@id='crema-review-popup']")), 5000, 'Looking for popup')
                .then(function(res) {
                    res.getDriver().wait(until.elementIsVisible(res), 5000, 'Waiting for popup');
                });
        }else if(opts['type'] === 'widget') {
            return await this.driver.wait(until.elementLocated(By.xpath(".//*/iframe[starts-with(@id,'crema-product-reviews') or starts-with(@id,'crema-reviews')]")), 5000, 'Looking for widget')
                .then(function(res) {
                    res.getDriver().wait(until.elementIsVisible(res), 5000, 'Waiting for widget');
                });
        }
    };
};

module.exports = Page;