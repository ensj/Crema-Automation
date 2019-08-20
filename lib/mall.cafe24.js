let Page = require('./mall.base');
const locator = require('../utils/locator.cafe24');
const { mall } = require("../utils/credentials.json");
const api = require('../lib/api');

Page.prototype.login = async function() {
    await this.driver.get(mall.cafe24.url + "/member/login.html");

    var userID = await this.findById(locator.userID);
    var userPW = await this.findById(locator.userPW);

    await this.clear(userID);
    await this.write(userID, mall.cafe24.userID);
    await this.clear(userPW);
    await this.write(userPW, mall.cafe24.userPW);

    await this.findByXPath(".//*[starts-with(@onclick, \"MemberAction.login('member_form_\")]")
            .then(function(el) {
                el.click();
            });

    return await this.waitUrl(mall.cafe24.url + "/index.html");
};

Page.prototype.getProduct = async function() {
    var self = this;
    return api.getRandomProduct(mall.cafe24.id).then(function(body) {
        let product = JSON.parse(body)[0];
        return self.driver.get(mall.cafe24.url + locator.productPath + product.code);
    });
};

Page.prototype.getReviews = async function(loc = 0) {
    if(loc) {
        await this.driver.get(mall.cafe24.url + locator);
    }else {
        await this.driver.get(mall.cafe24.url + locator.reviewPath); 
    }
};

Page.prototype.writeReview = async function() {
    var curPage = await this.driver.getTitle();
    await this.driver.executeScript("jQuery('.crema-applied').hide(); jQuery('.crema-hide').show();");

    let el = await this.findByXPath(".//*[starts-with(@href, \"/board/product/write.html?board_no=4\")]");
    let path = await el.getAttribute("href");
    await this.driver.get(path);

    el = await this.findByXPath(".//*[@id=\"subject\"]");
    await el.sendKeys("리뷰");

    el = await this.findById("content_iframe_container");
    await el.click();
    await this.driver.actions().sendKeys("너무 좋아요.").perform();

    el = await this.findById("password");
    await el.sendKeys("123");
    
    await this.driver.executeScript("BOARD_WRITE.form_submit('boardWriteForm');");
    await this.waitTitle(curPage);
};

Page.prototype.deleteReview = async function() {
    await this.driver.get(mall.cafe24.url + "/myshop/board_list.html");
    await this.driver.executeScript("jQuery('.crema-applied').hide(); jQuery('.crema-hide').show();");

    let el = await this.findByXPath(".//*[contains(@href, 'board_no=4') and contains(@href, 'board/product/read.html?')]");
    let path = await el.getAttribute("href");
    await this.driver.get(path);
    await this.driver.executeScript("BOARD_READ.article_delete('BoardDelForm','4');");

    el = await this.getAlert(); // 정말로 삭제하시겠습니까?
    await el.accept();

    el = await this.getAlert(); // 게시글이 삭제되었습니다.
    await el.accept();

    await this.waitUrl(mall.cafe24.url + "/board/product/list.html?board_no=4");
};

module.exports = Page;