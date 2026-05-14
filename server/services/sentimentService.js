const Sentiment = require('sentiment');
const analyzer = new Sentiment();

/**
 * Analyze sentiment for an array of text responses.
 * Returns { positive, neutral, negative, scores, annotated }
 */
function analyzeSentiment(responses) {
  let positive = 0;
  let neutral = 0;
  let negative = 0;
  const scores = [];
  const annotated = [];

  for (const text of responses) {
    if (!text || text.toString().trim() === '') continue;
    const result = analyzer.analyze(text.toString());
    const score = result.score;
    scores.push(score);

    let label = 'neutral';
    if (score > 1) { positive++; label = 'positive'; }
    else if (score < -1) { negative++; label = 'negative'; }
    else { neutral++; }

    annotated.push({ text: text.toString(), score, label });
  }

  return { positive, neutral, negative, scores, annotated };
}

module.exports = { analyzeSentiment };
