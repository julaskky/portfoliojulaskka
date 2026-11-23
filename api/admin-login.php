<?php
$allowedOrigin = 'http://localhost:5173';

if (($_SERVER['HTTP_ORIGIN'] ?? '') === $allowedOrigin) {
    header("Access-Control-Allow-Origin: $allowedOrigin");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}

header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

session_start();


require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode([
        'success' => false,
        'message' => 'Email and password are required.'
    ]);
    exit;
}

$stmt = $pdo->prepare(
    "SELECT id, name, email, password_hash
     FROM admins
     WHERE email = ? AND status = 'active'
     LIMIT 1"
);

$stmt->execute([$email]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email or password.'
    ]);
    exit;
}

session_regenerate_id(true);

$_SESSION['admin_id'] = $admin['id'];
$_SESSION['admin_name'] = $admin['name'];

echo json_encode([
    'success' => true,
    'message' => 'Login successful.',
    'admin' => [
        'id' => $admin['id'],
        'name' => $admin['name'],
        'email' => $admin['email']
    ]
]);