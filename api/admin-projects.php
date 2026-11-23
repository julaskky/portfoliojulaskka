<?php
$allowedOrigin = 'http://localhost:5173';

if (($_SERVER['HTTP_ORIGIN'] ?? '') === $allowedOrigin) {
    header("Access-Control-Allow-Origin: $allowedOrigin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Vary: Origin');
}

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

session_start();

function respond($success, $message = '', $data = [], $code = 200)
{
    http_response_code($code);
    echo json_encode(array_merge([
        'success' => $success,
        'message' => $message,
    ], $data));
    exit;
}

if (empty($_SESSION['admin_id'])) {
    respond(false, 'Administrator authentication required.', [], 401);
}

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

function readInput()
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    return is_array($data) ? $data : [];
}

function projectData($input)
{
    $title = trim($input['title'] ?? '');

    if ($title === '') {
        respond(false, 'Project title is required.', [], 422);
    }

    $slug = trim($input['slug'] ?? '');

    if ($slug === '') {
        $slug = strtolower($title);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        $slug = trim($slug, '-');
    }

    $technologies = $input['technologies'] ?? [];

    if (is_string($technologies)) {
        $technologies = array_filter(
            array_map('trim', explode(',', $technologies))
        );
    }

    if (!is_array($technologies)) {
        $technologies = [];
    }

    $technologies = array_values(array_filter(
        array_map(
            fn($item) => trim((string) $item),
            $technologies
        ),
        fn($item) => $item !== ''
    ));

    $status = ($input['status'] ?? 'draft') === 'published'
        ? 'published'
        : 'draft';

    return [
        'title' => $title,
        'slug' => $slug,
        'short_description' => trim($input['short_description'] ?? ''),
        'description' => trim($input['description'] ?? ''),
        'technologies' => json_encode($technologies),
        'image_path' => trim($input['image_path'] ?? ''),
        'live_url' => trim($input['live_url'] ?? ''),
        'github_url' => trim($input['github_url'] ?? ''),
        'category' => trim($input['category'] ?? ''),
        'status' => $status,
        'featured' => !empty($input['featured']) ? 1 : 0,
    ];
}

try {
    if ($method === 'GET') {
        $stmt = $pdo->query(
            'SELECT * FROM projects
             ORDER BY featured DESC, updated_at DESC, id DESC'
        );

        respond(true, 'Projects loaded.', [
            'projects' => $stmt->fetchAll(PDO::FETCH_ASSOC),
        ]);
    }

    $input = readInput();

    if ($method === 'POST') {
        $project = projectData($input);

        $stmt = $pdo->prepare(
            'INSERT INTO projects (
                title, slug, short_description, description,
                technologies, image_path, live_url, github_url,
                category, status, featured
            ) VALUES (
                :title, :slug, :short_description, :description,
                :technologies, :image_path, :live_url, :github_url,
                :category, :status, :featured
            )'
        );

        $stmt->execute($project);

        respond(true, 'Project created successfully.', [
            'id' => (int) $pdo->lastInsertId(),
        ], 201);
    }

    if ($method === 'PUT') {
        $id = filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);

        if (!$id || $id < 1) {
            respond(false, 'A valid project ID is required.', [], 422);
        }

        $project = projectData($input);
        $project['id'] = $id;

        $stmt = $pdo->prepare(
            'UPDATE projects SET
                title = :title,
                slug = :slug,
                short_description = :short_description,
                description = :description,
                technologies = :technologies,
                image_path = :image_path,
                live_url = :live_url,
                github_url = :github_url,
                category = :category,
                status = :status,
                featured = :featured,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = :id'
        );

        $stmt->execute($project);

        respond(true, 'Project updated successfully.');
    }

    if ($method === 'DELETE') {
        $id = filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);

        if (!$id || $id < 1) {
            respond(false, 'A valid project ID is required.', [], 422);
        }

        $stmt = $pdo->prepare('DELETE FROM projects WHERE id = :id');
        $stmt->execute(['id' => $id]);

        if ($stmt->rowCount() === 0) {
            respond(false, 'Project not found.', [], 404);
        }

        respond(true, 'Project deleted successfully.');
    }

    header('Allow: GET, POST, PUT, DELETE, OPTIONS');
    respond(false, 'Method not allowed.', [], 405);

} catch (PDOException $error) {
    error_log('Admin projects database error: ' . $error->getMessage());
    respond(false, 'A database error occurred. Check the PHP error log.', [], 500);
} catch (Throwable $error) {
    error_log('Admin projects error: ' . $error->getMessage());
    respond(false, 'An unexpected server error occurred.', [], 500);
}
