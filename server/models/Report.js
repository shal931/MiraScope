const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  column: String,
  type: { type: String, enum: ['rating', 'multiple_choice', 'short_text', 'timestamp', 'unknown'] },
  responses: [mongoose.Schema.Types.Mixed],
  sentimentSummary: {
    positive: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    negative: { type: Number, default: 0 },
  },
  topKeywords: [{ word: String, count: Number }],
  representativeQuotes: [String],
});

const ReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  fileName: String,
  totalResponses: Number,
  questions: [QuestionSchema],
  overallSentiment: {
    positive: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    negative: { type: Number, default: 0 },
  },
  topThemes: [{ theme: String, count: Number, quotes: [String] }],
  suggestedActions: [{ action: String, confidence: String, priority: String }],
  geminiInsights: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', ReportSchema);
