import * as THREE from 'three';
import '../style.css';
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
import json from '../../file.json' assert { type: 'json' };

let timestepsArr = [];
let length = Object.keys(json.model_number).length;

for (let i = 0; i < length; i++) {
  let starTimestep = {};
  starTimestep.center_h1 = json.center_h1[i];
  starTimestep.center_he3 = json.center_he3[i];
  starTimestep.center_he4 = json.center_he4[i];
  starTimestep.log_L = json.log_L[i];
  starTimestep.log_R = json.log_R[i];
  starTimestep.log_Teff = json.log_Teff[i];
  starTimestep.log_center_P = json.log_center_P[i];
  starTimestep.log_center_Rho = json.log_center_Rho[i];
  starTimestep.model_number = json.model_number[i];
  starTimestep.star_age = json.star_age[i];
  starTimestep.star_mass = json.star_mass[i];
  starTimestep.star_mdot = json.star_mdot[i];
  timestepsArr.push(starTimestep);
}
console.log(timestepsArr);

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
