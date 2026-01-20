<?php
session_start();

// 1. Authentication Check
if (!isset($_SESSION['loggedin'])) {
    header('Location: login.php');
    exit;
}

// 2. Input Validation
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header('Location: dashboard.php?error=invalid_id');
    exit;
}

$project_id = (int)$_GET['id'];

// 3. Database Connection
require_once '../includes/db.php';

try {
    // 4. Perform Deletion (without file removal)
    $pdo->beginTransaction();
    
    // Delete from project_images table
    $stmt = $pdo->prepare("DELETE FROM project_images WHERE project_id = ?");
    $stmt->execute([$project_id]);
    
    // Delete from projects table
    $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
    $deleted = $stmt->execute([$project_id]);
    
    $pdo->commit();
    
    // 5. Redirect with Success
    header('Location: dashboard.php?success=project_deleted');
    exit;

} catch (PDOException $e) {
    // 6. Error Handling
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    error_log("Delete Project Error: " . $e->getMessage());
    header('Location: dashboard.php?error=delete_failed');
    exit;
}