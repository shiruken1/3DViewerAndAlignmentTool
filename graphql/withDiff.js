/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

/* App */
import diffQuery from 'graphql/queries/Diff';

const WithDiff = ({ id, children }) => {
  if (!id) {
    return (
      <React.Fragment>
        {children({
          diffLoading: false,
          diff: null,
          diffError: null,
        })}
      </React.Fragment>
    );
  }
  return (
    <Query query={diffQuery} variables={{ id }} pollInterval={15000}>
      {({ loading, error, data }) =>
        children({
          diffLoading: loading,
          diffError: error,
          diff: data && data.diff,
        })
      }
    </Query>
  );
};

WithDiff.propTypes = {
  id: PropTypes.string,
  children: PropTypes.func.isRequired,
};

WithDiff.defaultProps = {
  id: null,
};

export default WithDiff;
