/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

/* App */
import projectQuery from 'graphql/queries/Project';

const WithProject = ({ id, children }) => (
  <Query query={projectQuery} variables={{ id }} pollInterval={15000}>
    {({ loading, error, data }) =>
      children({
        projectLoading: loading,
        projectError: error,
        project: data && data.project,
      })
    }
  </Query>
);
WithProject.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default WithProject;
