const router = require('express').Router();
const controller = require('../controllers/userManagementController');

router.get('/', (req, res) => {
  res.json({ module: 'user-management', status: 'active' });
});
router.get('/users', controller.getData);

module.exports = router;
