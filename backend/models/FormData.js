const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    annualIncome: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    occupation: {
      type: String,
      trim: true,
    },
    spendings: {
      groceries: { type: Number, default: 0 },
      transport: { type: Number, default: 0 },
      entertainment: { type: Number, default: 0 },
      eatOut: { type: Number, default: 0 },
      healthcare: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      miscellaneous: { type: Number, default: 0 },
    },
    // Credit Score API fields
    monthlyIncome: { type: Number, default: 0 },
    loanRepayment: { type: Number, default: 0 },
    rent: { type: Number, default: 0 },
    utilities: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    desiredSavings: { type: Number, default: 0 },
    // Credit Score results from API
    creditScoreResult: {
      credit_score: { type: Number },
      risk_level: { type: String },
      financial_health: { type: String },
      metrics: {
        dti: { type: Number },
        expense_ratio: { type: Number },
        savings_ratio: { type: Number },
        disposable_ratio: { type: Number },
      },
      recommendations: [{ type: String }],
      calculatedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FormData', formDataSchema);
