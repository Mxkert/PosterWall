// Create Express
const express = require('express');
const cors = require('cors');
const volleyball = require('volleyball');
const path = require('path');
const port = process.env.PORT || 5000;

// mongodb+srv://Mxkert:<password>@overloader.u31ga.azure.mongodb.net/<dbname>?retryWrites=true&w=majority

// MongoDB Database using Mongoose
const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/overloader', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://Mxkert:testtest@cluster0.jmfjg.mongodb.net/Posterwall?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

// Initialize express app
const app = express();

// App use
app.use(cors());

const posters = require('./routes/posters');
app.use(volleyball);
app.use(cors({
  origin: ['https://poster-wall-k6n5d.ondigitalocean.app/, http://localhost:3000']
}));
app.use(express.json());

app.use('/api/posters', posters);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  console.log('in production');
  app.use(express.static('../client/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });
}

// if (process.env.NODE_ENV === 'production') {
//   //set static folder
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

// Handles any requests that don't match the ones above
// app.use(express.static('client/build'));
// app.get('*', (req,res) =>{
//   res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

// console.log('dir name: ' + __dirname);
// console.log('build: ' + path.join(__dirname + '/client/build/index.html'));
// app.use(express.static(path.join(__dirname + '/client/build')));

// app.get('*', (req,res) =>{
//   res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// // Handles any requests that don't match the ones above
// app.get('*', (req,res) =>{
// res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

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

app.listen(port, function() {
    console.log("Server is running on Port: " + port);
});