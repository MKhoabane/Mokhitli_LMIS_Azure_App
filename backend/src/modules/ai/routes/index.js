const router = require('express').Router();
const controller = require('../controllers/aiController');

router.get('/', (req, res) => {
  res.json({ module: 'ai', status: 'active' });
});
router.get('/insights', controller.getData);

module.exports = router;
