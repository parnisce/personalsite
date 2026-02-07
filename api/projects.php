<?php
require_once 'config.php';

session_start();

$method = $_SERVER['REQUEST_METHOD'];

// Helper function to check if user is authenticated
function isAuthenticated()
{
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

// GET - Fetch all projects (public access)
if ($method === 'GET') {
    $conn = getDBConnection();

    $sql = "SELECT * FROM projects ORDER BY created_at DESC";
    $result = $conn->query($sql);

    $projects = [];
    while ($row = $result->fetch_assoc()) {
        $projects[] = $row;
    }

    $conn->close();
    sendResponse($projects);
}

// POST - Create new project (requires auth)
if ($method === 'POST') {
    if (!isAuthenticated()) {
        sendError('Unauthorized', 401);
    }

    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    $required = ['title', 'short_description', 'description', 'tech_stack', 'image_url', 'link', 'category', 'badges'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            sendError("Field '$field' is required", 400);
        }
    }

    $conn = getDBConnection();

    $stmt = $conn->prepare("INSERT INTO projects (title, short_description, description, tech_stack, image_url, link, category, badges) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param(
        "ssssssss",
        $data['title'],
        $data['short_description'],
        $data['description'],
        $data['tech_stack'],
        $data['image_url'],
        $data['link'],
        $data['category'],
        $data['badges']
    );

    if ($stmt->execute()) {
        $newId = $conn->insert_id;
        $stmt->close();
        $conn->close();
        sendResponse(['success' => true, 'id' => $newId], 201);
    } else {
        sendError('Failed to create project', 500);
    }
}

// PUT - Update project (requires auth)
if ($method === 'PUT') {
    if (!isAuthenticated()) {
        sendError('Unauthorized', 401);
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        sendError('Project ID is required', 400);
    }

    $conn = getDBConnection();

    $stmt = $conn->prepare("UPDATE projects SET title = ?, short_description = ?, description = ?, tech_stack = ?, image_url = ?, link = ?, category = ?, badges = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");

    $stmt->bind_param(
        "ssssssssi",
        $data['title'],
        $data['short_description'],
        $data['description'],
        $data['tech_stack'],
        $data['image_url'],
        $data['link'],
        $data['category'],
        $data['badges'],
        $data['id']
    );

    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        sendResponse(['success' => true]);
    } else {
        sendError('Failed to update project', 500);
    }
}

// DELETE - Delete project (requires auth)
if ($method === 'DELETE') {
    if (!isAuthenticated()) {
        sendError('Unauthorized', 401);
    }

    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id === 0) {
        sendError('Project ID is required', 400);
    }

    $conn = getDBConnection();

    $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        sendResponse(['success' => true]);
    } else {
        sendError('Failed to delete project', 500);
    }
}

sendError('Invalid request method', 405);
?>