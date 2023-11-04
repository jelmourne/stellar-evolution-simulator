import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const geometry = new THREE.SphereGeometry();
const material = new THREE.MeshBasicMaterial({ color: "#ff00ff" });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.01;

  renderer.render(scene, camera);
}

animate();
