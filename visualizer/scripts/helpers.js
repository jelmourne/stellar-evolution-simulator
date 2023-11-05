import axios from 'axios';

import * as THREE from 'three';
import json from '../../file.json' assert { type: 'json' };
function getSunTexture() {
  const loader = new THREE.TextureLoader();
  const texture = loader.load('/2k_sun.jpg');

  const material = new THREE.MeshBasicMaterial({
    map: texture,

    // adjust color of sun based on temp
    color: '#ffffff',
  });
  return material;
}

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
export { getSunTexture };
