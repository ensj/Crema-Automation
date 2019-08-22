const {Builder, By, until} = require('selenium-webdriver');

var Page = function(o) {
	this.driver = new Builder()
		.setChromeOptions(o)
		.forBrowser('chrome')
		.build();

	this.get = async function(url) {
		return await this.driver.get(url);
	};

	this.quit = async function() {
		return await this.driver.quit();
	};

    // the "find" functions will always return a timeout error if the element is not found. 
    // Solution: need a catch for all the errors in the wait function calls.
    // The waits are needed for all the elements that take time to load.
    this.findById = async function(id) {
        await this.driver.wait(until.elementLocated(By.id(id)), 2000, 'Looking for element (id): ' + id);
        return await this.driver.findElement(By.id(id));
    };

    this.findByName = async function(name) {
        await this.driver.wait(until.elementLocated(By.name(name)), 2000, 'Looking for element (id): ' + name);
        return await this.driver.findElement(By.name(name));
    };

    this.findByXPath = async function(xpath) {
		await this.driver.wait(until.elementLocated(By.xpath(xpath)), 2000, 'Looking for element (xpath:single): ' + xpath);
        return await this.driver.findElement(By.xpath(xpath));
    };

    this.findMultipleByXPath = async function(xpath) {
        await this.driver.wait(until.elementsLocated(By.xpath(xpath)), 2000, 'Looking for element (xpath:multiple): ' + xpath);
        return await this.driver.findElements(By.xpath(xpath)); 
    };

    this.clear = async function(el) {
        return await el.clear();
    }

    this.write = async function (el, txt) {
        return await el.sendKeys(txt);
    };

    this.executeScript = async function(script) {
        return await this.driver.executeScript(script);
    };  

    this.getAlert = async function() {
    	await this.driver.wait(until.alertIsPresent(), 2000, 'Looking for alert');
        return await this.driver.switchTo().alert();
    };

    this.waitUrl = async function(url) {
        return this.driver.wait(until.urlContains(url), 10000, 'Waiting for page load');
    };

    this.waitTitle = async function(title) {
        return this.driver.wait(until.titleIs(title), 3000, 'Waiting for title');
    };

    // This can be further improved by adding new, more specific "types" of crema widgets and popups that can be detected.
    this.check = async function(opts) {
        if(opts['type'] === 'popup') {
            return await this.driver.wait(until.elementLocated(By.xpath(".//*[@id='crema-review-popup']")), 10000, 'Looking for popup')
                .then(function(res) {
                    res.getDriver().wait(until.elementIsVisible(res), 10000, 'Waiting for popup');
                });
        }else if(opts['type'] === 'widget') {
            return await this.driver.wait(until.elementLocated(By.xpath(".//*/iframe[starts-with(@id,'crema-product-reviews') or starts-with(@id,'crema-reviews')]")), 10000, 'Looking for widget')
                .then(function(res) {
                    res.getDriver().wait(until.elementIsVisible(res), 10000, 'Waiting for widget');
                });
        }
    };
};

module.exports = Page;