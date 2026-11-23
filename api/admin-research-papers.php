<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

session_start();
require_once __DIR__ . '/db.php';

function respond($status, $data) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

if (empty($_SESSION['admin_id'])) {
    respond(401, [
        'success' => false,
        'message' => 'Please log in again.'
    ]);
}

function getInput() {
    $data = json_decode(file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

function validatePaper($data) {
    $title = trim((string)($data['title'] ?? ''));

    if ($title === '') {
        respond(422, [
            'success' => false,
            'message' => 'Paper title is required.'
        ]);
    }

    $yearInput = trim((string)($data['publication_year'] ?? ''));
    $year = null;

    if ($yearInput !== '') {
        $year = filter_var($yearInput, FILTER_VALIDATE_INT);

        if (
            $year === false ||
            $year < 1900 ||
            $year > ((int)date('Y') + 5)
        ) {
            respond(422, [
                'success' => false,
                'message' => 'Enter a valid publication year.'
            ]);
        }
    }

    return [
        'title' => $title,
        'authors' => trim((string)($data['authors'] ?? '')),
        'publication_title' => trim(
            (string)($data['publication_title'] ?? '')
        ),
        'publication_year' => $year,
        'doi' => trim((string)($data['doi'] ?? '')),
        'abstract' => trim((string)($data['abstract'] ?? '')),
        'paper_url' => trim((string)($data['paper_url'] ?? '')),
        'status' => ($data['status'] ?? 'draft') === 'published'
            ? 'published'
            : 'draft'
    ];
}

try {
    $method = $_SERVER['REQUEST_METHOD'];

    // List all papers for the admin.
    if ($method === 'GET') {
        $stmt = $pdo->query("
            SELECT *
            FROM research_papers
            ORDER BY created_at DESC
        ");

        respond(200, [
            'success' => true,
            'papers' => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
    }

    $data = getInput();

    // Add a paper.
    if ($method === 'POST') {
        $paper = validatePaper($data);

        $stmt = $pdo->prepare("
            INSERT INTO research_papers (
                title, authors, publication_title,
                publication_year, doi, abstract,
                paper_url, status
            ) VALUES (
                :title, :authors, :publication_title,
                :publication_year, :doi, :abstract,
                :paper_url, :status
            )
        ");

        $stmt->execute($paper);

        respond(201, [
            'success' => true,
            'message' => 'Research paper added successfully.'
        ]);
    }

    // Update a paper, including publish/unpublish.
    if ($method === 'PUT') {
        $id = filter_var(
            $data['id'] ?? null,
            FILTER_VALIDATE_INT
        );

        if (!$id || $id < 1) {
            respond(422, [
                'success' => false,
                'message' => 'A valid paper ID is required.'
            ]);
        }

        $paper = validatePaper($data);
        $paper['id'] = $id;

        $stmt = $pdo->prepare("
            UPDATE research_papers SET
                title = :title,
                authors = :authors,
                publication_title = :publication_title,
                publication_year = :publication_year,
                doi = :doi,
                abstract = :abstract,
                paper_url = :paper_url,
                status = :status
            WHERE id = :id
        ");

        $stmt->execute($paper);

        respond(200, [
            'success' => true,
            'message' => 'Research paper updated successfully.'
        ]);
    }

    // Delete a paper.
    if ($method === 'DELETE') {
        $id = filter_var(
            $data['id'] ?? null,
            FILTER_VALIDATE_INT
        );

        if (!$id || $id < 1) {
            respond(422, [
                'success' => false,
                'message' => 'A valid paper ID is required.'
            ]);
        }

        $stmt = $pdo->prepare(
            'DELETE FROM research_papers WHERE id = ?'
        );

        $stmt->execute([$id]);

        respond(200, [
            'success' => true,
            'message' => 'Research paper deleted successfully.'
        ]);
    }

    respond(405, [
        'success' => false,
        'message' => 'Method not allowed.'
    ]);

} catch (Throwable $e) {
    respond(500, [
        'success' => false,
        'message' => 'A server error occurred while processing papers.'
    ]);
}
