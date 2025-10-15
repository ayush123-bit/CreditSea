// backend/controllers/reportController.js
const Report = require('../models/Report');

/**
 * GET /api/reports
 * returns list of reports (optionally with pagination)
 */
const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ parsedAt: -1 }).limit(100);
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/:id
 */
const getReportById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const report = await Report.findById(id);
    if (!report) {
      res.status(404);
      throw new Error('Report not found');
    }
    res.json(report);
  } catch (err) {
    next(err);
  }
};

module.exports = { getReports, getReportById };
