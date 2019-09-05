const {describe, it, after, before} = require('mocha');

process.on('unhandledRejection', () => {});

describe.only('cafe24 Site Check', function () {
	this.timeout(60000);
	this.slow(20000);
	let Page, page, driver, productId;

	// before all other tests
	before(async function() {
		// specify we're using cafe24
		Page = require('../lib/mall.cafe24');
		// specify browser type
		page = new Page({'type': 'mobile'});
		// get selenium driver
		driver = page.driver;

		// get product id we're testing
		productId = 148; 

		// log into the website
		await page.login();
	});

	// after all tests
	after(async function() {
		// quit driver
		await page.quit();
	});

	describe('Product - Review', function() {
		it('Get product page', async function() {
			await page.getProduct(productId);
		});

		it('Write review', async function() {
			await page.writeReview();
		});

		it('Delete review', async function() {
			await page.deleteReview();
		});
	});

	describe('Board - Review', function() {
		it('Get review board', async function() {
			await page.getReviews();
		});

		it('Write review', async function() {
			await page.writeReview();
		});

		it('Delete review', async function() {
			await page.deleteReview();
		});
	});

	describe('Product - Question', function() {
		it('Get product page', async function() {
			await page.getProduct(productId);
		});

		it('Write question', async function() {
			await page.writeQuestion();	
		});

		it('Delete question', async function() {
			await page.deleteQuestion();
		});
	});

	describe('Board - Question', function() {
		it('Get QnA board', async function() {
			await page.getQuestions();
		});

		it('Write question', async function() {
			await page.writeQuestion();
		});

		it('Delete question', async function() {
			await page.deleteQuestion();
		});
	});

	describe.only('Product - Purchase ', function() {
		it('Get product page', async function() {
			await page.getProduct(productId);
		});

		it('Put in basket', async function() {
			await page.putBasket();
		});

		it('Order all', async function() {
			await page.orderAll();
		});

		it('Buy product', async function() {
			await page.buyProduct();
		});

		it('Cancel order', async function() {
			await page.cancelOrder();
		});
	});
});