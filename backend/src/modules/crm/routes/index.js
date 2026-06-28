const router = require('express').Router();
const controller = require('../controllers/crmController');

router.get('/', (req, res) => {
  res.json({ module: 'crm', status: 'active' });
});
router.get('/pipeline', controller.getData);

module.exports = router;
