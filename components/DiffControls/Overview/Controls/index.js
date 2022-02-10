/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import WithDiffSettings from 'graphql/withDiffSettings';
import WithNav from 'graphql/withNav';
import unitDefs from 'util/units';

import FilterControls from './FilterControls';

const Controls = ({ diffData, modelUnits }) =>
  diffData && (
    <WithNav>
      {({ writeNav }) => (
        <WithDiffSettings>
          {({ writeDiffSettings, ...diffSettings }) => {
            function setLimit({ limit, value }) {
              writeDiffSettings({
                limits: {
                  ...diffSettings.limits,
                  [limit]: value,
                },
              });
              writeNav({ activeDiffViewId: null });
            }
            function setUnits(newUnits) {
              const { limits, units } = diffSettings;
              const scale = unitDefs[units || modelUnits].to[newUnits];

              const newLimits = {
                __typename: 'DiffLimits',
                crop: (limits.crop * scale).toFixed(4),
                red: (limits.red * scale).toFixed(4),
                yellow: (limits.yellow * scale).toFixed(4),
              };
              writeDiffSettings({ limits: newLimits, units: newUnits });
              writeNav({ activeDiffViewId: null });
            }
            function setFilter(filterSet, filterName, value) {
              const prevFilters = diffSettings.overview[filterSet];
              writeDiffSettings({
                overview: {
                  ...diffSettings.overview,
                  [filterSet]: {
                    ...prevFilters,
                    [filterName]: value,
                  },
                },
              });
              writeNav({ activeDiffViewId: null });
            }
            return (
              <FilterControls
                diffData={diffData}
                diffSettings={diffSettings}
                modelUnits={modelUnits}
                setLimit={setLimit}
                setUnits={setUnits}
                setFilter={setFilter}
              />
            );
          }}
        </WithDiffSettings>
      )}
    </WithNav>
  );

Controls.propTypes = {
  diffData: PropTypes.object,
  modelUnits: PropTypes.string.isRequired,
};
Controls.defaultProps = {
  diffData: null,
};

export default Controls;
