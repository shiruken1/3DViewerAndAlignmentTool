/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

/* App */
import projectQuery from 'graphql/queries/Project';
import diffDeleteMutation from 'graphql/mutations/DiffDelete';
import diffViewDeleteMutation from 'graphql/mutations/DiffViewDelete';

const mapErrors = error => {
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

const SubmitDiffDelete = ({ projectId, children }) => (
  <Mutation
    mutation={diffDeleteMutation}
    onError={() => {}}
    refetchQueries={[
      {
        query: projectQuery,
        variables: { id: projectId },
      },
    ]}>
    {(update, { error }) => (
      <Mutation mutation={diffViewDeleteMutation} onError={() => {}}>
        {/* what to do with any diffViewDelete errors? */}
        {diffViewUpdate =>
          children({
            deleteDiff: update,
            deleteDiffView: diffViewUpdate,
            deleteDiffError: mapErrors(error),
          })
        }
      </Mutation>
    )}
  </Mutation>
);

SubmitDiffDelete.propTypes = {
  projectId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

SubmitDiffDelete.defaultProps = {};

export default SubmitDiffDelete;
