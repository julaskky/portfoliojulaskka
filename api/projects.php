<?php
require_once "db.php";

header("Access-Control-Allow-Origin: http://localhost:5173");

try {
    $stmt = $pdo->query(
        "SELECT id, title, slug, short_description,
                description, technologies, image_path,
                live_url, github_url, category, featured
         FROM projects
         WHERE status = 'published'
         ORDER BY featured DESC, created_at DESC"
    );

    echo json_encode([
        "success" => true,
        "projects" => $stmt->fetchAll()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to retrieve projects."
    ]);
}
