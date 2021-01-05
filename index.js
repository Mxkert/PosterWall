console.log('testing');

require('dotenv').config();
const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
const port = process.env.PORT || 5000;

// MongoDB Database using Mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

const app = express();

const posters = require('./routes/posters');

app.use(volleyball);
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

app.use('/api/posters', posters);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get("/serviceWorker.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "src", "serviceWorker.js"));
  });
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port', port);
});