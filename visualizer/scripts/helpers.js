import axios from 'axios';
import * as THREE from "three";

function getSunTexture() {
  const loader = new THREE.TextureLoader();
  const texture = loader.load("/2k_sun.jpg");

  const material = new THREE.MeshBasicMaterial({ map: texture });

  return material;
}

export { getSunTexture };