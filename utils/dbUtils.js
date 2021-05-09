const MongoClient = require('mongodb').MongoClient;

const {
  constants: { DB_USERNAME, DB_PASSWORD },
} = require('./constants');

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.iyktc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let referencedDB;
let referencedCollection;

const connectToDB = async () => {
  try {
    await client.connect();
    referencedDB = client.db('tweetsData');
    referencedCollection = referencedDB.collection('twitterCollection');
  } catch (err) {
    console.log(err);
  }
};

const storeTweets = async ({ screen_name, tweets, user_id }) => {
  try {
    await referencedCollection.findOneAndReplace(
      { screen_name },
      { screen_name, tweets, user_id },
      { upsert: true }
    );
  } catch (err) {
    console.log(err);
  }
};

const getTweetsForUser = async (screen_name) => {
  const tweets = await referencedCollection.findOne({
    screen_name: {
      $eq: screen_name,
    },
  });
  return tweets;
};

const checkConnection = async () => {
  const result = await referencedCollection.findOne();
  return result;
};

module.exports = {
  connectToDB,
  storeTweets,
  getTweetsForUser,
  checkConnection,
};
