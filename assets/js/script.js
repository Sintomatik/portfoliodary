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
// 3D CARD RENDERER - Real Three.js 3D Objects
// ============================================

class Card3DRenderer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cards = [];
        this.raycaster = null;
        this.mouse = new THREE.Vector2();
        this.clock = null;
        this.hoveredCard = null;
        
        this.init();
    }
    
    init() {
        if (typeof THREE === 'undefined') return;
        
        // Create overlay canvas for 3D cards
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'cards-3d-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        document.body.appendChild(this.canvas);
        
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 10);
        this.scene.add(directionalLight);
        
        const purpleLight = new THREE.PointLight(0x7b2cbf, 2, 100);
        purpleLight.position.set(-10, 10, 20);
        this.scene.add(purpleLight);
        
        const cyanLight = new THREE.PointLight(0x00d4ff, 2, 100);
        cyanLight.position.set(10, -10, 20);
        this.scene.add(cyanLight);
        
        this.createCard3DObjects();
        
        window.addEventListener('resize', () => this.onResize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('scroll', () => this.updateCardPositions());
        
        this.animate();
    }
    
    createCard3DObjects() {
        // Find all card elements to create 3D representations
        const cardElements = document.querySelectorAll('.card-3d-target');
        
        cardElements.forEach((el, index) => {
            const card3D = this.createSingle3DCard(el, index);
            if (card3D) {
                this.cards.push(card3D);
                this.scene.add(card3D.group);
            }
        });
    }
    
    createSingle3DCard(element, index) {
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return null;
        
        const group = new THREE.Group();
        
        // Scale factor to convert pixels to 3D units
        const scale = 0.02;
        const width = rect.width * scale;
        const height = rect.height * scale;
        const depth = 0.3;
        
        // Main card body - rounded box effect with multiple layers
        const cardGeometry = new THREE.BoxGeometry(width, height, depth, 2, 2, 2);
        
        // Front face material with gradient-like effect
        const cardMaterial = new THREE.MeshPhongMaterial({
            color: 0x1a0a2e,
            transparent: true,
            opacity: 0.85,
            shininess: 100,
            specular: 0x7b2cbf
        });
        
        const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
        group.add(cardMesh);
        
        // Glowing edge frame
        const edgesGeometry = new THREE.EdgesGeometry(cardGeometry);
        const edgesMaterial = new THREE.LineBasicMaterial({ 
            color: 0x7b2cbf,
            transparent: true,
            opacity: 0.8
        });
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        group.add(edges);
        
        // Corner accent spheres
        const cornerPositions = [
            [-width/2, height/2, depth/2],
            [width/2, height/2, depth/2],
            [-width/2, -height/2, depth/2],
            [width/2, -height/2, depth/2]
        ];
        
        cornerPositions.forEach(pos => {
            const sphereGeom = new THREE.SphereGeometry(0.08, 8, 8);
            const sphereMat = new THREE.MeshBasicMaterial({ 
                color: 0x00d4ff,
                transparent: true,
                opacity: 0.9
            });
            const sphere = new THREE.Mesh(sphereGeom, sphereMat);
            sphere.position.set(pos[0], pos[1], pos[2]);
            group.add(sphere);
        });
        
        // Floating rings around card
        const ringGeometry = new THREE.TorusGeometry(Math.max(width, height) * 0.6, 0.02, 8, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x9d4edd,
            transparent: true,
            opacity: 0.3
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.z = -0.5;
        group.add(ring);
        
        // Store reference data
        group.userData = {
            element: element,
            originalPosition: new THREE.Vector3(),
            targetRotation: new THREE.Euler(0, 0, 0),
            currentRotation: new THREE.Euler(0, 0, 0),
            isHovered: false,
            index: index,
            floatOffset: Math.random() * Math.PI * 2,
            ring: ring
        };
        
        return { group, element, edges, ring };
    }
    
    updateCardPositions() {
        this.cards.forEach(({ group, element }) => {
            const rect = element.getBoundingClientRect();
            
            // Convert screen coordinates to 3D world coordinates
            const x = (rect.left + rect.width / 2 - window.innerWidth / 2) * 0.02;
            const y = -(rect.top + rect.height / 2 - window.innerHeight / 2) * 0.02;
            
            group.userData.originalPosition.set(x, y, 0);
            group.position.x = x;
            group.position.y = y;
        });
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.updateCardPositions();
    }
    
    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Check which card is hovered based on DOM element
        this.cards.forEach(({ group, element }) => {
            const rect = element.getBoundingClientRect();
            const isHovered = (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            );
            
            group.userData.isHovered = isHovered;
            
            if (isHovered) {
                // Calculate rotation based on mouse position within card
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const rotY = ((event.clientX - centerX) / rect.width) * 0.4;
                const rotX = -((event.clientY - centerY) / rect.height) * 0.4;
                
                group.userData.targetRotation.set(rotX, rotY, 0);
            } else {
                group.userData.targetRotation.set(0, 0, 0);
            }
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const elapsedTime = this.clock.getElapsedTime();
        
        this.cards.forEach(({ group, edges, ring }) => {
            const userData = group.userData;
            
            // Smooth rotation interpolation
            group.rotation.x += (userData.targetRotation.x - group.rotation.x) * 0.1;
            group.rotation.y += (userData.targetRotation.y - group.rotation.y) * 0.1;
            
            // Floating animation
            const floatY = Math.sin(elapsedTime * 0.8 + userData.floatOffset) * 0.1;
            group.position.z = userData.isHovered ? 2 : floatY;
            
            // Scale on hover
            const targetScale = userData.isHovered ? 1.05 : 1;
            group.scale.x += (targetScale - group.scale.x) * 0.1;
            group.scale.y += (targetScale - group.scale.y) * 0.1;
            group.scale.z += (targetScale - group.scale.z) * 0.1;
            
            // Animate ring
            if (ring) {
                ring.rotation.z = elapsedTime * 0.2 + userData.floatOffset;
                ring.material.opacity = userData.isHovered ? 0.6 : 0.3;
            }
            
            // Edge glow on hover
            if (edges) {
                edges.material.color.setHex(userData.isHovered ? 0x00d4ff : 0x7b2cbf);
                edges.material.opacity = userData.isHovered ? 1 : 0.6;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
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
    const threeBackground = new ThreeBackground();
    
    // Initialize 3D card renderer for cards with the target class
    setTimeout(() => {
        const card3DRenderer = new Card3DRenderer();
        // Update positions after initial render
        setTimeout(() => card3DRenderer.updateCardPositions(), 100);
    }, 300);
    
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
    
    console.log('✨ Dark Purple 3D Portfolio with Real 3D Objects Initialized');
});
