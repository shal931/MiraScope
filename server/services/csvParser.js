const { parse } = require('csv-parse/sync');

/**
 * Detect question type from column name and values
 */
function detectType(colName, values) {
  const lower = colName.toLowerCase();
  if (lower.includes('timestamp') || lower.includes('date') || lower.includes('time')) {
    return 'timestamp';
  }
  const nonEmpty = values.filter((v) => v && v.toString().trim() !== '');
  if (nonEmpty.length === 0) return 'unknown';

  // Rating: all numeric between 1–10
  const numericCount = nonEmpty.filter((v) => !isNaN(v) && Number(v) >= 1 && Number(v) <= 10).length;
  if (numericCount / nonEmpty.length > 0.8) return 'rating';

  // Multiple choice: few unique values relative to total
  const unique = new Set(nonEmpty.map((v) => v.toString().toLowerCase().trim()));
  if (unique.size <= 8 && unique.size / nonEmpty.length < 0.3) return 'multiple_choice';

  // Short text: everything else with text content
  const avgLen = nonEmpty.reduce((s, v) => s + v.toString().length, 0) / nonEmpty.length;
  if (avgLen > 10) return 'short_text';

  return 'multiple_choice';
}

/**
 * Parse CSV buffer and return normalized question objects
 */
function parseCSV(buffer) {
  const content = buffer.toString('utf-8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });

  if (records.length === 0) throw new Error('CSV file is empty or has no data rows.');

  const columns = Object.keys(records[0]);
  const questions = columns.map((col) => {
    const values = records.map((r) => r[col]);
    const type = detectType(col, values);
    return {
      column: col,
      type,
      responses: values.filter((v) => v && v.toString().trim() !== ''),
    };
  });

  return { totalResponses: records.length, questions };
}

module.exports = { parseCSV };
