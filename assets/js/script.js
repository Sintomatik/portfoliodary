/**
 * Dark Purple 3D Portfolio - Main JavaScript
 * Features: Three.js 3D cards, background particles, and animations
 */

// ============================================
// THREE.JS 3D SCENE WITH CARD OBJECTS
// ============================================

class ThreeBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.geometries = [];
        this.card3DObjects = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.clock = null;
        this.raycaster = null;
        this.mouse = null;
        
        this.init();
    }
    
    init() {
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded');
            return;
        }
        
        let canvas = document.getElementById('three-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'three-canvas';
            document.body.prepend(canvas);
        }
        
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        this.createParticles();
        this.createFloatingGeometries();
        this.createAmbientLight();
        
        window.addEventListener('resize', () => this.onResize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        this.animate();
    }
    
    createParticles() {
        const particleCount = 800;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const colorPalette = [
            new THREE.Color(0x7b2cbf),
            new THREE.Color(0x9d4edd),
            new THREE.Color(0xc77dff),
            new THREE.Color(0x00d4ff),
        ];
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 120;
            positions[i3 + 1] = (Math.random() - 0.5) * 120;
            positions[i3 + 2] = (Math.random() - 0.5) * 60;
            
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            sizes[i] = Math.random() * 0.2 + 0.05;
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
            new THREE.DodecahedronGeometry(1, 0),
            new THREE.BoxGeometry(1, 1, 1),
        ];
        
        const colors = [0x7b2cbf, 0x9d4edd, 0xc77dff, 0x00d4ff];
        
        for (let i = 0; i < 20; i++) {
            const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
            const material = new THREE.MeshBasicMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                wireframe: true,
                transparent: true,
                opacity: 0.25
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.x = (Math.random() - 0.5) * 80;
            mesh.position.y = (Math.random() - 0.5) * 60;
            mesh.position.z = (Math.random() - 0.5) * 30 - 15;
            
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            const scale = Math.random() * 2.5 + 0.5;
            mesh.scale.set(scale, scale, scale);
            
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.008,
                    y: (Math.random() - 0.5) * 0.008,
                    z: (Math.random() - 0.5) * 0.008
                },
                floatSpeed: Math.random() * 0.4 + 0.3,
                floatOffset: Math.random() * Math.PI * 2,
                originalY: mesh.position.y
            };
            
            this.geometries.push(mesh);
            this.scene.add(mesh);
        }
    }
    
    createAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0x7b2cbf, 0.6);
        this.scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x00d4ff, 1.5, 150);
        pointLight1.position.set(20, 20, 20);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x9d4edd, 1.2, 150);
        pointLight2.position.set(-20, -20, 10);
        this.scene.add(pointLight2);
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onMouseMove(event) {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        this.mouse.x = this.mouseX;
        this.mouse.y = this.mouseY;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const elapsedTime = this.clock.getElapsedTime();
        
        if (this.particles) {
            this.particles.rotation.y = elapsedTime * 0.03;
            this.particles.rotation.x = this.mouseY * 0.08;
            
            // Wave effect on particles
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(elapsedTime + positions[i] * 0.1) * 0.002;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
        
        this.geometries.forEach((mesh) => {
            const { rotationSpeed, floatSpeed, floatOffset, originalY } = mesh.userData;
            
            mesh.rotation.x += rotationSpeed.x;
            mesh.rotation.y += rotationSpeed.y;
            mesh.rotation.z += rotationSpeed.z;
            
            mesh.position.y = originalY + Math.sin(elapsedTime * floatSpeed + floatOffset) * 2;
            mesh.position.x += Math.cos(elapsedTime * floatSpeed * 0.5 + floatOffset) * 0.01;
        });
        
        // Smooth camera follow
        this.camera.position.x += (this.mouseX * 3 - this.camera.position.x) * 0.015;
        this.camera.position.y += (this.mouseY * 3 - this.camera.position.y) * 0.015;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// ============================================
// 3D CARD ENHANCEMENTS - Interactive Depth Effects
// ============================================

class Card3DEnhancer {
    constructor() {
        this.cards = [];
        this.init();
    }
    
    init() {
        // Find all 3D target cards (excluding flip-cards which have their own transform)
        const cardElements = document.querySelectorAll('.card-3d-target:not(.flip-card)');
        const flipCards = document.querySelectorAll('.flip-card.card-3d-target');
        
        // Enhance non-flip cards with full 3D tilt
        cardElements.forEach((element, index) => {
            this.enhanceCard(element, index, false);
        });
        
        // Enhance flip cards with wrapper-based 3D
        flipCards.forEach((element, index) => {
            this.enhanceFlipCard(element, index);
        });
        
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }
    
    enhanceCard(element, index, isFlipCard) {
        // Add visual depth indicators
        const depthIndicator = document.createElement('div');
        depthIndicator.className = 'depth-indicator-3d';
        depthIndicator.innerHTML = `
            <div class="corner-glow corner-tl"></div>
            <div class="corner-glow corner-tr"></div>
            <div class="corner-glow corner-bl"></div>
            <div class="corner-glow corner-br"></div>
            <div class="edge-glow edge-top"></div>
            <div class="edge-glow edge-right"></div>
            <div class="edge-glow edge-bottom"></div>
            <div class="edge-glow edge-left"></div>
        `;
        element.style.position = 'relative';
        element.appendChild(depthIndicator);
        
        this.cards.push({
            element: element,
            depthIndicator: depthIndicator,
            index: index,
            isFlipCard: isFlipCard
        });
    }
    
    enhanceFlipCard(element, index) {
        // For flip cards, we wrap it to allow 3D tilt without breaking the flip
        const wrapper = document.createElement('div');
        wrapper.className = 'flip-card-3d-wrapper';
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
        
        // Add depth indicators to the wrapper
        const depthIndicator = document.createElement('div');
        depthIndicator.className = 'depth-indicator-3d';
        depthIndicator.innerHTML = `
            <div class="corner-glow corner-tl"></div>
            <div class="corner-glow corner-tr"></div>
            <div class="corner-glow corner-bl"></div>
            <div class="corner-glow corner-br"></div>
        `;
        wrapper.appendChild(depthIndicator);
        
        this.cards.push({
            element: wrapper,
            actualCard: element,
            depthIndicator: depthIndicator,
            index: index,
            isFlipCard: true
        });
    }
    
    onMouseMove(event) {
        this.cards.forEach(({ element, isFlipCard, actualCard }) => {
            const targetEl = isFlipCard ? element : element;
            const rect = targetEl.getBoundingClientRect();
            const isHovered = (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            );
            
            if (isHovered) {
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const rotateY = ((event.clientX - centerX) / rect.width) * 12;
                const rotateX = -((event.clientY - centerY) / rect.height) * 12;
                
                if (isFlipCard) {
                    // Apply to wrapper for flip cards
                    element.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                } else {
                    // Apply directly to element
                    element.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px) scale(1.02)`;
                }
                
                element.classList.add('is-hovered-3d');
            } else {
                element.style.transform = '';
                element.classList.remove('is-hovered-3d');
            }
        });
    }
}

// ============================================
// FLASHY NAME EFFECT
// ============================================

class FlashyNameEffect {
    constructor() {
        this.nameElement = document.querySelector('.flashy-name');
        this.particlesContainer = null;
        this.particles = [];
        
        if (this.nameElement) {
            this.init();
        }
    }
    
    init() {
        this.particlesContainer = this.nameElement.querySelector('.name-particles');
        if (!this.particlesContainer) return;
        
        // Create floating particles
        this.createParticles();
        
        // Add mouse interaction
        this.nameElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.nameElement.addEventListener('click', () => this.burst());
        
        // Start animation loop
        this.animate();
    }
    
    createParticles() {
        const symbols = ['✦', '✧', '★', '✴', '❋', '✺', '◆', '◇'];
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('span');
            particle.className = 'floating-particle';
            particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 1 + 0.5}rem;
                color: ${['var(--accent-cyan)', 'var(--accent-pink)', 'var(--accent-purple)', 'var(--accent-light)'][Math.floor(Math.random() * 4)]};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0;
                pointer-events: none;
                text-shadow: 0 0 10px currentColor;
                animation: floatParticle ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite;
            `;
            this.particlesContainer.appendChild(particle);
            this.particles.push({
                element: particle,
                x: Math.random() * 100,
                y: Math.random() * 100,
                speed: 0.2 + Math.random() * 0.3,
                angle: Math.random() * Math.PI * 2
            });
        }
        
        // Add CSS for particle animation
        if (!document.querySelector('#flashy-name-styles')) {
            const style = document.createElement('style');
            style.id = 'flashy-name-styles';
            style.textContent = `
                @keyframes floatParticle {
                    0%, 100% {
                        opacity: 0;
                        transform: translateY(0) rotate(0deg) scale(0.5);
                    }
                    20% {
                        opacity: 0.8;
                    }
                    50% {
                        opacity: 1;
                        transform: translateY(-20px) rotate(180deg) scale(1);
                    }
                    80% {
                        opacity: 0.8;
                    }
                }
                
                @keyframes burstParticle {
                    0% {
                        opacity: 1;
                        transform: translate(0, 0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(var(--tx), var(--ty)) scale(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    onMouseMove(e) {
        const rect = this.nameElement.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Create trail particle
        if (Math.random() > 0.7) {
            this.createTrailParticle(x, y);
        }
    }
    
    createTrailParticle(x, y) {
        const particle = document.createElement('span');
        particle.className = 'trail-particle';
        particle.textContent = ['✦', '✧', '★'][Math.floor(Math.random() * 3)];
        particle.style.cssText = `
            position: absolute;
            font-size: ${0.5 + Math.random() * 0.5}rem;
            color: var(--accent-cyan);
            left: ${x}%;
            top: ${y}%;
            pointer-events: none;
            text-shadow: 0 0 15px var(--accent-cyan), 0 0 30px var(--accent-pink);
            animation: trailFade 0.8s ease-out forwards;
        `;
        this.particlesContainer.appendChild(particle);
        
        setTimeout(() => particle.remove(), 800);
        
        // Add trail animation if not exists
        if (!document.querySelector('#trail-styles')) {
            const style = document.createElement('style');
            style.id = 'trail-styles';
            style.textContent = `
                @keyframes trailFade {
                    0% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0) translateY(-30px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    burst() {
        // Create burst effect on click
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('span');
            const angle = (i / 15) * Math.PI * 2;
            const distance = 80 + Math.random() * 60;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.className = 'burst-particle';
            particle.textContent = ['✦', '✧', '★', '✴', '❋'][Math.floor(Math.random() * 5)];
            particle.style.cssText = `
                position: absolute;
                font-size: ${0.8 + Math.random() * 0.8}rem;
                color: ${['var(--accent-cyan)', 'var(--accent-pink)', 'var(--accent-purple)'][Math.floor(Math.random() * 3)]};
                left: 50%;
                top: 50%;
                pointer-events: none;
                text-shadow: 0 0 20px currentColor;
                --tx: ${tx}px;
                --ty: ${ty}px;
                animation: burstParticle 0.8s ease-out forwards;
            `;
            this.particlesContainer.appendChild(particle);
            
            setTimeout(() => particle.remove(), 800);
        }
    }
    
    animate() {
        this.particles.forEach(p => {
            p.angle += 0.01;
            p.x += Math.cos(p.angle) * p.speed * 0.1;
            p.y += Math.sin(p.angle) * p.speed * 0.1;
            
            // Keep within bounds
            if (p.x < 0) p.x = 100;
            if (p.x > 100) p.x = 0;
            if (p.y < 0) p.y = 100;
            if (p.y > 100) p.y = 0;
            
            p.element.style.left = p.x + '%';
            p.element.style.top = p.y + '%';
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// FLOATING 3D DECORATIONS FOR SECTIONS
// ============================================

class Section3DDecorations {
    constructor() {
        this.decorations = new Map();
        this.init();
    }
    
    init() {
        if (typeof THREE === 'undefined') return;
        
        // Add 3D decorations to specific sections
        this.addDecorationsToSection('.hero-section', 'hero');
        this.addDecorationsToSection('.projects-grid', 'projects');
        this.addDecorationsToSection('.aspirations-grid', 'aspirations');
        this.addDecorationsToSection('.timeline-3d', 'timeline');
    }
    
    addDecorationsToSection(selector, type) {
        const section = document.querySelector(selector);
        if (!section) return;
        
        // Add decoration container
        const container = document.createElement('div');
        container.className = 'section-3d-decorations';
        container.innerHTML = `
            <div class="floating-3d-shape shape-1"></div>
            <div class="floating-3d-shape shape-2"></div>
            <div class="floating-3d-shape shape-3"></div>
            <div class="floating-3d-shape shape-4"></div>
        `;
        section.style.position = 'relative';
        section.appendChild(container);
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
    const threeBackground = new ThreeBackground();
    
    // Initialize 3D card enhancer (lightweight CSS-based 3D)
    setTimeout(() => {
        new Card3DEnhancer();
    }, 100);
    
    // Initialize flashy name effect
    new FlashyNameEffect();
    
    // Initialize section 3D decorations
    new Section3DDecorations();
    
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
    
    console.log('✨ Dark Purple 3D Portfolio with Real 3D Effects Initialized');
});
