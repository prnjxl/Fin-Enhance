const express = require('express');
const router = express.Router();
const { submitForm, getFormData } = require('../controllers/formController');
const { protect } = require('../middleware/authMiddleware');

// All form routes are protected
router.post('/', protect, submitForm);
router.get('/', protect, getFormData);

module.exports = router;
