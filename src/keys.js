module.exports = function () {

	const dotenv = require('dotenv');
	dotenv.config();

	keys = {
		apiUrl: process.env.API_URL,
		webUrl: process.env.WEB_URL,
		configEmail: {
			email: process.env.EMAIL,
			password: process.env.EMAIL_PASSWORD
		},
		dbUrl: process.env.MONGO_URL,
		google: {
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			refreshToken: process.env.GOOGLE_REFRESH_TOKEN
		}
	}

	return keys;
}