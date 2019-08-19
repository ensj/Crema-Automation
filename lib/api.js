const request = require('request-promise');
const { apiCreds } = require("../utils/credentials.json");

var exports = module.exports = {};

const oauth2 = require('simple-oauth2').create(apiCreds);

getToken = async function() {
	try {
		const result = await oauth2.clientCredentials.getToken();
		return oauth2.accessToken.create(result).token;
	}catch (error) {
		return error;
	}
}

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