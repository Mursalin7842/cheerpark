<?php
// register.php - simple JSON registration endpoint
header('Content-Type: application/json');

// Basic CORS/header setup for local testing (optional)
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$username = trim($_POST['reg-username'] ?? '');
$email    = trim($_POST['reg-email'] ?? '');
$password = $_POST['reg-password'] ?? '';

if ($username === '' || $email === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

// TODO: change these to your real DB credentials
$dbHost = 'localhost';
$dbUser = 'root';
$dbPass = '';
$dbName = 'cheerpark';

$mysqli = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}

// Check if username or email already exists
$stmt = $mysqli->prepare('SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1');
$stmt->bind_param('ss', $username, $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Username or email already taken.']);
    $stmt->close();
    $mysqli->close();
    exit;
}

$stmt->close();

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $mysqli->prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
$stmt->bind_param('sss', $username, $email, $hash);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Account created successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to create account.']);
}

$stmt->close();
$mysqli->close();
