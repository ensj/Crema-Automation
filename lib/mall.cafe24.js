let Page = require('./mall.base');
const locator = require('../utils/locator.cafe24');
const { mall } = require('../utils/credentials.json');
const api = require('../lib/api');

Page.prototype.login = async function() {
    await this.driver.get(mall.cafe24.url + '/member/login.html');

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

    // some websites don't load with /index.html
    // Solution: Create a function that waits for two or more urls (takes in an array?).
    return await this.waitUrl(mall.cafe24.url + '/index.html');
};

Page.prototype.getProduct = async function(code = 0) {
    if(code) {
        return this.driver.get(mall.cafe24.url + locator.productPath + code);
    }else {
        var self = this;
        return api.getRandomProduct(mall.cafe24.id).then(function(body) {
            let product = JSON.parse(body)[0];
            return self.driver.get(mall.cafe24.url + locator.productPath + product.code);
        });
    }
};

Page.prototype.getReviews = async function(loc = 0) {
    if(loc) {
        await this.driver.get(mall.cafe24.url + locator);
    }else {
        await this.driver.get(mall.cafe24.url + locator.reviewPath); 
    }
};

Page.prototype.getQuestions = async function(loc = 0) {
    if(loc) {
        await this.driver.get(mall.cafe24.url + locator);
    }else {
        await this.driver.get(mall.cafe24.url + locator.questionPath); 
    }
};

Page.prototype.writeReview = async function() {
    var curPage = await this.driver.getTitle();
    await this.driver.executeScript("jQuery('.crema-applied').hide(); jQuery('.crema-hide').show();");

    let el = await this.findByXPath(".//*[starts-with(@href, '/board/product/write.html?board_no=4')]");
    await this.driver.get(await el.getAttribute('href'));

    el = await this.findByXPath(".//*[@id='subject']");
    await el.sendKeys('리뷰');

    el = await this.findById('content_iframe_container');
    await el.click();
    await this.driver.actions().sendKeys('너무 좋아요.').perform();

    el = await this.findById('password');
    await el.sendKeys('123');
    
    await this.driver.executeScript("BOARD_WRITE.form_submit('boardWriteForm');");
    await this.waitTitle(curPage);
};

Page.prototype.deleteReview = async function() {
    await this.driver.get(mall.cafe24.url + '/myshop/board_list.html');
    await this.driver.executeScript("jQuery('.crema-applied').hide(); jQuery('.crema-hide').show();");

    let el = await this.findByXPath(".//*[contains(@href, 'board_no=4') and contains(@href, 'board/product/read.html?')]");
    await this.driver.get(await el.getAttribute('href'));
    await this.driver.executeScript("BOARD_READ.article_delete('BoardDelForm','4');");

    el = await this.getAlert(); // 정말로 삭제하시겠습니까?
    await el.accept();

    el = await this.getAlert(); // 게시글이 삭제되었습니다.
    await el.accept();

    await this.waitUrl(mall.cafe24.url + '/board/product/list.html?board_no=4');
};

Page.prototype.writeQuestion = async function() {
    var curPage = await this.driver.getTitle();
    await this.driver.executeScript("jQuery('.crema-applied').hide(); jQuery('.crema-hide').show();");

    let el = await this.findByXPath(".//*[starts-with(@href, '/board/product/write.html?board_no=6')]");
    await this.driver.get(await el.getAttribute('href'));

    el = await this.findByXPath(".//*[@id='subject']");
    await el.sendKeys('문의');

    el = await this.findById('content_iframe_container');
    await el.click();
    await this.driver.actions().sendKeys('너무 좋아요.').perform();

    el = await this.findById('password');
    await el.sendKeys('123');
    
    await this.driver.executeScript("BOARD_WRITE.form_submit('boardWriteForm');");
    await this.waitTitle(curPage);
};

Page.prototype.deleteQuestion = async function() {
    await this.driver.get(mall.cafe24.url + '/myshop/board_list.html');
    await this.driver.executeScript("jQuery('.crema-applied').hide(); jQuery('.crema-hide').show();");

    let el = await this.findByXPath(".//*[contains(@href, 'board_no=6') and contains(@href, 'board/product/read.html?')]");
    await this.driver.get(await el.getAttribute('href'));
    await this.driver.executeScript("BOARD_READ.article_delete('BoardDelForm','6');");

    el = await this.getAlert(); // 정말로 삭제하시겠습니까?
    await el.accept();

    el = await this.getAlert(); // 게시글이 삭제되었습니다.
    await el.accept();

    await this.waitUrl(mall.cafe24.url + '/board/product/list.html?board_no=6');
};

