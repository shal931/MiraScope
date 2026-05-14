const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Common English stop words to filter out
const STOP_WORDS = new Set([
  'the','a','an','is','it','in','on','at','to','for','of','and','or','but',
  'not','with','this','that','was','are','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might',
  'can','i','you','we','they','he','she','my','your','our','their','its',
  'me','him','her','us','them','what','which','who','how','when','where',
  'why','all','each','very','just','more','also','only','about','up','out',
  'if','so','as','by','from','get','got','like','good','really','well',
  'much','many','some','any','no','yes','ok','okay','hi','hello','thanks'
]);

/**
 * Extract top N keywords from an array of text responses using TF-IDF.
 */
function extractKeywords(responses, topN = 15) {
  if (!responses || responses.length === 0) return [];

  // Token frequency map
  const freq = {};
  for (const text of responses) {
    if (!text) continue;
    const tokens = tokenizer.tokenize(text.toString().toLowerCase());
    const unique = new Set(tokens); // IDF: count doc frequency
    for (const word of unique) {
      if (word.length < 3 || STOP_WORDS.has(word) || /^\d+$/.test(word)) continue;
      freq[word] = (freq[word] || 0) + 1;
    }
  }

  return Object.entries(freq)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/**
 * Pick representative quotes: longest unique responses with positive/neutral sentiment
 */
function getRepresentativeQuotes(responses, limit = 3) {
  if (!responses || responses.length === 0) return [];
  return [...responses]
    .filter((r) => r && r.toString().trim().length > 20)
    .sort((a, b) => b.toString().length - a.toString().length)
    .slice(0, limit)
    .map((r) => r.toString().trim());
}

/**
 * Build top themes by clustering keyword groups with their quotes
 */
function buildTopThemes(textQuestions, topN = 5) {
  const allResponses = textQuestions.flatMap((q) => q.responses);
  const keywords = extractKeywords(allResponses, topN * 3);

  return keywords.slice(0, topN).map((kw) => {
    const matchingResponses = allResponses.filter((r) =>
      r && r.toString().toLowerCase().includes(kw.word)
    );
    const quotes = getRepresentativeQuotes(matchingResponses, 2);
    return { theme: kw.word, count: kw.count, quotes };
  });
}

module.exports = { extractKeywords, getRepresentativeQuotes, buildTopThemes };
