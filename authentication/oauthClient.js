const oauthClient = require('oauth');
const {
  constants: {
    requestTokenUrl,
    accessTokenUrl,
    consumerKey,
    consumerSecret,
    oauthVersion,
    oauthCallbackUrl,
    method,
  },
} = require('../utils/constants');

const oauth = new oauthClient.OAuth(
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
            console.log('getOAuthRequestToken', error);
            return error;
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
            console.log('getOAuthAccessToken', error);
            return error;
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
