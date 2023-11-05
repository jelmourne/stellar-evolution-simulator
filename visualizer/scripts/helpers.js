import axios from "axios";

import * as THREE from "three";

function getSunTexture() {
  const loader = new THREE.TextureLoader();
  const texture = loader.load("/2k_sun.jpg");
  return texture;
}

function getData() {}

export { getSunTexture, getData };
