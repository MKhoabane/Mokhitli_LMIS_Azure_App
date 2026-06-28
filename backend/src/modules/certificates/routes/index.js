const router = require('express').Router();
const controller = require('../controllers/certificatesController');

router.get('/', (req, res) => {
  res.json({ module: 'certificates', status: 'active' });
});
router.get('/issued', controller.getData);

module.exports = router;
