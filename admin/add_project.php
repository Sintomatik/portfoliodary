<?php
session_start();

if (!isset($_SESSION['loggedin'])) {
    header('Location: login.php');
    exit;
}

$pageTitle = "Add New Project";
include '../includes/header.php';
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
            $title = $description = $category = $project_url = $image_paths = '';
        } catch (Exception $e) {
            $pdo->rollBack();
            $errors[] = 'There was an error saving the project: ' . $e->getMessage();
        }
    }
}
?>

<div class="row justify-content-center">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header">
                <h4>Add New Project</h4>
            </div>
            <div class="card-body">
                <?php if ($success): ?>
                    <div class="alert alert-success">Project added successfully!</div>
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
                        <input type="text" class="form-control" id="title" name="title" value="<?php echo htmlspecialchars($title ?? ''); ?>" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea class="form-control" id="description" name="description" rows="5" required><?php echo htmlspecialchars($description ?? ''); ?></textarea>
                    </div>
                    
                    <div class="mb-3">
                        <label for="category" class="form-label">Category</label>
                        <input type="text" class="form-control" id="category" name="category" value="<?php echo htmlspecialchars($category ?? ''); ?>">
                    </div>
                    
                    <div class="mb-3">
                        <label for="project_url" class="form-label">Project URL (optional)</label>
                        <input type="url" class="form-control" id="project_url" name="project_url" value="<?php echo htmlspecialchars($project_url ?? ''); ?>">
                    </div>
                    
                    <!-- Image paths input -->
                    <div class="mb-3">
                        <label for="image_paths" class="form-label">Image Paths/URLs (one per line)</label>
                        <textarea class="form-control" id="image_paths" name="image_paths" rows="3" placeholder="https://example.com/image1.jpg&#10;/assets/images/project1.png&#10;https://i.imgur.com/abc123.jpg"><?php 
                            if (!empty($image_paths)) {
                                echo htmlspecialchars(implode("\n", $image_paths));
                            }
                        ?></textarea>
                        <small class="text-muted">
                            Enter one image path per line. Can be full URLs (https://...) or server paths (/path/to/image.jpg)
                        </small>
                        <div id="imagePreviews" class="row g-2 mt-2"></div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Add Project</button>
                    <a href="dashboard.php" class="btn btn-secondary">Cancel</a>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
// Live preview for image paths
document.getElementById('image_paths').addEventListener('input', function() {
    const previewContainer = document.getElementById('imagePreviews');
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