/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

/* App */
import modelsQuery from 'graphql/queries/Models';

const WithModels = ({ projectId, children }) => (
  <Query query={modelsQuery} variables={{ projectId }} pollInterval={15000}>
    {({ loading, error, data }) =>
      children({
        modelsLoading: loading,
        modelsError: error,
        models: data && data.models,
      })
    }
  </Query>
);
WithModels.propTypes = {
  projectId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default WithModels;
