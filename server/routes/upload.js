const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { parseCSV } = require('../services/csvParser');
const { analyzeSentiment } = require('../services/sentimentService');
const { extractKeywords, getRepresentativeQuotes, buildTopThemes } = require('../services/keywordService');
const { generateInsights } = require('../services/geminiService');
const Report = require('../models/Report');

const router = express.Router();

// Multer memory storage (no disk write)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are accepted'));
    }
  },
});

router.post('/', upload.single('csv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded.' });
    }

    // 1. Parse CSV
    const { totalResponses, questions } = parseCSV(req.file.buffer);

    // 2. Process each question
    const processedQuestions = [];
    let overallPos = 0, overallNeu = 0, overallNeg = 0;

    for (const q of questions) {
      const processed = { ...q };

      if (q.type === 'short_text') {
        const sentiment = analyzeSentiment(q.responses);
        processed.sentimentSummary = {
          positive: sentiment.positive,
          neutral: sentiment.neutral,
          negative: sentiment.negative,
        };
        overallPos += sentiment.positive;
        overallNeu += sentiment.neutral;
        overallNeg += sentiment.negative;

        processed.topKeywords = extractKeywords(q.responses, 10);
        processed.representativeQuotes = getRepresentativeQuotes(q.responses, 3);
      } else {
        processed.sentimentSummary = { positive: 0, neutral: 0, negative: 0 };
        processed.topKeywords = [];
        processed.representativeQuotes = [];
      }

      processedQuestions.push(processed);
    }

    const overallSentiment = { positive: overallPos, neutral: overallNeu, negative: overallNeg };

    // 3. Build top themes from all text questions
    const textQuestions = processedQuestions.filter((q) => q.type === 'short_text');
    const topThemes = buildTopThemes(textQuestions, 5);

    // 4. Get AI insights + suggested actions
    const { geminiInsights, suggestedActions } = await generateInsights({
      totalResponses,
      overallSentiment,
      topThemes,
      questions: processedQuestions,
    });

    // 5. Save to MongoDB
    const reportId = uuidv4();
    const report = new Report({
      reportId,
      fileName: req.file.originalname,
      totalResponses,
      questions: processedQuestions,
      overallSentiment,
      topThemes,
      suggestedActions,
      geminiInsights,
    });
    await report.save();

    res.json({ reportId, message: 'Report generated successfully.' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to process CSV.' });
  }
});

module.exports = router;
