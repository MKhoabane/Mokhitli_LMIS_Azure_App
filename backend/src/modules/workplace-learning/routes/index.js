const router = require('express').Router();
const controller = require('../controllers/workplaceLearningController');

router.get('/', (req, res) => {
  res.json({ module: 'workplace-learning', status: 'active' });
});
router.get('/portal/employer', controller.getEmployerPortal);

module.exports = router;
