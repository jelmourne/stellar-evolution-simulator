import * as THREE from 'three';
import '../style.css';
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
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
let scene;
let camera;
let renderer;
const canvas = document.getElementsByTagName("canvas")[0];
scene = new THREE.Scene();
const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const loader = new THREE.TextureLoader();

//camera
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 8;
camera.position.x = 0;
scene.add(camera);

//default renderer
renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
renderer.setClearColor(0x000000, 0.0);

//bloom renderer
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 0.6; //intensity of glow
bloomPass.radius = 0;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

//sun object
const color = new THREE.Color("#FDB813");
const geometry = new THREE.IcosahedronGeometry(1, 15);
const material = new THREE.MeshBasicMaterial({
  map: loader.load("/2k_sun.jpg"),
  color: color,
});
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0, 0, 0);
sphere.layers.set(1);
scene.add(sphere);

// galaxy geometry
const starGeometry = new THREE.SphereGeometry(80, 64, 64);

// galaxy material
const starMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("/galaxy1.png"),
  side: THREE.BackSide,
  transparent: true,
});

// galaxy mesh
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
starMesh.layers.set(1);
scene.add(starMesh);

//ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientlight);

//resize listner
window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

//animation loop
const animate = () => {
  requestAnimationFrame(animate);
  starMesh.rotation.y += 0.0001;
  camera.layers.set(1);
  bloomComposer.render();
  // Orbit controls
};
const controls = new OrbitControls(camera, renderer.domElement);

animate();
