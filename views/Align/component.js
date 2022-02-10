/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */

/* NPM */
import React from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import { Button, Menu, Icon, Confirm, Header } from 'semantic-ui-react';

/* App */
import transformPlanes from 'lib/ar_math/transformPlanes';
import { dotProduct } from 'lib/ar_math/vector';

import LoaderProgress from 'components/LoaderProgress';
import Viewer from 'components/View3d/align';
import Logo from 'components/Loading/Logo';

import unitDefs from 'util/units';
import cFL from 'util/capitalize';
import Log from 'util/Log';

import css from './Align.module.scss';
import Barbells from './Barbells';

const PLANE_SLOTS = [0, 1, 2];
// PARALLEL_LIMIT should agree with aa.model.fs.glsl shader
const PARALLEL_LIMIT = 0.8; // 0.8 is about 35 degrees

// I'm suprised ThreeJS has no such function
function getHessian(surface) {
  const { normal, constant } = surface.plane;
  return [normal.x, normal.y, normal.z, constant];
}

export default class extends React.Component {
  static propTypes = {
    scan: PropTypes.object,
    model: PropTypes.object,
    scanData: PropTypes.object,
    modelData: PropTypes.object,
    planesData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    scanProgress: PropTypes.number.isRequired,
    modelProgress: PropTypes.number.isRequired,
    planesProgress: PropTypes.number.isRequired,
  };

  static defaultProps = {
    scan: null,
    model: null,
    scanData: null,
    modelData: null,
    planesData: null,
  };

  state = {
    scaling: null,
    showScan: true,
    scanSurfaces: [],
    modelSurfaces: [],
    verifyModel: null,
    adjustCamera: null,
    transformedScan: null,
    failedTransform: false,
    confirmAlignmentOpen: false,
    frameTheModel: false,
    frameTheScan: false,
    frameTheResult: false,
  };

  static getDerivedStateFromProps(props, state) {
    let newState = Object.assign(state);

    const { model, scan, scanData, modelData, planesData } = props;

    if (modelData && modelData.overrideMaterial) {
      // convert to non-indexed geometry so that face normals will be available
      Object.values(modelData.children)
        .filter(mesh => mesh.geometry)
        .forEach(mesh => {
          mesh.geometry = mesh.geometry.toNonIndexed();
          mesh.geometry.computeVertexNormals();
        });

      modelData.overrideMaterial = null;
    }

    if (scan && model && !state.scaling) {
      const scale = unitDefs[scan.units].to[model.units];
      Log(`scaling by ${scale}`);
      const scaling = new THREE.Vector3(scale, scale, scale);

      newState = {
        ...newState,
        scaling,
      };
    }

    if (state.scaling) {
      const { scaling } = state;

      if (scanData && !scanData.scale.equals(scaling)) {
        // apply scaling to scan
        scanData.scale.copy(scaling);
      }

      if (
        scanData &&
        scanData.userData.boundingBox &&
        !scanData.userData.boundingBox.scaled
      ) {
        // preserve for transformedScan
        scanData.userData.originalBB = scanData.userData.boundingBox.clone();

        // so the initial camera grabs the whole scan
        scanData.userData.boundingBox.min.multiplyScalar(scaling.x);
        scanData.userData.boundingBox.max.multiplyScalar(scaling.x);
        scanData.userData.boundingBox.scaled = true;
      }

      if (planesData && !planesData.scale.equals(scaling)) {
        planesData.scale.copy(scaling);
      }
    }

    return newState;
  }

  onAcceptAlignment = async () => {
    this.setState({ confirmAlignmentOpen: false });
    await this.props.onSubmit(
      // transpose and truncate matrix to conform to SKUR API expectations
      this.state.transformedScan.matrix
        .clone()
        .transpose()
        .toArray()
        .slice(0, 12),
    );
  };

  onCancelAlignment = () => {
    this.onRestartModelSelection();
    this.onRestartScanSelection();

    this.setState({
      showScan: true,
      verifyModel: null,
      transformedScan: null,
      confirmAlignmentOpen: false,
    });
  };

