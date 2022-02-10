/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import { gql } from 'graphql.macro';

/* App */
import UserUpdateMutation from 'graphql/mutations/UserUpdate';
import CurrentUser from 'graphql/queries/CurrentUser';

import CompleteSignUp from './CompleteSignUp';

const userQuery = gql`
  query user($id: ID!, $token: String) {
    user(id: $id, token: $token) {
      id
      firstName
      lastName
      email
      phone
      country
      role
      emailVerified
      createdOn
      company
    }
  }
`;

export const mapErrors = defaultError => error => {
  const firstError =
    error &&
    error.graphQLErrors &&
    error.graphQLErrors.length &&
    error.graphQLErrors[0];
  if (!firstError) {
    return [];
  }
  if (firstError.message === 'Unauthorized') {
    return [
      {
        field: '_',
        message: 'Incorrect email or password.',
      },
    ];
  }
  if (firstError.message === 'Password too weak') {
    return [
      {
        field: '_',
        message: 'Password too weak.',
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
  return [{ field: '_', message: defaultError }];
};

const Wrap = ({ userId, token }) => (
  // need new query for user: not authenticated, but have id and emailVerificationToken
  <Query query={userQuery} variables={{ id: userId, token }}>
    {({ loading: loadingUser, data, error: userError }) => (
      <Mutation
        displayName="UserUpdateMutation"
        mutation={UserUpdateMutation}
        onError={() => {}}
        refetchQueries={[{ query: CurrentUser }]}>
        {(
          userUpdate,
          { loading: loadingUpdate, data: updateData, error: updateError },
        ) => (
          <CompleteSignUp
            onUpdate={v =>
              userUpdate({ variables: { input: { id: userId, updates: v } } })
            }
            loadingUser={loadingUser}
            user={data && data.user}
            userError={mapErrors('Invalid Link.')(userError)}
            loadingUpdate={loadingUpdate}
            updatedUser={updateData && updateData.userUpdate.user}
            updateError={mapErrors('User update failed.')(updateError)}
            token={token}
          />
        )}
      </Mutation>
    )}
  </Query>
);

Wrap.propTypes = {
  userId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default Wrap;
