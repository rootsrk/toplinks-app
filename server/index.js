const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const twitterManager = require('twitter-lite');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 8080;
const { oauthMethods } = require('./authentication/oauthClient');

const COOKIE_NAME = 'oauth_token';
const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.iyktc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority1`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db;
let collection;

const connectToDB = async () => {
  await client.connect();
  db = client.db('tweetsData');
  collection = db.collection('twitterCollection');
};

//our in-memory secrets database.
//Can be a key-value store or a relational database
let tokens = {};

app.use(bodyParser.json());
app.use(cookieParser());

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello, world' });
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
    console.log(err);
  }
  if (tweets.length) {
    await collection.findOneAndReplace(
      { screen_name },
      { screen_name, tweets, user_id },
      { upsert: true }
    );
  }

  res.json({ tweets });
});

router.get('/checkDBConnection', async (req, res) => {
  const rec = await collection.findOne();
  res.json({ rec });
});

router.get('/getTweetsForUser', async (req, res) => {
  const { screen_name } = req.query;
  const records = await collection.findOne({
    screen_name: {
      $eq: screen_name,
    },
  });
  res.json({ records });
});

app.use('/', router);
app.listen(port, async () => {
  await connectToDB();
  console.log(`Server running at http://localhost:${port}`);
});
