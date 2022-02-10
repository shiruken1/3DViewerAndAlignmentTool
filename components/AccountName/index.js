/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import WithNav from 'graphql/withNav';

import CurrentUserContext from 'context/currentUser';

const AccountName = ({ account }) => (
  <CurrentUserContext.Consumer>
    {currentUser => (
      <WithNav>
        {({ adminMode }) => {
          if (account.name) {
            return account.name;
          }
          if (!adminMode || account.owner.id === currentUser.id) {
            return 'My Workspace';
          }
          return (
            <span>
              &lt;
              {account.owner.firstName} {account.owner.lastName}
              &gt;
            </span>
          );
        }}
      </WithNav>
    )}
  </CurrentUserContext.Consumer>
);
AccountName.propTypes = {
  account: PropTypes.object.isRequired,
};

export default AccountName;
