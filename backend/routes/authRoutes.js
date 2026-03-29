const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { register, login, getMe, oauthCallback } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';

//Email Auth
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

//Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth error:', err);
      return res.redirect(`${FRONTEND}/login?error=google_auth_failed`);
    }
    if (!user) {
      console.error('Google OAuth failed:', info?.message || 'Unknown reason');
      return res.redirect(`${FRONTEND}/login?error=${encodeURIComponent(info?.message || 'google_auth_failed')}`);
    }
    req.user = user;
    oauthCallback(req, res);
  })(req, res, next);
});

//GitHub OAuth
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', { session: false }, (err, user, info) => {
    if (err) {
      console.error('GitHub OAuth error:', err);
      return res.redirect(`${FRONTEND}/login?error=github_auth_failed`);
    }
    if (!user) {
      console.error('GitHub OAuth failed:', info?.message || 'Unknown reason');
      return res.redirect(`${FRONTEND}/login?error=${encodeURIComponent(info?.message || 'github_auth_failed')}`);
    }
    req.user = user;
    oauthCallback(req, res);
  })(req, res, next);
});

module.exports = router;
