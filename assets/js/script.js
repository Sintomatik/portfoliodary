/**
 * Portfolio Main Script
 * Handles flip cards, form validation, and interactions
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize flip cards
    initFlipCards();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize delete confirmations
    initDeleteConfirmations();
});

/**
 * Initialize 3D Flip Cards
 */
function initFlipCards() {
    var flipCards = document.querySelectorAll('.flip-card-wrapper');
    
    flipCards.forEach(function(wrapper) {
        var card = wrapper.querySelector('.flip-card');
        var flipBtns = wrapper.querySelectorAll('.flip-btn');
        
        if (!card) return;
        
        // Flip button click handlers
        flipBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                card.classList.toggle('flipped');
            });
        });
        
        // Prevent carousel controls from triggering flip
        var carouselControls = wrapper.querySelectorAll('.carousel-control-prev, .carousel-control-next, .carousel-indicators button');
        carouselControls.forEach(function(control) {
            control.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    });
}

/**
 * Initialize Form Validation
 */
function initFormValidation() {
    var forms = document.querySelectorAll('form');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            var requiredFields = form.querySelectorAll('[required]');
            var isValid = true;
            
            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Veuillez remplir tous les champs requis.');
            }
        });
    });
}

/**
 * Initialize Delete Confirmations
 */
function initDeleteConfirmations() {
    var deleteButtons = document.querySelectorAll('.delete-btn, [data-confirm]');
    
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            var message = button.dataset.confirm || 'Êtes-vous sûr de vouloir supprimer cet élément?';
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        
        var target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
