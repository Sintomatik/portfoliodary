<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Admin - <?php echo $pageTitle ?? 'Dashboard'; ?></title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="../assets/images/favicon.ico">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    
    <!-- Main Stylesheet -->
    <link rel="stylesheet" href="../assets/css/style.css">
    
    <!-- Three.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    
    <style>
        body {
            font-family: 'Rajdhani', 'Segoe UI', sans-serif;
        }
        .page-title, .hero-title, .navbar-3d .brand {
            font-family: 'Orbitron', sans-serif;
        }
    </style>
</head>
<body>
    <!-- Page Loader -->
    <div class="page-loader">
        <div class="loader-spinner"></div>
    </div>

    <!-- Three.js Canvas -->
    <canvas id="three-canvas"></canvas>

    <!-- Main Wrapper -->
    <div class="main-wrapper">
        <!-- Navigation -->
        <nav class="navbar-3d">
            <div class="nav-container">
                <a href="../index.php" class="brand">Portfolio Admin</a>
                
                <button class="menu-toggle" aria-label="Toggle navigation">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                
                <ul class="nav-links">
                    <li><a href="dashboard.php"><i class="bi bi-speedometer2"></i> Dashboard</a></li>
                    <li><a href="add_project.php"><i class="bi bi-plus-circle"></i> Ajouter Projet</a></li>
                    <li><a href="../projects.php"><i class="bi bi-collection"></i> Voir Projets</a></li>
                    <li><a href="../index.php"><i class="bi bi-house-door"></i> Site Principal</a></li>
                    <li><a href="login.php?logout=1"><i class="bi bi-box-arrow-right"></i> Déconnexion</a></li>
                </ul>
            </div>
        </nav>

        <!-- Main Content Container -->
        <main class="content-container">
