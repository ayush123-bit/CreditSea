// backend/models/Report.js
const mongoose = require('mongoose');

const CreditAccountSchema = new mongoose.Schema({
  type: { type: String },            // e.g., Credit Card, Loan
  bank: { type: String },
  accountNumber: { type: String },
  address: { type: String },
  amountOverdue: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  raw: { type: mongoose.Schema.Types.Mixed } // keep raw object for reference
});

const ReportSchema = new mongoose.Schema({
  sourceFileName: { type: String },
  parsedAt: { type: Date, default: Date.now },

  // Basic Details
  name: { type: String },
  mobilePhone: { type: String },
  pan: { type: String },
  creditScore: { type: Number },

  // Report Summary
  reportSummary: {
    totalAccounts: { type: Number, default: 0 },
    activeAccounts: { type: Number, default: 0 },
    closedAccounts: { type: Number, default: 0 },
    currentBalanceAmount: { type: Number, default: 0 },
    securedAmount: { type: Number, default: 0 },
    unsecuredAmount: { type: Number, default: 0 },
    last7DaysEnquiries: { type: Number, default: 0 },
    raw: { type: mongoose.Schema.Types.Mixed }
  },

  // Credit accounts
  creditAccounts: [CreditAccountSchema],

  // store raw parsed object if you want to inspect later
  rawParsed: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('Report', ReportSchema);
