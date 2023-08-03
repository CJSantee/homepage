const THREE = require("three");

let camera, scene, renderer;
function init(canvas) {
  scene = new THREE.Scene();

  // Set up lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 20, 0);
  scene.add(dirLight);

  // Add Cube
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );


  // Camera
  camera = new THREE.PerspectiveCamera( 75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000 );
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.render(scene, camera);

  canvas.appendChild(renderer.domElement);
}

function onResize(canvas) {
  console.log('resize');
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;

  renderer.setSize(width, height);
  camera.aspect = width/height;
  camera.updateProjectionMatrix;
}

module.exports = class {
  onMount() {
    const canvas = this.getEl("canvas");

    init(canvas);

    window.addEventListener('resize', () => onResize(canvas));
  }
};
