/* NPM */
import React from 'react';

/* App */
import WithDiffSettings from 'graphql/withDiffSettings';
import WithNav from 'graphql/withNav';

import FilterControls from './FilterControls';

const Controls = () => (
  <WithNav>
    {({ writeNav }) => (
      <WithDiffSettings>
        {({ writeDiffSettings, ...diffSettings }) => {
          function setFilter(filterSet, filterName, value) {
            const prevFilters = diffSettings.focus[filterSet];
            writeDiffSettings({
              focus: {
                ...diffSettings.focus,
                [filterSet]: {
                  ...prevFilters,
                  [filterName]: value,
                },
              },
            });
            writeNav({ activeDiffViewId: null });
          }
          function setViewDirection(viewDirection) {
            writeDiffSettings({
              focus: {
                ...diffSettings.focus,
                viewDirection,
              },
            });
            writeNav({ activeDiffViewId: null });
          }
          function setObjectMode(objectMode) {
            writeDiffSettings({
              focus: {
                ...diffSettings.focus,
                objectMode,
              },
            });
            writeNav({ activeDiffViewId: null });
          }
          return (
            <FilterControls
              diffSettings={diffSettings}
              setFilter={setFilter}
              setViewDirection={setViewDirection}
              setObjectMode={setObjectMode}
            />
          );
        }}
      </WithDiffSettings>
    )}
  </WithNav>
);

export default Controls;
