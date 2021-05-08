const oauthClient = require('oauth');

const consumerKey = process.env.CONSUMER_KEY; // 'g9YsqPUpaMIJKF4E4kLGLBMY1',
const consumerSecret = process.env.CONSUMER_SECRET; //'FwoHc2plS0AX7lBrgCvw639MSqo5LqKYrXifRXIekhZgPXhWaS',
const requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
const accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
const oauthVersion = '1.0';
const oauthCallbackUrl = process.env.CALLBACK_URL;
const method = 'HMAC-SHA1';

const oauth = new oauthClient.OAuth(
  requestTokenUrl,
  accessTokenUrl,
  consumerKey,
  consumerSecret,
  oauthVersion,
  oauthCallbackUrl,
  method
);

console.log(
  requestTokenUrl,
  accessTokenUrl,
  consumerKey,
  consumerSecret,
  oauthVersion,
  oauthCallbackUrl,
  method
);

const oauthMethods = {
  getRequestToken: () => {
    return new Promise((resolve, reject) => {
      oauth.getOAuthRequestToken(
        (error, oauth_token, oauth_token_secret, results) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve({ oauth_token, oauth_token_secret, results });
          }
        }
      );
    });
  },
  getAccessToken: (params = {}) => {
    const { oauth_token, oauth_token_secret, oauth_verifier } = params;
    return new Promise((resolve, reject) => {
      oauth.getOAuthAccessToken(
        oauth_token,
        oauth_token_secret,
        oauth_verifier,
        (error, oauth_access_token, oauth_access_token_secret, results) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve({
              oauth_access_token,
              oauth_access_token_secret,
              results,
            });
          }
        }
      );
    });
  },
};

module.exports = { oauthMethods };
