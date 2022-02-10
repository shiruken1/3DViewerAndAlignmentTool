/* NPM */
import THREE from './three';

export default gltf => {
  // override material returned by GLTFLoader
  const overrideMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080,
    metalness: 0,
    name: 'default',
    normalScale: {
      x: -1,
      y: 1,
    },
    roughness: 1,
  });
  const objects = {};
  const boundingBox = new THREE.Box3();

  // Calulate object bounding boxes and scene bounding box
  gltf.scene.traverseVisible(child => {
    if (child.geometry) {
      child.geometry.computeVertexNormals();
      objects[child.name] = child.geometry;
      child.geometry.computeBoundingBox();
      const box = child.geometry.boundingBox;
      boundingBox.expandByPoint(box.min);
      boundingBox.expandByPoint(box.max);
    }
  });
  Object.assign(gltf.scene, {
    name: 'model',
    overrideMaterial,
    objects,
    boundingBox,
  });
};
