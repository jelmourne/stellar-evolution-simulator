import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { getSunTexture } from "./helpers";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  7,
  40
);

var bgTexture = new THREE.TextureLoader().load("/2k_stars.jpg");
bgTexture.minFilter = THREE.LinearFilter;
scene.setClearColor = new THREE.Color(0, 0, 0);
scene.background = bgTexture;

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = getSunTexture();
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const light = new THREE.PointLight("#ffffff", 1, 100);
light.position.set(0, 10, 10);
scene.add(light);

camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  sphere.rotation.y += 0.002;
}

animate();

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
