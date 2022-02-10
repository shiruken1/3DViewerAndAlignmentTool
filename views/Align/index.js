/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import scanAssociateMutation from 'graphql/mutations/ScanAssociate';
import WithModel from 'graphql/withModel';
import WithAAFiles from 'gl/WithAAFiles';
import Loading from 'components/Loading';
import WithDiff from 'graphql/withDiff';
import WithScan from 'graphql/withScan';
import WithNav from 'graphql/withNav';
import AA from './component';

const AAWithFiles = WithAAFiles(AA);

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
  return [{ field: '_', message: 'Create failed.' }];
};

async function sendTransform(update, writeNav, model, scan, transform) {
  const response = await update({
    variables: {
      input: {
        modelId: model.id,
        scanId: scan.id,
        alignment: {
          method: 'Assisted',
          scanTransform: transform,
        },
      },
    },
  });

  if (!response) {
    // @TODO: ensure error message?
    return;
  }

  writeNav({ view: 'project' });
}

export default () => (
  // {({ activeScanId, adminMode, fullScreen, writeNav }) => {
  <WithNav>
    {({ activeDiffId, adminMode, writeNav }) => {
      if (!activeDiffId) return null;
      return (
        <Mutation mutation={scanAssociateMutation} onError={() => {}}>
          {(update, { error: updateError }) => (
            <WithDiff id={activeDiffId}>
              {({ diff, diffLoading }) => (
                <Loading loading={diffLoading && !diff}>
                  {() => (
                    <WithScan id={diff.scanId}>
                      {({ scan, scanLoading }) => (
                        <Loading loading={scanLoading && !scan}>
                          {() => (
                            <WithModel id={diff.modelId}>
                              {({ model, modelLoading }) => (
                                <Loading loading={modelLoading && !model}>
                                  {() => (
                                    <AAWithFiles
                                      scan={scan}
                                      model={model}
                                      adminMode={adminMode}
                                      error={mapErrors(updateError)}
                                      onSubmit={array =>
                                        sendTransform(
                                          update,
                                          writeNav,
                                          model,
                                          scan,
                                          array,
                                        )
                                      }
                                      // fullScreen={fullScreen}
                                      // toggleFullScreen={() => {
                                      //   writeNav({ fullScreen: !fullScreen });
                                      // }}
                                    />
                                  )}
                                </Loading>
                              )}
                            </WithModel>
                          )}
                        </Loading>
                      )}
                    </WithScan>
                  )}
                </Loading>
              )}
            </WithDiff>
          )}
        </Mutation>
      );
    }}
  </WithNav>
);
