const router = require('express').Router();
const controller = require('../controllers/reportingController');

router.get('/', (req, res) => {
  res.json({ module: 'reporting', status: 'active' });
});
router.get('/summary', controller.getData);

module.exports = router;
