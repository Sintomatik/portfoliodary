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
    if (empty($name)) $errors[] = "Le nom est requis";
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Une adresse email valide est requise";
    if (empty($message)) $errors[] = "Le message est requis";
    
    if (empty($errors)) {
        // Send email (configure with your actual email)
        $to = "darymuch@outlook.com";
        $subject = "Nouveau message de $name";
        $body = "Nom: $name\nEmail: $email\n\nMessage:\n$message";
        $headers = "From: $email";
        
        if (mail($to, $subject, $body, $headers)) {
            $success = true;
        } else {
            $errors[] = "Échec de l'envoi du message. Veuillez réessayer plus tard.";
        }
    }
}
?>

<h1 class="page-title">Contact</h1>
<p class="page-subtitle">N'hésitez pas à me contacter</p>

<section class="contact-section">
    <div class="contact-form card-3d-target">
        <?php if (isset($success)): ?>
            <div class="alert-3d success">
                <i class="bi bi-check-circle"></i>
                Merci! Votre message a été envoyé avec succès.
            </div>
        <?php endif; ?>
        
        <?php if (!empty($errors)): ?>
            <div class="alert-3d error">
                <i class="bi bi-exclamation-triangle"></i>
                <ul style="margin: 0; padding-left: 1rem;">
                    <?php foreach ($errors as $error): ?>
                        <li><?= htmlspecialchars($error) ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label for="name"><i class="bi bi-person"></i> Nom et Prénom</label>
                <input type="text" class="form-input" id="name" name="name" required 
                       placeholder="Votre nom complet"
                       value="<?= htmlspecialchars($_POST['name'] ?? '') ?>">
            </div>
            
            <div class="form-group">
                <label for="email"><i class="bi bi-envelope"></i> Adresse E-Mail</label>
                <input type="email" class="form-input" id="email" name="email" required
                       placeholder="votre.email@exemple.com"
                       value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
            </div>
            
            <div class="form-group">
                <label for="message"><i class="bi bi-chat-text"></i> Votre Message</label>
                <textarea class="form-input" id="message" name="message" rows="5" required
                          placeholder="Écrivez votre message ici..."><?= htmlspecialchars($_POST['message'] ?? '') ?></textarea>
            </div>
            
            <button type="submit" class="btn-3d btn-3d-large btn-3d-block">
                <i class="bi bi-send"></i> Envoyer Message
            </button>
        </form>
    </div>
    
    <div style="text-align: center; margin-top: 3rem;">
        <h4 style="color: var(--accent-pink); margin-bottom: 1rem;">Autres Moyens de Contact</h4>
        <div class="social-links">
            <a href="#" class="social-link" title="LinkedIn">
                <i class="bi bi-linkedin"></i>
            </a>
            <a href="#" class="social-link" title="GitHub">
                <i class="bi bi-github"></i>
            </a>
            <a href="#" class="social-link" title="Twitter">
                <i class="bi bi-twitter-x"></i>
            </a>
            <a href="mailto:darymuch@outlook.com" class="social-link" title="Email">
                <i class="bi bi-envelope-fill"></i>
            </a>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>