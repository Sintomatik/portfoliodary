document.addEventListener('DOMContentLoaded', function() {
    // Simple confirmation for delete actions
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to delete this project?')) {
                e.preventDefault();
            }
        });
    });
    
    // Form validation example
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });

    // 3D Flip Card Interactions
    initFlipCards();
});

function initFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card-container');
    
    flipCards.forEach(container => {
        const card = container.querySelector('.flip-card');
        const flipBtn = container.querySelectorAll('.flip-btn');
        
        if (!card) return;
        
        // Add click handler to flip buttons
        flipBtn.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card click
                toggleFlipCard(card);
            });
        });
        
        // Optional: Click on card to flip (excluding carousel controls)
        card.addEventListener('click', function(e) {
            // Don't flip if clicking carousel controls
            if (e.target.closest('.carousel-control-prev') || 
                e.target.closest('.carousel-control-next') ||
                e.target.closest('.carousel-indicators') ||
                e.target.closest('.flip-btn')) {
                return;
            }
            
            // Only flip if clicking on the card info section or back face
            if (e.target.closest('.card-info') || 
                e.target.closest('.flip-card-back')) {
                toggleFlipCard(card);
            }
        });
    });
}

function toggleFlipCard(card) {
    card.classList.toggle('flipped');
    
    // Add subtle shake animation
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = '';
    }, 10);
}

// Carousel image preloading for smooth transitions
function preloadCarouselImages() {
    const carousels = document.querySelectorAll('.card-carousel');
    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('img');
        images.forEach(img => {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        });
    });
}

// Call preload on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCarouselImages);
} else {
    preloadCarouselImages();
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add entrance animations for cards
function addEntranceAnimations() {
    const cards = document.querySelectorAll('.flip-card-container, .card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// Initialize entrance animations
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addEntranceAnimations);
} else {
    addEntranceAnimations();
}
