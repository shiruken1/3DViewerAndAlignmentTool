/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

/* App */
import accountsQuery from 'graphql/queries/Accounts';

const WithAccounts = ({ adminMode, currentUser, children }) => (
  <Query
    query={accountsQuery}
    variables={{
      forUser: adminMode ? null : currentUser.id,
      activitiesLimit: 5,
    }}
    pollInterval={15000}>
    {({ loading, error, data }) =>
      children({
        accountsLoading: loading,
        accountsError: error,
        accounts: data && data.accounts,
      })
    }
  </Query>
);
WithAccounts.propTypes = {
  adminMode: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};

export default WithAccounts;
