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

    this.findById = async function(id) {
        return await this.driver.wait(until.elementLocated(By.id(id)), 15000, 'Looking for element');
    };

    this.findByName = async function(name) {
        return await this.driver.wait(until.elementLocated(By.name(name)), 15000, 'Looking for element');
    };

    this.findByXPath = async function(xpath) {
		return await this.driver.wait(until.elementLocated(By.xpath(xpath)), 15000, 'Looking for element');
    };

    this.clear = async function(el) {
        return await el.clear();
    }

    // fill input web elements
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
        return this.driver.wait(until.titleIs(title), 3000, 'Waiting to go back');
    };

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