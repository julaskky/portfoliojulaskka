<?php
$allowedOrigin = 'http://localhost:5173';

if (($_SERVER['HTTP_ORIGIN'] ?? '') === $allowedOrigin) {
    header("Access-Control-Allow-Origin: $allowedOrigin");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}

header('Content-Type: application/json');

session_start();

if (empty($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated.']);
    exit;
}

echo json_encode([
    'success' => true,
    'admin' => [
        'id' => $_SESSION['admin_id'],
        'name' => $_SESSION['admin_name'] ?? 'Administrator'
    ]
]);
