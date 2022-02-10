/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import WithNav from 'graphql/withNav';
import Loading from 'components/Loading';
import WithModel from 'graphql/withModel';
import modelUpdateMutation from 'graphql/mutations/ModelUpdate';

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
    {({ activeModelId, modal, writeNav }) =>
      modal === 'modelEdit' && (
        <WithModel id={activeModelId}>
          {({ model, modelLoading }) => (
            <Loading loading={modelLoading && !model}>
              {() => (
                <Mutation
                  mutation={modelUpdateMutation}
                  onError={() => {}}
                  onCompleted={() => writeNav({ modal: null })}>
                  {(update, { error: updateError }) => (
                    <Form
                      model={model}
                      error={mapErrors(updateError)}
                      onCancel={() => writeNav({ modal: null })}
                      onUpdate={async params => {
                        update({
                          variables: {
                            input: {
                              id: activeModelId,
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
        </WithModel>
      )
    }
  </WithNav>
);
