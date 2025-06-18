// Script to check for duplicate questions in all JSON files in the data folder
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dataDir = path.join(__dirname, '../public/data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

let foundDuplicates = false;

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  let questions;
  try {
    questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`Could not parse ${file}:`, e.message);
    return;
  }
  if (!Array.isArray(questions)) return;
  const seen = new Set();
  const unique = [];
  const duplicates = [];
  questions.forEach((q, idx) => {
    if (!q.question) {
      unique.push(q);
      return;
    }
    const key = q.question.trim().toLowerCase();
    if (seen.has(key)) {
      duplicates.push({ idx, question: q.question });
    } else {
      seen.add(key);
      unique.push(q);
    }
  });
  if (duplicates.length > 0) {
    foundDuplicates = true;
    console.log(`\nREMOVING DUPLICATES in ${file}:`);
    duplicates.forEach(d => console.log(`  Index: ${d.idx}, Question: ${d.question}`));
    fs.writeFileSync(filePath, JSON.stringify(unique, null, 4));
    console.log(`  -> ${duplicates.length} duplicate(s) removed from ${file}`);
  }
});
if (!foundDuplicates) {
  console.log('No duplicate questions found in any file.');
}

// Run update-question-counts.js after removing duplicates
try {
  console.log('\nRunning update-question-counts.js...');
  execSync('node scripts/update-question-counts.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('update-question-counts.js completed.');
} catch (e) {
  console.error('Failed to run update-question-counts.js:', e.message);
}
