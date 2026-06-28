const router = require('express').Router();
const controller = require('../controllers/lmsController');

router.get('/', (req, res) => {
  res.json({ module: 'lms', status: 'active' });
});
router.get('/portal/facilitator', controller.getFacilitatorPortal);

module.exports = router;
