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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FormData', formDataSchema);
