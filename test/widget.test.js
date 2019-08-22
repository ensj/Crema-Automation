const {describe, it, after, before} = require('mocha');
const chrome = require('selenium-webdriver/chrome');

const api = require('../lib/api');

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


describe('cafe24 Widget Check', function () {
	this.timeout(60000);
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

	it('#page.check(popup) - Main Page', async function() {
		await page.get(url);
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


// MAKESHOP WIDGET TEST


describe('makeshop Widget Check', function () {
	this.timeout(60000);
	let Page, page, driver, api, token, id, url, reviews;

	before(async function() {
		Page = require('../lib/mall.makeshop');
		page = new Page(o, {'type': 'chrome'});
		driver = page.driver;

		id = mall.makeshop.id; 
		url = mall.makeshop.url;
		reviews = mall.makeshop.reviews;

		let res = await page.login(url);
		expect(res).to.equal(true, "login failed");
	});

	after(async function() {
		await page.quit();
	});

	it('#page.check(popup) - Main Page', async function() {
		await page.get(url);
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
		await page.get(url + reviews);
		await page.check({'type':'widget'});
	});
});