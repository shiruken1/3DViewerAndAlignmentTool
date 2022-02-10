/* App */
import colors from 'lib/colors';

import THREE from './three';
import makeScene from './Scene';

const webpackGLSLLoader = require.context(
  '!webpack-glsl-loader!.',
  false,
  /\.glsl$/,
);
const aaModelVS = webpackGLSLLoader('./aa.model.vs.glsl');
const aaModelFS = webpackGLSLLoader('./aa.model.fs.glsl');

const PLANE_SLOTS = [0, 1, 2];

const DegRad = 0.017453292519943;
const tiltThreshold = 90.0001 * DegRad;

// determined by comp's plane extraction tool
const alphaMapSize = 128;

const c = document.createElement('canvas');
c.id = 'twodee';
c.width = alphaMapSize;
c.height = alphaMapSize;

const context = c.getContext('2d');
context.scale(1, -1);

// for verification
// const img = document.createElement('img');
// img.id = 'img';
// img.style.display = 'block';
// img.style.position = 'absolute';
// img.style.backgroundColor = 'yellow';
// img.style.zIndex = '999';
// img.width = alphaMapSize;
// img.height = alphaMapSize;

function testTexture(intersectedOjbect) {
  const {
    uv: { x, y },
    object: {
      material: [
        {
          alphaMap: { image },
        },
      ],
    },
  } = intersectedOjbect;
  context.drawImage(image, 0, 0, alphaMapSize, -alphaMapSize);
  const alphaThreshold = 20;
  return (
    context.getImageData(alphaMapSize * x, alphaMapSize * y, 1, 1).data[0] >=
    alphaThreshold
  );
}

function sgn(a, b) {
  if (b === undefined) b = 1.0; // eslint-disable-line no-param-reassign
  return a < 0 ? b * -1 : b;
}