  colorScanSurfaces = scanSurfaces => {
    this.props.planesData.children.forEach(mesh => {
      const {
        geometry: { faces },
      } = mesh;
      const selection = scanSurfaces.find(s => s.uuid === mesh.uuid);
      if (selection) {
        // if selected, set selected material
        faces.forEach(f => (f.materialIndex = selection.index + 1));
      } else {
        // if parallel to a selected surface, set the corresponding
        // parallel material
        let found = false;
        scanSurfaces.forEach(surface => {
          // if this one was "parallel", recolor it
          if (
            Math.abs(dotProduct(getHessian(surface), mesh.userData.plane)) >
            PARALLEL_LIMIT
          ) {
            faces.forEach(f => (f.materialIndex = surface.index + 4));
            found = true;
          }
        });
        // and if not seleted or parallel to any seleted surface
        // just use the unselected material for this surface
        if (!found) {
          faces.forEach(f => (f.materialIndex = 0));
        }
      }
      mesh.geometry.groupsNeedUpdate = true;
    });
  };

  onUndoLastScanSelection = () => {
    this.setState(prevState => {
      const scanSurfaces = prevState.scanSurfaces.slice(
        0,
        prevState.scanSurfaces.length - 1,
      );
      this.colorScanSurfaces(scanSurfaces);
      return { scanSurfaces };
    });
  };

  onUndoLastModelSelection = () => {
    this.setState(prevState => ({
      modelSurfaces: prevState.modelSurfaces.slice(
        0,
        prevState.modelSurfaces.length - 1,
      ),
    }));
  };

  onRestartScanSelection = () => {
    this.colorScanSurfaces([]);
    this.setState({
      scanSurfaces: [],
    });
  };

  onRestartModelSelection = () => {
    this.setState({
      modelSurfaces: [],
    });
  };

