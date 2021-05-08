require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const indexRouter = require('./routes');
const { connectToDB } = require('./utils/dbUtils');
const { port } = require('./utils/constants');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', indexRouter);
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err, code: 500 });
});

app.listen(port, async () => {
  await connectToDB();
  console.log(`Server running at http://localhost:${port}`);
});
