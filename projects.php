<?php 
$pageTitle = "Projects";
include 'includes/header.php'; 
include 'includes/db.php';
?>

<h1>✨ Mes Projets</h1>
<p class="lead">Découvrez mes créations en 3D - Cliquez sur les cartes pour les retourner</p>

<div class="row mt-4">
    <?php
    // Get all projects with their images
    $stmt = $pdo->query("
        SELECT p.* 
        FROM projects p
        ORDER BY p.created_at DESC
    ");
    
    while ($project = $stmt->fetch()) {
        // Get all images for this project
        $imgStmt = $pdo->prepare("
            SELECT image_path 
            FROM project_images 
            WHERE project_id = ? 
            ORDER BY image_path
        ");
        $imgStmt->execute([$project['id']]);
        $images = $imgStmt->fetchAll();
        
        echo '<div class="col-md-4 mb-5">';
        echo '  <div class="flip-card-container">';
        echo '    <div class="flip-card">';
        
        // FRONT FACE - Carousel
        echo '      <div class="flip-card-face flip-card-front">';
        
        if (count($images) > 0) {
            echo '        <div id="carousel' . $project['id'] . '" class="carousel slide card-carousel" data-bs-ride="false">';
            echo '          <div class="carousel-indicators">';
            foreach ($images as $index => $img) {
                $active = $index === 0 ? 'active' : '';
                echo '            <button type="button" data-bs-target="#carousel' . $project['id'] . '" data-bs-slide-to="' . $index . '" class="' . $active . '"></button>';
            }
            echo '          </div>';
            
            echo '          <div class="carousel-inner">';
            foreach ($images as $index => $img) {
                $active = $index === 0 ? 'active' : '';
                echo '            <div class="carousel-item ' . $active . '">';
                echo '              <img src="' . htmlspecialchars($img['image_path']) . '" class="d-block w-100" alt="' . htmlspecialchars($project['title']) . '">';
                echo '            </div>';
            }
            echo '          </div>';
            
            if (count($images) > 1) {
                echo '          <button class="carousel-control-prev" type="button" data-bs-target="#carousel' . $project['id'] . '" data-bs-slide="prev">';
                echo '            <span class="carousel-control-prev-icon"></span>';
                echo '          </button>';
                echo '          <button class="carousel-control-next" type="button" data-bs-target="#carousel' . $project['id'] . '" data-bs-slide="next">';
                echo '            <span class="carousel-control-next-icon"></span>';
                echo '          </button>';
            }
            
            echo '        </div>';
        } else {
            echo '        <div class="card-carousel d-flex align-items-center justify-content-center" style="background: rgba(157, 78, 221, 0.1);">';
            echo '          <div class="text-center">';
            echo '            <i class="bi bi-image" style="font-size: 4rem; color: #9d4edd;"></i>';
            echo '            <p class="mt-2" style="color: #c77dff;">Aucune image</p>';
            echo '          </div>';
            echo '        </div>';
        }
        
        echo '        <div class="card-info">';
        echo '          <h5>' . htmlspecialchars($project['title']) . '</h5>';
        echo '          <p>' . substr(htmlspecialchars($project['description']), 0, 80) . '...</p>';
        echo '        </div>';
        echo '        <button class="flip-btn">ℹ️ Plus d\'infos</button>';
        echo '      </div>';
        
        // BACK FACE - Information
        echo '      <div class="flip-card-face flip-card-back">';
        echo '        <div class="back-content">';
        echo '          <h3>' . htmlspecialchars($project['title']) . '</h3>';
        echo '          <p>' . nl2br(htmlspecialchars($project['description'])) . '</p>';
        
        if (!empty($project['technologies'])) {
            echo '          <h5 style="color: #9d4edd; margin-top: 20px;">Technologies utilisées:</h5>';
            echo '          <ul>';
            $techs = explode(',', $project['technologies']);
            foreach ($techs as $tech) {
                echo '            <li>' . htmlspecialchars(trim($tech)) . '</li>';
            }
            echo '          </ul>';
        }
        
        echo '          <div style="margin-top: auto; padding-top: 20px;">';
        echo '            <a href="project_detail.php?id=' . $project['id'] . '" class="btn btn-primary">Voir les détails complets</a>';
        echo '          </div>';
        echo '        </div>';
        echo '        <button class="flip-btn">🔄 Retour</button>';
        echo '      </div>';
        
        echo '    </div>';
        echo '  </div>';
        echo '</div>';
    }
    ?>
</div>

<script src="assets/js/script.js"></script>

<?php include 'includes/footer.php'; ?>
