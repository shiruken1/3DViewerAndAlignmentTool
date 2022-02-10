/* NPM */
import THREE from './three';

/* App */
export default class Viewer {
  constructor(canvas, cameraPosition) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setClearColor(0xefefef);
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      0.1,
      20000,
    );

    this.camera.position.copy(cameraPosition);
    this.stuff = new THREE.Scene();
    this.stuff.rotation.x = -Math.PI / 2;
    this.mouse = null;
    this.raycaster = new THREE.Raycaster();
    this.model = null;

    const scene = new THREE.Scene();
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight1 = new THREE.DirectionalLight(0xc0c0b0);
    directionalLight1.position.set(0, 100, 0);
    scene.add(directionalLight1);
    scene.add(ambientLight);
    this.scene = scene;
    this.scene.add(this.stuff);

    this.camera.lookAt(this.scene.position);
  }
  pickModelObject(x, y) {
    const objects = this.stuff.children[0].children;
    // get normalized mouse position
    const { width, height } = this.renderer.domElement;
    this.mouse = {
      x: (x / width) * 2 - 1,
      y: -(y / height) * 2 + 1,
    };
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(objects);
    if (!intersects.length) {
      return null;
    }
    return intersects[0].object.name;
  }
  updateTransform() {
    // temporarily clear any positioning
    this.stuff.position.copy(new THREE.Vector3(0, 0, 0));
    // find new extents of combined model and point cloud
    const box = new THREE.Box3();
    box.expandByObject(this.stuff);
    // and (re)set position to center it all
    const center = new THREE.Vector3();
    box.getCenter(center);
    this.stuff.position.copy(center.negate());
  }
  updateScene(model) {
    let needTransformUpdate = false;
    // update model, if changed
    if (model !== this.model) {
      if (this.model) {
        this.stuff.remove(this.model);
      }
      this.model = model;
      if (this.model) {
        this.stuff.add(this.model);
      }
      needTransformUpdate = true;
    }

    // update transform to recenter on changed model
    if (needTransformUpdate) {
      this.updateTransform();
    }
  }
  resize(width, height) {
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    return true;
  }
  render(model) {
    this.updateScene(model);
    this.renderer.render(this.scene, this.camera);
  }
}
