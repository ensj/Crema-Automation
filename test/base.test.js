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

describe('Base Test Suite', function () {
	this.timeout(60000);
	this.slow(20000);
	let Page, page, driver, id, url, productId;

	before(async function() {
		Page = require('../lib/mall.cafe24');
		page = new Page(o, {'type': 'chrome'});
		driver = page.driver;

		id = mall.cafe24.id; 
		url = mall.cafe24.url;

		productId = 11;

		await page.login();
	});

	after(async function() {
		await page.quit();
	});

	it('Base Test', async function() {
		
	});

	it.skip('Skipped Test', async function() {
		
	});

	it.only('Only Test That Runs', async function() {
		
	});
});

describe.skip('Skipped Test Suite', function () {
	this.timeout(60000);
	this.slow(20000);
	let Page, page, driver, id, url;

	before(async function() {
		Page = require('../lib/mall.cafe24');
		page = new Page(o, {'type': 'chrome'});
		driver = page.driver;

		id = mall.cafe24.id; 
		url = mall.cafe24.url;

		await page.login();
	});

	after(async function() {
		await page.quit();
	});

	it('Base Test', async function() {
		
	});

	it.skip('Skipped Test', async function() {
		
	});

	it.only('Only Test That Runs', async function() {
		
	});
});