<?php 
$pageTitle = "Accueil";
include 'includes/header.php'; 
include 'includes/db.php';
?>

<div class="text-center mb-5">
    <h1 class="mb-4">✨ Bienvenue sur mon Portfolio</h1>
    <p class="lead" style="max-width: 800px; margin: 0 auto;">
        Je suis Anthony Muraccioli, étudiant en Métiers du Multimédia et de l'Internet à l'IUT de Corte.<br><br>
        Mes intérêts se portent principalement sur l'informatique et le développement d'applications & de sites web, 
        mais ma formation m'a permis d'obtenir un grand panel de compétences professionnelles différentes comme 
        la création graphique, l'audiovisuel, la communication digitale et la gestion de projet.
        <br><br>Ce site est une vitrine de l'évolution de ces compétences au fil des années.
    </p>
    <a href="journey.php" class="btn btn-primary btn-lg mt-4">🚀 Découvrez mon parcours</a>
</div>

<h2 class="text-center mb-4">⭐ Mes derniers projets</h2>

<div class="row">
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
    
    while ($project = $stmt->fetch()):
    ?>
    <div class="col-md-4 mb-4">
        <div class="card h-100">
            <?php if (!empty($project['image_path'])): ?>
                <img src="<?php echo htmlspecialchars($project['image_path']); ?>" 
                     class="card-img-top" 
                     alt="<?php echo htmlspecialchars($project['title']); ?>">
            <?php else: ?>
                <div class="card-img-top d-flex align-items-center justify-content-center" 
                     style="height: 200px; background: rgba(45, 10, 94, 0.3);">
                    <i class="bi bi-image" style="font-size: 3rem; color: var(--purple-light);"></i>
                </div>
            <?php endif; ?>
            
            <div class="card-body d-flex flex-column">
                <h5 class="card-title"><?php echo htmlspecialchars($project['title']); ?></h5>
                <p class="card-text"><?php echo substr(htmlspecialchars($project['description']), 0, 100); ?>...</p>
                <a href="project_detail.php?id=<?php echo $project['id']; ?>" class="btn btn-primary mt-auto">
                    Voir Projet
                </a>
            </div>
        </div>
    </div>
    <?php endwhile; ?>
</div>

<div class="text-center mt-4">
    <a href="projects.php" class="btn btn-primary btn-lg">Voir tous les projets →</a>
</div>

<?php include 'includes/footer.php'; ?>
