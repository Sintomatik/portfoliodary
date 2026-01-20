/**
 * Dark Purple 3D Portfolio - Main JavaScript
 * Features: Three.js background, flip cards, carousels, and animations
 */

// ============================================
// THREE.JS 3D BACKGROUND
// ============================================

class ThreeBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.geometries = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.clock = null;
        
        this.init();
    }
    
    init() {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded');
            return;
        }
        
        // Get or create canvas
        let canvas = document.getElementById('three-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'three-canvas';
            document.body.prepend(canvas);
        }
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create elements
        this.createParticles();
        this.createFloatingGeometries();
        this.createAmbientLight();
        
        // Events
        window.addEventListener('resize', () => this.onResize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Start animation
        this.animate();
    }
    
    createParticles() {
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const colorPalette = [
            new THREE.Color(0x7b2cbf), // Purple
            new THREE.Color(0x9d4edd), // Light purple
            new THREE.Color(0xc77dff), // Pink
            new THREE.Color(0x00d4ff), // Cyan
        ];
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;
            
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createFloatingGeometries() {
        const geometryTypes = [
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.OctahedronGeometry(1, 0),
            new THREE.TetrahedronGeometry(1, 0),
            new THREE.TorusGeometry(0.7, 0.3, 8, 16),
            new THREE.DodecahedronGeometry(1, 0)
        ];
        
        const colors = [0x7b2cbf, 0x9d4edd, 0xc77dff, 0x00d4ff];
        
        for (let i = 0; i < 15; i++) {
            const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
            const material = new THREE.MeshBasicMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.x = (Math.random() - 0.5) * 60;
            mesh.position.y = (Math.random() - 0.5) * 40;
            mesh.position.z = (Math.random() - 0.5) * 20 - 10;
            
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            const scale = Math.random() * 2 + 0.5;
            mesh.scale.set(scale, scale, scale);
            
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                },
                floatSpeed: Math.random() * 0.5 + 0.5,
                floatOffset: Math.random() * Math.PI * 2
            };
            
            this.geometries.push(mesh);
            this.scene.add(mesh);
        }
    }
    
    createAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0x7b2cbf, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onMouseMove(event) {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const elapsedTime = this.clock.getElapsedTime();
        
        // Rotate particles
        if (this.particles) {
            this.particles.rotation.y = elapsedTime * 0.05;
            this.particles.rotation.x = this.mouseY * 0.1;
        }
        
        // Animate geometries
        this.geometries.forEach((mesh, index) => {
            const { rotationSpeed, floatSpeed, floatOffset } = mesh.userData;
            
            mesh.rotation.x += rotationSpeed.x;
            mesh.rotation.y += rotationSpeed.y;
            mesh.rotation.z += rotationSpeed.z;
            
            mesh.position.y += Math.sin(elapsedTime * floatSpeed + floatOffset) * 0.01;
        });
        
        // Camera follow mouse
        this.camera.position.x += (this.mouseX * 2 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouseY * 2 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// ============================================
// FLIP CARD CAROUSEL
// ============================================

class FlipCardCarousel {
    constructor(cardElement) {
        this.card = cardElement;
        this.inner = cardElement.querySelector('.flip-card-inner');
        this.images = cardElement.querySelectorAll('.carousel-images img');
        this.imagesContainer = cardElement.querySelector('.carousel-images');
        this.dots = cardElement.querySelectorAll('.carousel-dots .dot');
        this.prevBtn = cardElement.querySelector('.carousel-nav.prev');
        this.nextBtn = cardElement.querySelector('.carousel-nav.next');
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prev();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.next();
            });
        }
        
        // Dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                this.goTo(index);
            });
        });
        
        // Flip on click (not on nav elements)
        this.card.addEventListener('click', (e) => {
            if (!e.target.closest('.carousel-nav') && !e.target.closest('.carousel-dots') && !e.target.closest('.btn-3d')) {
                this.flip();
            }
        });
        
        // Start autoplay
        this.startAutoPlay();
        
        // Pause on hover
        this.card.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.card.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    goTo(index) {
        this.currentIndex = index;
        if (this.imagesContainer) {
            this.imagesContainer.style.transform = `translateX(-${index * 100}%)`;
        }
        this.updateDots();
    }
    
    next() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.goTo(nextIndex);
    }
    
    prev() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.goTo(prevIndex);
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    flip() {
        this.card.classList.toggle('flipped');
    }
    
    startAutoPlay() {
        if (this.images.length > 1) {
            this.autoPlayInterval = setInterval(() => this.next(), 4000);
        }
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ============================================
// PROJECT DETAIL CAROUSEL
// ============================================

class ProjectCarousel {
    constructor(container) {
        this.container = container;
        this.mainImage = container.querySelector('.main-image');
        this.thumbnails = container.querySelectorAll('.thumbnail-strip img');
        this.prevBtn = container.querySelector('.carousel-nav.prev');
        this.nextBtn = container.querySelector('.carousel-nav.next');
        this.images = Array.from(this.thumbnails).map(thumb => thumb.src);
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        // Thumbnail clicks
        this.thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.goTo(index));
        });
        
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        this.updateThumbnails();
    }
    
    goTo(index) {
        this.currentIndex = index;
        if (this.mainImage && this.images[index]) {
            this.mainImage.src = this.images[index];
        }
        this.updateThumbnails();
    }
    
    next() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.goTo(nextIndex);
    }
    
    prev() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.goTo(prevIndex);
    }
    
    updateThumbnails() {
        this.thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });
    }
}

