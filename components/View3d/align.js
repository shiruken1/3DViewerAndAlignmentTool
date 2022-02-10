/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

/* App */
import NoWebGL from 'components/NoWebGL';
import Viewer from 'gl/AAViewer';

import css from './View3d.module.scss';

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

export default class extends React.PureComponent {
  static propTypes = {
    filters: PropTypes.object,
    name: PropTypes.string.isRequired,
    scanData: PropTypes.object,
    fullScreen: PropTypes.bool,
    modelData: PropTypes.object,
    adjustCamera: PropTypes.number,
    toggleFullScreen: PropTypes.func,
    onMouseDrag: PropTypes.func.isRequired,
    onMouseClick: PropTypes.func.isRequired,
    response: PropTypes.func.isRequired,
    frame: PropTypes.bool,
    selectedSurfaces: PropTypes.array,
  };

  static defaultProps = {
    frame: null,
    filters: null,
    scanData: null,
    modelData: null,
    fullScreen: null,
    adjustCamera: null,
    toggleFullScreen: null,
    selectedSurfaces: null,
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.canvasRef = React.createRef();
  }

  state = {
    viewer: null,
    masterCamera: false,
    lastMouseDown: [null, null],
  };

  componentDidMount() {
    try {
      const { filters, name, selectedSurfaces } = this.props;
      // set up viewer object
      if (window.WebGLRenderingContext) {
        const viewer = new Viewer(this.canvasRef.current, name);
        viewer.updateSettings({ filters, selectedSurfaces });
        this.setState({ viewer }); // eslint-disable-line react/no-did-mount-set-state
        requestAnimationFrame(this.update);
      }
    } catch (e) {
      // will show NoWebGL component
      console.log('WebGL error: ', e); // eslint-disable-line no-console
    }
  }

  componentDidUpdate() {
    const { viewer } = this.state;
    const { filters, selectedSurfaces } = this.props;
    viewer.updateSettings({ filters, selectedSurfaces });
  }

  // Bad idea...
  // onMouseEnter = e => {
  //   this.setState({ masterCamera: true });
  // };

  // onMouseLeave = e => {
  //   this.setState({ masterCamera: false });
  // };

  onMouseMove = e => {
    const { offsetX, offsetY, buttons } = e.nativeEvent;
    const leftClicking = buttons === 1;
    if (!leftClicking) return;

    const {
      viewer,
      lastMouseDown: [lastX, lastY],
    } = this.state;
    const canvas = this.canvasRef.current;
    if (!viewer || !canvas) return;

    // if actually dragging
    if (offsetX !== lastX || offsetY !== lastY) {
      this.props.onMouseDrag({ x: offsetX, y: offsetY });
    }
  };

  onMouseDown = e => {
    const { viewer } = this.state;
    if (!viewer) return;

    const { offsetX, offsetY, target, button } = e.nativeEvent;
    if (target.nodeName !== 'CANVAS') return; // no need to proceed
    const leftClicking = button === 0;
    if (!leftClicking) return; // don't register right clicks, please

    this.setState({
      masterCamera: true,
      lastMouseDown: [offsetX, offsetY],
    });
  };

  onMouseUp = e => {
    const {
      viewer,
      lastMouseDown: [lastX, lastY],
    } = this.state;

    const { offsetX, offsetY, target, button } = e.nativeEvent;
    const leftClicking = button === 0;

    if (!leftClicking) return; // don't register right clicks
    if (target.nodeName !== 'CANVAS') return; // no need to proceed
    this.setState({ masterCamera: false });

    const MIN_DRAG_DISTANCE = 3;
    if (
      Math.abs(offsetX - lastX) > MIN_DRAG_DISTANCE ||
      Math.abs(offsetY - lastY) > MIN_DRAG_DISTANCE
    ) {
      return; // user dragged
    }

    const selected = viewer.pickObject(offsetX, offsetY);
    this.props.onMouseClick(selected);
  };

  update = () => {
    const { viewer, masterCamera } = this.state;
    if (!viewer || !this.containerRef.current) {
      return;
    }
    const { modelData, scanData, adjustCamera, frame, response } = this.props;

    if (!viewer.name) {
      if (modelData && modelData.name) {
        viewer.name = modelData.name;
      } else if (scanData && scanData.name) {
        viewer.name = scanData.name;
      }
    }

    const { clientHeight, clientWidth } = this.containerRef.current;

    viewer.resize(clientWidth, clientHeight);
    if (frame) {
      viewer.restoreCamera();
      response(false);
    }
    viewer.render(modelData, scanData, masterCamera, adjustCamera);

    requestAnimationFrame(this.update);
  };

  render() {
    const { fullScreen, toggleFullScreen } = this.props;
    const { viewer } = this.state;

    return (
      <div className={css.WebGL} ref={this.containerRef}>
        {!viewer && <NoWebGL />}
        <canvas
          ref={this.canvasRef}
          onMouseMove={this.onMouseMove}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        />
        {toggleFullScreen ? (
          <FullScreenButton
            fullScreen={fullScreen}
            toggleFullScreen={toggleFullScreen}
          />
        ) : null}
      </div>
    );
  }
}
