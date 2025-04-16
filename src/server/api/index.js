const express = require('express');
const router = express.Router();

//test route
router.get('/test', (req, res) => {
  res.send('Sample API route working!');
});

//mount routes (auth, videos, reviews)
router.use('/auth', require('../routes/auth'));
router.use('/videos', require('../routes/videos'));
router.use('/reviews', require('../routes/reviews')); 

module.exports = router;
