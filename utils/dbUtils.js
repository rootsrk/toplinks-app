const MongoClient = require('mongodb').MongoClient;

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

export { connectToDB };
