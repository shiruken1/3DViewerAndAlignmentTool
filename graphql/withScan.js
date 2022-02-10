/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

/* App */
import scanQuery from 'graphql/queries/Scan';

const WithScan = ({ id, children }) => (
  <Query query={scanQuery} variables={{ id }} pollInterval={15000}>
    {({ loading, error, data }) =>
      children({
        scanLoading: loading,
        scanError: error,
        scan: data && data.scan,
      })
    }
  </Query>
);
WithScan.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default WithScan;
