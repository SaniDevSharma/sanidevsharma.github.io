import * as THREE from 'three';

const canvasContainer = document.getElementById('canvas-container');

// Scene Setup
const scene = new THREE.Scene();
// No fog for now, keeping it clean dark

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
canvasContainer.appendChild(renderer.domElement);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;

const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // Spread particles
    posArray[i] = (Math.random() - 0.5) * 60; 
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x3b82f6, // Primary blue color
    transparent: true,
    opacity: 0.8,
});

// Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Connecting Lines (Optional beauty) - Creating a separate geometry for lines would be heavy without instantiation.
// Instead, adding some floating geometric shapes for depth.

const geometry = new THREE.IcosahedronGeometry(10, 0);
const material = new THREE.MeshBasicMaterial({ 
    color: 0x3b82f6, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.05 
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const geometry2 = new THREE.IcosahedronGeometry(15, 0);
const material2 = new THREE.MeshBasicMaterial({ 
    color: 0x10b981, // Secondary color
    wireframe: true, 
    transparent: true, 
    opacity: 0.03 
});
const sphere2 = new THREE.Mesh(geometry2, material2);
scene.add(sphere2);


// Mouse Interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate Space
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = -mouseY * 0.0001;
    particlesMesh.rotation.y += mouseX * 0.0001;

    // Rotate Spheres
    sphere.rotation.x = elapsedTime * 0.1;
    sphere.rotation.y = elapsedTime * 0.1;

    sphere2.rotation.x = -elapsedTime * 0.05;
    sphere2.rotation.y = -elapsedTime * 0.05;

    // Camera minimal movement for "breathing" effect
    camera.position.y = Math.sin(elapsedTime * 0.5) * 0.2;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
