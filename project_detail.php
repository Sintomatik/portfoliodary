<?php
if (!isset($_GET['id'])) {
    header('Location: projects.php');
    exit;
}

$pageTitle = "Project Details";
$basePath = '';
include 'includes/header.php';
include 'includes/db.php';

$stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
$stmt->execute([$_GET['id']]);
$project = $stmt->fetch();

if (!$project) {
    echo '<div class="alert alert-danger">Project not found!</div>';
    include 'includes/footer.php';
    exit;
}

// Fetch project images
$stmt = $pdo->prepare("SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order");
$stmt->execute([$_GET['id']]);
$images = $stmt->fetchAll();
?>

<div class="row">
    <!-- Image Carousel -->
    <div class="col-lg-7">
        <?php if (!empty($images)): ?>
            <div id="projectCarousel" class="carousel slide shadow rounded" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    <?php foreach ($images as $key => $image): ?>
                        <button type="button" data-bs-target="#projectCarousel" 
                                data-bs-slide-to="<?= $key ?>" 
                                class="<?= $key === 0 ? 'active' : '' ?>"
                                aria-label="Slide <?= $key + 1 ?>"></button>
                    <?php endforeach; ?>
                </div>
                
                <div class="carousel-inner rounded-3">
                    <?php foreach ($images as $key => $image): ?>
                        <div class="carousel-item <?= $key === 0 ? 'active' : '' ?>">
                            <img src="<?= $image['image_path'] ?>" class="d-block w-100" alt="Project image <?= $key + 1 ?>" style="max-height: 500px; object-fit: contain;">
                        </div>
                    <?php endforeach; ?>
                </div>
                
                <button class="carousel-control-prev" type="button" data-bs-target="#projectCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#projectCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            
            <!-- Thumbnail navigation -->
            <div class="row g-2 mt-2">
                <?php foreach ($images as $key => $image): ?>
                    <div class="col-3 col-md-2">
                        <img src="<?= $image['image_path'] ?>" 
                             class="img-thumbnail cursor-pointer" 
                             style="height: 80px; width: 100%; object-fit: cover;"
                             onclick="goToSlide(<?= $key ?>)">
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
    
    <!-- Project Details -->
    <div class="col-lg-5 mt-4 mt-lg-0">
        <div class="card h-100">
            <div class="card-body">
                <h1 class="card-title"><?= htmlspecialchars($project['title']) ?></h1>
                
                <ul class="list-group list-group-flush mb-3">
                    <?php if ($project['category']): ?>
                        <li class="list-group-item">
                            <strong>Catégorie:</strong> <?= htmlspecialchars($project['category']) ?>
                        </li>
                    <?php endif; ?>
                </ul>
                
                <?php if ($project['project_url']): ?>
                    <a href="<?= htmlspecialchars($project['project_url']) ?>" class="btn btn-primary" target="_blank">
                        Lien du Projet
                    </a>
                <?php endif; ?>
                <br>
                <br>
                <div class="card-text mb-4"><?= nl2br(htmlspecialchars($project['description'])) ?></div>
            </div>
        </div>
    </div>
</div>

<script>
// Make sure Bootstrap JS is loaded
if (typeof bootstrap === 'undefined') {
    console.error('Bootstrap JS not loaded!');
} else {
    document.addEventListener('DOMContentLoaded', function() {
        const projectCarousel = document.getElementById('projectCarousel');
        if (projectCarousel) {
            const myCarousel = new bootstrap.Carousel(projectCarousel);
            
            // Make function globally available
            window.goToSlide = function(index) {
                myCarousel.to(index);
            };
            
            // Optional: Highlight active thumbnail
            myCarousel._element.addEventListener('slid.bs.carousel', function() {
                const thumbnails = document.querySelectorAll('.img-thumbnail');
                const activeIndex = [...this.querySelectorAll('.carousel-item')].findIndex(
                    item => item.classList.contains('active')
                );
                
                thumbnails.forEach((thumb, i) => {
                    thumb.style.border = i === activeIndex ? '3px solid #0d6efd' : '1px solid #dee2e6';
                });
            });
        }
    });
}
</script>

<?php include 'includes/footer.php'; ?>