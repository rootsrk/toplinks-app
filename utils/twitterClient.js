const twitterManager = require('twitter-lite');
const { consumerKey, consumerSecret } = require('./utils/constants');

const getTweets = async ({ oauth_access_token, oauth_access_token_secret }) => {
  const client = new twitterManager({
    consumer_key: consumerKey, //'g9YsqPUpaMIJKF4E4kLGLBMY1'
    consumer_secret: consumerSecret, //'FwoHc2plS0AX7lBrgCvw639MSqo5LqKYrXifRXIekhZgPXhWaS'
    access_token_key: oauth_access_token,
    access_token_secret: oauth_access_token_secret,
    tweet_mode: 'extended',
  });
  let tweets;
  try {
    tweets = await client.get('statuses/home_timeline', {
      exclude_replies: true,
      count: 200,
      tweet_mode: 'extended',
    });
  } catch (err) {
    console.log('Error obtaining tweets', err);
    return err;
  }
};

module.exports = { getTweets };
