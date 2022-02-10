/* NPM */
import React from 'react';

/* App */
import WithNav from 'graphql/withNav';
import WithDiff from 'graphql/withDiff';
import WithDiffSettings from 'graphql/withDiffSettings';

import Loading from 'components/Loading';

import WithDiffFiles from 'gl/WithDiffFiles';

import Diff from './component';

const DiffWithFiles = WithDiffFiles(Diff);

export default class extends React.PureComponent {
  cameraMovedDuringInspection = () => {};
  render() {
    return (
      <WithNav>
        {({ activeDiffId, activeDiffViewId, fullScreen }) => {
          if (!activeDiffId) return null;
          return (
            <WithDiff id={activeDiffId}>
              {({ diff, diffError, diffLoading }) => (
                <Loading loading={diffLoading && !diff}>
                  {() => {
                    if (
                      diffError &&
                      !/GraphQL error: Unauthorized/.test(diffError.message)
                    ) {
                      throw diffError;
                    }
                    const diffView = diff.diffViews.find(
                      v => v.id === activeDiffViewId,
                    );
                    return (
                      <WithDiffSettings>
                        {({ writeDiffSettings, ...diffSettings }) => (
                          <React.Fragment>
                            <DiffWithFiles
                              diff={diff}
                              diffView={diffView}
                              fullScreen={fullScreen}
                              files={diff.files}
                              focusObjectId={diffSettings.focus.objectId}
                              setFocusObjectId={focusObjectId =>
                                writeDiffSettings({
                                  focus: {
                                    ...diffSettings.focus,
                                    objectId: focusObjectId,
                                  },
                                })
                              }
                            />
                          </React.Fragment>
                        )}
                      </WithDiffSettings>
                    );
                  }}
                </Loading>
              )}
            </WithDiff>
          );
        }}
      </WithNav>
    );
  }
}