// ============================================
// MOBILE NAVIGATION
// ============================================

class MobileNav {
    constructor() {
        this.toggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        
        if (this.toggle && this.navLinks) {
            this.init();
        }
    }
    
    init() {
        this.toggle.addEventListener('click', () => {
            this.navLinks.classList.toggle('active');
            this.toggle.classList.toggle('active');
        });
        
        // Close menu on link click
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.navLinks.classList.remove('active');
                this.toggle.classList.remove('active');
            });
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar-3d')) {
                this.navLinks.classList.remove('active');
                this.toggle.classList.remove('active');
            }
        });
    }
}

// ============================================
// PAGE LOADER
// ============================================

class PageLoader {
    constructor() {
        this.loader = document.querySelector('.page-loader');
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (this.loader) {
                    this.loader.classList.add('hidden');
                }
            }, 500);
        });
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.timeline-item-3d, .aspiration-card, .glass-card');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// ============================================
// FORM VALIDATION
// ============================================

class FormValidation {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.validateForm(e, form));
        });
    }
    
    validateForm(e, form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            this.clearError(field);
            
            if (!field.value.trim()) {
                this.showError(field, 'Ce champ est requis');
                isValid = false;
            } else if (field.type === 'email' && !this.isValidEmail(field.value)) {
                this.showError(field, 'Adresse email invalide');
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
        }
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    showError(field, message) {
        field.style.borderColor = '#ff5252';
        field.style.boxShadow = '0 0 10px rgba(255, 82, 82, 0.3)';
        
        const error = document.createElement('span');
        error.className = 'field-error';
        error.textContent = message;
        error.style.color = '#ff5252';
        error.style.fontSize = '0.85rem';
        error.style.marginTop = '0.3rem';
        error.style.display = 'block';
        
        field.parentNode.appendChild(error);
    }
    
    clearError(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const error = field.parentNode.querySelector('.field-error');
        if (error) {
            error.remove();
        }
    }
}

// ============================================
// ACTIVE NAV LINK
// ============================================

function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href.replace('..', '').replace('.php', ''))) {
            link.classList.add('active');
        }
    });
}

// ============================================
// DELETE CONFIRMATION
// ============================================

function initDeleteConfirmation() {
    document.querySelectorAll('.delete-btn, [data-confirm]').forEach(button => {
        button.addEventListener('click', function(e) {
            const message = this.dataset.confirm || 'Êtes-vous sûr de vouloir supprimer ce projet?';
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js background
    new ThreeBackground();
    
    // Initialize page loader
    new PageLoader();
    
    // Initialize mobile navigation
    new MobileNav();
    
    // Initialize flip card carousels
    document.querySelectorAll('.flip-card').forEach(card => {
        new FlipCardCarousel(card);
    });
    
    // Initialize project detail carousel
    const projectCarouselContainer = document.querySelector('.project-carousel-container');
    if (projectCarouselContainer) {
        new ProjectCarousel(projectCarouselContainer);
    }
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize form validation
    new FormValidation();
    
    // Set active nav link
    setActiveNavLink();
    
    // Initialize delete confirmation
    initDeleteConfirmation();
    
    console.log('✨ Dark Purple 3D Portfolio Initialized');
});
