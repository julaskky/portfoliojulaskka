<?php
require_once 'db.php';

$email = 'admin@example.com';
$newHash = password_hash('(16May1976))', PASSWORD_DEFAULT);

$stmt = $pdo->prepare(
    "UPDATE admins SET password_hash = ? WHERE email = ?"
);
$stmt->execute([$newHash, $email]);

echo $stmt->rowCount() >= 0
    ? 'Password reset completed. Rows updated: ' . $stmt->rowCount()
    : 'Password reset failed.';
