<?php 
$pageTitle = "Home";
include 'includes/header.php'; 
include 'includes/db.php';
?>

<!-- Hero Section -->
<section class="hero-section">
    <h1 class="hero-title">Anthony Muraccioli</h1>
    <p class="hero-subtitle">
        Étudiant en Métiers du Multimédia et de l'Internet à l'IUT de Corte.<br>
        Passionné par l'informatique, le développement web, la création graphique, 
        l'audiovisuel et la communication digitale.
    </p>
    <div class="hero-buttons">
        <a href="journey.php" class="btn-3d btn-3d-large">
            <i class="bi bi-signpost-2"></i> Découvrir mon Parcours
        </a>
        <a href="projects.php" class="btn-3d btn-3d-cyan btn-3d-large">
            <i class="bi bi-collection"></i> Voir mes Projets
        </a>
    </div>
</section>

<!-- Latest Projects Section -->
<section class="latest-projects">
    <h2 class="section-title"><i class="bi bi-stars"></i> Derniers Projets</h2>
    
    <div class="projects-grid">
        <?php
        // Fetch latest 3 projects with all their images
        $stmt = $pdo->query("
            SELECT p.* FROM projects p
            ORDER BY p.created_at DESC 
            LIMIT 3
        ");
        
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
    
    <div class="center-buttons">
        <a href="projects.php" class="btn-3d btn-3d-large">
            <i class="bi bi-grid-3x3-gap"></i> Voir Tous les Projets
        </a>
    </div>
</section>

<?php include 'includes/footer.php'; ?>