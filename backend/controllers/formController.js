const FormData = require('../models/FormData');

// @desc    Submit financial form data
// @route   POST /api/forms
// @access  Private
const submitForm = async (req, res) => {
  try {
    const { annualIncome, dob, occupation, spendings } = req.body;

    // Create or update form data for this user
    const formData = await FormData.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        annualIncome,
        dob,
        occupation,
        spendings: {
          groceries: parseFloat(spendings?.groceries) || 0,
          transport: parseFloat(spendings?.transport) || 0,
          entertainment: parseFloat(spendings?.entertainment) || 0,
          eatOut: parseFloat(spendings?.eatOut) || 0,
          healthcare: parseFloat(spendings?.healthcare) || 0,
          education: parseFloat(spendings?.education) || 0,
          miscellaneous: parseFloat(spendings?.miscellaneous) || 0,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({
      message: 'Form data saved successfully',
      data: formData,
    });
  } catch (error) {
    console.error('Submit form error:', error);
    res.status(500).json({ message: 'Server error saving form data' });
  }
};

// @desc    Get form data for authenticated user
// @route   GET /api/forms
// @access  Private
const getFormData = async (req, res) => {
  try {
    const formData = await FormData.findOne({ userId: req.user._id });
    if (!formData) {
      return res.status(404).json({ message: 'No form data found' });
    }
    res.json(formData);
  } catch (error) {
    console.error('Get form error:', error);
    res.status(500).json({ message: 'Server error fetching form data' });
  }
};

module.exports = { submitForm, getFormData };
