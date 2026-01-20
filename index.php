<?php 
$pageTitle = "Home";
include 'includes/header.php'; 
include 'includes/db.php';
?>

<div style="text-align: center; margin-bottom: 3rem;">
    <h1 style="font-size: 3rem; margin-bottom: 1rem;">✨ Bienvenue sur mon Portfolio</h1>
    <p class="lead" style="max-width: 800px; margin: 0 auto; font-size: 1.2rem;"> 
        Je suis Anthony Muraccioli, étudiant en Métiers du Multimédia et de l'Internet à l'IUT de Corte.<br><br> 
        Mes intêrets se portent principalement sur l'informatique et le développement d'applications & de sites web, 
        mais ma formation m'a permis d'obtenir un grand panel de compétences professionnelles différentes comme 
        la création graphique, l'audiovisuel, la communication digitale et la gestion de projet.
        <br><br>Ce site est une vitrine de l'évolution de ces compétences au fil des années.<br>
    </p>

    <a href="journey.php" class="btn btn-primary btn-lg mt-4">🚀 Découvrez mon parcours</a>
</div>

<br><br>
<p class="lead" style="text-align: center; font-size: 1.5rem; margin-bottom: 2rem;">
    ⭐ Mes derniers projets ajoutés
</p>

<div class="row mt-5">
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
        LIMIT 3
    ");
    
    while ($project = $stmt->fetch()) {
        echo '<div class="col-md-4 mb-4">';
        echo '  <div class="card h-100">';
        
        // Show first image if available
        if (!empty($project['image_path'])) {
            echo '    <img src="' . $project['image_path'] . '" class="card-img-top" style="height: 200px; object-fit: cover;" alt="' . htmlspecialchars($project['title']) . '">';
        } else {
            echo '    <div class="card-img-top d-flex align-items-center justify-content-center" style="height: 200px; background: rgba(157, 78, 221, 0.1);">';
            echo '      <i class="bi bi-image" style="font-size: 3rem; color: #9d4edd;"></i>';
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

<div style="text-align: center; margin-top: 3rem;">
    <a href="projects.php" class="btn btn-primary btn-lg">📂 Voir tous mes projets en 3D</a>
</div>

<script src="assets/js/script.js"></script>

<?php include 'includes/footer.php'; ?>
