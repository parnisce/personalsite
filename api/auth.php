<?php
require_once 'config.php';

session_start();

$method = $_SERVER['REQUEST_METHOD'];

// Login
if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['email']) || !isset($data['password'])) {
        sendError('Email and password are required', 400);
    }

    $conn = getDBConnection();

    $email = $conn->real_escape_string($data['email']);
    $password = $data['password'];

    $sql = "SELECT * FROM admin_users WHERE email = '$email' LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows === 0) {
        sendError('Invalid credentials', 401);
    }

    $user = $result->fetch_assoc();

    if (!password_verify($password, $user['password_hash'])) {
        sendError('Invalid credentials', 401);
    }

    // Create session
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_id'] = $user['id'];
    $_SESSION['admin_email'] = $user['email'];

    sendResponse([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email']
        ]
    ]);
}

// Logout
if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    sendResponse(['success' => true]);
}

// Check session
if ($method === 'GET' && isset($_GET['action']) && $_GET['action'] === 'check') {
    if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
        sendResponse([
            'authenticated' => true,
            'user' => [
                'id' => $_SESSION['admin_id'],
                'email' => $_SESSION['admin_email']
            ]
        ]);
    } else {
        sendResponse(['authenticated' => false]);
    }
}

sendError('Invalid request', 400);
?>