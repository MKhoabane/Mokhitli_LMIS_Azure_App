const router = require('express').Router();
const controller = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/register-company', controller.registerCompany);
router.get('/invitations/:invitationId', controller.getInvitation);
router.post('/invitations/:invitationId/accept', controller.acceptInvitation);
router.get('/me', verifyToken, controller.me);

module.exports = router;
