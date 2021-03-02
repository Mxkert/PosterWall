const express = require('express');
const distance = require('google-distance-matrix');
const fetch = require('node-fetch');

const router = express.Router();

router.post('/distance', (req, res) => {
  const origins = req.body.origins
  const destinations = req.body.destinations

  console.log(origins);
  console.log(destinations);

  distance.key(process.env.MAPS_API);

  distance.matrix(origins, destinations, function(err, distances) {
    if (!err)
      if (distances.rows[0]) 
        res.json(distances.rows[0].elements[0].distance.value)
  })
});

router.post('/location', (req, res) => {
  const latlng = req.body.latlng

  fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${process.env.MAPS_API}`)
    .then(res => res.json())
    .then(body => {
      const location = body.results[0].address_components[3].long_name;
      res.json(location)
    });
});

module.exports = router;