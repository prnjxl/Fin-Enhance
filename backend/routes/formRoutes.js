const express = require('express');
const router = express.Router();
const { submitForm, getFormData, predictCreditScore, getCreditScore } = require('../controllers/formController');
const { protect } = require('../middleware/authMiddleware');

// All form routes are protected
router.post('/', protect, submitForm);
router.get('/', protect, getFormData);

// Credit score routes
router.post('/predict', protect, predictCreditScore);
router.get('/score', protect, getCreditScore);

module.exports = router;
