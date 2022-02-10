import colors from 'lib/colors';
import THREE from './three';

export default function ExtractedPlanesScene(json) {
  // initial setup
  const scene = new THREE.Scene();

  // loop through extracted planes data
  json.forEach((p, i) => {
    // set up texture
    const alphaMap = new THREE.TextureLoader().load(p.alphaMap);

    const color = colors.planeColors[i % colors.planeColors.length];
    const coloredMaterial = new THREE.MeshPhongMaterial({
      color,
      alphaMap,
      transparent: true,
      shininess: 0,
      reflectivity: 0,
      side: THREE.DoubleSide,
      depthWrite: true,
      depthTest: true,
    });

    const selectedMaterial = colors.barbellColors.map(
      selectionColor =>
        new THREE.MeshBasicMaterial({
          alphaMap,
          transparent: true,
          side: THREE.DoubleSide,
          color: new THREE.Color(parseInt(`0x${selectionColor.slice(-6)}`, 16)),
          depthWrite: true,
          depthTest: true,
        }),
    );
    const parallelMaterial = colors.barbellColors.map(
      selectionColor =>
        new THREE.MeshBasicMaterial({
          alphaMap,
          transparent: true,
          opacity: 0.25,
          side: THREE.DoubleSide,
          color: new THREE.Color(parseInt(`0x${selectionColor.slice(-6)}`, 16)),
          depthWrite: true,
          depthTest: true,
        }),
    );

    const matrix = new THREE.Matrix4().set(...p.matrix);

    // create geometry
    const geo = new THREE.PlaneGeometry(1, 1);

    const plane = new THREE.Mesh(geo, [
      coloredMaterial,
      ...selectedMaterial,
      ...parallelMaterial,
    ]);
    plane.applyMatrix(matrix);

    // store info for later use
    plane.userData = {
      plane: p.plane,
      numPoints: p.numPoints,
    };

    scene.add(plane);
  });

  // @TODO: why does this throw everything off?
  // const boundingBox = new THREE.Box3();

  // scene.traverseVisible(child => {
  //   if (child.geometry) {
  //     child.geometry.computeVertexNormals();
  //     child.geometry.computeBoundingBox();

  //     const box = child.geometry.boundingBox;
  //     boundingBox.expandByPoint(box.min);
  //     boundingBox.expandByPoint(box.max);
  //   }
  // });

  Object.assign(scene, {
    name: 'planes', // so we can optimize pickModelObject()
    // boundingBox,
  });

  return scene;
}
