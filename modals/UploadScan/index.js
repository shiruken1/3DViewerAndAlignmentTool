/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import WithNav from 'graphql/withNav';
import WithModels from 'graphql/withModels';
import scanCreateMutation from 'graphql/mutations/ScanCreate';
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

export const formatAlignment = (method, x, y, z, zRotation) => {
  switch (method) {
    case 'Prealigned':
      return { method };
    case 'Assisted':
      return { method };
    case 'DirectEntry': {
      // const c = Math.cos(zRotation);
      // const s = Math.sin(zRotation);
      return {
        method,
        scanRotation: zRotation,
        scanTranslation: [x, y, z],
        // scanTransform: [c, -s, 0, x, s, c, 0, y, 0, 0, 1, z],
      };
    }
    default:
      return null;
  }
};

export default () => (
  <WithNav>
    {({ activeProjectId, activeModelId, modal, writeNav }) =>
      modal === 'uploadScan' && (
        <Mutation
          mutation={scanCreateMutation}
          onError={() => {}}
          refetchQueries={[
            {
              query: projectViewQuery,
              variables: { projectId: activeProjectId },
            },
          ]}>
          {(create, { client, error: createError }) => (
            <WithModels projectId={activeProjectId}>
              {({ modelsLoading, models }) => (
                <Form
                  error={mapErrors(createError)}
                  projectId={activeProjectId}
                  modelId={
                    // if only one model, default to it
                    activeModelId ||
                    (models && models.filter(m => !m.deleted).length === 1
                      ? models[0].id
                      : null)
                  }
                  models={models}
                  modelsLoading={modelsLoading}
                  onCancel={() => writeNav({ modal: null })}
                  onCreate={async params => {
                    const input = {
                      name: params.name,
                      description: params.description,
                      units: params.units,
                      sourceFile: params.file.name,
                      projectId: activeProjectId,
                      modelId: params.associatedModelId,
                    };

                    if (params.alignment) {
                      input.alignment = formatAlignment(
                        params.alignment,
                        params.x,
                        params.y,
                        params.z,
                        params.rotation,
                      );
                    }

                    const result = await create({ variables: { input } });
                    if (!result) {
                      return;
                    }
                    const {
                      data: {
                        scanCreate: { scan },
                      },
                    } = result;
                    const files = [params.file];
                    Upload.start({
                      client,
                      artifact: scan,
                      files,
                      kind: 'scan',
                    });

                    // nothing more to see here
                    writeNav({ modal: null });
                  }}
                />
              )}
            </WithModels>
          )}
        </Mutation>
      )
    }
  </WithNav>
);
