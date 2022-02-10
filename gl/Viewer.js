/* App */
import THREE from './three';
import makeScene from './Scene';

/*
It would be nice to be able to just do this:
import planeVS from './plane.vs.glsl';
import planeFS from './plane.fs.glsl';

But that's not currently possible with Create React App.

So instead, we do this ugly business:
*/

const webpackGLSLLoader = require.context(
  '!webpack-glsl-loader!.',
  false,
  /\.glsl$/,
);
const planeVS = webpackGLSLLoader('./plane.vs.glsl');
const planeFS = webpackGLSLLoader('./plane.fs.glsl');

const DISPLAY_FLAGS = {
  green: 1,
  yellow: 2,
  red: 4,
  cropped: 8,
  missing: 16,
  insufficient: 32,
  all: 0,
  __typename: 0,
  fromObject(obj) {
    if (!obj.all) return 0;
    return Object.keys(obj).reduce(
      (a, f) => a ^ (obj[f] ? 0 : DISPLAY_FLAGS[f]), // eslint-disable-line no-bitwise
      0x3f,
    );
  },
};

export default class Viewer {
  constructor({ canvas, onChange, debugMode }) {
    this.debugMode = debugMode;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.scene = makeScene();
    this.scene.setDebugMode(debugMode);
    this.stuff = new THREE.Scene();
    this.stuff.rotation.x = -Math.PI / 2;
    this.stuff.updateMatrixWorld();
    this.scene.add(this.stuff);
    this.raycaster = new THREE.Raycaster();
    this.diff = null;
    this.model = null;
    this.scan = null;
    this.scanChunks = 0;
    this.limits = { crop: 0, red: 0, yellow: 0 };
    this.modelFilters = 0x3f;
    this.scanFilters = 0x3f;
    this.objectMode = 0;
    this.cameraPosition = Viewer.VIEWDIR.threeQuarter.clone();
    this.cameraTarget = new THREE.Vector3();
    this.neededUpdates = {};
    this.makeModelMaterials = true;

    this.overviewControls = this.makeControls(canvas, true);
    this.focusControls = this.makeControls(canvas, false);
    this.controls = this.overviewControls;

    this.onChange = onChange;
  }

