/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import WithNav from 'graphql/withNav';
import accountQuery from 'graphql/queries/Account';
import projectCreateMutation from 'graphql/mutations/ProjectCreate';

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
    {({ activeAccountId, modal, writeNav }) =>
      modal === 'projectCreate' && (
        <Mutation
          mutation={projectCreateMutation}
          onError={() => {}}
          refetchQueries={[
            {
              query: accountQuery,
              variables: { id: activeAccountId },
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
                  accountId: activeAccountId,
                };
                const { data } = await create({ variables: { input } });
                if (!data) {
                  return;
                }
                writeNav({
                  activeProjectId: data.projectCreate.project.id,
                  modal: null,
                  view: 'project',
                });
              }}
            />
          )}
        </Mutation>
      )
    }
  </WithNav>
);
