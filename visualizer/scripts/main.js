import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from 'postprocessing';
import { getSunTexture } from './helpers';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  7,
  40
);

var bgTexture = new THREE.TextureLoader().load('/2k_stars.jpg');
bgTexture.minFilter = THREE.LinearFilter;
scene.setClearColor = new THREE.Color(0, 0, 0);
scene.background = bgTexture;

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = getSunTexture();
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const light = new THREE.PointLight('#ffffff', 1, 100);
light.position.set(0, 10, 10);
scene.add(light);

camera.position.z = 10;

// Render scene
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adds filter to image
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new EffectPass(camera, new BloomEffect()));

// Creating renderer to place labels and the legend
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none'; // Ignoring mouse events so orbit controls still work
document.body.appendChild(labelRenderer.domElement);

// Animate star
function animate() {
  requestAnimationFrame(animate);

  // Creating renderer to place labels and the legend
  composer.render();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  sphere.rotation.y += 0.002;
}

// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight);
// });

animate();

// Creating HTML element
const propertiesDiv = document.createElement('div');
propertiesDiv.style.border = '2px solid #fff';
propertiesDiv.style.width = '300px;';
propertiesDiv.style.padding = '20px';
propertiesDiv.innerHTML = `<ul style="list-style-type:none;color:#fff; padding:0; margin:0; line-height:1.5">
    <li>Age:</li>
    <li>Solar Mass:</li>
    <li>Luminosity:</li>
    <li>Radius:</li>
    <li>Effective Temp. (K):</li>
    <li>Density:</li>
    <li>Pressure:</li>
    <li>Fraction Hydrogen:</li>
  </ul>`;

console.log(propertiesDiv);
const propertiesBox = new CSS2DObject(propertiesDiv);
scene.add(propertiesBox);
propertiesBox.position.set(-6, 0.8, 4);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
