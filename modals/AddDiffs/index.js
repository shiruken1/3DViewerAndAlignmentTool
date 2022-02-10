/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import WithNav from 'graphql/withNav';
import WithActiveAccount from 'graphql/withActiveAccount';
import accountUpdateMutation from 'graphql/mutations/AccountUpdate';
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
    {({ modal, writeNav }) =>
      modal === 'addDiffs' && (
        <WithActiveAccount>
          {({ account }) => (
            <Mutation mutation={accountUpdateMutation} onError={() => {}}>
              {(update, { error: updateError }) => (
                <Form
                  account={account}
                  error={mapErrors(updateError)}
                  onCancel={() => writeNav({ modal: null })}
                  onSave={updates => {
                    update({
                      variables: { input: { id: account.id, updates } },
                    });
                    writeNav({ modal: null });
                  }}
                />
              )}
            </Mutation>
          )}
        </WithActiveAccount>
      )
    }
  </WithNav>
);
