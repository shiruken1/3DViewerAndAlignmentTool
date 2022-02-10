/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import WithNav from 'graphql/withNav';

import ObjId from './ObjId';

export default class extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
  };
  static defaultProps = {
    id: null,
    label: null,
  };

  render() {
    return (
      <WithNav>
        {({ adminMode }) => {
          if (!adminMode) {
            return null;
          }
          return <ObjId {...this.props} />;
        }}
      </WithNav>
    );
  }
}
