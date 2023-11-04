import * as THREE from "three";

function getSunTexture() {
  const loader = new THREE.TextureLoader();
  const texture = loader.load("/2k_sun.jpg");

  const material = new THREE.MeshBasicMaterial({
    alphaMap: texture,

    // adjust color of sun based on temp
    color: "#FFA500",
  });

  //adjust for sun stage
  material.alphaTest = 0.5;

  return material;
}

export { getSunTexture };
