const router = require('express').Router();
const controller = require('../controllers/qualificationManagementController');

router.get('/', (req, res) => {
  res.json({ module: 'qualification-management', status: 'active' });
});
router.get('/qualifications', controller.getData);

module.exports = router;
