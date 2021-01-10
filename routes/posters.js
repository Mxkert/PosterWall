const express = require('express');

const router = express.Router();

let Poster = require('../models/Poster');

// Get all posters
router.route("/not-accepted").get((req, res, next) => {
  Poster.find(
    { 
      accepted: false,
      rejected: false
    },
    (err, poster) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(poster);
    }
  );
});

router.route("/").get((req, res, next) => {
  Poster.find(
    {},
    null,
    {},
    (err, poster) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(poster);
    }
  );
});

router.route("/:id").get((req, res, next) => {
  Poster.findById(req.params.id, 
    (err, poster) => {
    if (err) {
      return next(err);
    }
    res.json(poster);
  });
});

router.post('/add', (req, res) => {
  let poster = new Poster(req.body);
  poster.save()
    .then(project => {
        res.status(200).json({'poster': 'poster added successfully'});
    })
    .catch(err => {
        res.status(400).send('adding new poster failed');
        console.log(err);
        res.send(err);
    });
});

router.put('/accept/:id', (req, res) => {
  Poster.findByIdAndUpdate(req.params.id, 
    { $set: 
      { accepted: true }
    }
    , (err, poster) => {
    if (err) {
      return next(err);
    }
    res.status(200).send(poster);
  });
});

router.put('/reject/:id', (req, res) => {
  Poster.findByIdAndUpdate(req.params.id, 
    { $set: 
      { rejected: true }
    }
    , (err, poster) => {
    if (err) {
      return next(err);
    }
    res.status(200).send(poster);
  });
});

router.put('/delete/:id', (req, res) => {
  Poster.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      return next(err);
    }
    res.status(200).send('Succesful deletion');
  });
});

router.post('/edit/:id', (req, res) => {
  console.log(req.body);
  Poster.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      genre: req.body.genre,
      description: req.body.description,
      price: req.body.price,
    },
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).send(result);
      }
    });
});

module.exports = router;