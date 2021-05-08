const express = require('express');
const router = express.Router();
const { oauthMethods } = require('./authentication/oauthClient');
const { cookieName } = require('./utils/constants');

const {
  storeTweets,
  getTweetsForUser,
  checkConnection,
} = require('./utils/dbUtils');

let tokens = {};

router.post('/getToken', async (req, res, next) => {
  try {
    const {
      oauth_token,
      oauth_token_secret,
      results,
    } = await oauthMethods.getRequestToken();
    tokens[oauth_token] = { oauth_token_secret };

    res.cookie(cookieName, oauth_token, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    res.json({ oauth_token, results });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/authenticateUser', async (req, res, next) => {
  try {
    const resp = await oauthMethods.getAccessToken(req.body);
    tokens = resp;
    res.json({ resp });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/getTweetsFromSource', async (req, res, next) => {
  try {
    const {
      oauth_access_token,
      oauth_access_token_secret,
      screen_name,
      user_id,
    } = req.body;

    await getTweets({ oauth_access_token, oauth_access_token_secret });
    if (tweets.length) {
      await storeTweets({ screen_name, tweets, user_id });
    }

    res.json({ tweets, err });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/checkDBConnection', async (req, res, next) => {
  try {
    const rec = await checkConnection();
    res.json({ rec });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/getTweetsForUser', async (req, res, next) => {
  try {
    const { screen_name } = req.query;
    const records = await getTweetsForUser(screen_name);
    res.json({ records });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
