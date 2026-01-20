<?php
session_start();

if (!isset($_SESSION['loggedin'])) {
    header('Location: login.php');
    exit;
}

$pageTitle = "Admin Dashboard";
include 'includes/header.php';
include '../includes/db.php';

// Count projects
$stmt = $pdo->query("SELECT COUNT(*) FROM projects");
$projectCount = $stmt->fetchColumn();
?>

<h1 class="page-title">Dashboard</h1>
<p class="page-subtitle">Bienvenue dans votre panneau d'administration</p>

<!-- Stats Cards -->
<div class="aspirations-grid" style="margin-bottom: 2rem;">
    <div class="aspiration-card">
        <div class="card-header-3d career">
            <span class="icon"><i class="bi bi-collection"></i></span>
            <h3>Total Projets</h3>
        </div>
        <div class="card-body-3d" style="text-align: center;">
            <p style="font-size: 3rem; color: var(--accent-cyan); margin: 1rem 0;"><?php echo $projectCount; ?></p>
            <p style="color: var(--text-secondary);">projets dans votre portfolio</p>
        </div>
    </div>
    
    <div class="aspiration-card">
        <div class="card-header-3d education">
            <span class="icon"><i class="bi bi-plus-circle"></i></span>
            <h3>Actions Rapides</h3>
        </div>
        <div class="card-body-3d" style="display: flex; flex-direction: column; gap: 1rem;">
            <a href="add_project.php" class="btn-3d btn-3d-block">
                <i class="bi bi-plus-lg"></i> Ajouter Projet
            </a>
            <a href="../projects.php" class="btn-3d btn-3d-cyan btn-3d-block">
                <i class="bi bi-eye"></i> Voir Site
            </a>
        </div>
    </div>
</div>

<!-- Recent Projects Table -->
<div class="glass-card">
    <h3 style="color: var(--accent-pink); margin-bottom: 1.5rem;">
        <i class="bi bi-clock-history"></i> Projets Récents
    </h3>
    
    <div style="overflow-x: auto;">
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Catégorie</th>
                    <th>Date Ajout</th>
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
                    echo '<td>' . date('d/m/Y', strtotime($project['created_at'])) . '</td>';
                    echo '<td style="display: flex; gap: 0.5rem;">';
                    echo '<a href="edit_project.php?id=' . $project['id'] . '" class="btn-3d btn-3d-small"><i class="bi bi-pencil"></i></a>';
                    echo '<a href="delete_project.php?id=' . $project['id'] . '" class="btn-3d btn-3d-small" style="background: linear-gradient(135deg, #dc3545, #c82333);" data-confirm="Êtes-vous sûr de vouloir supprimer ce projet?"><i class="bi bi-trash"></i></a>';
                    echo '</td>';
                    echo '</tr>';
                }
                ?>
            </tbody>
        </table>
    </div>
</div>

<?php include 'includes/footer.php'; ?>