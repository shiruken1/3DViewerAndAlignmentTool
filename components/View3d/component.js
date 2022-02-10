/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';
import { Button } from 'semantic-ui-react';

/* App */
import Logo from 'components/Loading/Logo';
import NoWebGL from 'components/NoWebGL';
import Viewer from 'gl/Viewer';
import unitDefs from 'util/units';

import css from './View3d.module.scss';

const Tolerances = styled.div`
  z-index: 1;
  top: 0.5em;
  left: 0.5em;
  font-size: 16px;
  font-weight: 400;
  position: absolute;
  color: ${props => (props.invalid ? 'orange' : '#777')};
`;

const Label = styled.span`
  margin-left: 0.5em;
  text-decoration: ${props => (props.invalid ? 'line-through' : 'none')};
`;

const FullScreenButton = ({ fullScreen, toggleFullScreen }) => (
  <Button
    className={css.fullScreen}
    icon={fullScreen ? 'compress' : 'expand'}
    onClick={toggleFullScreen}
  />
);
FullScreenButton.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  toggleFullScreen: PropTypes.func.isRequired,
};

class ShowObjId extends React.PureComponent {
  static propTypes = {
    objId: PropTypes.string,
  };
  static defaultProps = {
    objId: null,
  };

  render() {
    const { objId } = this.props;
    return objId && <div className={css.objId}>{objId}</div>;
  }
}

