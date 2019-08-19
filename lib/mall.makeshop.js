let Page = require('./mall.base');
const locator = require('../utils/locator.makeshop');
const { mall } = require("../utils/credentials.json");
const api = require('../lib/api');

Page.prototype.login = async function() {
    await this.driver.get(mall.makeshop.url + "/shop/member.html?type=login");

    var userID = await this.findByName(locator.userID);
    var userPW = await this.findByName(locator.userPW);

    // make dis work with api later
    await this.clear(userID);
    await this.write(userID, mall.makeshop.userID);
    await this.clear(userPW);
    await this.write(userPW, mall.makeshop.userPW);

    await this.executeScript("check();");

    return this.driver;
};

Page.prototype.getProduct = function() {
    var self = this;
    return api.getRandomProduct(mall.makeshop.id).then(async function(body) {
        let product = JSON.parse(body)[0];
        return await self.driver.get(mall.makeshop.url + locator.productPath + product.code);
    });
};

Page.prototype.writeReview = async function() {
    
};

module.exports = Page;