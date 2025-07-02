<?php

// Read the files
$classifiedPath = __DIR__ . '/../public/data/classified_questions.json';
$kubernetesPath = __DIR__ . '/../public/data/kubernetes.json';

echo "Reading files...\n";

$classified = json_decode(file_get_contents($classifiedPath), true);
$kubernetes = json_decode(file_get_contents($kubernetesPath), true);

if (!$classified || !$kubernetes) {
    die("Error reading JSON files\n");
}

// Create a lookup map for kubernetes questions
$questionMap = [];
foreach ($kubernetes as $k) {
    if (isset($k['question'])) {
        // Create a normalized key for comparison
        $normalizedQuestion = strtolower(trim($k['question']));
        $questionMap[$normalizedQuestion] = $k;
    }
}

echo "Processing questions...\n";

// Track statistics
$stats = [
    'total' => 0,
    'matched' => 0,
    'unmatched' => 0
];

// Process each category
foreach ($classified as $category => &$questions) {
    echo "\nProcessing category: {$category}\n";
    
    foreach ($questions as &$question) {
        $stats['total']++;
        
        if (!isset($question['question'])) {
            $stats['unmatched']++;
            continue;
        }

        // Normalize the question for comparison
        $normalizedQuestion = strtolower(trim($question['question']));
        
        if (isset($questionMap[$normalizedQuestion])) {
            $kubernetesQuestion = $questionMap[$normalizedQuestion];
            
            // Copy over the missing fields
            if (isset($kubernetesQuestion['options'])) {
                $question['options'] = $kubernetesQuestion['options'];
            }
            if (isset($kubernetesQuestion['answer'])) {
                $question['answer'] = $kubernetesQuestion['answer'];
            }
            if (isset($kubernetesQuestion['explanation'])) {
                $question['explanation'] = $kubernetesQuestion['explanation'];
            }
            
            $stats['matched']++;
            echo "✓ Matched: " . substr($question['question'], 0, 60) . "...\n";
        } else {
            $stats['unmatched']++;
            echo "✗ No match: " . substr($question['question'], 0, 60) . "...\n";
        }
    }
}

// Save the merged result
$outputPath = __DIR__ . '/../public/data/merged_questions.json';
file_put_contents($outputPath, json_encode($classified, JSON_PRETTY_PRINT));

echo "\nMerge complete!\n";
echo "Statistics:\n";
echo "Total questions processed: {$stats['total']}\n";
echo "Questions matched: {$stats['matched']}\n";
echo "Questions unmatched: {$stats['unmatched']}\n";
echo "\nOutput saved to: {$outputPath}\n";
