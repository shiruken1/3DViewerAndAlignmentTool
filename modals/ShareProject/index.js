/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import Loading from 'components/Loading';
import CurrentUserContext from 'context/currentUser';
import WithAccount from 'graphql/withAccount';
import WithProject from 'graphql/withProject';
import WithNav from 'graphql/withNav';
import projectUpdateMutation from 'graphql/mutations/ProjectUpdate';
import AccountQuery from 'graphql/queries/Account';
import AccountsQuery from 'graphql/queries/Accounts';
import CurrentUserQuery from 'graphql/queries/CurrentUser';
import ProjectViewQuery from 'graphql/queries/ProjectView';

import ShareProject from './ShareProject';

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
  <CurrentUserContext.Consumer>
    {currentUser => (
      <WithNav>
        {({ activeProjectId, activeAccountId, adminMode, modal, writeNav }) =>
          modal === 'projectShare' && (
            <WithAccount id={activeAccountId}>
              {({ account, accountLoading }) => (
                <WithProject id={activeProjectId}>
                  {({ project, projectLoading }) => (
                    <Loading
                      loading={
                        (accountLoading && !account) ||
                        (projectLoading && !project)
                      }>
                      {() => {
                        if (!account || !project) {
                          return null;
                        }
                        return (
                          <Mutation
                            mutation={projectUpdateMutation}
                            onError={() => {}}
                            refetchQueries={[
                              // refetch mostly only matters if super in admin mode
                              // but is harmless in other cases
                              {
                                query: CurrentUserQuery,
                              },
                              {
                                query: AccountQuery,
                                variables: { id: activeAccountId },
                              },
                              {
                                query: AccountsQuery,
                                variables: {
                                  forUser: adminMode ? null : currentUser.id,
                                  activitiesLimit: 5,
                                },
                              },
                              {
                                query: ProjectViewQuery,
                                variables: { projectId: activeProjectId },
                              },
                            ]}
                            awaitRefetchQueries>
                            {(update, { error: updateError }) => (
                              <ShareProject
                                account={account}
                                project={project}
                                error={mapErrors(updateError)}
                                onCancel={() => writeNav({ modal: null })}
                                onUpdate={async users => {
                                  if (!users.length) {
                                    return;
                                  }
                                  const result = await update({
                                    variables: {
                                      input: {
                                        id: activeProjectId,
                                        updates: { users },
                                      },
                                    },
                                  });
                                  if (!result) {
                                    return;
                                  }
                                  writeNav({ modal: null });
                                }}
                              />
                            )}
                          </Mutation>
                        );
                      }}
                    </Loading>
                  )}
                </WithProject>
              )}
            </WithAccount>
          )
        }
      </WithNav>
    )}
  </CurrentUserContext.Consumer>
);
