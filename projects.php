<?php 
$pageTitle = "Projects";
include 'includes/header.php'; 
include 'includes/db.php';
?>

<h1>Mes Projets</h1>
<p>Voici l'entièreté des projets auxquels j'ai contribué pendant mes années d'études en MMI</p>

<div class="row mt-4">
    <?php
    $stmt = $pdo->query("
        SELECT p.*, pi.image_path 
        FROM projects p
        LEFT JOIN (
            SELECT project_id, MIN(image_path) as image_path 
            FROM project_images 
            GROUP BY project_id
        ) pi ON p.id = pi.project_id
        ORDER BY p.created_at DESC
    ");
    
    while ($project = $stmt->fetch()) {
        echo '<div class="col-md-4 mb-4">';
        echo '  <div class="card h-100">';
        
        // Show first image if available
        if (!empty($project['image_path'])) {
            echo '    <img src="' . $project['image_path'] . '" class="card-img-top" style="height: 200px; object-fit: cover;" alt="' . htmlspecialchars($project['title']) . '">';
        } else {
            echo '    <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">';
            echo '      <i class="bi bi-image text-muted" style="font-size: 3rem;"></i>';
            echo '    </div>';
        }
        
        echo '    <div class="card-body">';
        echo '      <h5 class="card-title">' . htmlspecialchars($project['title']) . '</h5>';
        echo '      <p class="card-text">' . substr(htmlspecialchars($project['description']), 0, 100) . '...</p>';
        echo '      <a href="project_detail.php?id=' . $project['id'] . '" class="btn btn-primary">Voir Projet</a>';
        echo '    </div>';
        echo '  </div>';
        echo '</div>';
    }
    ?>
</div>

<?php include 'includes/footer.php'; ?>