const FormData = require('../models/FormData');

// @desc    Submit financial form data
// @route   POST /api/forms
// @access  Private
const submitForm = async (req, res) => {
  try {
    const {
      annualIncome, dob, occupation, spendings,
      monthlyIncome, loanRepayment, rent, utilities, insurance, desiredSavings,
    } = req.body;

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
        monthlyIncome: parseFloat(monthlyIncome) || 0,
        loanRepayment: parseFloat(loanRepayment) || 0,
        rent: parseFloat(rent) || 0,
        utilities: parseFloat(utilities) || 0,
        insurance: parseFloat(insurance) || 0,
        desiredSavings: parseFloat(desiredSavings) || 0,
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

// @desc    Predict credit score via external API and save result
// @route   POST /api/forms/predict
// @access  Private
const predictCreditScore = async (req, res) => {
  try {
    // Fetch the user's saved form data
    const formData = await FormData.findOne({ userId: req.user._id });
    if (!formData) {
      return res.status(400).json({ message: 'Please save your financial data first.' });
    }

    // Build the payload for the external credit score API
    // The API expects exact key names with capital letters
    const payload = {
      Income: formData.monthlyIncome || 0,
      Loan_Repayment: formData.loanRepayment || 0,
      Rent: formData.rent || 0,
      Groceries: formData.spendings?.groceries || 0,
      Transport: formData.spendings?.transport || 0,
      Eating_Out: formData.spendings?.eatOut || 0,
      Entertainment: formData.spendings?.entertainment || 0,
      Utilities: formData.utilities || 0,
      Healthcare: formData.spendings?.healthcare || 0,
      Education: formData.spendings?.education || 0,
      Miscellaneous: formData.spendings?.miscellaneous || 0,
      Insurance: formData.insurance || 0,
      Desired_Savings: formData.desiredSavings || 0,
    };

    // Validate that Income > 0 to avoid division-by-zero on the API
    if (payload.Income <= 0) {
      return res.status(400).json({
        message: 'Monthly Income must be greater than 0 to calculate credit score.',
      });
    }

    // Call the API
    const apiResponse = await fetch(
      'https://gurujod-csp.hf.space/predict',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error('Credit Score API error:', apiResponse.status, errText);
      return res.status(502).json({
        message: `Credit Score API returned status ${apiResponse.status}`,
      });
    }

    const result = await apiResponse.json();

    // Save the result to MongoDB
    formData.creditScoreResult = {
      credit_score: result.credit_score,
      risk_level: result.risk_level,
      financial_health: result.financial_health,
      metrics: result.metrics,
      recommendations: result.recommendations || [],
      calculatedAt: new Date(),
    };
    await formData.save();

    res.json({
      message: 'Credit score calculated successfully',
      data: formData.creditScoreResult,
      payload, // Return what was sent for transparency
    });
  } catch (error) {
    console.error('Predict credit score error:', error);
    res.status(500).json({ message: 'Server error calculating credit score' });
  }
};

// @desc    Get saved credit score result
// @route   GET /api/forms/score
// @access  Private
const getCreditScore = async (req, res) => {
  try {
    const formData = await FormData.findOne({ userId: req.user._id });
    if (!formData || !formData.creditScoreResult?.credit_score) {
      return res.status(404).json({ message: 'No credit score result found. Run a prediction first.' });
    }
    res.json(formData.creditScoreResult);
  } catch (error) {
    console.error('Get credit score error:', error);
    res.status(500).json({ message: 'Server error fetching credit score' });
  }
};

module.exports = { submitForm, getFormData, predictCreditScore, getCreditScore };
