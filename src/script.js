import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
let matcapTexture = textureLoader.load('/textures/matcaps/7.png'); // Default matcap

// Create a material that uses the initial matcap texture
const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

/**
 * GUI for Matcap Texture
 */
const matcaps = [ 1, 2, 3, 4, 5, 6, 7, 8];
const matcapControl = { matcap: 7 }; // Default to matcap 7

gui.add(matcapControl, 'matcap', matcaps).name('Matcap').onChange((value) => {
    // Load the new texture when a new matcap is selected
    matcapTexture = textureLoader.load(`/textures/matcaps/${value}.png`, () => {
        // Once the texture is loaded, update materials
        textMaterial.matcap = matcapTexture;
        donutMaterial.matcap = matcapTexture;
        textMaterial.needsUpdate = true;
        donutMaterial.needsUpdate = true;
    });
});

/**
 * Fonts
 */
const fontLoader = new FontLoader(); // Use THREE.FontLoader from the core library

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Houcine Taki', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
    });

    textGeometry.center(); // Center the text geometry

    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);
});

/**
 * Donuts
 */
const geometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(geometry, donutMaterial);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    scene.add(donut);
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
