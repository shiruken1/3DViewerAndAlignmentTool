/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import WithNav from 'graphql/withNav';
import modelCreateMutation from 'graphql/mutations/ModelCreate';
import projectViewQuery from 'graphql/queries/ProjectView';

import Upload from 'util/upload';

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
    if (firstError.state.name[0] === 'Duplicate key not allowed for field.') {
      return [
        {
          field: 'name',
          message:
            'Duplicate names are not allowed. Please try a different name.',
        },
      ];
    }
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
    {({ activeProjectId, modal, writeNav }) =>
      modal === 'uploadModel' && (
        <Mutation
          mutation={modelCreateMutation}
          onError={() => {}}
          refetchQueries={[
            {
              query: projectViewQuery,
              variables: { projectId: activeProjectId },
            },
          ]}>
          {(create, { client, error: createError }) => (
            <Form
              error={mapErrors(createError)}
              projectId={activeProjectId}
              onCancel={() => writeNav({ modal: null })}
              onCreate={async params => {
                const input = {
                  name: params.name,
                  description: params.description,
                  units: 'meters',
                  sourceFile: params.file.name,
                  projectId: activeProjectId,
                };
                if (params.fileMdb2) {
                  input.sourceFile2 = params.fileMdb2.name;
                }
                const result = await create({ variables: { input } });
                if (!result) {
                  return;
                }
                const {
                  data: {
                    modelCreate: { model },
                  },
                } = result;
                const files = [params.file];
                if (params.fileMdb2) {
                  files.push(params.fileMdb2);
                }
                Upload.start({ client, artifact: model, files, kind: 'model' });

                // nothing more to see here
                writeNav({ modal: null });
              }}
            />
          )}
        </Mutation>
      )
    }
  </WithNav>
);
