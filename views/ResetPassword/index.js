/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import resetPasswordMutation from 'graphql/mutations/ResetPassword';

import ResetPassword from './ResetPassword';

export const mapErrors = defaultError => error => {
  const firstError =
    error &&
    error.graphQLErrors &&
    error.graphQLErrors.length &&
    error.graphQLErrors[0];
  if (!firstError) {
    return [];
  }
  if (firstError.message === 'Unauthorized') {
    return [
      {
        field: '_',
        message: 'Incorrect email or password.',
      },
    ];
  }
  if (firstError.message === 'Password too weak') {
    return [
      {
        field: '_',
        message: 'Password too weak.',
      },
    ];
  }
  if (firstError.message === 'Validation Error') {
    return Object.keys(firstError.state).map(k => ({
      field: k,
      message: firstError.state[k][0],
    }));
  }
  // some random error
  return [{ field: '_', message: defaultError }];
};

export default () => (
  <Mutation
    displayName="ResetPasswordMutation"
    mutation={resetPasswordMutation}
    onError={() => {}}>
    {(resetPassword, { loading, error: resetPasswordError }) => (
      <ResetPassword
        onResetPassword={v => resetPassword({ variables: { input: v } })}
        error={mapErrors('Reset password failed.')(resetPasswordError)}
        loading={loading}
      />
    )}
  </Mutation>
);
