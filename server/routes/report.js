const express = require('express');
const Report = require('../models/Report');

const router = express.Router();

// GET /api/report/:id — fetch full report
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findOne({ reportId: req.params.id });
    if (!report) return res.status(404).json({ error: 'Report not found.' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/report/:id/export-csv — download annotated CSV
router.get('/:id/export-csv', async (req, res) => {
  try {
    const report = await Report.findOne({ reportId: req.params.id });
    if (!report) return res.status(404).json({ error: 'Report not found.' });

    const textQs = report.questions.filter((q) => q.type === 'short_text');
    const rows = ['Question,Response,Sentiment'];

    for (const q of textQs) {
      for (const resp of q.responses) {
        const safe = resp.toString().replace(/"/g, '""');
        const pos = q.sentimentSummary.positive;
        const neg = q.sentimentSummary.negative;
        const label = pos > neg ? 'positive' : neg > pos ? 'negative' : 'neutral';
        rows.push(`"${q.column}","${safe}","${label}"`);
      }
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="mirascope-annotated-${req.params.id}.csv"`);
    res.send(rows.join('\n'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/report — list recent reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find({}, 'reportId fileName totalResponses createdAt')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/report/:id
router.delete('/:id', async (req, res) => {
  try {
    await Report.deleteOne({ reportId: req.params.id });
    res.json({ message: 'Report deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
