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

// CAFE24 WIDGET TEST


describe('cafe24 Site Check 2', function () {
	this.timeout(60000);
	this.slow(20000);
	let Page, page, driver, token, id, url;

	before(async function() {
		Page = require('../lib/mall.cafe24');
		page = new Page(o);
		driver = page.driver;

		id = mall.cafe24.id; 
		url = mall.cafe24.url;

		await page.login();
	});

	after(async function() {
		await page.quit();
	});

	it('Write review at product page', async function() {
		await page.getProduct();
		await page.writeReview();
	});

	it('Write review at full reviews page', async function() {
		await page.getReviews();
		await page.writeReview();
	});

});