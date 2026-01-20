<?php
$pageTitle = "My Journey";
include 'includes/header.php';
?>

<div class="container py-5">
    <div class="text-center mb-5">
        <h1 class="display-4">Mon Parcours</h1>
        <p class="lead text-muted">Le chemin m'ayant ammené ici</p>
    </div>
    
    <div class="timeline">
        <!-- Timeline Item 1 -->
        <div class="timeline-item">
            <div class="timeline-badge bg-primary">
                <i class="bi bi-book"></i>
            </div>
            <div class="timeline-panel shadow-sm">
                <div class="timeline-heading">
                    <h4>Obtention du Bac</h4>
                    <p class="text-muted"><small>2021</small></p>
                </div>
                <div class="timeline-body">
                    <p>Obtention du Bac Général avec Mention Assez Bien. Début de mon apprentissage de l'informatique via la filière NSI.</p>
                </div>
            </div>
        </div>
        
        <!-- Timeline Item 2 -->
        <div class="timeline-item timeline-item-right">
            <div class="timeline-badge bg-success">
                <i class="bi bi-code-slash"></i>
            </div>
            <div class="timeline-panel shadow-sm">
                <div class="timeline-heading">
                    <h4>Début de mes études</h4>
                    <p class="text-muted"><small>Septembre 2021</small></p>
                </div>
                <div class="timeline-body">
                    <p>Commencement avec une 1ère année de license Sciences pour l'Ingénieur, puis conclusion que cela n'était pas ma voie.</p>
                </div>
            </div>
        </div>
        
        <!-- Timeline Item 3 -->
        <div class="timeline-item">
            <div class="timeline-badge bg-info">
                <i class="bi bi-building"></i>
            </div>
            <div class="timeline-panel shadow-sm">
                <div class="timeline-heading">
                    <h4>Inscription en MMI</h4>
                    <p class="text-muted"><small>Septembre 2022</small></p>
                </div>
                <div class="timeline-body">
                    <p>Arrivée en 1ère année de MMI, je me sentais bien plus à ma place. Obtention de la 1ère année après plusieurs mois de dur labeur.</p>
                </div>
            </div>
        </div>
        
        <!-- Timeline Item 4 -->
        <div class="timeline-item timeline-item-right">
            <div class="timeline-badge bg-warning">
                <i class="bi bi-briefcase"></i>
            </div>
            <div class="timeline-panel shadow-sm">
                <div class="timeline-heading">
                    <h4>Première embauche</h4>
                    <p class="text-muted"><small>Juin 2024</small></p>
                </div>
                <div class="timeline-body">
                    <p>Deux mois en mi-temps dans une agence immobilière "Agence Salito" de Calvi. J'y fut assistant en graphisme pour les réseaux sociaux.</p>
                </div>
            </div>
        </div>
        
        <!-- Timeline Item 5 -->
        <div class="timeline-item">
            <div class="timeline-badge bg-danger">
                <i class="bi bi-trophy"></i>
            </div>
            <div class="timeline-panel shadow-sm">
                <div class="timeline-heading">
                    <h4>2ème année MMI</h4>
                    <p class="text-muted"><small>Septembre 2024 - Juin 2025</small></p>
                </div>
                <div class="timeline-body">
                    <p>Réalisation de deux mois de stage au sein de la chaîne de télé locale "Télé Paese". Ma plus grande expérience professionnelle pour le moment.</p>
                </div>
            </div>
        </div>
    </div>
    
    <div class="text-center mt-5">
        <h3>Et ensuite?</h3>
        <p class="lead">Obtention de mon DUT et réussite de ma 2ème, puis 3ème année!</p>
        <a href="aspirations.php" class="btn btn-primary btn-lg mt-3">Voir Mes Aspirations</a>
    </div>
</div>

<style>
    /* Timeline Styles */
    .timeline {
        position: relative;
        padding: 20px 0;
    }
    
    .timeline::before {
        content: '';
        position: absolute;
        left: 50%;
        width: 2px;
        height: 100%;
        background: #dee2e6;
    }
    
    .timeline-item {
        position: relative;
        margin-bottom: 30px;
        width: 50%;
        clear: both;
    }
    
    .timeline-item-right {
        float: right;
    }
    
    .timeline-badge {
        position: absolute;
        top: 20px;
        left: 50%;
        width: 50px;
        height: 50px;
        margin-left: -25px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: white;
        z-index: 1;
    }
    
    .timeline-panel {
        position: relative;
        width: 95%;
        padding: 20px;
        background: white;
        border-radius: 8px;
    }
    
    .timeline-item:nth-child(even) .timeline-panel {
        margin-left: auto;
    }
    
    .skills-learned .badge {
        margin-right: 5px;
    }
    
    @media (max-width: 768px) {
        .timeline::before {
            left: 25px;
        }
        
        .timeline-item,
        .timeline-item-right {
            width: 100%;
            padding-left: 70px;
            float: none;
        }
        
        .timeline-badge {
            left: 25px;
        }
    }
</style>

<?php include 'includes/footer.php'; ?>