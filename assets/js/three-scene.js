/**
 * Three.js 3D Background Scene
 * Creates animated particles and geometric shapes
 */
(function() {
    'use strict';
    
    // Check if THREE is loaded
    function waitForThree(callback) {
        if (typeof THREE !== 'undefined') {
            callback();
        } else {
            setTimeout(function() { waitForThree(callback); }, 50);
        }
    }
    
    waitForThree(function() {
        var container = document.getElementById('bg-container');
        if (!container) return;
        
        var scene, camera, renderer;
        var particles, shapes = [];
        var mouseX = 0, mouseY = 0;
        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;
        
        init();
        animate();
        
        function init() {
            // Scene
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x0a0a1a, 0.0015);
            
            // Camera
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
            camera.position.z = 500;
            
            // Renderer
            try {
                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setClearColor(0x0a0a1a, 1);
                container.appendChild(renderer.domElement);
            } catch (e) {
                console.warn('WebGL not supported');
                return;
            }
            
            // Particles
            createParticles();
            
            // Geometric shapes
            createShapes();
            
            // Lighting
            var ambientLight = new THREE.AmbientLight(0x6b4fd9, 0.3);
            scene.add(ambientLight);
            
            var pointLight1 = new THREE.PointLight(0x9d4edd, 1.5, 800);
            pointLight1.position.set(200, 200, 200);
            scene.add(pointLight1);
            
            var pointLight2 = new THREE.PointLight(0x7b2cbf, 1.5, 800);
            pointLight2.position.set(-200, -200, 200);
            scene.add(pointLight2);
            
            // Events
            document.addEventListener('mousemove', onMouseMove);
            window.addEventListener('resize', onResize);
        }
        
        function createParticles() {
            var geometry = new THREE.BufferGeometry();
            var count = 800;
            var positions = new Float32Array(count * 3);
            var colors = new Float32Array(count * 3);
            
            var purpleShades = [
                new THREE.Color(0x9d4edd),
                new THREE.Color(0x7b2cbf),
                new THREE.Color(0x5a189a),
                new THREE.Color(0xc77dff)
            ];
            
            for (var i = 0; i < count * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * 2000;
                positions[i + 1] = (Math.random() - 0.5) * 2000;
                positions[i + 2] = (Math.random() - 0.5) * 2000;
                
                var color = purpleShades[Math.floor(Math.random() * purpleShades.length)];
                colors[i] = color.r;
                colors[i + 1] = color.g;
                colors[i + 2] = color.b;
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            var material = new THREE.PointsMaterial({
                size: 3,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });
            
            particles = new THREE.Points(geometry, material);
            scene.add(particles);
        }
        
        function createShapes() {
            var geometries = [
                new THREE.TetrahedronGeometry(20),
                new THREE.OctahedronGeometry(20),
                new THREE.IcosahedronGeometry(20),
                new THREE.DodecahedronGeometry(20)
            ];
            
            for (var i = 0; i < 8; i++) {
                var geo = geometries[Math.floor(Math.random() * geometries.length)];
                var mat = new THREE.MeshPhongMaterial({
                    color: Math.random() > 0.5 ? 0x9d4edd : 0x7b2cbf,
                    transparent: true,
                    opacity: 0.25,
                    wireframe: Math.random() > 0.5,
                    side: THREE.DoubleSide
                });
                
                var mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(
                    (Math.random() - 0.5) * 1000,
                    (Math.random() - 0.5) * 1000,
                    (Math.random() - 0.5) * 500
                );
                mesh.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    0
                );
                mesh.userData = {
                    rotateX: (Math.random() - 0.5) * 0.01,
                    rotateY: (Math.random() - 0.5) * 0.01
                };
                
                shapes.push(mesh);
                scene.add(mesh);
            }
        }
        
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate particles
            if (particles) {
                particles.rotation.y += 0.0003;
                particles.rotation.x += 0.0001;
            }
            
            // Rotate shapes
            for (var i = 0; i < shapes.length; i++) {
                shapes[i].rotation.x += shapes[i].userData.rotateX;
                shapes[i].rotation.y += shapes[i].userData.rotateY;
            }
            
            // Camera parallax
            camera.position.x += (mouseX - camera.position.x) * 0.02;
            camera.position.y += (-mouseY - camera.position.y) * 0.02;
            camera.lookAt(scene.position);
            
            renderer.render(scene, camera);
        }
        
        function onMouseMove(event) {
            mouseX = (event.clientX - windowHalfX) * 0.5;
            mouseY = (event.clientY - windowHalfY) * 0.5;
        }
        
        function onResize() {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    });
})();
