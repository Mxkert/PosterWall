const express = require('express');
const distance = require('google-distance-matrix');

const router = express.Router();

router.post('/distance', (req, res) => {
  const origins = req.body.origins
  const destinations = req.body.destinations

  console.log(origins);
  console.log(destinations);

  distance.key(process.env.MAPS_API);

  distance.matrix(origins, destinations, function(err, distances) {
    if (!err)
      if (distances.rows[0].elements[0].distance.value) 
        res.json(distances.rows[0].elements[0].distance.value)
  })
});

module.exports = router;