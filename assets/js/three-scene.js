// Three.js 3D Background Scene
// Wait for THREE to be available before doing anything
(function waitForThree() {
    if (typeof THREE === 'undefined') {
        setTimeout(waitForThree, 100);
        return;
    }
    
    // THREE is now available, start initialization
    var scene, camera, renderer, particles;
    var geometricShapes = [];
    var mouseX = 0, mouseY = 0;
    var isInitialized = false;
    var animationId = null;

    function init() {
        if (isInitialized) return;

        var canvas = document.getElementById('three-canvas');
        if (!canvas) {
            console.warn('Canvas not found');
            return;
        }

        try {
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x1a0933, 0.002);

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 50;

            renderer = new THREE.WebGLRenderer({ 
                canvas: canvas,
                alpha: true,
                antialias: true,
                powerPreference: 'low-power'
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Lighting
            var ambientLight = new THREE.AmbientLight(0x6b4fd9, 0.5);
            scene.add(ambientLight);

            var pointLight1 = new THREE.PointLight(0x9d4edd, 2, 100);
            pointLight1.position.set(20, 20, 20);
            scene.add(pointLight1);

            var pointLight2 = new THREE.PointLight(0x7b2cbf, 2, 100);
            pointLight2.position.set(-20, -20, 20);
            scene.add(pointLight2);

            createParticles();
            createGeometricShapes();

            window.addEventListener('resize', onWindowResize);
            document.addEventListener('mousemove', onMouseMove);

            isInitialized = true;
            console.log('Three.js initialized successfully');
            animate();
        } catch (error) {
            console.error('Three.js init error:', error);
            if (canvas) canvas.style.display = 'none';
        }
    }

    function createParticles() {
        var particleCount = 500;
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(particleCount * 3);
        var colors = new Float32Array(particleCount * 3);

        var purpleColors = [
            new THREE.Color(0x9d4edd),
            new THREE.Color(0x7b2cbf),
            new THREE.Color(0x5a189a),
            new THREE.Color(0x3c096c)
        ];

        for (var i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 1] = (Math.random() - 0.5) * 200;
            positions[i + 2] = (Math.random() - 0.5) * 200;

            var color = purpleColors[Math.floor(Math.random() * purpleColors.length)];
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        var material = new THREE.PointsMaterial({
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
        var geometries = [
            new THREE.TetrahedronGeometry(2),
            new THREE.OctahedronGeometry(2),
            new THREE.IcosahedronGeometry(2)
        ];

        for (var i = 0; i < 6; i++) {
            var geometry = geometries[Math.floor(Math.random() * geometries.length)];
            var material = new THREE.MeshPhongMaterial({
                color: Math.random() > 0.5 ? 0x9d4edd : 0x7b2cbf,
                transparent: true,
                opacity: 0.3,
                wireframe: Math.random() > 0.5
            });

            var mesh = new THREE.Mesh(geometry, material);
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
        if (!isInitialized || !renderer) return;
        animationId = requestAnimationFrame(animate);

        if (particles) {
            particles.rotation.y += 0.0005;
            particles.rotation.x += 0.0002;
        }

        for (var i = 0; i < geometricShapes.length; i++) {
            geometricShapes[i].rotation.x += geometricShapes[i].userData.rotationSpeed.x;
            geometricShapes[i].rotation.y += geometricShapes[i].userData.rotationSpeed.y;
        }

        camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    }

    // Start when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
