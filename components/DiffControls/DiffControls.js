/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import Tab from 'components/Tab';
import DiffInspect from './Inspect';
import DiffOverview from './Overview';
import WithDiffSettings from '../../graphql/withDiffSettings';

import css from './DiffControls.module.scss';

export default class extends React.PureComponent {
  static propTypes = {
    diff: PropTypes.object.isRequired,
    diffData: PropTypes.object,
    focusObjectId: PropTypes.string,
    modelUnits: PropTypes.string.isRequired,
    setFocusObjectId: PropTypes.func.isRequired,
  };
  static defaultProps = {
    diffData: null,
    focusObjectId: null,
  };
  render() {
    const {
      diff,
      diffData,
      focusObjectId,
      modelUnits,
      setFocusObjectId,
    } = this.props;
    const panes = [
      {
        name: 'OVERVIEW',
        render: () => (
          <WithDiffSettings>
            {({ ...diffSettings }) => (
              <DiffOverview
                diff={diff}
                diffData={diffData}
                diffSettings={diffSettings}
                modelUnits={modelUnits}
              />
            )}
          </WithDiffSettings>
        ),
        value: 'overview',
      },
      {
        name: 'INSPECT',
        render: () => (
          <DiffInspect
            diff={diff}
            diffData={diffData}
            modelUnits={modelUnits}
          />
        ),
        value: 'inspect',
        content: 'Select an object or row in the Variance List',
      },
    ];
    return (
      <div className={css.Controls}>
        <Tab
          activeIndex={!focusObjectId ? 'overview' : 'inspect'}
          panes={panes}
          onSetActiveIndex={index => {
            if (index === 'overview') {
              setFocusObjectId(null);
            }
          }}
          scrollable
        />
      </div>
    );
  }
}
