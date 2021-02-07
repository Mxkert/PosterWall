const express = require('express');
const distance = require('google-distance-matrix');

const router = express.Router();

router.post('/distance', (req, res) => {
  const origins = req.body.origins
  const destinations = req.body.destinations

  console.log(origins);
  console.log(destinations);

  distance.key('AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0');

  distance.matrix(origins, destinations, function(err, distances) {
    if (!err)
      res.json(distances.rows[0].elements[0].distance.value)
  })
});

module.exports = router;