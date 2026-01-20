<?php
session_start();

if (!isset($_SESSION['loggedin'])) {
    header('Location: login.php');
    exit;
}

if (!isset($_GET['id'])) {
    header('Location: dashboard.php');
    exit;
}

$pageTitle = "Edit Project";
include 'includes/header.php';
include '../includes/db.php';

// Fetch project data
$stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
$stmt->execute([$_GET['id']]);
$project = $stmt->fetch();

if (!$project) {
    header('Location: dashboard.php');
    exit;
}

// Fetch existing images
$stmt = $pdo->prepare("SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order");
$stmt->execute([$_GET['id']]);
$existing_images = $stmt->fetchAll();

$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $project_url = trim($_POST['project_url'] ?? '');
    $image_paths = array_filter(array_map('trim', explode("\n", $_POST['image_paths'] ?? '')));
    $images_to_keep = $_POST['keep_images'] ?? [];
    
    // Validate inputs
    if (empty($title)) {
        $errors[] = 'Le titre est requis';
    }
    
    if (empty($description)) {
        $errors[] = 'La description est requise';
    }
    
    if (empty($errors)) {
        $pdo->beginTransaction();
        
        try {
            // Update project
            $stmt = $pdo->prepare("UPDATE projects SET title = ?, description = ?, project_url = ?, category = ? WHERE id = ?");
            $stmt->execute([$title, $description, $project_url, $category, $project['id']]);
            
            // Handle image deletions
            $stmt = $pdo->prepare("SELECT id FROM project_images WHERE project_id = ?");
            $stmt->execute([$project['id']]);
            $all_images = $stmt->fetchAll();
            
            foreach ($all_images as $img) {
                if (!in_array($img['id'], $images_to_keep)) {
                    $stmt = $pdo->prepare("DELETE FROM project_images WHERE id = ?");
                    $stmt->execute([$img['id']]);
                }
            }
            
            // Add new image paths
            foreach ($image_paths as $sort_order => $path) {
                if (!empty($path)) {
                    $stmt = $pdo->prepare("INSERT INTO project_images (project_id, image_path, sort_order) VALUES (?, ?, ?)");
                    $stmt->execute([$project['id'], $path, $sort_order + count($images_to_keep)]);
                }
            }
            
            $pdo->commit();
            $success = true;
            
            // Refresh data
            $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $project = $stmt->fetch();
            
            $stmt = $pdo->prepare("SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order");
            $stmt->execute([$project['id']]);
            $existing_images = $stmt->fetchAll();
        } catch (Exception $e) {
            $pdo->rollBack();
            $errors[] = 'Erreur lors de la mise à jour: ' . $e->getMessage();
        }
    }
}
?>

<h1 class="page-title">Modifier Projet</h1>
<p class="page-subtitle">Modifiez les détails de votre projet</p>

<section class="contact-section">
    <div class="contact-form" style="max-width: 800px;">
        <?php if ($success): ?>
            <div class="alert-3d success">
                <i class="bi bi-check-circle"></i>
                Projet mis à jour avec succès!
            </div>
        <?php endif; ?>
        
        <?php if (!empty($errors)): ?>
            <div class="alert-3d error">
                <i class="bi bi-exclamation-triangle"></i>
                <ul style="margin: 0; padding-left: 1rem;">
                    <?php foreach ($errors as $error): ?>
                        <li><?php echo $error; ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label for="title"><i class="bi bi-type"></i> Titre du Projet</label>
                <input type="text" class="form-input" id="title" name="title" 
                       value="<?php echo htmlspecialchars($project['title']); ?>" required>
            </div>
            
            <div class="form-group">
                <label for="description"><i class="bi bi-text-paragraph"></i> Description</label>
                <textarea class="form-input" id="description" name="description" rows="5" required><?php echo htmlspecialchars($project['description']); ?></textarea>
            </div>
            
            <div class="form-group">
                <label for="category"><i class="bi bi-tag"></i> Catégorie</label>
                <input type="text" class="form-input" id="category" name="category" 
                       value="<?php echo htmlspecialchars($project['category']); ?>">
            </div>
            
            <div class="form-group">
                <label for="project_url"><i class="bi bi-link-45deg"></i> URL du Projet (optionnel)</label>
                <input type="url" class="form-input" id="project_url" name="project_url" 
                       value="<?php echo htmlspecialchars($project['project_url']); ?>">
            </div>
            
            <!-- Existing images -->
            <?php if (!empty($existing_images)): ?>
            <div class="form-group">
                <label><i class="bi bi-images"></i> Images Actuelles</label>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; margin-top: 0.5rem;">
                    <?php foreach ($existing_images as $image): ?>
                        <div class="glass-card" style="padding: 0.5rem;">
                            <img src="<?= htmlspecialchars($image['image_path']) ?>" 
                                 style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px;"
                                 onerror="this.src='../assets/images/placeholder.png';">
                            <label style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.85rem;">
                                <input type="checkbox" name="keep_images[]" value="<?= $image['id'] ?>" checked 
                                       style="accent-color: var(--accent-cyan);">
                                Garder
                            </label>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
            
            <div class="form-group">
                <label for="image_paths"><i class="bi bi-plus-circle"></i> Ajouter des Images (un chemin par ligne)</label>
                <textarea class="form-input" id="image_paths" name="image_paths" rows="3" 
                          placeholder="https://exemple.com/nouvelle-image.jpg&#10;assets/images/nouvelle-image.png"></textarea>
                <small style="color: var(--text-secondary); display: block; margin-top: 0.5rem;">
                    Entrez un chemin d'image par ligne pour ajouter de nouvelles images.
                </small>
            </div>
            
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button type="submit" class="btn-3d btn-3d-large">
                    <i class="bi bi-check-circle"></i> Mettre à Jour
                </button>
                <a href="dashboard.php" class="btn-3d btn-3d-outline btn-3d-large">
                    <i class="bi bi-x-circle"></i> Annuler
                </a>
            </div>
        </form>
    </div>
</section>

<?php include 'includes/footer.php'; ?>