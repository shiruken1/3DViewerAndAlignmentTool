/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import WithNav from 'graphql/withNav';
import Loading from 'components/Loading';
import WithProject from 'graphql/withProject';
import accountQuery from 'graphql/queries/Account';
import projectUpdateMutation from 'graphql/mutations/ProjectUpdate';

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
    {({ activeProjectId, activeAccountId, modal, writeNav }) =>
      modal === 'projectEdit' && (
        <WithProject id={activeProjectId}>
          {({ project, projectLoading }) => (
            <Loading loading={projectLoading && !project}>
              {() => (
                <Mutation
                  mutation={projectUpdateMutation}
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
                      project={project}
                      error={mapErrors(updateError)}
                      onCancel={() => writeNav({ modal: null })}
                      onUpdate={async params => {
                        update({
                          variables: {
                            input: {
                              id: activeProjectId,
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
        </WithProject>
      )
    }
  </WithNav>
);
