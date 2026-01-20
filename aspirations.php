<?php
$pageTitle = "My Aspirations";
include 'includes/header.php';
?>

<h1 class="page-title">Mes Aspirations</h1>
<p class="page-subtitle">Où me vois-je dans le futur?</p>

<div class="aspirations-grid">
    <!-- Career Goals -->
    <div class="aspiration-card">
        <div class="card-header-3d career">
            <span class="icon"><i class="bi bi-briefcase-fill"></i></span>
            <h3>Objectifs de Carrière</h3>
        </div>
        <div class="card-body-3d">
            <ul class="aspiration-list">
                <li>
                    <span class="check-icon"><i class="bi bi-check-circle-fill"></i></span>
                    Travailler dans l'informatique ou l'électronique après l'obtention de mon BUT
                </li>
                <li>
                    <span class="check-icon"><i class="bi bi-check-circle-fill"></i></span>
                    Faire un lien avec une ou plusieurs entreprises étrangères
                </li>
                <li>
                    <span class="check-icon"><i class="bi bi-check-circle-fill"></i></span>
                    Contribuer à la modernisation de la Corse
                </li>
                <li>
                    <span class="check-icon"><i class="bi bi-check-circle-fill"></i></span>
                    Faire partie d'une équipe professionnelle et dynamique
                </li>
            </ul>
        </div>
    </div>
    
    <!-- Education Goals -->
    <div class="aspiration-card">
        <div class="card-header-3d education">
            <span class="icon"><i class="bi bi-mortarboard-fill"></i></span>
            <h3>Objectifs Scolaires</h3>
        </div>
        <div class="card-body-3d">
            <ul class="aspiration-list">
                <li>
                    <span class="check-icon"><i class="bi bi-book-fill"></i></span>
                    Obtenir mon DUT, puis mon BUT MMI
                </li>
                <li>
                    <span class="check-icon"><i class="bi bi-book-fill"></i></span>
                    Obtenir des compétences en Intelligence Artificielle
                </li>
                <li>
                    <span class="check-icon"><i class="bi bi-book-fill"></i></span>
                    Possiblement réaliser un Master en Développement Full-Stack
                </li>
            </ul>
        </div>
    </div>
    
    <!-- Personal Growth -->
    <div class="aspiration-card">
        <div class="card-header-3d personal">
            <span class="icon"><i class="bi bi-heart-fill"></i></span>
            <h3>Objectifs Personnels</h3>
        </div>
        <div class="card-body-3d">
            <ul class="aspiration-list">
                <li>
                    <span class="check-icon"><i class="bi bi-globe2"></i></span>
                    Voyager au moins une fois tous les ans
                </li>
                <li>
                    <span class="check-icon"><i class="bi bi-people-fill"></i></span>
                    Créer de nouveaux liens sociaux
                </li>
                <li>
                    <span class="check-icon"><i class="bi bi-yin-yang"></i></span>
                    Trouver un bon équilibre travail-vie
                </li>
            </ul>
        </div>
    </div>
</div>

<div class="center-buttons">
    <a href="contact.php" class="btn-3d btn-3d-large btn-3d-cyan">
        <i class="bi bi-envelope"></i> Me Contacter
    </a>
</div>

<?php include 'includes/footer.php'; ?>