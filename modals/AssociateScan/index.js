/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import scanAssociateMutation from 'graphql/mutations/ScanAssociate';
import WithActiveProject from 'graphql/withActiveProject';
import SubmitDiffDelete from 'graphql/submitDiffDelete';
import diffsQuery from 'graphql/queries/Diffs';
import WithDiff from 'graphql/withDiff';
import WithNav from 'graphql/withNav';

import Loading from 'components/Loading';

import Form from './component';

// remove extraneous fields from alignment before saving
function cleanAlignment({
  method,
  scanTransform,
  scanTranslation,
  scanRotation,
}) {
  switch (method) {
    case 'Prealigned':
      return { method };
    case 'DirectEntry':
      return { method, scanTranslation, scanRotation };
    case 'Assisted':
      return { method, scanTransform };
    default:
      return null;
  }
}

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
  return [{ field: '_', message: 'Associate failed.' }];
};

export default () => (
  <WithNav>
    {({ modal, activeScanId, writeNav }) =>
      modal === 'associateScan' && (
        <WithActiveProject>
          {({ project }) => {
            const scan = project.scans.find(s => s.id === activeScanId);
            const firstDiff = project.diffs.find(
              d => d.scanId === activeScanId,
            );
            return (
              <WithDiff id={firstDiff && firstDiff.id}>
                {({ diff, diffLoading }) => (
                  <Loading loading={diffLoading && !diff}>
                    {() => (
                      <Mutation
                        mutation={scanAssociateMutation}
                        onError={() => {}}
                        refetchQueries={[
                          {
                            query: diffsQuery,
                            variables: {
                              projectId: project.id,
                            },
                          },
                        ]}>
                        {(associate, { error: updateError }) => (
                          <SubmitDiffDelete projectId={project.id}>
                            {({
                              deleteDiff,
                              // deleteDiffView, possible future use
                              // deleteDiffError, don't yet know how to use it
                            }) => (
                              <Form
                                defaultAlignment={diff && diff.alignment}
                                defaultModelId={
                                  // default to previously selected model, if any
                                  // or only available model if only in project
                                  (diff && diff.modelId) ||
                                  (project.models.length === 1
                                    ? project.models[0].id
                                    : null)
                                }
                                error={mapErrors(updateError)}
                                onCancel={() => writeNav({ modal: null })}
                                onAssociate={async params => {
                                  const input = {
                                    scanId: scan.id,
                                    modelId: params.modelId,
                                  };

                                  if (
                                    params.alignment &&
                                    params.alignment.method
                                  ) {
                                    input.alignment = cleanAlignment(
                                      params.alignment,
                                    );
                                  }

                                  if (diff && diff.modelId !== params.modelId) {
                                    // delete the previously created diff
                                    // to allow for the new association to create one
                                    await deleteDiff({
                                      variables: {
                                        input: { id: diff.id },
                                      },
                                    });
                                  }

                                  const response = await associate({
                                    variables: { input },
                                  });

                                  if (!response) {
                                    return;
                                  }

                                  writeNav({
                                    modal: null,
                                  });
                                  const canAA =
                                    scan.status === 'Done' &&
                                    params.modelId &&
                                    params.alignment &&
                                    params.alignment.method === 'Assisted' &&
                                    project.models.find(
                                      m =>
                                        m.id === params.modelId &&
                                        m.status === 'Done',
                                    );
                                  if (canAA && params.beginAlignment) {
                                    writeNav({
                                      activeDiffId:
                                        response.data.scanAssociate.diff.id,
                                      view: 'align',
                                    });
                                  }
                                }}
                                project={project}
                                scan={scan}
                                diff={diff}
                              />
                            )}
                          </SubmitDiffDelete>
                        )}
                      </Mutation>
                    )}
                  </Loading>
                )}
              </WithDiff>
            );
          }}
        </WithActiveProject>
      )
    }
  </WithNav>
);
