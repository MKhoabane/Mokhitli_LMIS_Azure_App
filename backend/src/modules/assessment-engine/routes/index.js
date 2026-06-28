const router = require('express').Router();
const controller = require('../controllers/assessmentEngineController');

router.get('/', (req, res) => {
  res.json({ module: 'assessment-engine', status: 'active' });
});
router.get('/portal/assessor', controller.getAssessorPortal);

module.exports = router;
