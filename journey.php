<?php
$pageTitle = "My Journey";
include 'includes/header.php';
?>

<h1 class="page-title">Mon Parcours</h1>
<p class="page-subtitle">Le chemin m'ayant amené ici</p>

<div class="timeline-3d">
    <!-- Timeline Item 1 -->
    <div class="timeline-item-3d card-3d-target">
        <div class="timeline-badge-3d purple">
            <i class="bi bi-mortarboard"></i>
        </div>
        <div class="timeline-content-3d">
            <h4>Obtention du Bac</h4>
            <p class="timeline-date">2021</p>
            <p>Obtention du Bac Général avec Mention Assez Bien. Début de mon apprentissage de l'informatique via la filière NSI.</p>
        </div>
    </div>
    
    <!-- Timeline Item 2 -->
    <div class="timeline-item-3d card-3d-target">
        <div class="timeline-badge-3d cyan">
            <i class="bi bi-code-slash"></i>
        </div>
        <div class="timeline-content-3d">
            <h4>Début de mes études</h4>
            <p class="timeline-date">Septembre 2021</p>
            <p>Commencement avec une 1ère année de licence Sciences pour l'Ingénieur, puis conclusion que cela n'était pas ma voie.</p>
        </div>
    </div>
    
    <!-- Timeline Item 3 -->
    <div class="timeline-item-3d card-3d-target">
        <div class="timeline-badge-3d pink">
            <i class="bi bi-building"></i>
        </div>
        <div class="timeline-content-3d">
            <h4>Inscription en MMI</h4>
            <p class="timeline-date">Septembre 2022</p>
            <p>Arrivée en 1ère année de MMI, je me sentais bien plus à ma place. Obtention de la 1ère année après plusieurs mois de dur labeur.</p>
        </div>
    </div>
    
    <!-- Timeline Item 4 -->
    <div class="timeline-item-3d card-3d-target">
        <div class="timeline-badge-3d cyan">
            <i class="bi bi-briefcase"></i>
        </div>
        <div class="timeline-content-3d">
            <h4>Première embauche</h4>
            <p class="timeline-date">Juin 2024</p>
            <p>Deux mois en mi-temps dans une agence immobilière "Agence Salito" de Calvi. J'y fut assistant en graphisme pour les réseaux sociaux.</p>
        </div>
    </div>
    
    <!-- Timeline Item 5 -->
    <div class="timeline-item-3d card-3d-target">
        <div class="timeline-badge-3d purple">
            <i class="bi bi-trophy"></i>
        </div>
        <div class="timeline-content-3d">
            <h4>2ème année MMI</h4>
            <p class="timeline-date">Septembre 2024 - Juin 2025</p>
            <p>Réalisation de deux mois de stage au sein de la chaîne de télé locale "Télé Paese". Ma plus grande expérience professionnelle pour le moment.</p>
        </div>
    </div>
</div>

<div class="next-section">
    <h3>Et ensuite?</h3>
    <p>Obtention de mon DUT et réussite de ma 2ème, puis 3ème année!</p>
    <a href="aspirations.php" class="btn-3d btn-3d-large">
        <i class="bi bi-rocket-takeoff"></i> Voir Mes Aspirations
    </a>
</div>

<?php include 'includes/footer.php'; ?>