export default class Viewer {
  constructor(canvas, name) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    // this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      0.1,
      2000,
    );

    this.controls = new THREE.OrbitControls(this.camera, canvas);
    this.controls.screenSpacePanning = true;
    this.controls.enableKeys = false;

    this.camera.position.z = 5;
    this.scene = makeScene(name);
    this.stuff = new THREE.Scene();
    this.stuff.name = 'Stuff';
    this.stuff.rotation.x = -Math.PI / 2;
    this.scene.add(this.stuff);
    this.mouse = null;
    this.raycaster = new THREE.Raycaster();
    this.model = null;
    this.scan = null;
    this.scanChunks = 0;
    this.name = name;
    this.adjustCam = null;
    this.filters = {
      showScan: true,
      showModel: true,
    };
    this.selectedSurfaces = [];
    this.cameraDefault = null;
    this.objects = null;
    this.makeModelMaterials = true;
    document.addEventListener('keyup', this.onKey.bind(this));
    // document.getElementsByTagName('CANVAS')[0].parentElement.appendChild(img);
  }
  onKey({ key }) {
    if (key === 'b') {
      const box = this.getViewBounds();
      if (box) this.stuff.add(new THREE.Box3Helper(box, 0xffff00));
    }
  }
  updateSettings({ filters, selectedSurfaces }) {
    this.filters = {
      ...this.filters,
      ...filters,
    };
    this.selectedSurfaces = selectedSurfaces ? selectedSurfaces.slice() : [];
  }
  getViewBounds() {
    const { model, scan } = this;
    let modelBox;
    let scanBox;
    if (model && model.boundingBox) {
      modelBox = model.boundingBox;
    }
    if (scan && scan.userData && scan.userData.boundingBox) {
      scanBox = scan.userData.boundingBox;
    }
    if (modelBox) {
      if (scanBox) {
        return modelBox.clone().intersect(scanBox);
      }
      return modelBox;
    }
    if (scanBox) {
      return scanBox;
    }
    return null;
  }
  restoreCamera() {
    if (!this.cameraDefault) {
      this.frameAll();
      return;
    }

    const { position, target } = this.cameraDefault;
    this.controls.object.position.copy(position);
    this.controls.target.copy(target);
    this.controls.update();
  }
  frameAll() {
    const viewBounds = this.getViewBounds();
    if (!viewBounds) return;

    const radius = viewBounds.max.distanceTo(viewBounds.min);
    const target = new THREE.Vector3();

    let fieldOfView = this.camera.fov / 2.0;
    if (this.canvas.width < this.canvas.height) {
      fieldOfView = (fieldOfView * this.canvas.width) / this.canvas.height;
    }

    const distance = radius / Math.sin(fieldOfView * DegRad);

    if (distance > this.camera.far) {
      this.camera.far = distance + viewBounds.getSize().length();
      this.camera.updateProjectionMatrix();
    }

    const position = this.controls.object.position
      .clone()
      .sub(this.controls.target)
      .setLength(distance)
      .add(target);

    this.controls.object.position.copy(position);
    this.controls.target.copy(target);
    this.controls.update();

    this.cameraDefault = { position, target };
  }
  pickObject(x, y) {
    const object = this.stuff.children.find(
      a => a.name === 'model' || a.name === 'planes',
    );

    if (!object) {
      return [];
    }

    // get normalized mouse position
    const { width, height } = this.renderer.domElement;
    this.mouse = {
      x: (x / width) * 2 - 1,
      y: -(y / height) * 2 + 1,
    };
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(object.children, true);
    if (!intersects.length) {
      return intersects;
    }

    intersects.forEach(i => i.point.sub(this.stuff.position));
    if (object.name === 'planes') {
      return intersects.map(i => ({ ...i, textureHit: testTexture(i) }));
    }
    return intersects;
  }

  selectionUniforms() {
    const uniforms = {};
    PLANE_SLOTS.forEach(slot => {
      const surface = this.selectedSurfaces.find(s => s.index === slot);
      let plane;
      let id;
      if (!surface) {
        plane = new THREE.Vector4();
        id = -1;
      } else {
        plane = new THREE.Vector4(
          ...surface.plane.normal.toArray(),
          surface.plane.constant,
        );
        id = surface.id; // eslint-disable-line prefer-destructuring
      }
      uniforms[`selectedPlane${slot + 1}`] = plane;
      uniforms[`selectedId${slot + 1}`] = id;
    });
    return uniforms;
  }

  static makeModelMaterial(objId, selectionUniforms) {
    const sColors = colors.barbellColors.map(bc =>
      parseInt(`0x${bc.slice(-6)}`, 16),
    );
    const uniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib.ambient,
      THREE.UniformsLib.lights,
      {
        objectId: { type: 'i', value: objId },
        selectedColor1: { value: new THREE.Color(sColors[0]) },
        selectedColor2: { value: new THREE.Color(sColors[1]) },
        selectedColor3: { value: new THREE.Color(sColors[2]) },
        selectedPlane1: { value: selectionUniforms.selectedPlane1 },
        selectedPlane2: { value: selectionUniforms.selectedPlane2 },
        selectedPlane3: { value: selectionUniforms.selectedPlane3 },
        selectedId1: { value: selectionUniforms.selectedId1 },
        selectedId2: { value: selectionUniforms.selectedId2 },
        selectedId3: { value: selectionUniforms.selectedId3 },
        color: { value: new THREE.Color(0xff00ff) },
      },
    ]);
    return new THREE.ShaderMaterial({
      name: 'Viewer ShaderMaterial',
      vertexShader: aaModelVS,
      fragmentShader: aaModelFS,
      uniforms,
      lights: true,
      flatShading: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
      depthWrite: true,
      depthTest: true,
    });
  }

  updateModelUniforms() {
    if (!this.model || this.model.name === 'planes') return;
    const selectionUniforms = this.selectionUniforms();
    this.model.traverseVisible(obj => {
      const { material } = obj;
      if (!material) return;

      // If model is freshly loaded, or if we're reusing it from cache
      // replace materials with custom materials .
      if (this.makeModelMaterials || !material.uniforms) {
        // eslint-disable-next-line no-param-reassign
        obj.material = Viewer.makeModelMaterial(obj.id, selectionUniforms);
        return;
      }
      // Otherwise update material using new settings
      material.uniforms.selectedPlane1.value = selectionUniforms.selectedPlane1;
      material.uniforms.selectedPlane2.value = selectionUniforms.selectedPlane2;
      material.uniforms.selectedPlane3.value = selectionUniforms.selectedPlane3;
      material.uniforms.selectedId1.value = selectionUniforms.selectedId1;
      material.uniforms.selectedId2.value = selectionUniforms.selectedId2;
      material.uniforms.selectedId3.value = selectionUniforms.selectedId3;
    });
    // only make the materials once
    this.makeModelMaterials = false;
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
  updateCamera(adjustCam) {
    if (this.adjustCam === adjustCam) return;

    const cameraCenter = this.controls.target.clone();
    const cameraEye = this.camera.position.clone();

    const viewVector = cameraEye.sub(cameraCenter);
    const viewLength = viewVector.length();

    // Tilt view to correspond with the other viewer
    viewVector.sub(cameraCenter);

    let tilt = Math.atan2(viewVector.z, viewVector.y) + adjustCam;
    if (Math.abs(tilt) < tiltThreshold) {
      tilt = sgn(tilt, tiltThreshold);
    }

    const newY = viewLength * Math.cos(tilt) + cameraCenter.y;
    const newZ = viewLength * Math.sin(tilt) + cameraCenter.z;

    this.camera.position.set(cameraEye.x, newY, newZ);
    this.adjustCam = adjustCam;
  }
  updateScene(model, scan, master, adjustCam) {
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
      this.frameAll();
      needTransformUpdate = true;
    }

    if (this.model && this.filters.showModel !== this.model.visible) {
      this.model.visible = this.filters.showModel;
    }

    // update scan if change
    if (scan !== this.scan) {
      if (this.scan) {
        this.stuff.remove(this.scan);
      }
      this.scan = scan;
      this.scanChunks = 0;
      if (scan) {
        this.scanChunks = scan.children.length;
        this.stuff.add(scan);
      }
      this.frameAll();
      needTransformUpdate = true;
    } else if (
      // was a new chunk appended during scan load?
      scan &&
      scan.children.length !== this.scanChunks
    ) {
      this.scanChunks = scan.children.length;
      needTransformUpdate = true;
    }

    if (this.scan && this.filters.showScan !== this.scan.visible) {
      this.scan.visible = this.filters.showScan;
    }

    if (!master && adjustCam) {
      this.updateCamera(adjustCam);
    }

    // update transform to recenter on changed model and/or scan
    if (needTransformUpdate) {
      this.updateTransform();
    }
    this.updateModelUniforms();
  }
  resize(width, height) {
    const { height: oldHeight, width: oldWidth } = this.renderer.getSize();
    if (width === oldWidth && height === oldHeight) {
      return;
    }

    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
  render(model, scan, master, adjustCam) {
    this.updateScene(model, scan, master, adjustCam);
    this.renderer.render(this.scene, this.camera);
  }
}
