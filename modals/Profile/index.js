/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import CurrentUserContext from 'context/currentUser';
import WithNav from 'graphql/withNav';
import userUpdateMutation from 'graphql/mutations/UserUpdate';

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
  // some random error
  return [{ field: '_', message: 'Create failed.' }];
};

export default () => (
  <CurrentUserContext.Consumer>
    {currentUser => (
      <WithNav>
        {({ modal, writeNav }) =>
          modal === 'profile' && (
            <Mutation
              mutation={userUpdateMutation}
              onError={() => {}}
              onCompleted={() => writeNav({ modal: null })}>
              {(update, { error: updateError }) => (
                <Form
                  user={currentUser}
                  error={mapErrors(updateError)}
                  onCancel={() => writeNav({ modal: null })}
                  onSave={updates => {
                    update({
                      variables: { input: { id: currentUser.id, updates } },
                    });
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
