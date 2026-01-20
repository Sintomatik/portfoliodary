<?php
$pageTitle = "My Aspirations";
include 'includes/header.php';
?>

<div class="container py-5">
    <div class="text-center mb-5">
        <h1 class="display-4">Mes Aspirations</h1>
        <p class="lead text-muted">Où me vois-je dans le futur?</p>
    </div>
    
    <div class="row g-4">
        <!-- Career Goals -->
        <div class="col-md-6">
            <div class="card h-100 shadow-sm">
                <div class="card-header bg-success text-white">
                    <h3><i class="bi bi-briefcase-fill me-2"></i>Objectifs de Carrière</h3>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            Travailler dans l'informatique ou l'électronique après l'obtention de mon BUT
                        </li>
                        <li class="list-group-item">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            Faire un lien avec une ou plusieurs entreprises étrangères
                        </li>
                        <li class="list-group-item">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            Contribuer à la modernisation de la Corse
                        </li>
                        <li class="list-group-item">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            Faire partie d'une équipe professionnelle et dynamique
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Education Goals -->
        <div class="col-md-6">
            <div class="card h-100 shadow-sm">
                <div class="card-header bg-info text-white">
                    <h3><i class="bi bi-mortarboard-fill me-2"></i>Objectifs Scolaires</h3>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <i class="bi bi-book-fill text-info me-2"></i>
                            Obtenir mon DUT, puis mon BUT MMI
                        </li>
                        <li class="list-group-item">
                            <i class="bi bi-book-fill text-info me-2"></i>
                            Obtenir des compétences en Intelligence Artificielle
                        </li>
                        <li class="list-group-item">
                            <i class="bi bi-book-fill text-info me-2"></i>
                            Possiblement réaliser un Master en Développement Full-Stack
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Personal Growth -->
        <div class="col-12 mt-4">
            <div class="card shadow-sm">
                <div class="card-header bg-warning text-dark">
                    <h3><i class="bi bi-heart-fill me-2"></i>Objectifs Personnels</h3>
                </div>
                <div class="card-body">
                        <div class="col-md-6">
                            <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><i class="bi bi-book-fill text-info me-2"></i>Voyager au moins une fois tous les ans</li>
                                <li class="list-group-item"><i class="bi bi-book-fill text-info me-2"></i>Créer de nouveaux liens sociaux</li>
                                <li class="list-group-item"><i class="bi bi-book-fill text-info me-2"></i>Trouver un bon équilibre travail-vie</li>
                            </ul>
                        </div>
                    </div>
                </div>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>