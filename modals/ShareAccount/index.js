/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import Loading from 'components/Loading';
import CurrentUserContext from 'context/currentUser';
import WithAccount from 'graphql/withAccount';
import WithNav from 'graphql/withNav';
import accountUpdateMutation from 'graphql/mutations/AccountUpdate';
import AccountQuery from 'graphql/queries/Account';
import AccountsQuery from 'graphql/queries/Accounts';
import CurrentUserQuery from 'graphql/queries/CurrentUser';
import ProjectViewQuery from 'graphql/queries/ProjectView';

import ShareAccount from './ShareAccount';

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
        {({ activeAccountId, activeProjectId, adminMode, modal, writeNav }) =>
          modal === 'accountShare' && (
            <WithAccount id={activeAccountId}>
              {({ account, accountLoading }) => (
                <Loading loading={accountLoading && !account}>
                  {() => (
                    <Mutation
                      mutation={accountUpdateMutation}
                      onError={() => {}}
                      refetchQueries={() => {
                        // refetch mostly only matters if super in admin mode
                        // but is harmless in other cases
                        const queries = [
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
                        ];
                        if (activeProjectId) {
                          queries.push({
                            query: ProjectViewQuery,
                            variables: { projectId: activeProjectId },
                          });
                        }
                        return queries;
                      }}
                      awaitRefetchQueries>
                      {(update, { error: updateError }) => (
                        <ShareAccount
                          account={account}
                          error={mapErrors(updateError)}
                          onCancel={() => writeNav({ modal: null })}
                          onUpdate={async users => {
                            if (!users.length) {
                              return;
                            }
                            const result = await update({
                              variables: {
                                input: {
                                  id: activeAccountId,
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
                  )}
                </Loading>
              )}
            </WithAccount>
          )
        }
      </WithNav>
    )}
  </CurrentUserContext.Consumer>
);
