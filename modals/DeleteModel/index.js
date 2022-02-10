/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import WithNav from 'graphql/withNav';
import Loading from 'components/Loading';
import WithModel from 'graphql/withModel';
import WithProjectView from 'graphql/withProjectView';
import SubmitDiffDelete from 'graphql/submitDiffDelete';
import modelDeleteMutation from 'graphql/mutations/ModelDelete';

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
    {({ activeProjectId, activeModelId, modal, writeNav }) =>
      modal === 'modelDelete' && (
        <WithModel id={activeModelId}>
          {({ model, modelLoading }) => (
            <Loading loading={modelLoading && !model}>
              {() => (
                <WithProjectView projectId={activeProjectId}>
                  {({ project, loading }) => (
                    <Loading loading={loading && !project}>
                      {() => (
                        <Mutation
                          mutation={modelDeleteMutation}
                          onError={() => {}}>
                          {(deleteModel, { error: deleteModelError }) => (
                            <SubmitDiffDelete projectId={activeProjectId}>
                              {({
                                deleteDiff,
                                deleteDiffView,
                                // deleteDiffError, don't yet know how to use it
                              }) => {
                                // @TODO: does component really need to check deleted flag
                                // if it's done here?
                                const diffs = project.diffs.filter(
                                  d =>
                                    d.modelId === model.id &&
                                    !d.deleted &&
                                    !d.scan.deleted,
                                );
                                return (
                                  <Form
                                    model={model}
                                    diffs={diffs}
                                    error={mapErrors(deleteModelError)}
                                    onCancel={() => writeNav({ modal: null })}
                                    onDelete={async () => {
                                      diffs
                                        .filter(d => !d.deleted)
                                        .map(async diff => {
                                          // erase all views first
                                          diff.diffViews
                                            .filter(v => !v.deleted)
                                            .map(async v =>
                                              deleteDiffView({
                                                variables: {
                                                  input: { id: v.id },
                                                },
                                              }),
                                            );

                                          // now delete the diff
                                          await deleteDiff({
                                            variables: {
                                              input: { id: diff.id },
                                            },
                                          });
                                        });

                                      // finally, delete the model
                                      await deleteModel({
                                        variables: { input: { id: model.id } },
                                      });

                                      writeNav({ modal: null });
                                    }}
                                  />
                                );
                              }}
                            </SubmitDiffDelete>
                          )}
                        </Mutation>
                      )}
                    </Loading>
                  )}
                </WithProjectView>
              )}
            </Loading>
          )}
        </WithModel>
      )
    }
  </WithNav>
);