  onModelClick = selectedObjects => {
    // console.log(selected);
    const { modelSurfaces } = this.state;
    let done = false;
    selectedObjects.forEach(selected => {
      if (done) return;
      const { point, face, object } = selected;
      if (object.name === 'wireframe') return; // @TODO: y u select wire?

      // plane calc
      const mpoint = point
        .clone()
        .applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

      const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
        face.normal,
        mpoint,
      );

      // was it selected already?
      const selectedIndex = modelSurfaces.findIndex(
        s =>
          s.uuid === object.uuid &&
          s.plane.normal.dot(plane.normal) > PARALLEL_LIMIT &&
          Math.abs(s.plane.constant - plane.constant) < 0.00001,
      );
      if (selectedIndex !== -1) {
        // then remove it from the list
        const updated = modelSurfaces.slice();
        updated.splice(selectedIndex, 1);
        this.setState({ modelSurfaces: updated });
        done = true;
        return;
      }

      // is there a selected surface that's too close to parallel?
      const parallelIndex = modelSurfaces.findIndex(
        s => Math.abs(s.plane.normal.dot(plane.normal)) > PARALLEL_LIMIT,
      );
      if (parallelIndex !== -1) {
        return;
      }

      // find lowest available slot
      const index = PLANE_SLOTS.find(i =>
        modelSurfaces.every(s => s.index !== i),
      );
      if (index === undefined) {
        done = true;
        return;
      }
      const position = object.geometry.getAttribute('position').array;
      const triangles = [
        new THREE.Vector3(...position.slice(face.a * 3, face.a * 3 + 3)),
        new THREE.Vector3(...position.slice(face.b * 3, face.b * 3 + 3)),
        new THREE.Vector3(...position.slice(face.c * 3, face.c * 3 + 3)),
      ];
      this.setState({
        modelSurfaces: [
          ...modelSurfaces,
          {
            index,
            plane,
            uuid: object.uuid,
            triangles,
            id: object.id,
          },
        ],
      });
      done = true;
    });
  };

  onPlaneClick = selectedObjects => {
    let remove = null;
    let add = null;
    const { scaling } = this.state;
    selectedObjects.forEach(selected => {
      if (add || remove) {
        return;
      }
      const { scanSurfaces } = this.state;
      const { object, textureHit } = selected;
      const selectedIndex = scanSurfaces.findIndex(s => s.uuid === object.uuid);
      if (selectedIndex !== -1) {
        // if already selected, unselect it
        remove = object.uuid;
        return;
      }
      if (!textureHit) {
        return;
      }
      // find lowest available slot
      const index = PLANE_SLOTS.find(i =>
        scanSurfaces.every(s => s.index !== i),
      );
      if (index === undefined) {
        return;
      }
      const {
        userData: { plane: hessian },
      } = object;

      // is there a selected surface that's too close to parallel?
      const parallelIndex = scanSurfaces.findIndex(
        s => Math.abs(dotProduct(getHessian(s), hessian)) > PARALLEL_LIMIT,
      );
      if (parallelIndex !== -1) {
        return;
      }

      // plane calc
      const plane = new THREE.Plane();
      plane.setComponents(
        hessian[0], // x
        hessian[1], // y
        hessian[2], // z
        hessian[3] * scaling.x, // w
      );
      add = {
        plane,
        index,
        uuid: object.uuid,
        position: object.position.clone(),
      };
    });
    if (!add && !remove) {
      return;
    }
    this.setState(prevState => {
      const scanSurfaces = prevState.scanSurfaces.filter(
        s => s.uuid !== remove,
      );
      if (add) {
        scanSurfaces.push(add);
      }
      this.colorScanSurfaces(scanSurfaces);
      return { scanSurfaces };
    });
  };

  onModelViewerResponse = frameTheModel => {
    this.setState({ frameTheModel });
  };

  onScanViewerResponse = frameTheScan => {
    this.setState({ frameTheScan });
  };

  onConfirmViewerResponse = frameTheResult => {
    this.setState({ frameTheResult });
  };

  // onCamMove = ({ x, y }) => {
  onCamMove = () => {};
  //   const DegRad = 0.017453292519943;
  //   const radX = x * DegRad;
  //   const radY = -y * DegRad;

  //   Tilt view if vertical rotation greater than horizontal
  //   if (Math.abs(radY) > Math.abs(radX)) {
  //     this.setState({ adjustCamera: radY });
  //   } else {
  //     this.setState({ adjustCamera: null });
  //   }
  // };

  resetScanCam = () => {
    this.setState({ frameTheScan: true });
  };

  resetModelCam = () => {
    this.setState({ frameTheModel: true });
  };

  onVerifyAlignment = () => {
    const transform = this.transform();
    if (transform === null) {
      // SD-1899
      this.setState({ failedTransform: true });
      return;
    }
    const { scanData, modelData } = this.props;

    const transformedScan = scanData.clone();
    transform.decompose(
      transformedScan.position,
      transformedScan.rotation,
      transformedScan.scale,
    );
    transformedScan.updateMatrix();

    const box = scanData.userData.originalBB.clone();
    box.applyMatrix4(transform);
    transformedScan.userData.boundingBox = box;

    const verifyModel = modelData.clone();
    verifyModel.name = 'verifyModel';
    verifyModel.boundingBox = modelData.boundingBox.clone();

    // verifyModel.add(new THREE.Box3Helper(verifyModel.boundingBox, 0x0000ff));
    // verifyModel.add(new THREE.Box3Helper(transformedScan.userData.boundingBox, 0xffff00));

    this.setState({
      verifyModel,
      transformedScan,
      frameTheResult: true,
      confirmAlignmentOpen: true,
    });
  };

  transform = () => {
    const { scanSurfaces, modelSurfaces, scaling } = this.state;

    // since we're now allowing random selection order
    scanSurfaces.sort((a, b) => a.index - b.index);
    modelSurfaces.sort((a, b) => a.index - b.index);

    const planesArray = scanSurfaces.map((scan, i) => [
      getHessian(scan),
      getHessian(modelSurfaces[i]),
    ]);

    const scaleMatrix = new THREE.Matrix4().makeScale(
      scaling.x,
      scaling.y,
      scaling.z,
    );

    let solutions = [true, false].map(flip => {
      const rawTransform = transformPlanes(planesArray, flip);
      if (rawTransform === null) return null;

      const xform = new THREE.Matrix4().set(...rawTransform);
      xform.multiply(scaleMatrix);
      // const t = xform.multiply(scaleMatrix).clone();

      // compute sum of squared distances from transformed scan surface centers
      // to model surface vertexes
      const sum = scanSurfaces.reduce((acc, s, i) => {
        // Flips the result. Do not use
        // const xs = s.plane.normal.clone().applyMatrix4(t);
        const xs = s.position.clone().applyMatrix4(xform);

        modelSurfaces[i].triangles.forEach(v => {
          acc += xs.distanceToSquared(v);
        });

        return acc;
      }, 0);

      return { t: xform, sum };
    });
    solutions = solutions.filter(a => a !== null);
    if (solutions.length) {
      solutions.sort((a, b) => a.sum - b.sum);
      return solutions[0].t;
    }

    return null;
  };

  componentWillUnmount() {
    this.onRestartModelSelection();
    this.onRestartScanSelection();
  }

  render() {
    const {
      model,
      scan,
      modelData,
      modelProgress,
      planesData,
      planesProgress,
      scanData,
      scanProgress,
    } = this.props;

    const {
      showScan,
      verifyModel,
      adjustCamera,
      frameTheScan,
      scanSurfaces,
      modelSurfaces,
      frameTheModel,
      frameTheResult,
      transformedScan,
      failedTransform,
      confirmAlignmentOpen,
    } = this.state;

    const readyToVerify = scanSurfaces.length > 2 && modelSurfaces.length > 2;
    const loading =
      planesProgress < 100 || scanProgress < 100 || modelProgress < 100;

    return (
      <React.Fragment>
        <div className={css.header}>
          <h3>Aligning:</h3> <span>{cFL(scan.name)}</span> scan with{' '}
          <span>{cFL(model.name)}</span> model
        </div>
        {confirmAlignmentOpen ? (
          <React.Fragment>
            <Header content="Accept Alignment?" />
            <div className={css.Confirm}>
              <Viewer
                adjustCamera={null}
                name="Verify"
                onMouseDrag={() => {}}
                modelData={verifyModel}
                onMouseClick={() => {}}
                scanData={transformedScan}
                frame={frameTheResult}
                response={this.onConfirmViewerResponse}
              />
            </div>
            <Button primary onClick={this.onAcceptAlignment}>
              <Icon name="checkmark" /> Save
            </Button>
            <Button onClick={this.onCancelAlignment}>
              <Icon name="cancel" /> Cancel
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Confirm
              header="SKUR Alignment"
              open={failedTransform}
              content="Assisted Alignment can not proceed with the surfaces you have selected. To retry alignment with different surfaces, unselect the current surfaces and select new ones."
              onConfirm={() => this.setState({ failedTransform: false })}
              onCancel={() => this.setState({ failedTransform: false })}
            />
            <div className={css.content}>
              <Logo loading={loading} />
              <Menu inverted className={css.ToolBar} size="tiny">
                <Menu.Item header>MODEL</Menu.Item>

                <div className={css.centerBar}>
                  <Menu.Item name="Reset Camera" onClick={this.resetModelCam} />
                  <Menu.Item
                    name="Undo"
                    onClick={this.onUndoLastModelSelection}
                  />
                  <Menu.Item
                    name="Undo All"
                    onClick={this.onRestartModelSelection}
                  />

                  <Menu.Item name="Reset Camera" onClick={this.resetScanCam} />
                  <Menu.Item
                    name="Undo"
                    onClick={this.onUndoLastScanSelection}
                  />
                  <Menu.Item
                    name="Undo All"
                    onClick={this.onRestartScanSelection}
                  />
                </div>
                <Menu.Item
                  header
                  position="right"
                  onClick={() => this.setState({ showScan: !showScan })}>
                  <Icon
                    name={showScan ? 'check square outline' : 'square outline'}
                  />{' '}
                  SCAN
                </Menu.Item>
              </Menu>
              <div className={css.middle}>
                <Logo loading={loading} />
                <div className={css.left}>
                  <LoaderProgress progress={modelProgress} />
                  <Viewer
                    modelData={modelData}
                    name="Model"
                    adjustCamera={adjustCamera}
                    onMouseDrag={this.onCamMove}
                    onMouseClick={this.onModelClick}
                    frame={frameTheModel}
                    response={this.onModelViewerResponse}
                    selectedSurfaces={modelSurfaces}
                  />
                </div>

                <div className={css.divider}>|</div>

                <div className={css.stoplight}>
                  <div className={css.widgets}>
                    <Barbells scans={scanSurfaces} models={modelSurfaces} />
                    {readyToVerify && (
                      <Button
                        primary
                        size="tiny"
                        className={css.verifyButton}
                        content="Align"
                        onClick={this.onVerifyAlignment}
                      />
                    )}
                  </div>
                </div>
                <div className={css.right}>
                  <div>
                    <LoaderProgress.Group
                      items={{
                        scanProgress,
                        planesProgress,
                      }}
                    />
                  </div>
                  <Viewer
                    name="Scan"
                    scanData={scanData}
                    className={css.right}
                    modelData={planesData}
                    filters={{ showScan }}
                    frame={frameTheScan}
                    adjustCamera={adjustCamera}
                    onMouseDrag={this.onCamMove}
                    onMouseClick={this.onPlaneClick}
                    response={this.onScanViewerResponse}
                  />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
