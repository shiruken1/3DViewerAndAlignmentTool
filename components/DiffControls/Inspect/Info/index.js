/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import WithDiffSettings from 'graphql/withDiffSettings';

import Info from './Info';

const Controls = ({ diffData, units }) => (
  <WithDiffSettings>
    {({ focus: { objectId }, ...diffSettings }) => {
      const object =
        objectId && diffData.diffs[objectId] && diffData.diffs[objectId][0];
      const otherVariances =
        objectId && diffData.diffs[objectId] && diffData.diffs[objectId];
      return (
        object && (
          <Info
            object={object}
            units={units}
            userUnits={diffSettings.units}
            otherVariances={otherVariances}
          />
        )
      );
    }}
  </WithDiffSettings>
);

Controls.propTypes = {
  diffData: PropTypes.object.isRequired,
  units: PropTypes.string.isRequired,
};

export default Controls;
