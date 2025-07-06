<?php
// Usage: php extract-questions.php <input-file.json> [output-file.json]
if ($argc < 2) {
    echo "Usage: php extract-questions.php <input-file.json> [output-file.json]\n";
    exit(1);
}

$inputFile = $argv[1];
$outputFile = $argc > 2 ? $argv[2] : preg_replace('/\.json$/', '-questions.json', $inputFile);
if (!file_exists($inputFile)) {
    echo "File not found: $inputFile\n";
    exit(1);
}

$data = json_decode(file_get_contents($inputFile), true);
if (!is_array($data)) {
    echo "Invalid JSON or not an array in $inputFile\n";
    exit(1);
}

$questions = [];
foreach ($data as $item) {
    if (isset($item['question'])) {
        $questions[] = $item['question'];
    }
}

file_put_contents($outputFile, json_encode($questions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo "Extracted " . count($questions) . " questions to $outputFile\n";
