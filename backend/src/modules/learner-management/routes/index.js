const router = require('express').Router();
const controller = require('../controllers/learnerManagementController');

router.get('/', controller.listLearners);
router.get('/portal/learner', controller.getLearnerPortal);

module.exports = router;
