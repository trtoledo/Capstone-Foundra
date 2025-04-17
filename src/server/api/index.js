const express = require('express');
const router = express.Router();

//test route
router.get('/test', (req, res) => {
  res.send('Sample API route working!');
});

//mount routes
router.use('/auth', require('../routes/auth'));
router.use('/videos', require('../routes/videos'));
router.use('/reviews', require('../routes/reviews')); 
router.use('/users', require('../routes/users'));
router.use('/admins', require('../routes/admins'));
router.use('/companies', require('../routes/companies'));
router.use('/industries', require('../routes/industries'));
router.use('/top-candidates', require('../routes/topCandidates'));
router.use('/feedback', require('../routes/feedback'));
router.use('/reports', require('../routes/reports'));
router.use('/messages', require('../routes/messages'));
router.use('/comments', require('../routes/comments'));

module.exports = router;
