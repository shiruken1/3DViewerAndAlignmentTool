/* NPM */
import React from 'react';

/* App */
import WithDiffSettings from 'graphql/withDiffSettings';

import VarianceList from './component';

export default ({ diffData, modelUnits }) =>
  diffData && (
    <WithDiffSettings>
      {({ writeDiffSettings, ...diffSettings }) => (
        <VarianceList
          diffData={diffData}
          diffSettings={diffSettings}
          mode="max"
          modelUnits={modelUnits}
          onClickRow={id => {
            // Caution: this code must match that in View3d
            if (id === diffSettings.focus.objectId) {
              // exit inspect mode
              writeDiffSettings({
                focus: {
                  ...diffSettings.focus,
                  objectId: null,
                },
                sortby: {
                  ...diffSettings.sortby,
                  column: diffSettings.sortby.column,
                  direction: diffSettings.sortby.direction,
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
                sortby: {
                  ...diffSettings.sortby,
                  column: diffSettings.sortby.column,
                  direction: diffSettings.sortby.direction,
                },
              });
            }
          }}
        />
      )}
    </WithDiffSettings>
  );
