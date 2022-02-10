/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import Loading from 'components/Loading';
import WithAccount from './withAccount';
import WithNav from './withNav';

const WithActiveAccount = ({ children }) => (
  <WithNav>
    {({ activeAccountId, adminMode, view, writeNav }) => {
      if (!activeAccountId) return null;
      return (
        <WithAccount id={activeAccountId}>
          {({ account, accountLoading }) => (
            <Loading loading={accountLoading && !account}>
              {() => children({ adminMode, account, view, writeNav })}
            </Loading>
          )}
        </WithAccount>
      );
    }}
  </WithNav>
);

WithActiveAccount.propTypes = {
  children: PropTypes.func.isRequired,
};

export default WithActiveAccount;
