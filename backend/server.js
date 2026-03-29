const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/db');
const passport = require('./config/passport');
const { errorHandler } = require('./middleware/authMiddleware');

//Connect to MongoDB
connectDB();

const app = express();

//Middleware

//CORS — allow frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.JWT_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//Routes

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/forms', require('./routes/formRoutes'));

//Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

//Error Handler
app.use(errorHandler);

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
