/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/* App */
import DiffControls from 'components/DiffControls';
import LoaderProgress from 'components/LoaderProgress';
import View3d from 'components/View3d';

import css from './Diff.module.scss';

function augmentDiffData(objdiffData) {
  return (
    objdiffData && {
      objects: objdiffData.objects,
      diffs: _.mapValues(objdiffData.diffs, d =>
        d.map(v => ({
          ...v,
          seen: v.seenPoints / v.pointsInObj > 0.1,
        })),
      ),
      markers: objdiffData.markers,
    }
  );
}

export default class extends React.PureComponent {
  static propTypes = {
    diff: PropTypes.object.isRequired,
    diffView: PropTypes.object,
    focusObjectId: PropTypes.string,
    fullScreen: PropTypes.bool.isRequired,
    modelData: PropTypes.object,
    modelProgress: PropTypes.number.isRequired,
    objdiffData: PropTypes.object,
    objdiffProgress: PropTypes.number.isRequired,
    scanData: PropTypes.object,
    scanProgress: PropTypes.number.isRequired,
    setFocusObjectId: PropTypes.func.isRequired,
  };
  static defaultProps = {
    diffView: null,
    focusObjectId: null,
    modelData: null,
    objdiffData: null,
    scanData: null,
  };

  render() {
    const {
      diff,
      diffView,
      focusObjectId,
      fullScreen,
      modelData,
      modelProgress,
      objdiffData,
      objdiffProgress,
      scanData,
      scanProgress,
      setFocusObjectId,
    } = this.props;

    const diffData = augmentDiffData(objdiffData);

    if (fullScreen) {
      return (
        <React.Fragment>
          <View3d
            diffView={diffView}
            className={css.fullScreen}
            scanData={scanData}
            modelData={modelData}
            diffData={diffData}
            modelUnits={diff.model.units}
            loading={
              scanProgress < 100 || modelProgress < 100 || objdiffProgress < 100
            }
          />
        </React.Fragment>
      );
    }
    return (
      <div className={css.content}>
        <div className={css.middle}>
          <div className={css.left}>
            <LoaderProgress.Group
              items={{
                scanProgress,
                modelProgress,
                objdiffProgress,
              }}
            />
            <View3d
              diffView={diffView}
              scanData={scanData}
              modelData={modelData}
              diffData={diffData}
              loading={
                scanProgress < 100 ||
                modelProgress < 100 ||
                objdiffProgress < 100
              }
              modelUnits={diff.model.units}
            />
          </div>
          <DiffControls
            diff={diff}
            diffData={diffData}
            focusObjectId={focusObjectId}
            modelUnits={diff.model.units}
            setFocusObjectId={setFocusObjectId}
          />
        </div>
      </div>
    );
  }
}
