const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Serialize user ID into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

//Local Email Auth
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        if (user.provider !== 'local') {
          return done(null, false, {
            message: `This email is registered via ${user.provider}. Please sign in with ${user.provider}.`,
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

//Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists by provider ID
          let user = await User.findOne({
            provider: 'google',
            providerId: profile.id,
          });

          if (user) {
            return done(null, user);
          }

          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null;

          // If email exists with another provider, link to that account
          if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
              return done(null, existingUser);
            }
          }

          // Create new user
          user = await User.create({
            name: profile.displayName,
            email: email,
            provider: 'google',
            providerId: profile.id,
            avatar:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : null,
          });

          return done(null, user);
        } catch (err) {
          console.error('Google Error:', err);
          return done(err);
        }
      }
    )
  );
} else {
  console.warn('Google OAuth not configured');
}

//GitHub OAuth
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists by provider ID
          let user = await User.findOne({
            provider: 'github',
            providerId: profile.id.toString(),
          });

          if (user) {
            return done(null, user);
          }

          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null;

          // If email exists with another provider, link to that account
          if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
              return done(null, existingUser);
            }
          }

          // Create new user
          user = await User.create({
            name: profile.displayName || profile.username,
            email: email,
            provider: 'github',
            providerId: profile.id.toString(),
            avatar:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : null,
          });

          return done(null, user);
        } catch (err) {
          console.error('GitHub Error:', err);
          return done(err);
        }
      }
    )
  );
} else {
  console.warn('GitHub OAuth not configured');
}

module.exports = passport;
