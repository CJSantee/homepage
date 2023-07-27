const THREE = require('three');

const originalBoxSize = 3;

module.exports = class {
  onCreate() {
    this.elm = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.setState({
      boxHeight: 1,
      stack: [],
    });
  }

  onMount() {
    this.elm = this.getEl('canvas');
    this.scene = new THREE.Scene();

    // Foundation 
    this.addLayer(0, 0, originalBoxSize, originalBoxSize);

    // Firstlayer
    this.addLayer(-10, 0, originalBoxSize, originalBoxSize, "x");

    // Set up lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 20, 0);
    this.scene.add(dirLight);

    // Camera
    const width = 10;
    const height = width * (this.el.offsetHeight / this.el.offsetWidth);
    this.camera = new THREE.OrthographicCamera(
      width / -2, // left
      width / 2, // right
      height / 2, // top
      height / -2, // bottom
      1, // near
      100 // far
    );
    this.camera.position.set(4, 4, 4);
    this.camera.lookAt(0, 0, 0);

    // Renderer 
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);
    renderer.render(this.scene, this.camera);
    this.el.appendChild(renderer.domElement);
  }

  addLayer(x, z, width, depth, direction) {
    const {boxHeight, stack} = this.state;
    const y = boxHeight * stack.length;

    const layer = this.generateBox(x, y, z, width, depth);
    layer.direction = direction;

    stack.push(layer);
    this.setStateDirty('stack', stack);
  }

  generateBox(x, y, z, width, depth) {
    const {boxHeight, stack} = this.state;
    const geometry = new THREE.BoxGeometry(width, boxHeight, depth);

    const color = new THREE.Color(`hsl(${30 + stack.length * 4}, 100%, 50%)`);
    const material = new THREE.MeshLambertMaterial({color});

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    this.scene.add(mesh);

    return {
      threejs: mesh,
      width,
      depth
    };
  }
}