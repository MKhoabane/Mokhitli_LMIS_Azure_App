const router = require('express').Router();
const controller = require('../controllers/rbacController');

router.get('/', (req, res) => {
  res.json({ module: 'rbac', status: 'active' });
});
router.get('/roles', controller.getData);

module.exports = router;
