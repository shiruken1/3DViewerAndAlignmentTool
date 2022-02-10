/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

/* App */
import modelQuery from 'graphql/queries/Model';

const WithModel = ({ id, children }) => (
  <Query query={modelQuery} variables={{ id }} pollInterval={15000}>
    {({ loading, error, data }) =>
      children({
        modelLoading: loading,
        modelError: error,
        model: data && data.model,
      })
    }
  </Query>
);
WithModel.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default WithModel;
