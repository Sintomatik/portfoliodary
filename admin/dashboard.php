<?php
session_start();

if (!isset($_SESSION['loggedin'])) {
    header('Location: login.php');
    exit;
}

$pageTitle = "Admin Dashboard";
include '../includes/header.php';
include '../includes/db.php';

// Count projects
$stmt = $pdo->query("SELECT COUNT(*) FROM projects");
$projectCount = $stmt->fetchColumn();
?>

<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Dashboard</h1>
    <div class="btn-toolbar mb-2 mb-md-0">
        <a href="add_project.php" class="btn btn-sm btn-outline-primary">
            <i class="bi bi-plus-circle"></i> Add New Project
        </a>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">Welcome, Admin</h5>
                <p class="card-text">You have <?php echo $projectCount; ?> projects in your portfolio.</p>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <h4>Recent Projects</h4>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date Added</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $stmt = $pdo->query("SELECT * FROM projects ORDER BY created_at DESC LIMIT 20");
                    while ($project = $stmt->fetch()) {
                        echo '<tr>';
                        echo '<td>' . $project['id'] . '</td>';
                        echo '<td>' . htmlspecialchars($project['title']) . '</td>';
                        echo '<td>' . htmlspecialchars($project['category']) . '</td>';
                        echo '<td>' . date('M j, Y', strtotime($project['created_at'])) . '</td>';
                        echo '<td>';
                        echo '<a href="edit_project.php?id=' . $project['id'] . '" class="btn btn-sm btn-warning">Edit</a> ';
                        echo '<a href="delete_project.php?id=' . $project['id'] . '" class="btn btn-sm btn-danger" onclick="return confirm(\'Are you sure?\')">Delete</a>';
                        echo '</td>';
                        echo '</tr>';
                    }
                    ?>
                </tbody>
            </table>
        </div>
        <a href="../projects.php" class="btn btn-primary mt-3">View All Projects</a>
    </div>
</div>

<?php include '../includes/footer.php'; ?>