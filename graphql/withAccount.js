/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

/* App */
import accountQuery from 'graphql/queries/Account';

const WithAccount = ({ id, children }) => (
  <Query query={accountQuery} variables={{ id }} pollInterval={5000}>
    {({ loading, error, data }) =>
      children({
        accountLoading: loading,
        accountError: error,
        account: data && data.account,
      })
    }
  </Query>
);
WithAccount.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default WithAccount;
