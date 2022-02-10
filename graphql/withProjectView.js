/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

/* App */
import projectViewQuery from 'graphql/queries/ProjectView';

const WithProjectView = ({ projectId, children }) => (
  <Query
    query={projectViewQuery}
    variables={{ projectId }}
    pollInterval={15000}>
    {({ loading, error, data }) =>
      children({ loading, error, project: data && data.project })
    }
  </Query>
);
WithProjectView.propTypes = {
  projectId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default WithProjectView;
