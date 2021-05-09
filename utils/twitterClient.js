const twitterManager = require('twitter-lite');
const {
  constants: { consumerKey, consumerSecret },
} = require('../utils/constants');

const getTweets = async ({ oauth_access_token, oauth_access_token_secret }) => {
  const client = new twitterManager({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
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
    return tweets;
  } catch (err) {
    console.log('Error obtaining tweets', err);
    return err;
  }
};

module.exports = { getTweets };
