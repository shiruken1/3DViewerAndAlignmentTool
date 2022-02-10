/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import WithDiffSettings from 'graphql/withDiffSettings';
import WithNav from 'graphql/withNav';

import Component from './component';

const View3d = props => (
  <WithNav>
    {({ debugMode, fullScreen, writeNav }) => (
      <WithDiffSettings>
        {({ writeDiffSettings, ...diffSettings }) => (
          <Component
            debugMode={debugMode}
            diffSettings={diffSettings}
            fullScreen={fullScreen}
            toggleFullScreen={() => {
              writeNav({ fullScreen: !fullScreen });
            }}
            onClickObject={id => {
              // Caution: this code must match that in VarianceList
              if (id === diffSettings.focus.objectId) {
                // exit inspect mode
                writeDiffSettings({
                  focus: {
                    ...diffSettings.focus,
                    objectId: null,
                  },
                });
              } else {
                // enter inspect mode, copying settings from overview
                writeDiffSettings({
                  focus: {
                    ...diffSettings.focus,
                    position: diffSettings.overview.position,
                    target: diffSettings.overview.target,
                    objectId: id,
                    viewDirection: 'free',
                  },
                });
              }
            }}
            setCamera={(update, clearDiffView) => {
              writeDiffSettings(update);
              if (clearDiffView) {
                writeNav({ activeDiffViewId: null });
              }
            }}
            {...props}
          />
        )}
      </WithDiffSettings>
    )}
  </WithNav>
);

View3d.propTypes = {
  diffView: PropTypes.object,
};

View3d.defaultProps = {
  diffView: null,
};

export default View3d;
