const router = require('express').Router();
const controller = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', controller.login);
router.get('/me', verifyToken, controller.me);

module.exports = router;
