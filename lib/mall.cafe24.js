let Page = require('./page.base');
const locator = require('../utils/locator.cafe24');
const { mall } = require('../utils/credentials.json');
const api = require('../lib/api');


/**
 * Logs into the current cafe24 mall.
 * 
 * Recognizes function completion by waiting to see if the driver gets 
 * redirected to the index page. Some pages don't load with the /index.html
 * path in the url, however, which may throw an error. 
 */
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
    var self = this;
    return await this.waitUrl(mall.cafe24.url + '/index.html')
        .catch(function() {
            self.waitUrl(mall.cafe24.url);
        });
};




/**
 * Gets a product page loaded up using a given product code.
 *
 * If no code is given, the function will make an API call to get a random product
 * off of the CREMA API. Will not work if the API returns an invalid product id, or
 * if the api credentials are invalid themselves.
 * When used on a website with no popup, the program will pause for around ten seconds
 * waiting for the popup. There may need to be a way to get around this in order to
 * speed up tests.
 */
Page.prototype.getProduct = async function(code = 0) {
    let self = this;
    if(code) {
        await this.driver.get(mall.cafe24.url + locator.productPath + code);
        // checks if a popup exists on the product page, and deletes it if there 
        // is one. If there isn't, nothing happens. 
        await this.check({'type':'popup'})
                .then(function() {
                    self.driver.executeScript("jQuery('#crema-review-popup').remove();");
                }).catch(function() {});
    }else {
        return api.getRandomProduct(mall.cafe24.id).then(async function(body) {
            let product = JSON.parse(body)[0];
            await self.driver.get(mall.cafe24.url + locator.productPath + product.code);
            await self.check({'type':'popup'})
                .then(function() {
                    self.driver.executeScript("jQuery('#crema-review-popup').remove();");
                }).catch(function() {});
        });
    }
};




/**
 * Gets the Review page from the locator, or the given parameter.
 */
Page.prototype.getReviews = function(loc = 0) {
    if(loc) {
        return this.driver.get(mall.cafe24.url + locator);
    }else {
        return this.driver.get(mall.cafe24.url + locator.reviewPath); 
    }
};




/**
 * Gets the QnA page from the locator, or the given parameter.
 */
Page.prototype.getQuestions = function(loc = 0) {
    if(loc) {
        return this.driver.get(mall.cafe24.url + locator);
    }else {
        return this.driver.get(mall.cafe24.url + locator.questionPath); 
    }
};




/**
 * Attempts to write a review on whatever page the function is called on.
 * 
 * This function finds the "리뷰쓰기" button by finding an element with a specific href,
 * and submits a review. This function does not work if the website has a captcha built
 * into the form.
 */
Page.prototype.writeReview = async function() {
    let curPage = await this.driver.getTitle();
    await this.driver.executeScript("jQuery('.crema-applied').hide();" + 
                                    "jQuery('.crema-hide').show();");

    let el = await this.findByXPath(".//*[starts-with(@href, '/board/product/write.html?board_no=4')]");
    await this.driver.get(await el.getAttribute('href'));

    el = await this.findByXPath(".//*[@id='subject']");
    await el.sendKeys('리뷰');

    // mode switching between chrome and mobile.
    if(this.type === 'chrome' || this.type === 'ie') {
        el = await this.findById('content_iframe_container');
        await el.click();
        await this.driver.actions().sendKeys('너무 좋아요.').perform();
    }else if(this.type === 'mobile') {
        el = await this.findById('content');
        await el.sendKeys('너무 좋아요.');
    }

    el = await this.findById('password');
    await el.sendKeys('123');
    
    await this.driver.executeScript("BOARD_WRITE.form_submit('boardWriteForm');");
    
    try {
        el = await this.getAlert();
        await el.accept();
    }catch(err) {
        return await this.waitTitle(curPage);
    }
    
    return await this.waitTitle(curPage);
};




/**
 * Attempts to delete a review off of the first page off of "my board".
 * 
 * If there is no review present on the first page, an error will be thrown. 
 * This will need to be addressed in the future.
 *
 * On mobile, clicking "삭제" causes the first alert, "정말로 삭제하시겠습니까?" to spawn.
 * Clicking this causes two more alerts to appear together, with the former 
 * getting replaced by the latter instantly. The driver ends up grabbing the 
 * disappeared alert, which causes it to throw an error when the alert goes away.
 * The solution to this error is located within the getAlert function. Refer to it 
 * in order to make any further improvements.
 */
