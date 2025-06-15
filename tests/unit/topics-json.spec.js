const fs = require('fs');
const path = require('path');

describe('topics.json data integrity', () => {
  const topicsPath = path.resolve(__dirname, '../../public/data/topics.json');
  let topics;

  beforeAll(() => {
    const raw = fs.readFileSync(topicsPath, 'utf-8');
    topics = JSON.parse(raw);
  });

  it('should be an array', () => {
    expect(Array.isArray(topics)).toBe(true);
  });

  it('should have required fields for each topic', () => {
    topics.forEach(topic => {
      expect(typeof topic.topic).toBe('string');
      expect(typeof topic.file).toBe('string');
      expect(typeof topic.title).toBe('string');
      expect(typeof topic.image).toBe('string');
      expect(typeof topic.description).toBe('string');
      expect(typeof topic.level).toBe('string');
      expect(typeof topic.badge).toBe('string');
      expect(typeof topic.questionsCount).toBe('number');
    });
  });

  it('should have unique topic keys', () => {
    const keys = topics.map(t => t.topic);
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
  });

  it('should have valid file paths', () => {
    topics.forEach(topic => {
      expect(topic.file).toMatch(/^data\/.+\.json$/);
    });
  });

  it('should have positive questionsCount', () => {
    topics.forEach(topic => {
      expect(topic.questionsCount).toBeGreaterThan(0);
    });
  });
});
