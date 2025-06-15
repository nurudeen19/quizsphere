const fs = require('fs');
const path = require('path');

describe('kubernetes.json question data integrity', () => {
  const questionsPath = path.resolve(__dirname, '../../public/data/kubernetes.json');
  let questions;

  beforeAll(() => {
    const raw = fs.readFileSync(questionsPath, 'utf-8');
    questions = JSON.parse(raw);
  });

  it('should be an array', () => {
    expect(Array.isArray(questions)).toBe(true);
  });

  it('should have required fields for each question', () => {
    questions.forEach((q, idx) => {
      expect(typeof q.question).toBe('string');
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options.length).toBeGreaterThan(1);
      expect(Array.isArray(q.answer)).toBe(true);
      expect(q.answer.length).toBeGreaterThan(0);
      expect(typeof q.explanation).toBe('string');
    });
  });

  it('should not have malformed objects', () => {
    questions.forEach((q, idx) => {
      // No extra or missing keys
      const allowed = ['question', 'options', 'answer', 'explanation'];
      const keys = Object.keys(q);
      keys.forEach(k => {
        expect(allowed.includes(k)).toBe(true);
      });
      expect(keys.length).toBe(allowed.length);
    });
  });

  it('should have valid answer indices', () => {
    questions.forEach((q, idx) => {
      q.answer.forEach(ansIdx => {
        expect(typeof ansIdx).toBe('number');
        expect(ansIdx).toBeGreaterThanOrEqual(0);
        expect(ansIdx).toBeLessThan(q.options.length);
      });
    });
  });
});
