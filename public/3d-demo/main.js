import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// Setup Scene, Camera, Renderer
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#e0e0e0');
// Soft fog to blend with background
scene.fog = new THREE.Fog('#e0e0e0', 10, 50);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(4, 2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI / 2 + 0.05; // allow slightly below ground
controls.target.set(0, 0.5, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 5, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 25;
dirLight.shadow.bias = -0.001;
scene.add(dirLight);

// Ground plane for shadows
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: '#e0e0e0',
    depthWrite: false
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// Grid Helper
const grid = new THREE.GridHelper(100, 40, 0x000000, 0x000000);
grid.material.opacity = 0.1;
grid.material.transparent = true;
scene.add(grid);

// Environment Map (HDR)
new RGBELoader()
    .setPath('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/equirectangular/')
    .load('royal_esplanade_1k.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
    });

// State
let carModel = null;
let bodyMaterials = [];
let currentColor = '#ff0000';

// Loading Indicator
const loadingEl = document.createElement('div');
loadingEl.className = 'loading';
loadingEl.textContent = 'Loading Model...';
document.body.appendChild(loadingEl);

// Load Model Function
function loadCarModel(url) {
    loadingEl.style.display = 'block';
    
    if (carModel) {
        scene.remove(carModel);
        carModel.traverse((child) => {
            if (child.isMesh) {
                child.geometry.dispose();
                if (child.material.isMaterial) {
                    child.material.dispose();
                } else if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                }
            }
        });
        carModel = null;
        bodyMaterials = [];
    }

    const loader = new GLTFLoader();
    loader.load(url, function (gltf) {
        carModel = gltf.scene;
        
        // Find body materials
        carModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                const mat = child.material;
                if (mat) {
                    const name = mat.name ? mat.name.toLowerCase() : '';
                    if (name.includes('body') || name.includes('paint') || name.includes('carpaint') || name.includes('color')) {
                        
                        const newMat = new THREE.MeshStandardMaterial({
                            color: new THREE.Color(currentColor),
                            roughness: 0.1,
                            metalness: 0.5
                        });
                        child.material = newMat;
                        bodyMaterials.push(newMat);
                        
                    }
                }
            }
        });

        // Fallback: If no material matched specific names, grab the mesh with the largest surface area (assumed to be car body)
        if (bodyMaterials.length === 0) {
            let largestMesh = null;
            let maxArea = 0;
            carModel.traverse((child) => {
                if (child.isMesh) {
                    const name = child.material?.name?.toLowerCase() || '';
                    if (!name.includes('glass') && !name.includes('window') && !name.includes('tire') && !name.includes('wheel') && !name.includes('light')) {
                        child.geometry.computeBoundingBox();
                        if (child.geometry.boundingBox) {
                            const size = new THREE.Vector3();
                            child.geometry.boundingBox.getSize(size);
                            const area = size.x * size.y * size.z;
                            if (area > maxArea) {
                                maxArea = area;
                                largestMesh = child;
                            }
                        }
                    }
                }
            });
            if (largestMesh) {
                const newMat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(currentColor),
                    roughness: 0.1,
                    metalness: 0.5
                });
                largestMesh.material = newMat;
                bodyMaterials.push(newMat);
            }
        }

        // Auto center and scale model
        const box = new THREE.Box3().setFromObject(carModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim; // Normalize scale
        carModel.scale.set(scale, scale, scale);
        
        carModel.position.x = -center.x * scale;
        carModel.position.y = -box.min.y * scale; 
        carModel.position.z = -center.z * scale;

        scene.add(carModel);
        loadingEl.style.display = 'none';
        updateCarColor(currentColor);

    }, undefined, function (error) {
        console.error('Error loading model', error);
        loadingEl.style.display = 'none';
    });
}

function updateCarColor(colorHex) {
    currentColor = colorHex;
    bodyMaterials.forEach(mat => {
        mat.color.set(colorHex);
    });
}

// UI Listeners
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const color = e.target.getAttribute('data-color');
        updateCarColor(color);
    });
});

document.getElementById('model-select').addEventListener('change', (e) => {
    loadCarModel(e.target.value);
});

// Load default
loadCarModel(document.getElementById('model-select').value);
document.querySelector('.color-btn[data-color="#ff0000"]').classList.add('active');

// Window Resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
