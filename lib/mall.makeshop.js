const Page = require('./page.base');
const locator = require('../utils/locator.makeshop');
const { mall } = require("../utils/credentials.json");
const api = require('../lib/api');




class MakeshopPage extends Page {
    async login() {
        await this.driver.get(mall.makeshop.url + "/shop/member.html?type=login");

        var userID = await this.findByName(locator.userID);
        var userPW = await this.findByName(locator.userPW);

        await this.clear(userID);
        await this.write(userID, mall.makeshop.userID);
        await this.clear(userPW);
        await this.write(userPW, mall.makeshop.userPW);

        await this.executeScript("check();");

        return this.driver;
    };




    getProduct() {
        var self = this;
        return api.getRandomProduct(mall.makeshop.id).then(async function(body) {
            let product = JSON.parse(body)[0];
            return await self.driver.get(mall.makeshop.url + locator.productPath + product.code);
        });
    };




    async getReviews(loc = 0) {
        if(loc) {
            await this.driver.get(mall.makeshop.url + locator);
        }else {
            await this.driver.get(mall.makeshop.url + locator.reviewPath); 
        }
    };




    async getQuestions(loc = 0) {
        if(loc) {
            await this.driver.get(mall.makeshop.url + locator);
        }else {
            await this.driver.get(mall.makeshop.url + locator.questionPath); 
        }
    };




    async writeReview() {
        
    };




    async deleteReview() {

    };




    async writeQuestion() {

    };




    async deleteQuestion() {

    };




    async buyProduct() {

    };
}

module.exports = Page;