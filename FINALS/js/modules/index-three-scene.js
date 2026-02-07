/*
  Three.js Scene Setup Module
  Handles 3D tooth visualization with mouse interaction and sparkle effects
 */

import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

export function initThreeScene() {
    const container = document.getElementById('threeJsContainer');

    if (!container) {
        console.warn('Container element with id "threeJsContainer" not found');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    
    // Ambient light (soft general light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 4);
    scene.add(ambientLight);

    // Directional light (sunlight effect)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Mouse interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    // Mouse move handler
    const onMouseMove = (event) => {
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
    };

    document.addEventListener('mousemove', onMouseMove);

    // Handle window resize
    const onWindowResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', onWindowResize);

    // Create group for objects
    const group = new THREE.Group();
    scene.add(group);

    // Load 3D Model 
    loadToothModel(group);

    // Add sparkle particles
    addSparkles(group);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Smooth motion
        group.position.y = Math.sin(Date.now() * 0.0015) * 0.2;

        // Smooth rotation based on mouse position
        targetRotationY = mouseX * 0.5;
        targetRotationX = mouseY * 0.2;
        
        // Rotate the entire group
        group.rotation.y += 0.05 * (targetRotationY - group.rotation.y);
        group.rotation.x += 0.05 * (targetRotationX - group.rotation.x);
        group.rotation.y += 0.005; 

        // Rotate particles
        const particles = group.children.find((child) => child instanceof THREE.Points);
        if (particles) {
            particles.rotation.y += 0.002;
            particles.rotation.x -= 0.001;
        }

        renderer.render(scene, camera);
    }

    animate();
    // Adjust camera position
    camera.position.z = 5; 
}


function loadToothModel(group) {
    const loader = new GLTFLoader();

    loader.load('assets/models/3d.glb', (gltf) => {
        const model = gltf.scene;

        // Scale the model 
        model.scale.set(3, 3, 3); 

        // Center the model
        new THREE.Box3().setFromObject(model).getCenter(model.position).multiplyScalar(-1);

        group.add(model);
        console.log('Model loaded successfully!');

    }, undefined, (error) => {
        console.error('An error occurred loading the GLB model:', error);
    });
}

/*
  Add sparkle particle effects to the scene
 */
function addSparkles(group) {
    const particleCount = 40;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    // Generate random particle positions
    for (let i = 0; i < particleCount * 3; i++) {
        particlePositions[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00a9c0,
        size: 0.15,
        transparent: true,
        opacity: 0.8,
    });

    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    group.add(particles);
}