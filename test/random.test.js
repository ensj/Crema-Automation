const {describe, it, after, before} = require('mocha');
const chrome = require('selenium-webdriver/chrome');

const { mall } = require("../utils/credentials.json");

process.on('unhandledRejection', () => {});

describe('Mobile Test Experiment', function () {
	this.timeout(30000);
	this.slow(20000);
	let Page, page, driver;

	before(async function() {
		Page = require('../lib/mall.cafe24');
		page = new Page(o, {'type': 'mobile'});
		driver = page.driver;

		await page.login();
	});

	after(async function() {
		//await page.quit();
	});

	it('Delete Question/Review test', async function() {
		//await page.get("http://thecrema1.cafe24.com/board/product/list.html?board_no=6");
		//await page.getProduct(198);
		await page.getProduct(198);
		await page.writeQuestion();
		await page.deleteQuestion();
		//await page.deleteReview();
	});
});