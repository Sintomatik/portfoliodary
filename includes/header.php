<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - <?php echo $pageTitle ?? 'Home'; ?></title>
    <link rel="stylesheet" href="<?php echo isset($basePath) ? $basePath : ''; ?>assets/css/style.css">
    <link rel="icon" type="image/x-icon" href="<?php echo isset($basePath) ? $basePath : ''; ?>favicon.ico">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Preload scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.min.js" defer></script>
    <script src="<?php echo isset($basePath) ? $basePath : ''; ?>assets/js/three-scene.js" defer></script>
    <script src="<?php echo isset($basePath) ? $basePath : ''; ?>assets/js/script.js" defer></script>
</head>
<body>
    <!-- Three.js Canvas for 3D Background -->
    <canvas id="three-canvas"></canvas>
    
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <a class="navbar-brand" href="<?php echo isset($basePath) ? $basePath : ''; ?>index.php">✦ Portfolio</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="<?php echo isset($basePath) ? $basePath : ''; ?>index.php">Accueil</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?php echo isset($basePath) ? $basePath : ''; ?>projects.php">Projets</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?php echo isset($basePath) ? $basePath : ''; ?>journey.php">Mon Parcours</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?php echo isset($basePath) ? $basePath : ''; ?>aspirations.php">Mes Aspirations</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?php echo isset($basePath) ? $basePath : ''; ?>contact.php">Contact</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?php echo isset($basePath) ? $basePath : ''; ?>admin/login.php">Admin</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container mt-4">