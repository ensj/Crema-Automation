const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const ie = require('selenium-webdriver/ie');

class Page {
    constructor(opts) {
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
    }




    /**
    * Navigates to the given url in the parameter.
    * 
    * @param {string} url The url to navigate to.
    * @return {Promise<undefined>} to be resolved when document finishes loading.
    */
	get(url) {
		return this.driver.get(url);
	}




    /**
    * Terminates the browser session. The current instance of Page will not be able
    * to be used again.
    * 
    * @return {Promise<undefined>} to be resolved after function completes.
    */
	quit() {
		return this.driver.quit();
	}




    /**
    * Finds element on a given web page according to the id.
    * 
    * @param {string} id The id of the element to be found.
    * @return {WebElementPromise} A WebElement to be issued commands against.
    */
    async findById(id) {
        await this.driver.wait(until.elementLocated(By.id(id)), 2000, 'Looking for element (id): ' + id);
        return await this.driver.findElement(By.id(id));
    }




    /**
    * Finds element on a given web page according to the name.
    * 
    * @param {string} name The name of the element to be found.
    * @return {WebElementPromise} A WebElement to be issued commands against.
    */
    async findByName(name) {
        await this.driver.wait(until.elementLocated(By.name(name)), 2000, 'Looking for element (id): ' + name);
        return await this.driver.findElement(By.name(name));
    }




    /**
    * Finds element on a given web page according to the xpath.
    * 
    * @param {string} xpath The xpath locator of the element to be found.
    * @return {WebElementPromise} A WebElement to be issued commands against.
    */
    async findByXPath(xpath) {
		await this.driver.wait(until.elementLocated(By.xpath(xpath)), 2000, 'Looking for element (xpath): ' + xpath);
        return await this.driver.findElement(By.xpath(xpath));
    }




    /**
    * Clears the current element of any text that it may have in the input field.
    * 
    * @param {WebElement} el The element that is to be cleared.
    * @return {Promise<undefined>} To be resolved after function completes.
    */
    clear(el) {
        return el.clear();
    }




    /**
    * Sends the given txt as an input to the given element, el.
    * 
    * @param {WebElement} el The element to input to.
    * @param {string} txt The text that is to be inputted.
    * @return {Promise<undefined>} To be resolved after function completes.
    */
    write (el, txt) {
        return el.sendKeys(txt);
    }




    /**
    * Executes the given javascript snippet to the current browser session.
    * 
    * @param {string} script The javascript script that is to be executed in the browser.
    * @return {IThenable<T>} Promise to be resolved according to the return value of the script. 
    */
    executeScript(script) {
        return this.driver.executeScript(script);
    }




    /**
    * Finds an alert on the browser, and returns it to the user as an AlertPromise.
    * 
    * Solution to the deleteReview/Question problem is here. It's rather crude, 
    * but it works.
    * 
    * @return {AlertPromise} The opened alert.
    */
    async getAlert() {
        let self = this;
    	await this.driver.wait(until.alertIsPresent(), 2000, 'Looking for alert')
            .catch(function() {
                return self.driver.wait(until.alertIsPresent(), 2000, 'Looking for alert');
            });
        return await this.driver.switchTo().alert();
    }




    /**
    * Waits until the url of the browser contains the given parameter.
    * 
    * @param {string} url The url for the browser to wait on.
    * @return {IThenable<T>} To be returned when the wait completes.
    */
    waitUrl(url) {
        return this.driver.wait(until.urlContains(url), 10000, 'Waiting for page load: ' + url);
    }




    /**
    * Waits until the title of the web page becomes the given parameter.
    * 
    * @param {string} title The title for the browser to wait on.
    * @return {IThenable<T>} To be returned when the wait completes.
    */
    waitTitle(title) {
        return this.driver.wait(until.titleIs(title), 3000, 'Waiting for title' + title);
    }




    /**
    * Checks if a specific CREMA widget/popup is in the html code, and if
    * it is being displayed properly.
    * 
    * This function cannot distinguish between widgets at the current moment. 
    * 
    * @param {Object} opts Options specifying the widget/popup that is to be found.
    * @return {IThenable<T>} To be resolved when the wait completes.
    */
    async check(opts) {
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
    }
}

module.exports = Page;