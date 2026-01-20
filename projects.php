<?php 
$pageTitle = "Projects";
include 'includes/header.php'; 
include 'includes/db.php';
?>

<h1 class="page-title">Mes Projets</h1>
<p class="page-subtitle">Voici l'entièreté des projets auxquels j'ai contribué pendant mes années d'études en MMI</p>

<div class="projects-grid">
    <?php
    $stmt = $pdo->query("SELECT * FROM projects ORDER BY created_at DESC");
    
    while ($project = $stmt->fetch()) {
        // Get all images for this project
        $imgStmt = $pdo->prepare("SELECT image_path FROM project_images WHERE project_id = ? ORDER BY sort_order");
        $imgStmt->execute([$project['id']]);
        $images = $imgStmt->fetchAll(PDO::FETCH_COLUMN);
        
        echo '<div class="flip-card card-3d-target">';
        echo '  <div class="flip-card-inner">';
        
        // Front - Carousel
        echo '    <div class="flip-card-front">';
        echo '      <div class="carousel-container">';
        echo '        <div class="carousel-images">';
        
        if (!empty($images)) {
            foreach ($images as $img) {
                echo '          <img src="' . htmlspecialchars($img) . '" alt="' . htmlspecialchars($project['title']) . '">';
            }
        } else {
            echo '          <div class="no-image-placeholder"><i class="bi bi-image"></i></div>';
        }
        
        echo '        </div>';
        
        // Carousel navigation (only if multiple images)
        if (count($images) > 1) {
            echo '        <button class="carousel-nav prev"><i class="bi bi-chevron-left"></i></button>';
            echo '        <button class="carousel-nav next"><i class="bi bi-chevron-right"></i></button>';
            echo '        <div class="carousel-dots">';
            foreach ($images as $index => $img) {
                echo '          <button class="dot' . ($index === 0 ? ' active' : '') . '"></button>';
            }
            echo '        </div>';
        }
        
        echo '      </div>';
        echo '      <div class="card-title-overlay">';
        echo '        <h3>' . htmlspecialchars($project['title']) . '</h3>';
        echo '        <span class="flip-hint"><i class="bi bi-arrow-repeat"></i> Cliquer pour retourner</span>';
        echo '      </div>';
        echo '    </div>';
        
        // Back - Info
        echo '    <div class="flip-card-back">';
        echo '      <h3>' . htmlspecialchars($project['title']) . '</h3>';
        if (!empty($project['category'])) {
            echo '      <span class="project-category">' . htmlspecialchars($project['category']) . '</span>';
        }
        echo '      <p class="project-description">' . htmlspecialchars($project['description']) . '</p>';
        echo '      <div class="project-actions">';
        echo '        <a href="project_detail.php?id=' . $project['id'] . '" class="btn-3d btn-3d-small" onclick="event.stopPropagation();">';
        echo '          <i class="bi bi-eye"></i> Voir Détails';
        echo '        </a>';
        if (!empty($project['project_url'])) {
            echo '        <a href="' . htmlspecialchars($project['project_url']) . '" class="btn-3d btn-3d-cyan btn-3d-small" target="_blank" onclick="event.stopPropagation();">';
            echo '          <i class="bi bi-box-arrow-up-right"></i> Lien';
            echo '        </a>';
        }
        echo '      </div>';
        echo '    </div>';
        
        echo '  </div>';
        echo '</div>';
    }
    ?>
</div>

<?php include 'includes/footer.php'; ?>