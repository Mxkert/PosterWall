const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 5000;

// MongoDB Database using Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Mxkert:testtest@cluster0.jmfjg.mongodb.net/Posterwall?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

const app = express();

const posters = require('./routes/posters');
app.use(volleyball);
app.use(cors({
  origin: ['https://overloader.herokuapp.com/, http://localhost:3000']
}));
app.use(express.json());

app.use('/posters', posters);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use(express.static('client/build'));
  // app.get("/serviceWorker.js", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "client", "src", "serviceWorker.js"));
  // });
  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname + '/client/build/index.html'));
  // });
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