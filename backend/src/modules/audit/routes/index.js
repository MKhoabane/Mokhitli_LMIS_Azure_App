const router = require('express').Router();
const controller = require('../controllers/auditController');

router.get('/', (req, res) => {
  res.json({ module: 'audit', status: 'active' });
});
router.get('/portal/moderator', controller.getModeratorPortal);

module.exports = router;
