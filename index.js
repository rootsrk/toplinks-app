require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const twitterManager = require('twitter-lite');
const path = require('path');

const { connectToDB } = require('./utils/dbUtils');
const { oauthMethods } = require('./authentication/oauthClient');
const {
  cookieName,
  consumerKey,
  consumerSecret,
} = require('./utils/constants');

const app = express();
const router = express.Router();

let tokens = {};

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', router);
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

router.post('/getToken', async (req, res) => {
  const {
    oauth_token,
    oauth_token_secret,
    results,
  } = await oauthMethods.getRequestToken();
  tokens[oauth_token] = { oauth_token_secret };

  res.cookie(COOKIE_NAME, oauth_token, {
    maxAge: 15 * 60 * 1000, // 15 minutes
    secure: true,
    httpOnly: true,
    sameSite: true,
  });
  res.json({ oauth_token, results });
});

router.post('/authenticateUser', async (req, res) => {
  const resp = await oauthMethods.getAccessToken(req.body);
  tokens = resp;
  res.json({ resp });
});

router.post('/getTweetsFromSource', async (req, res) => {
  const {
    oauth_access_token,
    oauth_access_token_secret,
    screen_name,
    user_id,
  } = req.body;

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
  if (tweets.length) {
    await collection.findOneAndReplace(
      { screen_name },
      { screen_name, tweets, user_id },
      { upsert: true }
    );
  }

  res.json({ tweets, err });
});

router.post('/checkDBConnection', async (req, res) => {
  const rec = await collection.findOne();
  res.json({ rec });
});

router.post('/getTweetsForUser', async (req, res) => {
  const { screen_name } = req.query;
  const records = await collection.findOne({
    screen_name: {
      $eq: screen_name,
    },
  });
  res.json({ records });
});

app.listen(port, async () => {
  await connectToDB();
  console.log(`Server running at http://localhost:${port}`);
});
