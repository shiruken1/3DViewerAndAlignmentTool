/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import WithNav from 'graphql/withNav';
import Loading from 'components/Loading';

import WithScan from 'graphql/withScan';
import WithProjectView from 'graphql/withProjectView';
import SubmitDiffDelete from 'graphql/submitDiffDelete';
import scanDeleteMutation from 'graphql/mutations/ScanDelete';

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
    {({ activeProjectId, activeScanId, modal, writeNav }) =>
      modal === 'scanDelete' && (
        <WithScan id={activeScanId}>
          {({ scan, scanLoading }) => (
            <Loading loading={scanLoading && !scan}>
              {() => (
                <WithProjectView projectId={activeProjectId}>
                  {({ project, loading }) => (
                    <Loading loading={loading && !project}>
                      {() => (
                        <Mutation
                          mutation={scanDeleteMutation}
                          onError={() => {}}>
                          {(deleteScan, { error: deleteScanError }) => (
                            <SubmitDiffDelete projectId={activeProjectId}>
                              {({
                                deleteDiff,
                                deleteDiffView,
                                // deleteDiffError, don't yet know how to use it
                              }) => {
                                const diffs = project.diffs.filter(
                                  d => d.scanId === scan.id,
                                );

                                return (
                                  <Form
                                    scan={scan}
                                    diffs={diffs}
                                    error={mapErrors(deleteScanError)}
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

                                      // finally, delete the scan
                                      await deleteScan({
                                        variables: { input: { id: scan.id } },
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
        </WithScan>
      )
    }
  </WithNav>
);
