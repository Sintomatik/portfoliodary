<?php
$pageTitle = "Contact Me";
include 'includes/header.php';

// Form handling
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');
    $errors = [];
    
    // Validation
    if (empty($name)) $errors[] = "Name is required";
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required";
    if (empty($message)) $errors[] = "Message is required";
    
    if (empty($errors)) {
        // Send email (configure with your actual email)
        $to = "darymuch@outlook.com";
        $subject = "Nouveau message de $name";
        $body = "Nom: $name\nEmail: $email\n\nMessage:\n$message";
        $headers = "De: $email";
        
        if (mail($to, $subject, $body, $headers)) {
            $success = true;
        } else {
            $errors[] = "Failed to send message. Please try again later.";
        }
    }
}
?>

<div class="row justify-content-center">
    <div class="col-md-8">
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h2 class="mb-0">Me Contacter</h2>
            </div>
            <div class="card-body">
                <?php if (isset($success)): ?>
                    <div class="alert alert-success">Merci! Votre message a été transféré avec succès.</div>
                <?php endif; ?>
                
                <?php if (!empty($errors)): ?>
                    <div class="alert alert-danger">
                        <ul class="mb-0">
                            <?php foreach ($errors as $error): ?>
                                <li><?= htmlspecialchars($error) ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>
                
                <form method="POST" class="needs-validation" novalidate>
                    <div class="mb-3">
                        <label for="name" class="form-label">Nom et Prénom</label>
                        <input type="text" class="form-control" id="name" name="name" required 
                               value="<?= htmlspecialchars($_POST['name'] ?? '') ?>">
                    </div>
                    
                    <div class="mb-3">
                        <label for="email" class="form-label">Adresse E-Mail</label>
                        <input type="email" class="form-control" id="email" name="email" required
                               value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
                    </div>
                    
                    <div class="mb-3">
                        <label for="message" class="form-label">Votre Message</label>
                        <textarea class="form-control" id="message" name="message" rows="5" required><?= 
                            htmlspecialchars($_POST['message'] ?? '') 
                        ?></textarea>
                    </div>
                    
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary btn-lg">Envoyer Message</button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="mt-4 text-center">
            <h4>Autres Moyens de Contact</h4>
            <div class="d-flex justify-content-center gap-3 mt-3">
                <a href="#" class="btn btn-outline-primary">
                    <i class="bi bi-linkedin"></i> LinkedIn
                </a>
                <a href="#" class="btn btn-outline-dark">
                    <i class="bi bi-github"></i> GitHub
                </a>
            </div>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>