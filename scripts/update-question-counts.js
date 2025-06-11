// update-question-counts.js
// Node.js script to update questionsCount in topics.json for each topic
const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../public/data/topics.json');
const dataDir = path.join(__dirname, '../public/data');

const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf-8'));

for (const topic of topics) {
  let file = topic.file || (topic.topic + '.json');
  // Remove any leading 'data/' or '/'
  file = file.replace(/^data\//, '').replace(/^\//, '');
  const filePath = path.join(dataDir, file);
  let count = 0;
  try {
    if (fs.existsSync(filePath)) {
      const questions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (Array.isArray(questions)) count = questions.length;
    }
  } catch (e) {
    // ignore errors, leave count as 0
  }
  topic.questionsCount = count;
  console.log(`Updated ${topic.topic} (${file}): ${count} questions`);
}

fs.writeFileSync(topicsPath, JSON.stringify(topics, null, 2));
console.log('Updated questionsCount for all topics.');
