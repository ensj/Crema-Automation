const {describe, it, after, before} = require('mocha');
const chrome = require('selenium-webdriver/chrome');

const { mall } = require("../utils/credentials.json");

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

process.on('unhandledRejection', () => {});

var o = new chrome
			.Options()
			.addArguments('disable-infobars')
			.setUserPreferences({ credential_enable_service: false })
			//.headless()
			//.windowSize({ width: 640, height: 480 });

describe.only('cafe24 Site Check 1 / 2', function () {
	this.timeout(60000);
	this.slow(20000);
	let Page, page, driver, id, url, productId;

	before(async function() {
		Page = require('../lib/mall.cafe24');
		page = new Page(o, {'type': 'chrome'});
		driver = page.driver;

		id = mall.cafe24.id; 
		url = mall.cafe24.url;

		productId = 243;

		await page.login();
	});

	after(async function() {
		await page.quit();
	});

	it('Write review at product page', async function() {
		await page.getProduct(productId);
		await page.writeReview();
		await page.deleteReview();
	});

	it('Write review at full reviews page', async function() {
		await page.getReviews();
		await page.writeReview();
		await page.deleteReview();
	});

	it('Write question at product page', async function() {
		await page.getProduct(productId);
		await page.writeQuestion();
		await page.deleteQuestion();
	});

	it('Write question at full questions page', async function() {
		await page.getQuestions();
		await page.writeQuestion();
		await page.deleteQuestion();
	});

	it.only('Buy a product', async function() {
		await page.getProduct(productId);
		await page.buyProduct();
	});

});