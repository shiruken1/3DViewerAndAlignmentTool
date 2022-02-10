import THREE from './three';

export default function makeScene(name) {
  const scene = new THREE.Scene();
  scene.name = name;

  const ambientLight = new THREE.AmbientLight(0x808080);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffd0);
  const directionalLight2 = new THREE.DirectionalLight(0xe0ffff);
  directionalLight1.position.set(-100, 50, 100);
  directionalLight2.position.set(100, 50, -100);
  scene.add(directionalLight1);
  scene.add(directionalLight2);

  scene.setDebugMode = mode => {
    if (mode) {
      if (!scene.axes) {
        scene.axes = new THREE.AxesHelper(50);
        scene.add(scene.axes);
      }
    } else if (scene.axes) {
      scene.remove(scene.axes);
      delete scene.axes;
    }
  };

  return scene;
}
