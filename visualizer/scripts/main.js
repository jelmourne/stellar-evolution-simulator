import * as THREE from "three";
import "../style.css";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import json from "../../file.json" assert { type: "json" };

const legend = document.getElementById("legend");

// playback
var interval;
var flag = false;
var i = 0;

function playEvolution() {
  interval = setInterval(() => {
    if (i >= timestepsArr.length) {
      clearInterval(interval);
    }
    slider.value = i;
    legend.children[0].innerHTML = "Age (yr): " + timestepsArr[i].star_age;
    legend.children[1].innerHTML =
      "Mass (M<sub>☉</sub>): " + timestepsArr[i].star_mass;
    legend.children[2].innerHTML =
      "Luminosity (log<sub>10</sub>L<sub>☉</sub>): " + timestepsArr[i].log_L;
    legend.children[3].innerHTML =
      "Radius (log<sub>10</sub>R<sub>☉</sub>): " + timestepsArr[i].log_R;
    legend.children[4].innerHTML =
      "Eff. Temp. (K) (log<sub>10</sub>T<sub>eff</sub>): " +
      timestepsArr[i].log_Teff;
    legend.children[5].innerHTML =
      "Density (g cm<sup>-3</sup>) (log<sub>10</sub>ρ<sub>c</sub>): " +
      timestepsArr[i].log_center_Rho;
    legend.children[6].innerHTML =
      "Pressure (dyn cm<sup>-2</sup>) (log<sub>10</sub>P<sub>c</sub>): " +
      timestepsArr[i].log_center_P;
    legend.children[7].innerHTML = "Model: " + timestepsArr[i].model_number;
    // legend.children[7].innerHTML =
    //   '<sup>1</sup>H Mass Fraction: ' + timestepsArr[i].center_h1;
    i++;
  }, 150);
}

const slider = document.getElementById("slider");
slider.addEventListener("change", () => {
  i = slider.value;
});

const playButton = document.getElementById("togglePlay");
document.getElementById("play").addEventListener("click", () => {
  if (!flag) {
    flag = true;
    playButton.classList.remove("fa-play");
    playButton.classList.add("fa-pause");
    playEvolution();
  } else {
    clearInterval(interval);
    flag = false;
    playButton.classList.remove("fa-pause");
    playButton.classList.add("fa-play");
  }
});

let scene;
let camera;
let renderer;
const canvas = document.getElementsByTagName("canvas")[0];
scene = new THREE.Scene();
const fov = 55;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const loader = new THREE.TextureLoader();
var color = "#FDB813";
const luminosity = document.getElementById("luminosity");
var options = {
  childList: true,
};

let observer = new MutationObserver(luminosityChange);

function luminosityChange() {
  let radius = document.getElementById("radius").innerHTML.slice(40);
  let luminosity = document.getElementById("luminosity").innerHTML.slice(44);
  let model = document.getElementById("model").innerHTML.slice(7);

  if (model > 1200 && model < 10000) {
    bloomPass.strength = luminosity / 4;
  } else {
    bloomPass.strength = luminosity / 2;
  }
  camera.position.z = 9 / radius;

  if (model > 13400) {
    camera.position.z = 15;
    material.color = new THREE.Color("#739aff");
    bloomPass.strength = 2;
  }
}

observer.observe(luminosity, options);

//camera
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 9; // modifies size of sun
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

// bloom renderer
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 0; // change luminosity
bloomPass.radius = 0;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

//sun object
const colorElem = new THREE.Color(color); // change color based on tempurature
const geometry = new THREE.IcosahedronGeometry(1, 15);
const material = new THREE.MeshBasicMaterial({
  map: loader.load("/2k_sun.jpg"),
  color: colorElem,
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

let timestepsArr = [];
let length = Object.keys(json.model_number).length;

for (let i = 0; i < length; i += 100) {
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
console.log(timestepsArr.length);
