/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

/* App */
import signOutMutation from 'graphql/mutations/SignOut';

// just reload the page on sign out
// this is a simple way to ensure the cache is cleared
const afterSignOut = () => {
  window.location.reload(true);
};

const WithSignOut = ({ children }) => (
  <Mutation mutation={signOutMutation} update={afterSignOut}>
    {signOut => children({ signOut })}
  </Mutation>
);
WithSignOut.propTypes = {
  children: PropTypes.func.isRequired,
};

export default WithSignOut;
