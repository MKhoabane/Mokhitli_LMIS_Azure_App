const router = require('express').Router();
const controller = require('../controllers/financeController');

router.get('/', (req, res) => {
  res.json({ module: 'finance', status: 'active' });
});
router.get('/overview', controller.getData);

module.exports = router;
