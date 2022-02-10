/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import WithNav from 'graphql/withNav';
import WithActiveAccount from 'graphql/withActiveAccount';
import sendRequestDiffsMutation from 'graphql/mutations/SendRequestDiffs';

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
      modal === 'buyDiffs' && (
        <WithActiveAccount>
          {({ account }) => (
            <Mutation mutation={sendRequestDiffsMutation} onError={() => {}}>
              {(sendRequestDiffs, { error: sendRequestDiffsError }) => (
                <Form
                  error={mapErrors(sendRequestDiffsError)}
                  onCancel={() => {
                    writeNav({ modal: null });
                  }}
                  onBuy={async params => {
                    const input = {
                      id: account.id,
                      diffsRequested: params.diffsRequested,
                    };
                    const { data } = await sendRequestDiffs({
                      variables: { input },
                    });
                    if (!data) {
                      return;
                    }
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
