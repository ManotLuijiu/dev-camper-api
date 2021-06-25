const express = require('express');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/ForgotPassword', forgotPassword);
router.put('/ResetPassword/:resetToken', resetPassword);
router.put('/UpdateDetails', protect, updateDetails);
router.put('/UpdatePassword', protect, updatePassword);
router.get('/me', protect, getMe);

module.exports = router;
