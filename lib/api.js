/**
 * The api.js file should not be used until the file itself is improved further, 
 * and the CREMA API itself becomes more reliable. 
 */

const request = require('request-promise');
const { apiCreds } = require("../utils/credentials.json");

var exports = module.exports = {};

const oauth2 = require('simple-oauth2').create(apiCreds);

/**
 * Generates an oauth2 token for the CREMA API 
 */
getToken = async function() {
	try {
		const result = await oauth2.clientCredentials.getToken();
		return oauth2.accessToken.create(result).token;
	}catch (error) {
		return error;
	}
}


/**
 * Gets a random product id from the CREMA API.
 * 
 * The getRandomProduct initializes a token when it is called for 
 * the first time in each session. As the token can last up to 60 
 * days, there needs to be a way to contain it elsewhere once produced.
 */
var token;
exports.getRandomProduct = function(id) {
	if(token) {
		return request.get(`https://api.cre.ma/v1/products?brand_id=${id}&limit=10&status=selling&in_stock=1&display=1`)
			.auth(null, null, true, token.access_token);
	}else {
		return getToken().then(function(res) {
			token = res;
			return request.get(`https://api.cre.ma/v1/products?brand_id=${id}&limit=10&status=selling&in_stock=1&display=1`)
				.auth(null, null, true, token.access_token);
		});
	}
};