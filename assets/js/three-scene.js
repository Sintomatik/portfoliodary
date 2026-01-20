// Three.js 3D Background Scene
let scene, camera, renderer, particles, geometricShapes = [];
let mouseX = 0, mouseY = 0;

function initThreeScene() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a0933, 0.002);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('three-canvas'),
        alpha: true,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x6b4fd9, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x9d4edd, 2, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7b2cbf, 2, 100);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

    // Create particle system
    createParticles();

    // Create geometric shapes
    createGeometricShapes();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);

    // Start animation
    animate();
}

function createParticles() {
    const particleCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const purpleColors = [
        new THREE.Color(0x9d4edd),
        new THREE.Color(0x7b2cbf),
        new THREE.Color(0x5a189a),
        new THREE.Color(0x3c096c)
    ];

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 200;
        positions[i + 1] = (Math.random() - 0.5) * 200;
        positions[i + 2] = (Math.random() - 0.5) * 200;

        const color = purpleColors[Math.floor(Math.random() * purpleColors.length)];
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createGeometricShapes() {
    // Floating geometric shapes
    const geometries = [
        new THREE.TetrahedronGeometry(2),
        new THREE.OctahedronGeometry(2),
        new THREE.IcosahedronGeometry(2),
        new THREE.TorusGeometry(2, 0.5, 16, 100),
        new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16)
    ];

    for (let i = 0; i < 8; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshPhongMaterial({
            color: Math.random() > 0.5 ? 0x9d4edd : 0x7b2cbf,
            transparent: true,
            opacity: 0.3,
            wireframe: Math.random() > 0.5
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 100;
        mesh.position.y = (Math.random() - 0.5) * 100;
        mesh.position.z = (Math.random() - 0.5) * 100;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        mesh.userData.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02
        };

        geometricShapes.push(mesh);
        scene.add(mesh);
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate particles
    if (particles) {
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;
    }

    // Animate geometric shapes
    geometricShapes.forEach(shape => {
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
    });

    // Camera movement based on mouse
    camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeScene);
} else {
    initThreeScene();
}
