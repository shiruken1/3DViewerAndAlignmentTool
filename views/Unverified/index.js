/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

/* App */
import resendVerifyEmailMutation from 'graphql/mutations/ResendVerifyEmail';

import Unverified from './Unverified';

export const mapErrors = defaultError => error => {
  const firstError =
    error &&
    error.graphQLErrors &&
    error.graphQLErrors.length &&
    error.graphQLErrors[0];
  if (!firstError) {
    return [];
  }
  // some random error
  return [{ field: '_', message: defaultError }];
};

const UnverifiedView = ({ currentUser }) => (
  <Mutation
    displayName="ResendVerifyEmailMutation"
    mutation={resendVerifyEmailMutation}
    onError={() => {}}>
    {(resendVerifyEmail, { loading, error }) => (
      <Unverified
        currentUser={currentUser}
        onResendVerifyEmail={v =>
          resendVerifyEmail({ variables: { input: v } })
        }
        error={mapErrors('Reset password failed.')(error)}
        loading={loading}
      />
    )}
  </Mutation>
);

UnverifiedView.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

export default UnverifiedView;
