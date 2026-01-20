<?php
if (!isset($_GET['id'])) {
    header('Location: projects.php');
    exit;
}

$pageTitle = "Project Details";
include 'includes/header.php';
include 'includes/db.php';

$stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
$stmt->execute([$_GET['id']]);
$project = $stmt->fetch();

if (!$project) {
    echo '<div class="alert-3d error"><i class="bi bi-exclamation-triangle"></i> Projet non trouvé!</div>';
    include 'includes/footer.php';
    exit;
}

// Fetch project images
$stmt = $pdo->prepare("SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order");
$stmt->execute([$_GET['id']]);
$images = $stmt->fetchAll();
?>

<div class="project-detail-grid">
    <!-- Image Carousel -->
    <div class="project-carousel-container card-3d-target">
        <div class="project-carousel-large">
            <?php if (!empty($images)): ?>
                <img src="<?= htmlspecialchars($images[0]['image_path']) ?>" class="main-image" alt="<?= htmlspecialchars($project['title']) ?>">
                
                <?php if (count($images) > 1): ?>
                    <div class="carousel-controls">
                        <button class="carousel-nav prev"><i class="bi bi-chevron-left"></i></button>
                        <button class="carousel-nav next"><i class="bi bi-chevron-right"></i></button>
                    </div>
                <?php endif; ?>
            <?php else: ?>
                <div class="no-image-placeholder main-image">
                    <i class="bi bi-image"></i>
                </div>
            <?php endif; ?>
        </div>
        
        <?php if (count($images) > 1): ?>
            <div class="thumbnail-strip">
                <?php foreach ($images as $key => $image): ?>
                    <img src="<?= htmlspecialchars($image['image_path']) ?>" 
                         alt="Thumbnail <?= $key + 1 ?>"
                         class="<?= $key === 0 ? 'active' : '' ?>">
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
    
    <!-- Project Info Panel -->
    <div class="project-info-panel card-3d-target">
        <h1><?= htmlspecialchars($project['title']) ?></h1>
        
        <div class="project-meta">
            <?php if ($project['category']): ?>
                <span class="meta-item">
                    <i class="bi bi-tag"></i>
                    <?= htmlspecialchars($project['category']) ?>
                </span>
            <?php endif; ?>
            <span class="meta-item">
                <i class="bi bi-calendar3"></i>
                <?= date('d/m/Y', strtotime($project['created_at'])) ?>
            </span>
        </div>
        
        <?php if ($project['project_url']): ?>
            <a href="<?= htmlspecialchars($project['project_url']) ?>" class="btn-3d btn-3d-cyan" target="_blank">
                <i class="bi bi-box-arrow-up-right"></i> Voir le Projet en Ligne
            </a>
        <?php endif; ?>
        
        <div class="project-description-full" style="margin-top: 1.5rem;">
            <?= nl2br(htmlspecialchars($project['description'])) ?>
        </div>
        
        <div style="margin-top: 2rem;">
            <a href="projects.php" class="btn-3d btn-3d-outline">
                <i class="bi bi-arrow-left"></i> Retour aux Projets
            </a>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>