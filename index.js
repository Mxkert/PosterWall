const express = require('express');
const volleyball = require('volleyball');
const path = require('path');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// MongoDB Database using Mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

const app = express();

function redirectWwwTraffic(req, res, next) {
  if (req.headers.host.slice(0, 4) === "www.") {
    var newHost = req.headers.host.slice(4);
    return res.redirect(301, req.protocol + "://" + newHost + req.originalUrl);
  }
  next();
}

const posters = require('./routes/posters');
const maps = require('./routes/maps');

app.set("trust proxy", true);
app.use(redirectWwwTraffic);

app.use(volleyball);
app.use(cors());
app.use(express.json());

app.use('/api/posters', posters);
app.use('/api/maps', maps);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use(express.static('client/build'));
  app.get("/serviceWorker.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "src", "serviceWorker.js"));
  });
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });
}


function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log('Listening on port', port);
});