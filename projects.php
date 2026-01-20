<?php 
$pageTitle = "Projets";
include 'includes/header.php'; 
include 'includes/db.php';
?>

<h1>✨ Mes Projets</h1>
<p class="lead mb-4">Découvrez mes créations - Cliquez sur les cartes pour les retourner</p>

<div class="row">
    <?php
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
        $projectId = $project['id'];
        $title = htmlspecialchars($project['title']);
        $description = htmlspecialchars($project['description']);
        $shortDesc = substr($description, 0, 80);
    ?>
    
    <div class="col-lg-4 col-md-6 mb-4">
        <div class="flip-card-wrapper">
            <div class="flip-card">
                <!-- FRONT -->
                <div class="flip-card-front">
                    <?php if (count($images) > 0): ?>
                        <div id="carousel<?php echo $projectId; ?>" class="carousel slide card-carousel" data-bs-ride="false">
                            <div class="carousel-indicators">
                                <?php foreach ($images as $idx => $img): ?>
                                    <button type="button" 
                                            data-bs-target="#carousel<?php echo $projectId; ?>" 
                                            data-bs-slide-to="<?php echo $idx; ?>" 
                                            class="<?php echo $idx === 0 ? 'active' : ''; ?>">
                                    </button>
                                <?php endforeach; ?>
                            </div>
                            <div class="carousel-inner">
                                <?php foreach ($images as $idx => $img): ?>
                                    <div class="carousel-item <?php echo $idx === 0 ? 'active' : ''; ?>">
                                        <img src="<?php echo htmlspecialchars($img['image_path']); ?>" 
                                             class="d-block w-100" 
                                             alt="<?php echo $title; ?>">
                                    </div>
                                <?php endforeach; ?>
                            </div>
                            <?php if (count($images) > 1): ?>
                                <button class="carousel-control-prev" type="button" data-bs-target="#carousel<?php echo $projectId; ?>" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon"></span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#carousel<?php echo $projectId; ?>" data-bs-slide="next">
                                    <span class="carousel-control-next-icon"></span>
                                </button>
                            <?php endif; ?>
                        </div>
                    <?php else: ?>
                        <div class="no-image">
                            <i class="bi bi-image"></i>
                            <p>Aucune image</p>
                        </div>
                    <?php endif; ?>
                    
                    <div class="card-info">
                        <h5><?php echo $title; ?></h5>
                        <p><?php echo $shortDesc; ?>...</p>
                    </div>
                    <button class="flip-btn">ℹ️ Plus d'infos</button>
                </div>
                
                <!-- BACK -->
                <div class="flip-card-back">
                    <div class="back-content">
                        <h3><?php echo $title; ?></h3>
                        <p><?php echo nl2br($description); ?></p>
                        
                        <?php if (!empty($project['technologies'])): ?>
                            <h5>Technologies utilisées</h5>
                            <ul>
                                <?php 
                                $techs = explode(',', $project['technologies']);
                                foreach ($techs as $tech): 
                                ?>
                                    <li><?php echo htmlspecialchars(trim($tech)); ?></li>
                                <?php endforeach; ?>
                            </ul>
                        <?php endif; ?>
                        
                        <a href="project_detail.php?id=<?php echo $projectId; ?>" class="btn btn-primary mt-3">
                            Voir les détails
                        </a>
                    </div>
                    <button class="flip-btn">🔄 Retour</button>
                </div>
            </div>
        </div>
    </div>
    
    <?php } ?>
</div>

<?php include 'includes/footer.php'; ?>
