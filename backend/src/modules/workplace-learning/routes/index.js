const router = require('express').Router();
const controller = require('../controllers/workplaceLearningController');
const { verifyToken } = require('../../../middleware/authMiddleware');

router.get('/', (req, res) => {
  res.json({ module: 'workplace-learning', status: 'active' });
});
router.get('/portal/employer', controller.getEmployerPortal);
router.get('/company-management', verifyToken, controller.getCompanyManagement);
router.post('/company-management/users/invite', verifyToken, controller.inviteCompanyUsers);
router.post('/company-management/invitations/:invitationId/resend', verifyToken, controller.resendCompanyInvitation);
router.post('/company-management/invitations/:invitationId/cancel', verifyToken, controller.cancelCompanyInvitation);

module.exports = router;