Page.prototype.buyProduct = async function() {
    // find all required options
    // keep getting one at a time till no result is returned
    await this.findMultipleByXPath("//select[@required='true']/option[last()]").then(function(arr) {
        arr.forEach(async function(el) {
            console.log(await el.getAttribute('value'));
            await el.click();
        });
    });

    /*var i = 1;
    while(this.findByXPath("(//select[@required='true']/option[last()])["+ i +"]")) {

    }*/

    // find "put in basket" button
    await this.findByXPath("//*[@onclick=\"product_submit(2, '/exec/front/order/basket/', this)\"]")
        .then(function(el) { 
            el.click(); 
        });

    // go to basket
    await this.waitUrl(mall.cafe24.url + '/order/basket.html');

    // order all in basket
    await this.findByXPath("//*[@onclick='Basket.orderAll(this)']")
        .then(function(el) { 
            el.click();
            // 장바구니에 동일한 상품이 있습니다. 장바구니에 추가하시겠습니까? 
            // ^ causes an error
        });

    await this.waitUrl(mall.cafe24.url + '/order/orderform.html');

    // name
    var el = await this.findById('oname');
    await el.clear();
    await el.sendKeys('크리마');

    // address
    el = await this.findById('btn_search_ozipcode');

    // open zipcodefinder iframe
    await this.driver.executeScript("ZipcodeFinder.Opener.Event.onClickBtnPopup(" 
                                    + "{data: {zipId1: 'ozipcode1', zipId2: 'ozipcode2', "
                                    + "addrId: 'oaddr1', stateId: '', cityId: '', type: 'layer', " 
                                    + "sLanguage: 'ko_KR', addrId2: 'oaddr2', form: 'frm_order_act'}})");

    // switch to zipcodefinder iframe
    await this.driver.switchTo().frame(await this.findById('iframeZipcode'));

    // zipcode address
    el = await this.findById('zboo_keyword');
    await el.sendKeys('신사동 634-5');
    el = await this.findById('zboo_search_btn');
    await el.click();
    el = await this.findByXPath("//*[contains(@onclick, '$ZclickAddress')]"); 
    await el.click();

    // switch back to original frame
    await this.driver.switchTo().defaultContent();
    
    // phone number (home)
    el = await this.findByXPath("//select[@id='ophone1_1']/option[@value='070']");
    await el.click(); 
    el = await this.findById('ophone1_2');
    await el.clear();
    await el.sendKeys('5102');
    el = await this.findById('ophone1_3');
    await el.clear();
    await el.sendKeys('2595');
    
    // phone number (mobile)
    el = await this.findByXPath("//select[@id='ophone2_1']/option[@value='010']"); 
    await el.click();
    el = await this.findById('ophone2_2');
    await el.clear();
    await el.sendKeys('3437');
    el = await this.findById('ophone2_3');
    await el.clear();
    await el.sendKeys('6008');
    
    // email
    el = await this.findById('oemail1');
    await el.clear();
    await el.sendKeys('supportpublic');
    el = await this.findByXPath("//select[@id='oemail3']/option[@value='etc']"); // 
    await el.click();
    el = await this.findById('oemail2');
    await el.clear();
    await el.sendKeys('cre.ma');

    // delivery address is same as customer info
    el = await this.findById('sameaddr0');
    await el.click();

    // payment method - cash
    el = await this.findByXPath(".//input[@value='cash']");
    await el.click();

    // payment sender name
    el = await this.findById('pname');
    await el.clear();
    await el.sendKeys('크리마');

    // choose payment option
    el = await this.findByXPath("//select[@id='bankaccount']/option[last()]");
    await el.click();

    // purchase agreement
    el = await this.findById('chk_purchase_agreement0');
    await el.click();

    // click "buy"
    el = await this.findById('btn_payment');
    await el.click();

    // wait for order to go through
    await this.waitUrl(mall.cafe24.url + '/order/order_result.html');
    // get full list of orders
    await this.driver.get(mall.cafe24.url + '/myshop/order/list.html');

    // find most recent order's cancel order button, click it
    el = await this.findByXPath("//tr[@class='xans-record-']/td/a");
    await el.click();

    // 주문을 취소하겠습니까?
    el = await this.getAlert();
    await el.accept();

    // 주문이 취소되었습니다.
    el = await this.getAlert();
    await el.accept();
};

module.exports = Page;