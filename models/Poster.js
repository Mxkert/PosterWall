const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Poster = new Schema({
    image: {
        type: String
    },
    title: {
        type: String
    },
    genre: {
        type: String
    },
    acts: {
        type: Array
    },
    description: {
        type: String
    },
    date: {
        type: Date
    },
    start_time: {
        type: String
    },
    end_time: {
        type: String
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    location_lat: {
      type: Number
    },
    location_lng: {
      type: Number
    },
    creation_date: {
        type: Date
    },
    accepted: {
        type: Boolean
    },
    rejected: {
        type: Boolean
    }
});
module.exports = mongoose.model('Poster', Poster);