  onControlsChanged = () => {
    this.neededUpdates.render = true;
    if (this.onChange) {
      const position = this.controls.object.position.clone();
      const target = this.controls.target.clone();
      // As soon as they move the controls, set viewDirection back to 'free'
      let viewDirection = 'free';
      if (this.savedViewDir) {
        if (
          position.equals(this.savedViewDir.position) &&
          target.equals(this.savedViewDir.target)
        ) {
          ({ viewDirection } = this.savedViewDir);
        } else {
          delete this.savedViewDir;
        }
      }
      this.onChange({
        position,
        target,
        viewDirection,
      });
    }
  };
  makeControls(canvas, enabled) {
    const controls = new THREE.OrbitControls(
      new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 2000),
      canvas,
    );
    controls.addEventListener('change', this.onControlsChanged);
    controls.screenSpacePanning = true;
    controls.enableKeys = false; // SD-2563
    controls.object.position.copy(this.cameraPosition);
    controls.target.copy(this.cameraTarget);
    controls.enabled = enabled;
    if (enabled) {
      controls.update();
    }
    return controls;
  }
  isVarianceVisible({ dm, missing, seen }) {
    // determine if an object is visible with the current limits and filters
    const {
      limits: { crop, red, yellow },
      modelFilters: filters,
    } = this;
    /* eslint-disable no-bitwise */
    if (!seen) {
      return filters & DISPLAY_FLAGS.insufficient;
    }
    if (missing) {
      return filters & DISPLAY_FLAGS.missing;
    }

    if (dm < yellow) {
      return filters & DISPLAY_FLAGS.green;
    }
    if (dm < red) {
      return filters & DISPLAY_FLAGS.yellow;
    }
    if (dm < crop) {
      return filters & DISPLAY_FLAGS.red;
    }
    return filters & DISPLAY_FLAGS.crop;
  }
  pickModelObject(x, y) {
    if (!this.model) {
      return null;
    }
    // get normalized mouse position
    const { width, height } = this.renderer.domElement;
    const mouse = {
      x: (x / width) * 2 - 1,
      y: -(y / height) * 2 + 1,
    };
    this.raycaster.setFromCamera(mouse, this.controls.object);
    const intersects = this.raycaster.intersectObjects(this.model.children);
    // there may be several intersected objects
    // none or one or more of them may be visible
    // select the closest one that's visible, if such a one exists
    const first = intersects.find(obj => {
      const { object } = obj;
      if (!object || object.type !== 'Mesh') return false;
      const { material } = object;
      if (!material || material.type !== 'ShaderMaterial') return false;
      const { uniforms } = material;
      return this.isVarianceVisible({
        dm: uniforms.variance.value,
        missing: uniforms.missing.value,
        seen: uniforms.seen.value,
      });
    });
    return first ? first.object.name : null;
  }
  updateSettings(settings) {
    const isFocus = settings.focus.objectId;
    const source = isFocus ? settings.focus : settings.overview;
    this.neededUpdates = {};
    this.setLimits(settings.limits, settings.scale, settings.symbolScale);
    this.setFilters(source.modelFilters, source.scanFilters);
    this.setObjectMode(source.objectMode);
    this.setFocusObject(source.objectId || null);
    if (!settings.autoCamera) {
      if (
        !this.focusControls.object.position.equals(settings.focus.position) ||
        !this.focusControls.target.equals(settings.focus.target)
      ) {
        this.focusControls.object.position.copy(settings.focus.position);
        this.focusControls.target.copy(settings.focus.target);
        this.focusControls.update();
      }
      if (
        !this.overviewControls.object.position.equals(
          settings.overview.position,
        ) ||
        !this.overviewControls.target.equals(settings.overview.target)
      ) {
        this.overviewControls.object.position.copy(settings.overview.position);
        this.overviewControls.target.copy(settings.overview.target);
        this.overviewControls.update();
      }
    }
    this.setViewDirection(settings.focus.viewDirection);
  }
  setViewDirection(viewDirection) {
    if (!this.focusId || !this.model || viewDirection === 'free') {
      return;
    }
    this.applyViewDirection(
      Viewer.VIEWDIR[viewDirection].clone(),
      this.focusControls.object.position.distanceTo(this.focusControls.target),
      viewDirection,
    );
  }
  applyViewDirection(viewDirection, distance, directionName) {
    // object center, with world matrix applied
    // eslint-disable-next-line no-console
    console.log(`applyViewDirection for: ${this.focusId}`);
    const target = new THREE.Vector3();

    let d = distance;
    const box = this.getObjectBounds(this.focusId);
    if (box) {
      box.getCenter(target).applyMatrix4(this.stuff.matrixWorld);
      if (!d) d = box.max.distanceTo(box.min) * 0.8;
    }

    // and set camera distance passed in or else compute
    // distance to frame the object
    const position = viewDirection.setLength(d).add(target);
    this.focusControls.object.position.copy(position);
    this.focusControls.target.copy(target);
    this.focusControls.update();

    // save viewDirection as well as resulting position, target
    // so that we can tell when they've moved the controls and
    // thus set the viewDirection to 'free'.  This must happen
    // before the call to onControlsChanged() to avoid a premature
    // switch to 'free'.
    if (directionName) {
      this.savedViewDir = {
        viewDirection: directionName,
        position: this.focusControls.object.position.clone(),
        target: this.focusControls.target.clone(),
      };
    }
    this.onControlsChanged();
  }
  setLimits(limits, scale, symbolScale) {
    if (scale) {
      this.scale = scale;
      this.symbolScale = symbolScale;
    } else {
      this.scale = 1.0;
      this.symbolScale = 1.0;
    }

    const scaledLimits = {
      crop: limits.crop * scale,
      red: limits.red * scale,
      yellow: limits.yellow * scale,
    };
    if (
      this.limits.crop === scaledLimits.crop &&
      this.limits.red === scaledLimits.red &&
      this.limits.yellow === scaledLimits.yellow
    ) {
      return;
    }
    this.limits = scaledLimits;
    this.neededUpdates.scanUniforms = true;
    this.neededUpdates.modelUniforms = true;
  }
  setFilters(modelFilters, scanFilters) {
    const newScanFilters = DISPLAY_FLAGS.fromObject(scanFilters);
    if (this.scanFilters !== newScanFilters) {
      this.scanFilters = newScanFilters;
      this.neededUpdates.scanUniforms = true;
      this.scanFiltersChanged = true;
    }
    const newModelFilters = DISPLAY_FLAGS.fromObject(modelFilters);
    if (this.modelFilters !== newModelFilters) {
      this.modelFilters = newModelFilters;
      this.neededUpdates.modelUniforms = true;
    }
  }
  setObjectMode(objectMode) {
    if (this.objectMode !== objectMode) {
      this.objectMode = objectMode;
      if (this.focusId) {
        this.neededUpdates.modelUniforms = true;
        this.neededUpdates.scanUniforms = true;
      }
    }
  }
  setFocusObject(objId) {
    if (objId === this.focusId) {
      return;
    }

    if (this.markers) {
      // console.log('setFocusObject: '+objId);
      const symbols = this.markers.children;
      for (let i = 0; i < symbols.length; i++) {
        const sym = symbols[i];
        // eslint-disable-next-line no-continue
        if (sym.name !== 'v-marker') continue;
        const marker = sym.children[0];
        // eslint-disable-next-line no-continue
        if (marker.name !== 'head') continue;

        const symData = sym.userData;
        const symId = symData.id;
        if (!symData.scale) {
          const box = this.getObjectBounds(symId);
          if (box) {
            const radius = box.max.distanceTo(box.min) / 2.0;
            const scale = radius / 24.0;
            marker.scale.set(scale, scale, scale);
            symData.scale = scale;
          }
        }

        /*
        if (objId === null || objId === symbolId) {
          symbol.visible = true;
        } else {
          symbol.visible = false;
        }
        */
        sym.visible = objId !== null && objId === symId;
      }
    }

    // if model isn't yet loaded, there's no sensible way to focus an object
    // so remember the request and set focus once the model is finished loading
    // unless they unfocus it before then
    if (!this.model) {
      this.pendingFocusId = objId;
      return;
    }
    // activate correct controls
    this.controls.enabled = false;
    if (objId) {
      this.controls = this.focusControls;
      this.neededUpdates.frameFocus = true;
    } else {
      this.controls = this.overviewControls;
    }
    this.controls.enabled = true;
    this.neededUpdates.modelUniforms = true;
    this.neededUpdates.scanUniforms = true;
    this.focusId = objId;
  }

  makeModelMaterial(variance, objIndex) {
    const { crop, red, yellow } = this.limits;
    const uniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib.ambient,
      THREE.UniformsLib.lights,
      {
        unselectAlpha: { value: 0.125 },
        symbolDisplay: { type: 'i', value: 0 },
        displayEnabled: { type: 'i', value: this.modelFilters },
        objectIndex: { type: 'i', value: variance.objIndex },
        focusIndex: { type: 'i', value: objIndex },
        focusCenter: { value: new THREE.Vector3() },
        focusRadius: { value: 0.0 },
        objectMode: { type: 'i', value: Viewer.OBJMODE[this.objectMode] },
        missing: { type: 'i', value: variance.missing },
        seen: { type: 'i', value: variance.seen },
        variance: { value: variance.dm },
        cropLimit: { value: crop },
        redLimit: { value: red },
        yellowLimit: { value: yellow },
      },
    ]);
    return new THREE.ShaderMaterial({
      name: 'Viewer ShaderMaterial',
      vertexShader: planeVS,
      fragmentShader: planeFS,
      uniforms,
      lights: true,
      side: THREE.DoubleSide,
      transparent: false,
      opacity: 1.0,
      depthWrite: true,
      depthTest: true,
    });
  }
  depthTestUniform(material, objIndex) {
    if (this.objectMode === 'Isolate') {
      return true;
    }
    if (this.objectMode === 'Context') {
      if (objIndex === -1) return true;
      if (material.uniforms.objectIndex.value === objIndex) return true;
      return false;
    }
    if (this.objectMode === 'Expand') {
      return true;
    }
    // return objIndex === -1 || material.uniforms.objectIndex.value === objIndex;
    return true;
  }
  updateModelUniforms() {
    if (!this.model || !this.diff || !this.objects) return;

    const { crop, red, yellow } = this.limits;
    const objIndex = this.focusId ? this.objects[this.focusId] : -1;

    let focusSphere;
    if (this.focusId) {
      this.model.traverseVisible(obj => {
        if (obj.name === this.focusId) {
          focusSphere = obj.geometry.boundingSphere;
        }
      });
    }
    this.model.traverseVisible(obj => {
      const { material } = obj;
      if (!material) return;

      // If model is freshly loaded, or if we're reusing it from cache
      // replace materials with custom materials .
      if (this.makeModelMaterials || !material.uniforms) {
        const id = obj.name;
        const variance = this.diff[id] && this.diff[id][0];
        // eslint-disable-next-line no-param-reassign
        obj.material = this.makeModelMaterial(
          variance || {
            dm: -1.0,
            missing: 0,
            seen: 0,
            objIndex: -1,
          },
          objIndex,
        );
        return;
      }
      // Otherwise update material using new settings
      if (material.uniforms) {
        material.uniforms.cropLimit.value = crop;
        material.uniforms.redLimit.value = red;
        material.uniforms.yellowLimit.value = yellow;
        material.uniforms.displayEnabled.value = this.modelFilters;
        material.uniforms.objectMode.value = Viewer.OBJMODE[this.objectMode];
        material.uniforms.focusIndex.value = objIndex;
        if (focusSphere) {
          material.uniforms.focusCenter.value = focusSphere.center;
          material.uniforms.focusRadius.value = focusSphere.radius * 1.1;
        }
        // material.uniforms.depthTest = this.depthTestUniform(material, objIndex);
        // material.depthTest = true;
        const opaque = this.depthTestUniform(material, objIndex);
        material.transparent = !opaque;
        material.depthWrite = opaque;
      }
    });
    // only make the materials once
    this.makeModelMaterials = false;
  }
  updateScanUniforms() {
    if (!this.scan || !this.scan.children || !this.scan.children.length) {
      return;
    }
    const objIndex =
      this.objects && this.focusId ? this.objects[this.focusId] : -1;
    let focusSphere;
    if (this.model && this.focusId) {
      this.model.traverseVisible(obj => {
        if (obj.name === this.focusId) {
          focusSphere = obj.geometry.boundingSphere;
        }
      });
    }
    const { uniforms } = this.scan.children[0].material;
    uniforms.cropLimit.value = this.limits.crop;
    uniforms.redLimit.value = this.limits.red;
    uniforms.yellowLimit.value = this.limits.yellow;
    uniforms.greenLimit.value = this.limits.green;
    uniforms.displayEnabled.value = this.scanFilters;
    uniforms.objectMode.value = Viewer.OBJMODE[this.objectMode];
    uniforms.focusIndex.value = objIndex;
    if (focusSphere) {
      uniforms.focusCenter.value = focusSphere.center;
      uniforms.focusRadius.value = focusSphere.radius * 1.1;
    }
  }
  getObject(objID) {
    if (!this.model || !this.model.objects) return undefined;
    return this.model.objects[objID];
  }
  getObjectBounds(objID) {
    const obj = this.getObject(objID);
    if (obj === undefined) return undefined;
    return obj.boundingBox;
  }
  getModelBounds() {
    return this.model.boundingBox;
  }
  getScanBounds() {
    return this.scan.userData.boundingBox;
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
  frameFocusedObject() {
    const viewDirection = this.overviewControls.object.position
      .clone()
      .sub(this.overviewControls.target);
    this.applyViewDirection(viewDirection);
  }
  frameAll() {
    const viewBounds = this.getViewBounds();
    const distance = viewBounds.max.distanceTo(viewBounds.min) * 1.0;
    if (distance > this.controls.object.far) {
      this.controls.object.far = distance + viewBounds.getSize().length();
      this.controls.object.updateProjectionMatrix();
    }

    const target = new THREE.Vector3();
    viewBounds.getCenter(target).applyMatrix4(this.stuff.matrixWorld);
    if (this.scene.axes) {
      this.scene.axes.position.copy(target);
    }
    const position = this.overviewControls.object.position
      .clone()
      .sub(this.overviewControls.target)
      .setLength(distance)
      .add(target);
    this.overviewControls.object.position.copy(position);
    this.overviewControls.target.copy(target);
    this.overviewControls.update();
  }

  updateScene(model, scan, diff, objects, markers) {
    const updates = this.neededUpdates;

    // update model, if changed
    if (model !== this.model) {
      if (this.model) {
        this.stuff.remove(this.model);
      }
      if (this.modelBox) {
        this.scene.remove(this.modelBox);
      }
      this.model = model;
      this.modelBox = null;
      if (this.model) {
        this.stuff.add(this.model);
        if (this.debugMode) {
          this.modelBox = new THREE.BoxHelper(this.model, 0xffff00);
          this.scene.add(this.modelBox);
        }
        if (this.pendingFocusId) {
          this.setFocusObject(this.pendingFocusId);
        }
      }
      updates.frameAll = true;
      updates.frameFocus = !!this.focusId;
      updates.modelUniforms = true;
    }

    // update scan if change
    if (scan !== this.scan) {
      if (this.scan) {
        this.stuff.remove(this.scan);
      }
      if (this.scanBox) {
        this.scene.remove(this.scanBox);
      }
      this.scan = scan;
      this.scanBox = null;
      this.scanChunks = 0;
      if (scan) {
        this.scanChunks = scan.children.length;
        this.stuff.add(scan);
        if (this.debugMode) {
          this.scanBox = new THREE.BoxHelper(this.scan, 0xff00ff);
          this.scene.add(this.scanBox);
        }
      }
      if (this.scanChunks) {
        updates.frameAll = true;
        updates.scanUniforms = true;
      }
    } else if (
      // was a new chunk appended during scan load?
      scan &&
      scan.children.length !== this.scanChunks
    ) {
      if (!this.scanChunks) {
        updates.frameAll = true;
        updates.scanUniforms = true;
      } else {
        updates.render = true;
      }
      if (this.scanBox) {
        this.scanBox.update();
      }
      this.scanChunks = scan.children.length;
    }

    // update diff, if changed
    if (diff !== this.diff) {
      this.diff = diff;
      updates.modelUniforms = true;
    }
    if (objects !== this.objects) {
      this.objects = objects;
      updates.modelUniforms = true;
    }
    if (markers !== this.markers) {
      this.markers = markers;
      if (markers) {
        const scale = this.symbolScale;
        const symbols = markers.children;
        for (let i = 0; i < symbols.length; i++) {
          const sym = symbols[i];
          // eslint-disable-next-line no-continue
          if (sym.name !== 'v-marker') continue;
          const marker = sym.children[0];
          // eslint-disable-next-line no-continue
          if (marker.name !== 'head') continue;

          // Model BoundingBoxes may not yet be defined, so need to
          // do this later, on Inspect
          /*
          const symData = sym.userData;
          const objId = symData.id;

          const box = this.getObjectBounds(objId);
          if (box) {
            const radius = box.max.distanceTo(box.min) / 2.0;
            scale = radius / 24;
          }
          */

          // Default 1" radius scale
          marker.scale.set(scale, scale, scale);
        }

        this.stuff.add(markers);
        // updates.markerUniforms = true;
      }
    }
    return updates;
  }
  applyUpdates(updates) {
    // if no updates, can skip render
    if (!Object.keys(updates).length) {
      return false;
    }
    // if either scene changed or focus changed, update camera
    if (updates.frameAll) {
      this.frameAll();
    }
    if (updates.frameFocus) {
      this.frameFocusedObject();
    }

    if (updates.modelUniforms) {
      this.updateModelUniforms();
    }
    if (updates.scanUniforms) {
      this.updateScanUniforms();
    }
    return true;
  }
  resize(width, height) {
    const { height: oldHeight, width: oldWidth } = this.renderer.getSize();
    if (width === oldWidth && height === oldHeight) {
      return;
    }
    this.renderer.setSize(width, height, false);
    this.focusControls.object.aspect = width / height;
    this.focusControls.object.updateProjectionMatrix();
    this.overviewControls.object.aspect = width / height;
    this.overviewControls.object.updateProjectionMatrix();
    this.neededUpdates.render = true;
  }
  render() {
    this.renderer.render(this.scene, this.controls.object);
    this.neededUpdates = {};
  }
}

Viewer.OBJMODE = {
  Isolate: 0,
  Context: 1,
  Expand: 2,
};

Viewer.VIEWDIR = {
  threeQuarter: new THREE.Vector3(1.0, 1.0, 1.0).normalize(),
  top: new THREE.Vector3(0.0, 1.0, 0.0),
  front: new THREE.Vector3(0.0, 0.0, 1.0),
  side: new THREE.Vector3(1.0, 0.0, 0.0),
};
