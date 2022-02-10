/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'graphql.macro';

/* App */
import CurrentUserContext from 'context/currentUser';
import WithNav from 'graphql/withNav';
import AccountsQuery from 'graphql/queries/Accounts';
import CurrentUserQuery from 'graphql/queries/CurrentUser';
import ProjectViewQuery from 'graphql/queries/ProjectView';

import Invitations from './Invitations';

const mutation = gql`
  mutation($input: InvitationRespondInput!) {
    invitationRespond(input: $input) {
      dummy
    }
  }
`;

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
  return [{ field: '_', message: 'Operation failed.' }];
};

export default () => (
  <CurrentUserContext.Consumer>
    {currentUser => (
      <WithNav>
        {({ activeProjectId, adminMode, modal, writeNav }) =>
          modal === 'invitations' && (
            <Mutation
              mutation={mutation}
              onError={() => {}}
              refetchQueries={() => {
                const queries = [
                  {
                    query: CurrentUserQuery,
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
              awaitRefetchQueries
              onCompleted={() => {
                if (!currentUser.invitations.length) {
                  writeNav({ modal: null });
                }
              }}>
              {(update, { error: updateError }) => (
                <Invitations
                  user={currentUser}
                  error={mapErrors(updateError)}
                  onClose={() => writeNav({ modal: null })}
                  onRespond={input => {
                    update({
                      variables: { input },
                    });
                  }}
                />
              )}
            </Mutation>
          )
        }
      </WithNav>
    )}
  </CurrentUserContext.Consumer>
);