Page.prototype.deleteReview = async function() { // make deletes return the text of the second alert.
    await this.driver.get(mall.cafe24.url + '/myshop/board_list.html');
    await this.driver.executeScript("jQuery('.crema-applied').hide();" + 
                                    "jQuery('.crema-hide').show();" + 
                                    "jQuery('#crema-review-popup').remove();");

    let el = await this.findByXPath(".//*[contains(@href, 'board_no=4') and contains(@href, 'board/product/read.html?')]");
    await this.driver.get(await el.getAttribute('href'));
    await this.driver.executeScript("BOARD_READ.article_delete('BoardDelForm','4');");

    el = await this.getAlert(); // 정말로 삭제하시겠습니까?
    await el.accept();

    el = await this.getAlert(); // 게시글이 삭제되었습니다. 
    await el.accept();

    return await el.getText();
    //this.waitUrl(mall.cafe24.url + '/board/product/list.html?board_no=4');
};




/**
 * Attempts to write a question on whatever page the function is called on.
 * 
 * This function finds the "문의하기" button by finding an element with a specific href,
 * and submits a question. This function does not work if the website has a captcha built
 * into the form.
 */
Page.prototype.writeQuestion = async function() {
    var curPage = await this.driver.getTitle();
    await this.driver.executeScript("jQuery('.crema-applied').hide();" + 
                                    "jQuery('.crema-hide').show();" + 
                                    "jQuery('#crema-review-popup').remove();");

    let el = await this.findByXPath(".//*[starts-with(@href, '/board/product/write.html?board_no=6')]");
    await this.driver.get(await el.getAttribute('href'));

    el = await this.findByXPath(".//*[@id='subject']");
    await el.sendKeys('문의');

    // mode switching between chrome and mobile.
    if(this.type === 'chrome' || this.type === 'ie') {
        el = await this.findById('content_iframe_container');
        await el.click();
        await this.driver.actions().sendKeys('어떤가요?').perform();
    }else if(this.type === 'mobile') {
        el = await this.findById('content');
        await el.sendKeys('어떤가요?');
    }

    el = await this.findById('password');
    await el.sendKeys('123');
    
    await this.driver.executeScript("BOARD_WRITE.form_submit('boardWriteForm');");
    return await this.waitTitle(curPage);
};




/**
 * Attempts to delete a question off of the first page off of "my board".
 * 
 * If there is no question present on the first page, an error will be thrown. 
 * This will need to be addressed in the future.
 * 
 * On mobile, clicking "삭제" causes the first alert, "정말로 삭제하시겠습니까?" to spawn.
 * Clicking this causes two more alerts to appear together, with the former 
 * getting replaced by the latter instantly. The driver ends up grabbing the 
 * disappeared alert, which causes it to throw an error when the alert goes away.
 * The solution to this error is located within the getAlert function. Refer to it 
 * in order to make any further improvements.
 */
Page.prototype.deleteQuestion = async function() {
    await this.driver.get(mall.cafe24.url + '/myshop/board_list.html');
    await this.driver.executeScript("jQuery('.crema-applied').hide();" + 
                                    "jQuery('.crema-hide').show();" + 
                                    "jQuery('#crema-review-popup').remove();");

    let el = await this.findByXPath(".//*[contains(@href, 'board_no=6') and contains(@href, 'board/product/read.html?')]");
    await this.driver.get(await el.getAttribute('href'));
    await this.driver.executeScript("BOARD_READ.article_delete('BoardDelForm','6');");

    el = await this.getAlert(); // 정말로 삭제하시겠습니까?
    await el.accept();

    el = await this.getAlert(); // 게시글이 삭제되었습니다.
    await el.accept();

    return await this.waitUrl(mall.cafe24.url + '/board/product/list.html?board_no=6');
};




/**
 * Attempts to put a given product on the page into the user's basket.
 */
Page.prototype.putBasket = async function() {
    let el;
    // find all required options
    for(var i = 1; i < 10; i++) {
        try {
            el = await this.findByXPath("(//select[@required='true']/option[last()])[" + i + "]")
            await el.click();
        }catch(err) {
            break;
        }
    }

    // find "put in basket" button
    el = await this.findByXPath("//*[@onclick=\"product_submit(2, '/exec/front/order/basket/', this)\"]");
    await el.click();

    // 장바구니에 동일한 상품이 있습니다. 장바구니에 추가하시겠습니까?
    try {
        el = await this.getAlert();
        await el.accept();
    }catch(err) {}
};




/**
 * Attempts to cancel the most recent order the user put through.
 */
Page.prototype.orderAll = async function() {
    // go to basket
    await this.get(mall.cafe24.url + '/order/basket.html');

    // order all in basket
    await this.findByXPath("//*[@onclick='Basket.orderAll(this)']")
        .then(function(el) { 
            el.click();
        });

    await this.waitUrl(mall.cafe24.url + '/order/orderform.html');
};




/**
 * Attempts to cancel the most recent order the user put through.
 */
