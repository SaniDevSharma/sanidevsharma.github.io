import * as THREE from 'three';

const canvasContainer = document.getElementById('canvas-container');

// Scene Setup
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasContainer.appendChild(renderer.domElement);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;

const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

// Using Primary (Blue) and Secondary (Purple) colors
const color1 = new THREE.Color(0x0ea5e9);
const color2 = new THREE.Color(0xd946ef);

for (let i = 0; i < particlesCount * 3; i += 3) {
    // Spread particles - wider spread
    posArray[i] = (Math.random() - 0.5) * 80;
    posArray[i + 1] = (Math.random() - 0.5) * 80;
    posArray[i + 2] = (Math.random() - 0.5) * 80;

    // Mix colors
    const mixedColor = Math.random() > 0.5 ? color1 : color2;
    colorsArray[i] = mixedColor.r;
    colorsArray[i + 1] = mixedColor.g;
    colorsArray[i + 2] = mixedColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true, // Enable vertex colors
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

// Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Floating Shapes for Depth
function createFloatingShape(size, color, opacity, x, y, z) {
    const geometry = new THREE.IcosahedronGeometry(size, 0);
    const material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: opacity
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    return mesh;
}

const shape1 = createFloatingShape(10, 0x0ea5e9, 0.03, 10, 5, 0);
const shape2 = createFloatingShape(15, 0xd946ef, 0.02, -10, -5, -5);
// Adding a third distant shape
const shape3 = createFloatingShape(8, 0x10b981, 0.02, 0, 15, -10);

scene.add(shape1);
scene.add(shape2);
scene.add(shape3);


// Mouse Interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
});

// Scroll Interaction
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate Space - slightly faster with scroll
    particlesMesh.rotation.y = elapsedTime * 0.03 + (scrollY * 0.0002);
    particlesMesh.rotation.x = -mouseY * 0.00005 + (scrollY * 0.0001);

    // Initial gentle movement
    particlesMesh.rotation.y += mouseX * 0.00005;

    // Rotate Spheres
    shape1.rotation.x = elapsedTime * 0.1;
    shape1.rotation.y = elapsedTime * 0.1;

    shape2.rotation.x = -elapsedTime * 0.05;
    shape2.rotation.y = -elapsedTime * 0.05;

    shape3.rotation.z = elapsedTime * 0.08;

    // Camera minimal movement for "breathing" effect
    camera.position.y = Math.sin(elapsedTime * 0.5) * 0.5;
    camera.position.x = Math.cos(elapsedTime * 0.3) * 0.2;

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
