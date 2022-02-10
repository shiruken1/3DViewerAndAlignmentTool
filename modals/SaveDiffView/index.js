/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import Loading from 'components/Loading';
import WithDiff from 'graphql/withDiff';
import WithDiffSettings from 'graphql/withDiffSettings';
import WithNav from 'graphql/withNav';
import diffViewCreateMutation from 'graphql/mutations/DiffViewCreate';
import diffQuery from 'graphql/queries/Diff';
import DiffSettings from 'util/DiffSettings';

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
  <WithDiffSettings>
    {diffSettings => (
      <WithNav>
        {({ activeDiffId, modal, writeNav }) =>
          modal === 'saveDiffView' && (
            <WithDiff id={activeDiffId}>
              {({ diff, diffLoading }) => (
                <Loading loading={diffLoading && !diff}>
                  {() => (
                    <Mutation
                      mutation={diffViewCreateMutation}
                      onError={() => {}}
                      refetchQueries={[
                        {
                          query: diffQuery,
                          variables: { id: activeDiffId },
                        },
                      ]}>
                      {(create, { error: createError }) => (
                        <Form
                          diffSettings={diffSettings}
                          error={mapErrors(createError)}
                          onCancel={() => writeNav({ modal: null })}
                          onSave={async params => {
                            const { data } = await create({
                              variables: {
                                input: DiffSettings.toDiffViewInput({
                                  activeDiffId,
                                  diff,
                                  diffSettings,
                                  params,
                                }),
                              },
                            });
                            if (!data) {
                              return;
                            }
                            writeNav({
                              modal: null,
                              activeDiffViewId: data.diffViewCreate.diffView.id,
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
    )}
  </WithDiffSettings>
);
