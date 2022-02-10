/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import WithNav from 'graphql/withNav';
import Loading from 'components/Loading';
import WithAccount from 'graphql/withAccount';
import accountQuery from 'graphql/queries/Account';
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
  return [{ field: '_', message: 'Editing failed.' }];
};

export default () => (
  <WithNav>
    {({ activeAccountId, modal, writeNav }) =>
      modal === 'accountEdit' && (
        <WithAccount id={activeAccountId}>
          {({ account, accountLoading }) => (
            <Loading loading={accountLoading && !account}>
              {() => (
                <Mutation
                  mutation={accountUpdateMutation}
                  onError={() => {}}
                  onCompleted={() => writeNav({ modal: null })}
                  refetchQueries={[
                    {
                      query: accountQuery,
                      variables: { id: activeAccountId },
                    },
                  ]}>
                  {(update, { error: updateError }) => (
                    <Form
                      account={account}
                      error={mapErrors(updateError)}
                      onCancel={() => writeNav({ modal: null })}
                      onUpdate={async params => {
                        update({
                          variables: {
                            input: {
                              id: activeAccountId,
                              updates: {
                                name: params.name,
                                description: params.description,
                              },
                            },
                          },
                        });
                      }}
                    />
                  )}
                </Mutation>
              )}
            </Loading>
          )}
        </WithAccount>
      )
    }
  </WithNav>
);
