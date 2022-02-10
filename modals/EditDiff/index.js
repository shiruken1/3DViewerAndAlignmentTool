/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import WithNav from 'graphql/withNav';
import Loading from 'components/Loading';
import WithDiff from 'graphql/withDiff';
import diffUpdateMutation from 'graphql/mutations/DiffUpdate';

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
    {({ activeDiffId, modal, writeNav }) =>
      modal === 'diffEdit' && (
        <WithDiff id={activeDiffId}>
          {({ diff, diffLoading }) => (
            <Loading loading={diffLoading && !diff}>
              {() => (
                <Mutation
                  mutation={diffUpdateMutation}
                  onError={() => {}}
                  onCompleted={() => writeNav({ modal: null })}>
                  {(update, { error: updateError }) => (
                    <Form
                      diff={diff}
                      error={mapErrors(updateError)}
                      onCancel={() => writeNav({ modal: null })}
                      onUpdate={async params => {
                        update({
                          variables: {
                            input: {
                              id: activeDiffId,
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
        </WithDiff>
      )
    }
  </WithNav>
);
