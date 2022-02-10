/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import WithNav from 'graphql/withNav';
import accountsQuery from 'graphql/queries/Accounts';
import accountCreateMutation from 'graphql/mutations/AccountCreate';
import CurrentUserContext from 'context/currentUser';

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
  <WithNav>
    {({ modal, adminMode, writeNav }) =>
      modal === 'accountCreate' && (
        <CurrentUserContext.Consumer>
          {currentUser => (
            <Mutation
              awaitRefetchQueries
              mutation={accountCreateMutation}
              onCompleted={() => writeNav({ modal: null })}
              onError={() => {}}
              refetchQueries={[
                {
                  query: accountsQuery,
                  variables: {
                    forUser: adminMode ? null : currentUser.id,
                    activitiesLimit: 5,
                  },
                },
              ]}>
              {(create, { error: createError }) => (
                <Form
                  error={mapErrors(createError)}
                  onCancel={() => writeNav({ modal: null })}
                  onCreate={async params => {
                    const input = {
                      name: params.name,
                      description: params.description,
                    };
                    await create({ variables: { input } });
                  }}
                />
              )}
            </Mutation>
          )}
        </CurrentUserContext.Consumer>
      )
    }
  </WithNav>
);
