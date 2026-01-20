<?php
session_start();

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: login.php');
    exit;
}

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // In a real application, use proper password hashing and secure credentials
    if ($username === 'admin' && $password === 'school123') {
        $_SESSION['loggedin'] = true;
        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Nom d\'utilisateur ou mot de passe invalide';
    }
}
?>

<?php 
$pageTitle = "Admin Login";
include 'includes/header.php'; 
?>

<h1 class="page-title">Admin Login</h1>
<p class="page-subtitle">Connectez-vous pour gérer votre portfolio</p>

<section class="contact-section">
    <div class="contact-form">
        <?php if ($error): ?>
            <div class="alert-3d error">
                <i class="bi bi-exclamation-triangle"></i>
                <?php echo $error; ?>
            </div>
        <?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label for="username"><i class="bi bi-person"></i> Nom d'utilisateur</label>
                <input type="text" class="form-input" id="username" name="username" required placeholder="Entrez votre nom d'utilisateur">
            </div>
            
            <div class="form-group">
                <label for="password"><i class="bi bi-lock"></i> Mot de passe</label>
                <input type="password" class="form-input" id="password" name="password" required placeholder="Entrez votre mot de passe">
            </div>
            
            <button type="submit" class="btn-3d btn-3d-large btn-3d-block">
                <i class="bi bi-box-arrow-in-right"></i> Se Connecter
            </button>
        </form>
        
        <div style="text-align: center; margin-top: 2rem;">
            <a href="../index.php" class="btn-3d btn-3d-outline">
                <i class="bi bi-arrow-left"></i> Retour au Site
            </a>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>