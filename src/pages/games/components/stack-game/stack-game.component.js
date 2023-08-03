const THREE = require("three");

let camera, scene, renderer;
const originalBoxSize = 3;

function init(canvas) {
  scene = new THREE.Scene();

  // Foundation
  addLayer(0, 0, originalBoxSize, originalBoxSize);

  // Firstlayer
  addLayer(-10, 0, originalBoxSize, originalBoxSize, "x");

  // Set up lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 20, 0);
  scene.add(dirLight);

  // Camera
  const width = 10;
  const height = width * (canvas.offsetHeight / canvas.offsetWidth);
  camera = new THREE.OrthographicCamera(
    width / -2, // left
    width / 2, // right
    height / 2, // top
    height / -2, // bottom
    1, // near
    100 // far
  );
  camera.position.set(4, 4, 4);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.render(scene, camera);

  canvas.appendChild(renderer.domElement);
}

let stack = [];
const boxHeight = 1;
let gameStarted = false;

function addLayer(x, z, width, depth, direction) {
  const y = boxHeight * stack.length;
  
  const layer = generateBox(x, y, z, width, depth);
  layer.direction = direction;
  
  stack.push(layer);
}

function generateBox(x, y, z, width, depth) {
  const geometry = new THREE.BoxGeometry(width, boxHeight, depth);

  const color = new THREE.Color(`hsl(${30 + stack.length * 4}, 100%, 50%)`);
  const material = new THREE.MeshLambertMaterial({ color });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);

  scene.add(mesh);

  return {
    threejs: mesh,
    width,
    depth,
  };
}

function animation() {
  const speed = 0.15;

  const topLayer = stack[stack.length - 1];
  topLayer.threejs.position[topLayer.direction] += speed;

  if (camera.position.y < boxHeight * (stack.length - 2) + 4) {
    camera.position.y += speed;
  }

  renderer.render(scene, camera);
}

function onClick() {
  if (!gameStarted) {
    renderer.setAnimationLoop(animation);
    gameStarted = true;
  } else {
    const topLayer = stack[stack.length - 1];
    const direction = topLayer.direction;

    // Next layer
    const nextX = direction === 'x' ? 0 : -10;
    const nextZ = direction === 'z' ? 0 : -10;
    const newWidth = originalBoxSize;
    const newDepth = originalBoxSize;
    const nextDirection = direction === 'x' ? 'z' : 'x';

    addLayer(nextX, nextZ, newWidth, newDepth, nextDirection);
  }
}

module.exports = class {
  onMount() {
    const canvas = this.getEl("canvas");

    init(canvas);

    canvas.addEventListener('click', onClick);
  }
};
