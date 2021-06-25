const express = require('express');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/ForgotPassword', forgotPassword);
router.put('/ResetPassword/:resetToken', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