export default class extends React.PureComponent {
  static propTypes = {
    scanData: PropTypes.object,
    modelData: PropTypes.object,
    diffData: PropTypes.object,

    loading: PropTypes.bool.isRequired,
    debugMode: PropTypes.bool.isRequired,
    diffSettings: PropTypes.shape({
      autoCamera: PropTypes.bool.isRequired,
      focus: PropTypes.shape({
        objectId: PropTypes.string,
        objectMode: PropTypes.string.isRequired,
        position: PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
          z: PropTypes.number.isRequired,
        }),
        target: PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
          z: PropTypes.number.isRequired,
        }),
        modelFilters: PropTypes.shape({
          all: PropTypes.bool.isRequired,
        }).isRequired,
        scanFilters: PropTypes.shape({
          red: PropTypes.bool.isRequired,
          yellow: PropTypes.bool.isRequired,
          green: PropTypes.bool.isRequired,
          cropped: PropTypes.bool.isRequired,
          all: PropTypes.bool.isRequired,
        }).isRequired,
      }),
      overview: PropTypes.shape({
        position: PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
          z: PropTypes.number.isRequired,
        }),
        target: PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
          z: PropTypes.number.isRequired,
        }),
        modelFilters: PropTypes.shape({
          red: PropTypes.bool.isRequired,
          yellow: PropTypes.bool.isRequired,
          green: PropTypes.bool.isRequired,
          insufficient: PropTypes.bool.isRequired,
          missing: PropTypes.bool.isRequired,
          all: PropTypes.bool.isRequired,
        }).isRequired,
        scanFilters: PropTypes.shape({
          red: PropTypes.bool.isRequired,
          yellow: PropTypes.bool.isRequired,
          green: PropTypes.bool.isRequired,
          cropped: PropTypes.bool.isRequired,
          all: PropTypes.bool.isRequired,
        }).isRequired,
      }),
      limits: PropTypes.shape({
        crop: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        red: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        yellow: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
      }),
      units: PropTypes.string,
    }).isRequired,
    fullScreen: PropTypes.bool.isRequired,
    modelUnits: PropTypes.string.isRequired,
    toggleFullScreen: PropTypes.func.isRequired,
    onClickObject: PropTypes.func.isRequired,
    setCamera: PropTypes.func.isRequired,
  };

  static defaultProps = {
    scanData: null,
    modelData: null,
    diffData: null,
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.canvasRef = React.createRef();
  }

  state = {
    viewer: null,
    hoverModelObjectId: null,
    lastMouseDown: [null, null],
  };

  componentDidMount() {
    try {
      const { diffSettings } = this.props;
      // set up viewer object
      if (window.WebGLRenderingContext) {
        const viewer = new Viewer({
          canvas: this.canvasRef.current,
          debugMode: this.props.debugMode,
          onChange: this.onCameraChanged,
        });
        viewer.updateSettings(diffSettings);
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({ viewer });
        requestAnimationFrame(this.update);
      }
    } catch (e) {
      // will show NoWebGL component
      console.log('WebGL error: ', e); // eslint-disable-line no-console
    }
  }

  componentDidUpdate() {
    const { viewer } = this.state;
    const { diffSettings, modelUnits } = this.props;
    const scanUnits = diffSettings.units || modelUnits;
    // eslint-disable-next-line no-console
    // console.log(`units: ${scanUnits}, ${modelUnits}`);
    const scale = unitDefs[scanUnits].to[modelUnits];
    const symbolScale = scale / unitDefs[scanUnits].to.inches;
    // eslint-disable-next-line no-console
    // console.log(diffSettings);
    // eslint-disable-next-line no-console
    // console.log(`scale: ${scale}, ${symbolScale}, ${scanUnits}`);
    if (viewer) viewer.updateSettings({ ...diffSettings, scale, symbolScale });
  }

  onCameraChanged = camera => {
    // this function is called when the user changed the camera controls
    const cameraUpdate = {
      position: {
        __typename: 'Vector3',
        ...camera.position,
      },
      target: {
        __typename: 'Vector3',
        ...camera.target,
      },
    };
    const { diffSettings, setCamera } = this.props;
    if (diffSettings.focus.objectId) {
      setCamera({
        focus: {
          ...diffSettings.focus,
          ...cameraUpdate,
          viewDirection: camera.viewDirection,
        },
      });
    } else {
      setCamera({
        overview: { ...diffSettings.overview, ...cameraUpdate },
      });
    }
  };

  onMouseMove = e => {
    const { viewer } = this.state;
    if (!viewer) {
      return;
    }
    const { offsetX, offsetY } = e.nativeEvent;
    const objId = viewer.pickModelObject(offsetX, offsetY);
    this.setState({
      hoverModelObjectId: objId,
    });
  };

  onMouseDown = e => {
    this.setState({
      lastMouseDown: [e.nativeEvent.offsetX, e.nativeEvent.offsetY],
    });
  };

  onClick = e => {
    const { viewer, lastMouseDown } = this.state;
    const { offsetX, offsetY } = e.nativeEvent;
    const MIN_DRAG_DISTANCE = 3;
    if (
      Math.abs(offsetX - lastMouseDown[0]) > MIN_DRAG_DISTANCE ||
      Math.abs(offsetY - lastMouseDown[1]) > MIN_DRAG_DISTANCE
    ) {
      return; // user dragged
    }
    const objId = viewer.pickModelObject(offsetX, offsetY);
    this.props.onClickObject(objId);
  };

  update = () => {
    const { viewer } = this.state;
    if (!viewer || !this.containerRef.current) {
      return;
    }
    const { clientHeight, clientWidth } = this.containerRef.current;
    viewer.resize(clientWidth, clientHeight);

    const {
      modelData,
      scanData,
      diffData,
      diffSettings,
      setCamera,
    } = this.props;

    const updates = viewer.updateScene(
      modelData,
      scanData,
      diffData && diffData.diffs,
      diffData && diffData.objects,
      diffData && diffData.markers,
    );
    // don't do frameAll when restoring a saved view
    if (!diffSettings.autoCamera) {
      delete updates.frameAll;
    }
    const needRender = viewer.applyUpdates(updates);
    // turn off autoCamera once bounding boxes seen
    const update = {
      autoCamera: diffSettings.autoCamera && !(modelData && scanData),
    };
    if (updates.frameAll) {
      update.overview = {
        ...diffSettings.overview,
        position: {
          __typename: 'Vector3',
          ...viewer.overviewControls.object.position,
        },
        target: {
          __typename: 'Vector3',
          ...viewer.overviewControls.target,
        },
      };
    }
    if (updates.frameFocus) {
      update.focus = {
        ...diffSettings.focus,
        position: {
          __typename: 'Vector3',
          ...viewer.focusControls.object.position,
        },
        target: {
          __typename: 'Vector3',
          ...viewer.focusControls.target,
        },
      };
    }
    setCamera(update);
    if (needRender) {
      viewer.render();
    }

    requestAnimationFrame(this.update);
  };

  render() {
    const {
      loading,
      fullScreen,
      toggleFullScreen,
      diffSettings: {
        units,
        limits: { crop, red, yellow },
      },
    } = this.props;

    const c = parseFloat(crop);
    const r = parseFloat(red);
    const y = parseFloat(yellow);

    const { viewer, hoverModelObjectId } = this.state;

    const invalids = {
      crop: false,
      red: c < r || r > c,
      yellow: y > r || y > c || r < y || c < y,
    };

    return (
      <div className={css.WebGL} ref={this.containerRef}>
        {!viewer && <NoWebGL />}
        <Tolerances invalid={Object.values(invalids).some(v => !!v)}>
          Tolerances:
          <Label invalid={invalids.crop}>{crop}</Label>,
          <Label invalid={invalids.red}>{red}</Label>,
          <Label invalid={invalids.yellow}>{yellow}</Label>
          <Label>{units}</Label>
        </Tolerances>
        <Logo loading={loading} />
        <canvas
          ref={this.canvasRef}
          onMouseMove={this.onMouseMove}
          onMouseDown={this.onMouseDown}
          onClick={this.onClick}
        />
        <ShowObjId objId={hoverModelObjectId} />
        <FullScreenButton
          fullScreen={fullScreen}
          toggleFullScreen={toggleFullScreen}
        />
      </div>
    );
  }
}
