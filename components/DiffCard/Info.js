/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import format from 'lib/format';
import InfoTable from 'components/InfoTable';
import ObjId from 'components/ObjId';

export default class extends React.PureComponent {
  static propTypes = {
    diff: PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string,
      createdBy: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      }).isRequired,
      createdOn: PropTypes.string.isRequired,
    }).isRequired,
  };
  render() {
    const { diff } = this.props;
    const rows = [
      { label: 'Date Created', value: format.date(diff.createdOn) },
      {
        label: 'Created By',
        value: `${diff.createdBy.firstName[0]}. ${diff.createdBy.lastName}`,
      },
    ];
    return (
      <React.Fragment>
        <p>{diff.description}</p>
        <InfoTable labelStyle={{ width: '80px' }} rows={rows} />
        <div>
          <ObjId id={diff.id} label="diff" />
          <ObjId id={diff.scanId} label="scan" />
          <ObjId id={diff.modelId} label="model" />
        </div>
      </React.Fragment>
    );
  }
}
