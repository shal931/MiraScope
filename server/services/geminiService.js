const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Use Gemini Flash to generate action items and insights from the report summary.
 */
async function generateInsights({ totalResponses, overallSentiment, topThemes, questions }) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return {
      geminiInsights: 'Gemini API key not configured. Add GEMINI_API_KEY to your .env file for AI-powered insights.',
      suggestedActions: generateFallbackActions(overallSentiment, topThemes),
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const themesText = topThemes.map((t) => `"${t.theme}" (mentioned ${t.count} times)`).join(', ');
    const sentimentText = `Positive: ${overallSentiment.positive}, Neutral: ${overallSentiment.neutral}, Negative: ${overallSentiment.negative}`;

    // Gather sample quotes from text questions
    const textQs = questions.filter((q) => q.type === 'short_text');
    const sampleQuotes = textQs
      .flatMap((q) => q.representativeQuotes || [])
      .slice(0, 6)
      .join('\n- ');

    const prompt = `You are an expert feedback analyst. Analyze this survey feedback summary and provide actionable insights.

Survey Data:
- Total responses: ${totalResponses}
- Sentiment distribution: ${sentimentText}
- Top themes: ${themesText}
- Sample quotes:
${sampleQuotes ? `- ${sampleQuotes}` : 'No text responses available'}

Please provide:
1. A brief 2-3 sentence executive summary
2. Exactly 3 specific, actionable recommendations with confidence levels (High/Medium/Low) and priority (P1/P2/P3)

Format your response as JSON:
{
  "summary": "...",
  "actions": [
    {"action": "...", "confidence": "High|Medium|Low", "priority": "P1|P2|P3", "rationale": "..."},
    {"action": "...", "confidence": "High|Medium|Low", "priority": "P1|P2|P3", "rationale": "..."},
    {"action": "...", "confidence": "High|Medium|Low", "priority": "P1|P2|P3", "rationale": "..."}
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        geminiInsights: parsed.summary || 'Insights generated.',
        suggestedActions: parsed.actions || generateFallbackActions(overallSentiment, topThemes),
      };
    }

    return {
      geminiInsights: text,
      suggestedActions: generateFallbackActions(overallSentiment, topThemes),
    };
  } catch (err) {
    console.error('Gemini API error:', err.message);
    return {
      geminiInsights: 'Could not generate AI insights. Using rule-based analysis.',
      suggestedActions: generateFallbackActions(overallSentiment, topThemes),
    };
  }
}

function generateFallbackActions(sentiment, themes) {
  const actions = [];
  const total = sentiment.positive + sentiment.neutral + sentiment.negative || 1;
  const negRate = sentiment.negative / total;

  if (negRate > 0.4) {
    actions.push({
      action: 'Conduct targeted follow-up sessions to address the high volume of negative feedback',
      confidence: 'High',
      priority: 'P1',
    });
  } else if (negRate > 0.2) {
    actions.push({
      action: 'Review and improve areas generating negative feedback through structured workshops',
      confidence: 'Medium',
      priority: 'P2',
    });
  } else {
    actions.push({
      action: 'Maintain current positive practices and document them as best practices',
      confidence: 'High',
      priority: 'P2',
    });
  }

  if (themes.length > 0) {
    actions.push({
      action: `Develop focused improvement plan around the most discussed topic: "${themes[0].theme}"`,
      confidence: 'Medium',
      priority: 'P1',
    });
  }

  if (themes.length > 1) {
    actions.push({
      action: `Create a feedback loop mechanism to track improvements related to "${themes[1].theme}"`,
      confidence: 'Medium',
      priority: 'P3',
    });
  } else {
    actions.push({
      action: 'Increase response collection frequency for more granular insights',
      confidence: 'Low',
      priority: 'P3',
    });
  }

  return actions;
}

module.exports = { generateInsights };
