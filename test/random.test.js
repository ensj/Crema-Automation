const {describe, it, after, before} = require('mocha');
const chrome = require('selenium-webdriver/chrome');

const { mall } = require("../utils/credentials.json");

const chai = require('chai');
const assert = chai.assert;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

process.on('unhandledRejection', () => {});

var o = new chrome
			.Options()
			.addArguments('disable-infobars')
			.setUserPreferences({ credential_enable_service: false })
			//.headless()
			//.windowSize({ width: 640, height: 480 });

// MAKESHOP FAILED PRODUCT TEST
//test to check

describe('Failed Product Test', function () {
	this.timeout(30000);
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

	it('Get the wrong product', async function() {
		//await page.getProduct();
		await page.getReviews();
		await page.writeReview();
	});
});