Page.prototype.cancelOrder = async function() {
    // get full list of orders
    await this.driver.get(mall.cafe24.url + '/myshop/order/list.html');

    // find most recent order's cancel order button and click it
    el = await this.findByXPath("//tr[@class='xans-record-']/td/a");
    await el.click();

    // 주문을 취소하겠습니까?
    el = await this.getAlert();
    await el.accept();

    // 주문이 취소되었습니다.
    el = await this.getAlert();
    await el.accept();
};




/**
 * Attempts to purchase a product from whatever page the driver is on.
 * Note: incredibly flaky. Also assumes that the driver is already on 
 * the order form. 
 *
 * This function is prone to quite a lot of errors, as many cafe24 malls
 * has a different way of handling user purchases. Sudden popups when a 
 * redirect is expected will cause an error, etc. Handle with care, and 
 * try to add a new try/catch block for each possible popup/redirect that 
 * the program doesn't expect. 
 */
Page.prototype.buyProduct = async function() {
    /*
     * ORDER FORM START
     */
    try {
        // name
        el = await this.findById('oname');
        await el.clear();
        await el.sendKeys('크리마');

        // address
        el = await this.findById('btn_search_ozipcode');

        // open zipcodefinder iframe
        // ZipcodeFinder.Opener.Event.onClickBtnPopup({data: {zipId1: 'ozipcode1', zipId2: 'ozipcode2', addrId: 'oaddr1', stateId: '', cityId: '', type: 'layer', sLanguage: 'ko_KR', addrId2: 'oaddr2', form: 'frm_order_act'}})
        // ^ above (or below) code doesn't execute properly on certain sites, 
        //   like memelody or augustplan. Find out why.
        await this.driver.executeScript("ZipcodeFinder.Opener.Event.onClickBtnPopup({" + 
                                        "data: {" + 
                                            "zipId1: 'ozipcode1', " + 
                                            "zipId2: 'ozipcode2', " + 
                                            "addrId: 'oaddr1', " + 
                                            "stateId: '', " + 
                                            "cityId: '', " + 
                                            "type: 'layer', " + 
                                            "sLanguage: 'ko_KR', " + 
                                            "addrId2: 'oaddr2', " + 
                                            "form: 'frm_order_act' " + 
                                        "}})");

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
    } catch(err) {
        console.log("Filling out order form failed: " + err);
    }
    /*
     * ORDER FORM END
     */

    /*
     * DELIVERY FORM START
     */
    // delivery address is same as customer info
    // el = await this.findById('sameaddr0');
    // await el.click();

    try {
        // name
        el = await this.findById('rname');
        await el.clear();
        await el.sendKeys('크리마');

        // address
        el = await this.findById('btn_search_ozipcode');

        // open zipcodefinder iframe
        // ZipcodeFinder.Opener.Event.onClickBtnPopup({data: {zipId1: 'rzipcode1', zipId2: 'rzipcode2', addrId: 'raddr1', stateId: '', cityId: '', type: 'layer', sLanguage: 'ko_KR', addrId2: 'raddr2', form: 'frm_order_act'}})
        await this.driver.executeScript("ZipcodeFinder.Opener.Event.onClickBtnPopup({" + 
                                        "data: {" + 
                                            "zipId1: 'rzipcode1'," + 
                                            "zipId2: 'rzipcode2', " + 
                                            "addrId: 'raddr1', " + 
                                            "stateId: '', " + 
                                            "cityId: '', " + 
                                            "type: 'layer', " + 
                                            "sLanguage: 'ko_KR', " + 
                                            "addrId2: 'raddr2', " + 
                                            "form: 'frm_order_act' " + 
                                        "}})");

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
        el = await this.findByXPath("//select[@id='rphone1_1']/option[@value='070']");
        await el.click(); 
        el = await this.findById('rphone1_2');
        await el.clear();
        await el.sendKeys('5102');
        el = await this.findById('rphone1_3');
        await el.clear();
        await el.sendKeys('2595');
        
        // phone number (mobile)
        el = await this.findByXPath("//select[@id='ophone2_1']/option[@value='010']"); 
        await el.click();
        el = await this.findById('rphone2_2');
        await el.clear();
        await el.sendKeys('3437');
        el = await this.findById('rphone2_3');
        await el.clear();
        await el.sendKeys('6008');
        
        // email
        el = await this.findById('remail1');
        await el.clear();
        await el.sendKeys('supportpublic');
        el = await this.findByXPath("//select[@id='remail3']/option[@value='etc']"); // 
        await el.click();
        el = await this.findById('remail2');
        await el.clear();
        await el.sendKeys('cre.ma');
    } catch(err) {
        console.log("Filling out delivery form failed: " + err);
    }
    /*
     * DELIVERY FORM END
     */

    /*
     * PAYMENT FORM START
     */
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
    /*
     * PAYMENT FORM END
     */

    // wait for order to go through
    await this.waitUrl(mall.cafe24.url + '/order/order_result.html');
};

module.exports = Page;