const router = require('express').Router();
const controller = require('../controllers/notificationsController');

router.get('/', (req, res) => {
  res.json({ module: 'notifications', status: 'active' });
});
router.get('/portal/parent', controller.getParentPortal);

module.exports = router;
