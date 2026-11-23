<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->query("
        SELECT id, title, authors, publication_title,
               publication_year, doi, abstract, paper_url
        FROM research_papers
        WHERE status = 'published'
        ORDER BY publication_year DESC, created_at DESC
    ");

    echo json_encode([
        'success' => true,
        'papers' => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Unable to load research papers.'
    ]);
}
