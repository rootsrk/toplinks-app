require('dotenv').config();

const constants = {
  port: process.env.PORT || 5000,
  cookieName: 'oauth_token',
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  requestTokenUrl: 'https://api.twitter.com/oauth/request_token',
  accessTokenUrl: 'https://api.twitter.com/oauth/access_token',
  oauthVersion: '1.0',
  oauthCallbackUrl:
    process.env.CALLBACK_URL || 'http://localhost:5000/authenticate',
  method: 'HMAC-SHA1',
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
};

module.exports = constants;
