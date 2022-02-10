/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import CurrentUserContext from 'context/currentUser';
import WithNav from 'graphql/withNav';
import resetPasswordMutation from 'graphql/mutations/ResetPassword';

import Form from './component';

export const mapErrors = error => {
  const firstError =
    error &&
    error.graphQLErrors &&
    error.graphQLErrors.length &&
    error.graphQLErrors[0];
  if (!firstError) {
    return [];
  }
  if (firstError.message === 'Forbidden') {
    return [
      {
        field: '_',
        message: 'You do not have permission for the operation.',
      },
    ];
  }
  if (firstError.message === 'Validation Error') {
    return Object.keys(firstError.state).map(k => ({
      field: k,
      message: firstError.state[k][0],
    }));
  }
  if (firstError.message === 'Password too weak') {
    return [
      {
        field: '_',
        message: 'Password too weak.',
      },
    ];
  }
  if (firstError.message === 'IncorrectPassword') {
    return [
      {
        field: '_',
        message: 'Incorrect password entered.',
      },
    ];
  }
  // some random error
  return [{ field: '_', message: 'Create failed.' }];
};

export default () => (
  <CurrentUserContext.Consumer>
    {currentUser => (
      <WithNav>
        {({ modal, writeNav }) =>
          modal === 'changePassword' && (
            <Mutation mutation={resetPasswordMutation} onError={() => {}}>
              {(resetPassword, { error: resetPasswordError }) => (
                <Form
                  userid={currentUser.id}
                  error={mapErrors(resetPasswordError)}
                  onCancel={() => writeNav({ modal: null })}
                  onResetPassword={async v => {
                    const result = await resetPassword({
                      variables: { input: v },
                    });
                    if (!result) {
                      return;
                    }
                    // eslint-disable-next-line no-console
                    console.log(result);
                    // eslint-disable-next-line no-console
                    console.log('error ', resetPasswordError);
                    writeNav({ modal: null });
                  }}
                />
              )}
            </Mutation>
          )
        }
      </WithNav>
    )}
  </CurrentUserContext.Consumer>
);
