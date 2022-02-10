/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import WithNav from 'graphql/withNav';
import Loading from 'components/Loading';
import WithProject from 'graphql/withProject';
import accountQuery from 'graphql/queries/Account';
import projectDeleteMutation from 'graphql/mutations/ProjectDelete';

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
  return [{ field: '_', message: 'Delete failed.' }];
};

export default () => (
  <WithNav>
    {({ activeProjectId, activeAccountId, modal, writeNav }) =>
      modal === 'projectDelete' && (
        <WithProject id={activeProjectId}>
          {({ project, projectLoading }) => (
            <Loading loading={projectLoading && !project}>
              {() => (
                <Mutation
                  mutation={projectDeleteMutation}
                  onError={() => {}}
                  refetchQueries={[
                    {
                      query: accountQuery,
                      variables: { id: activeAccountId },
                    },
                  ]}>
                  {(update, { error: deleteError }) => (
                    <Form
                      project={project}
                      error={mapErrors(deleteError)}
                      onCancel={() => writeNav({ modal: null })}
                      onDelete={async () => {
                        await update({
                          variables: { input: { id: activeProjectId } },
                        });

                        writeNav({ modal: null });
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
