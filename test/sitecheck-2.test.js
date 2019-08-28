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

	// before all other tests
	before(async function() {
		// specify we're using cafe24
		Page = require('../lib/mall.cafe24');
		// specify browser type
		page = new Page(o, {'type': 'chrome'});
		// get selenium driver
		driver = page.driver;

		// get mall id
		id = mall.cafe24.id;
		// get mall url 
		url = mall.cafe24.url;

		// get product id we're testing
		productId = 243; 

		// log into the website
		await page.login();
	});

	// after all tests
	after(async function() {
		// quit driver
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

	it('Buy a product', async function() {
		await page.getProduct(productId);
		await page.buyProduct();
	});

});