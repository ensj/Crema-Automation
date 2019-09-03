const {describe, it, after, before} = require('mocha');
const { mall } = require("../utils/credentials.json");

process.on('unhandledRejection', () => {});

// CAFE24 WIDGET TEST

describe('cafe24 Widget Check', function () {
	this.timeout(60000);
	let Page, page, driver;

	before(async function() {
		Page = require('../lib/mall.cafe24');
		page = new Page({'type': 'chrome'});
		driver = page.driver;

		await page.login();
	});

	after(async function() {
		await page.quit();
	});

	it('#page.check(popup) - Main Page', async function() {
		await page.get(mall.cafe24.url);
		await page.check({'type':'popup'});
	});

	it('#page.check(popup) - Product Page', async function() {
		await page.getProduct();
		await page.check({'type':'popup'});
	});

	it('#page.check(widget) - Product Page', async function() {
		await page.getProduct();
		await page.check({'type':'widget'});
	});

	it('#page.check(widget) - All Reviews Page', async function() {
		await page.getReviews();
		await page.check({'type':'widget'});
	});
});