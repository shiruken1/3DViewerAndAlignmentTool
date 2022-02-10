/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import WithDiffSettings from 'graphql/withDiffSettings';
import WithNav from 'graphql/withNav';
import DiffSettings from 'util/DiffSettings';

import Save from './Save';

const Controls = ({ diff }) => (
  <WithNav>
    {({ activeDiffViewId, writeNav }) => {
      function showSave() {
        writeNav({ modal: 'saveDiffView' });
      }
      function showShare() {
        writeNav({ modal: 'shareDiffView' });
      }
      function showAugmentedFiles() {
        writeNav({ modal: 'augmentedFiles' });
      }
      return (
        <WithDiffSettings>
          {({ writeDiffSettings }) => {
            function restoreView(view) {
              writeDiffSettings(DiffSettings.fromDiffView(view));
              writeNav({
                activeDiffViewId: view.id,
              });
            }
            return (
              <Save
                activeDiffViewId={activeDiffViewId}
                diff={diff}
                showAugmentedFiles={showAugmentedFiles}
                showSave={showSave}
                showShare={showShare}
                restoreView={restoreView}
              />
            );
          }}
        </WithDiffSettings>
      );
    }}
  </WithNav>
);

Controls.propTypes = {
  diff: PropTypes.object.isRequired,
};

export default Controls;
