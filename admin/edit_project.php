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
include '../includes/header.php';
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
        $errors[] = 'Title is required';
    }
    
    if (empty($description)) {
        $errors[] = 'Description is required';
    }
    
    // Validate image paths
    // foreach ($image_paths as $path) {
    //     if (!empty($path) && !filter_var($path, FILTER_VALIDATE_URL) && !preg_match('/^\/[a-z0-9\/._-]+\.(jpg|jpeg|png|gif)$/i', $path)) {
    //         $errors[] = "Invalid image path: $path. Use full URLs or server paths starting with /";
    //         break;
    //     }
    // }
    
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
            $stmt = $pdo->prepare("SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order");
            $stmt->execute([$project['id']]);
            $existing_images = $stmt->fetchAll();
        } catch (Exception $e) {
            $pdo->rollBack();
            $errors[] = 'There was an error updating the project: ' . $e->getMessage();
        }
    }
}
?>

<div class="row justify-content-center">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header">
                <h4>Edit Project</h4>
            </div>
            <div class="card-body">
                <?php if ($success): ?>
                    <div class="alert alert-success">Project updated successfully!</div>
                <?php endif; ?>
                
                <?php if (!empty($errors)): ?>
                    <div class="alert alert-danger">
                        <ul>
                            <?php foreach ($errors as $error): ?>
                                <li><?php echo $error; ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>
                
                <form method="POST">
                    <div class="mb-3">
                        <label for="title" class="form-label">Project Title</label>
                        <input type="text" class="form-control" id="title" name="title" value="<?php echo htmlspecialchars($project['title']); ?>" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea class="form-control" id="description" name="description" rows="5" required><?php echo htmlspecialchars($project['description']); ?></textarea>
                    </div>
                    
                    <div class="mb-3">
                        <label for="category" class="form-label">Category</label>
                        <input type="text" class="form-control" id="category" name="category" value="<?php echo htmlspecialchars($project['category']); ?>">
                    </div>
                    
                    <div class="mb-3">
                        <label for="project_url" class="form-label">Project URL (optional)</label>
                        <input type="url" class="form-control" id="project_url" name="project_url" value="<?php echo htmlspecialchars($project['project_url']); ?>">
                    </div>
                    
                    <!-- Existing images -->
                    <div class="mb-3">
                        <label class="form-label">Current Images</label>
                        <div class="row g-2" id="existingImages">
                            <?php foreach ($existing_images as $image): ?>
                                <div class="col-md-3 col-6">
                                    <div class="card h-100">
                                        <img src="<?= $image['image_path'] ?>" class="card-img-top" style="height: 120px; object-fit: cover;"
                                             onerror="this.onerror=null;this.src='/portfolio/assets/images/image-placeholder.png';">
                                        <div class="card-body p-2">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" name="keep_images[]" value="<?= $image['id'] ?>" id="keep_image_<?= $image['id'] ?>" checked>
                                                <label class="form-check-label small" for="keep_image_<?= $image['id'] ?>">
                                                    Keep this image
                                                </label>
                                            </div>
                                            <small class="text-muted d-block text-truncate"><?= htmlspecialchars($image['image_path']) ?></small>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    
                    <!-- New image paths -->
                    <div class="mb-3">
                        <label for="image_paths" class="form-label">Add More Image Paths/URLs (one per line)</label>
                        <textarea class="form-control" id="image_paths" name="image_paths" rows="3" placeholder="https://example.com/new-image.jpg&#10;/assets/images/new-image.png"></textarea>
                        <small class="text-muted">
                            Enter one image path per line. Can be full URLs (https://...) or server paths (/path/to/image.jpg)
                        </small>
                        <div id="newImagePreviews" class="row g-2 mt-2"></div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Update Project</button>
                    <a href="dashboard.php" class="btn btn-secondary">Cancel</a>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
// Live preview for new image paths
document.getElementById('image_paths').addEventListener('input', function() {
    const previewContainer = document.getElementById('newImagePreviews');
    previewContainer.innerHTML = '';
    
    const paths = this.value.split('\n').filter(path => path.trim() !== '');
    
    paths.forEach((path, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-3 col-6';
        col.innerHTML = `
            <div class="card h-100">
                <img src="${path.trim()}" class="card-img-top" style="height: 120px; object-fit: cover;"
                     onerror="this.onerror=null;this.src='/portfolio/assets/images/image-placeholder.png';">
                <div class="card-body p-2">
                    <small class="text-muted d-block text-truncate">${path.trim()}</small>
                </div>
            </div>
        `;
        previewContainer.appendChild(col);
    });
});
</script>

<?php include '../includes/footer.php'; ?>