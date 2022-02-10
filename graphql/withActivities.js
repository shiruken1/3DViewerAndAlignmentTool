/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

/* App */
import activitiesQuery from 'graphql/queries/Activities';

const WithActivities = ({ projectId, children }) => (
  <Query query={activitiesQuery} variables={{ projectId }} pollInterval={15000}>
    {({ loading, error, data }) =>
      children({
        activitiesLoading: loading,
        activitiesError: error,
        activities: data.project,
      })
    }
  </Query>
);
WithActivities.propTypes = {
  projectId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default WithActivities;
