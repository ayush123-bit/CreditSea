// backend/controllers/uploadController.js
const Report = require('../models/Report');
const { parseXmlString } = require('../utils/parseXML');

/**
 * POST /api/upload
 * Expects a single file in 'file' field (multer memory storage)
 */
const uploadAndParse = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded. Please attach an XML file in "file" form field.');
    }

    const fileBuffer = req.file.buffer;
    const xmlStr = fileBuffer.toString('utf8');

    // parse xml into normalized object
    const parsed = await parseXmlString(xmlStr);

    // create new report document
    const rpt = new Report({
      sourceFileName: req.file.originalname,
      name: parsed.name,
      mobilePhone: parsed.mobilePhone,
      pan: parsed.pan,
      creditScore: parsed.creditScore,
      reportSummary: parsed.reportSummary,
      creditAccounts: parsed.creditAccounts,
      rawParsed: parsed.rawParsed
    });

    const saved = await rpt.save();

    res.status(201).json({
      message: 'File parsed and saved successfully',
      reportId: saved._id,
      report: saved
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadAndParse };
