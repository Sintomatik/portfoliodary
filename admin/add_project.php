<?php
session_start();

if (!isset($_SESSION['loggedin'])) {
    header('Location: login.php');
    exit;
}

$pageTitle = "Add New Project";
include 'includes/header.php';
include '../includes/db.php';

$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $project_url = trim($_POST['project_url'] ?? '');
    $image_paths = array_filter(array_map('trim', explode("\n", $_POST['image_paths'] ?? '')));
    
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
            // Insert project
            $stmt = $pdo->prepare("INSERT INTO projects (title, description, project_url, category) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $description, $project_url, $category]);
            $project_id = $pdo->lastInsertId();
            
            // Insert image paths
            foreach ($image_paths as $sort_order => $path) {
                if (!empty($path)) {
                    $stmt = $pdo->prepare("INSERT INTO project_images (project_id, image_path, sort_order) VALUES (?, ?, ?)");
                    $stmt->execute([$project_id, $path, $sort_order]);
                }
            }
            
            $pdo->commit();
            $success = true;
            // Reset form fields
            $title = $description = $category = $project_url = '';
            $image_paths = [];
        } catch (Exception $e) {
            $pdo->rollBack();
            $errors[] = 'Erreur lors de l\'enregistrement: ' . $e->getMessage();
        }
    }
}
?>

<h1 class="page-title">Ajouter Projet</h1>
<p class="page-subtitle">Créez un nouveau projet pour votre portfolio</p>

<section class="contact-section">
    <div class="contact-form" style="max-width: 800px;">
        <?php if ($success): ?>
            <div class="alert-3d success">
                <i class="bi bi-check-circle"></i>
                Projet ajouté avec succès!
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
                       value="<?php echo htmlspecialchars($title ?? ''); ?>" required
                       placeholder="Entrez le titre du projet">
            </div>
            
            <div class="form-group">
                <label for="description"><i class="bi bi-text-paragraph"></i> Description</label>
                <textarea class="form-input" id="description" name="description" rows="5" required
                          placeholder="Décrivez votre projet..."><?php echo htmlspecialchars($description ?? ''); ?></textarea>
            </div>
            
            <div class="form-group">
                <label for="category"><i class="bi bi-tag"></i> Catégorie</label>
                <input type="text" class="form-input" id="category" name="category" 
                       value="<?php echo htmlspecialchars($category ?? ''); ?>"
                       placeholder="Ex: Web, Design, Vidéo...">
            </div>
            
            <div class="form-group">
                <label for="project_url"><i class="bi bi-link-45deg"></i> URL du Projet (optionnel)</label>
                <input type="url" class="form-input" id="project_url" name="project_url" 
                       value="<?php echo htmlspecialchars($project_url ?? ''); ?>"
                       placeholder="https://exemple.com/projet">
            </div>
            
            <div class="form-group">
                <label for="image_paths"><i class="bi bi-images"></i> Chemins des Images (un par ligne)</label>
                <textarea class="form-input" id="image_paths" name="image_paths" rows="3" 
                          placeholder="https://exemple.com/image1.jpg&#10;assets/images/projet1.png"><?php 
                    if (!empty($image_paths)) {
                        echo htmlspecialchars(implode("\n", $image_paths));
                    }
                ?></textarea>
                <small style="color: var(--text-secondary); display: block; margin-top: 0.5rem;">
                    Entrez un chemin d'image par ligne. URLs complètes ou chemins relatifs.
                </small>
            </div>
            
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button type="submit" class="btn-3d btn-3d-large">
                    <i class="bi bi-plus-circle"></i> Ajouter Projet
                </button>
                <a href="dashboard.php" class="btn-3d btn-3d-outline btn-3d-large">
                    <i class="bi bi-x-circle"></i> Annuler
                </a>
            </div>
        </form>
    </div>
</section>

<?php include 'includes/footer.php'; ?>