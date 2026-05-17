const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load and clean API key
const apiKey = process.env.GEMINI_API_KEY?.trim();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Use Gemini Flash to generate action items and insights from the report summary.
 */
async function generateInsights({
  totalResponses,
  overallSentiment,
  topThemes,
  questions,
}) {
  // Fallback if API key missing
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return {
      geminiInsights:
        "Gemini API key not configured. Add GEMINI_API_KEY to your .env file for AI-powered insights.",
      suggestedActions: generateFallbackActions(
        overallSentiment,
        topThemes
      ),
    };
  }

  try {
   // console.log("Using Gemini API...");
   // console.log("Key Length:", apiKey.length);

     
    const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

    const themesText = topThemes
      .map((t) => `"${t.theme}" (mentioned ${t.count} times)`)
      .join(", ");

    const sentimentText = `
Positive: ${overallSentiment.positive},
Neutral: ${overallSentiment.neutral},
Negative: ${overallSentiment.negative}
`;

    // Gather sample quotes from text questions
    const textQs = questions.filter(
      (q) => q.type === "short_text"
    );

    const sampleQuotes = textQs
      .flatMap((q) => q.representativeQuotes || [])
      .slice(0, 6)
      .join("\n- ");

    const prompt = `
You are an expert feedback analyst.

Analyze this survey feedback summary and provide actionable insights.

Survey Data:
- Total responses: ${totalResponses}
- Sentiment distribution: ${sentimentText}
- Top themes: ${themesText}

- Sample quotes:
${sampleQuotes ? `- ${sampleQuotes}` : "No text responses available"}

Please provide:
1. A brief 2-3 sentence executive summary
2. Exactly 3 actionable recommendations

Return ONLY valid JSON in this format:

{
  "summary": "...",
  "actions": [
    {
      "action": "...",
      "confidence": "High|Medium|Low",
      "priority": "P1|P2|P3",
      "rationale": "..."
    }
  ]
}
`;

    // Generate content
    const result = await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    //console.log("Gemini Raw Response:");
    //console.log(text);

    // Extract JSON safely
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);

        return {
          geminiInsights:
            parsed.summary || "Insights generated.",
          suggestedActions:
            parsed.actions ||
            generateFallbackActions(
              overallSentiment,
              topThemes
            ),
        };
      } catch (parseErr) {
        console.error(
          "JSON Parse Error:",
          parseErr.message
        );
      }
    }

    // Fallback if Gemini returns non-JSON
    return {
      geminiInsights: text,
      suggestedActions: generateFallbackActions(
        overallSentiment,
        topThemes
      ),
    };
  } catch (err) {
    console.error("Gemini API FULL ERROR:");
    console.error(err);

    return {
      geminiInsights:
        "Could not generate AI insights. Using rule-based analysis.",
      suggestedActions: generateFallbackActions(
        overallSentiment,
        topThemes
      ),
    };
  }
}

/**
 * Fallback rule-based recommendations
 */
function generateFallbackActions(sentiment, themes) {
  const actions = [];

  const total =
    sentiment.positive +
      sentiment.neutral +
      sentiment.negative || 1;

  const negRate = sentiment.negative / total;

  if (negRate > 0.4) {
    actions.push({
      action:
        "Conduct targeted follow-up sessions to address the high volume of negative feedback",
      confidence: "High",
      priority: "P1",
      rationale:
        "Negative sentiment exceeds 40% of all responses.",
    });
  } else if (negRate > 0.2) {
    actions.push({
      action:
        "Review and improve areas generating negative feedback through structured workshops",
      confidence: "Medium",
      priority: "P2",
      rationale:
        "Moderate negative sentiment indicates improvement opportunities.",
    });
  } else {
    actions.push({
      action:
        "Maintain current positive practices and document them as best practices",
      confidence: "High",
      priority: "P2",
      rationale:
        "Overall sentiment is largely positive.",
    });
  }

  if (themes.length > 0) {
    actions.push({
      action: `Develop focused improvement plan around the most discussed topic: "${themes[0].theme}"`,
      confidence: "Medium",
      priority: "P1",
      rationale:
        "This topic appeared most frequently in responses.",
    });
  }

  if (themes.length > 1) {
    actions.push({
      action: `Create a feedback loop mechanism to track improvements related to "${themes[1].theme}"`,
      confidence: "Medium",
      priority: "P3",
      rationale:
        "Continuous monitoring improves long-term outcomes.",
    });
  } else {
    actions.push({
      action:
        "Increase response collection frequency for more granular insights",
      confidence: "Low",
      priority: "P3",
      rationale:
        "More responses can improve analysis quality.",
    });
  }

  return actions;
}

module.exports = { generateInsights };