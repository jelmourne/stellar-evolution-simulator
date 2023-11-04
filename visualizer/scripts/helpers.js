import axios from "axios";
import * as THREE from "three";
import * as fs from "fs";
import * as d3 from "d3";

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

function playEvolution() {
  fs.readFile("../../data.csv", "utf8", (error, data) => {
    const newData = d3.csvParse(data);
    var i = 0;
    const interval = setInterval(() => {
      if (!(i <= newData.length - 100)) {
        clearInterval(interval);
      }
      return newData[i];
      i += 100;
    }, 200);
  });
}

export { getSunTexture, playEvolution };
