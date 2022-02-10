/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

/* App */
import diffsQuery from 'graphql/queries/Diffs';

const WithDiffs = ({ projectId, children }) => (
  <Query
    query={diffsQuery}
    variables={{ projectId }}
    pollInterval={15000}
    // return data even if errors
    // will return null for docs with missing fields
    errorPolicy="all">
    {({ loading, error, data }) =>
      children({
        diffsLoading: loading,
        diffsError: error,
        // filter out null docs
        diffs: data && data.diffs && data.diffs.filter(d => !!d),
      })
    }
  </Query>
);
WithDiffs.propTypes = {
  projectId: PropTypes.string,
  children: PropTypes.func.isRequired,
};
WithDiffs.defaultProps = {
  projectId: null,
};

export default WithDiffs;
