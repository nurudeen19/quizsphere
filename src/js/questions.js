// Efficiently load questions from JSON using fetch
let questions = fetch('../data/questions.json')
    .then(response => response.json())
    .then(questions => {
        // Shuffle options and update answers for each question to reduce predictability
        for (const q of questions) {
            const optionPairs = q.options.map((opt, idx) => ({ opt, idx }));
            for (let i = optionPairs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionPairs[i], optionPairs[j]] = [optionPairs[j], optionPairs[i]];
            }
            q.options = optionPairs.map(pair => pair.opt);
            const oldToNew = {};
            optionPairs.forEach((pair, newIdx) => {
                oldToNew[pair.idx] = newIdx;
            });
            if (Array.isArray(q.answers)) {
                q.answers = q.answers.map(oldIdx => oldToNew[oldIdx]);
            } else {
                q.answers = [oldToNew[q.answers]];
            }
        }
        // Uniqueness check utility
        const seen = new Set();
        let duplicates = 0;
        questions.forEach((q) => {
            const key = q.q.trim().toLowerCase();
            if (seen.has(key)) {
                duplicates++;
            } else {
                seen.add(key);
            }
        });
        if (duplicates > 0) {
            console.warn('Duplicate questions found:', duplicates);
        } else {
            console.info('All questions are unique.');
        }
        return questions;
    });

export default questions;