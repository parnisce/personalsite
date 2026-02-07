<?php
require_once 'config.php';

// Only allow running this script if no users exist
$conn = getDBConnection();
$result = $conn->query("SELECT COUNT(*) as count FROM admin_users");
$row = $result->fetch_assoc();

if ($row['count'] > 0) {
    die("Setup already completed. Security risk: Cannot create more users via this script.");
}

$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    if (empty($email) || empty($password)) {
        $message = "Email and password required.";
    } else {
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO admin_users (email, password_hash) VALUES (?, ?)");
        $stmt->bind_param("ss", $email, $passwordHash);

        if ($stmt->execute()) {
            $message = "User created successfully! You can now <a href='../admin/'>login</a>. <br><strong>IMPORTANT: Delete this file (api/setup_user.php) immediately.</strong>";
        } else {
            $message = "Error creating user: " . $conn->error;
        }
        $stmt->close();
    }
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup Admin User</title>
    <style>
        body {
            font-family: sans-serif;
            background: #111;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .card {
            background: #222;
            padding: 2rem;
            border-radius: 1rem;
            width: 100%;
            max-width: 400px;
        }

        input {
            display: block;
            width: 100%;
            padding: 0.5rem;
            margin-bottom: 1rem;
            background: #333;
            border: 1px solid #444;
            color: #fff;
            border-radius: 0.5rem;
        }

        button {
            background: #2563eb;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            width: 100%;
        }

        .message {
            margin-bottom: 1rem;
            color: #4ade80;
        }
    </style>
</head>

<body>
    <div class="card">
        <h2>Create Admin User</h2>
        <?php if ($message): ?>
            <div class="message">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>

        <form method="POST">
            <label>Email</label>
            <input type="email" name="email" required placeholder="admin@example.com">

            <label>Password</label>
            <input type="password" name="password" required placeholder="Strong password">

            <button type="submit">Create User</button>
        </form>
    </div>
</body>

</html>