import axios from "axios";
import * as THREE from "three";

function getSunTexture() {
  const loader = new THREE.TextureLoader();
  const texture = loader.load("/2k_sun.jpg");

  const material = new THREE.MeshBasicMaterial({
    map: texture,

    // adjust color of sun based on temp
    color: "#0030ff",
  });
  return material;
}

export { getSunTexture };
