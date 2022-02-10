/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import Tab from 'components/Tab';
import VarianceList from 'components/VarianceList';

import Save from '../Save';

import Controls from './Controls';
import Info from './Info';

export default class extends React.PureComponent {
  static propTypes = {
    diff: PropTypes.object.isRequired,
    diffSettings: PropTypes.object.isRequired,
    diffData: PropTypes.object,
    modelUnits: PropTypes.string.isRequired,
  };
  static defaultProps = {
    diffData: null,
  };
  state = {
    activeIndex: 'filter',
  };

  render() {
    const { diff, diffSettings, diffData, modelUnits } = this.props;
    const { activeIndex } = this.state;
    const panes = [
      {
        name: 'Filter',
        render: () => <Controls diffData={diffData} modelUnits={modelUnits} />,
        value: 'filter',
      },
      {
        name: 'Info',
        render: () => <Info diff={diff} diffSettings={diffSettings} />,
        value: 'info',
      },
      {
        name: 'Save',
        render: () => <Save diff={diff} />,
        value: 'save',
      },
    ];
    return (
      <React.Fragment>
        <Tab
          activeIndex={activeIndex}
          panes={panes}
          onSetActiveIndex={index => this.setState({ activeIndex: index })}
        />
        <VarianceList diffData={diffData} modelUnits={modelUnits} />
      </React.Fragment>
    );
  }
}
