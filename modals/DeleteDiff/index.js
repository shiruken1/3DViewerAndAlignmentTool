/* NPM */
import React from 'react';

/* App */
import WithNav from 'graphql/withNav';
import WithDiff from 'graphql/withDiff';
import SubmitDiffDelete from 'graphql/submitDiffDelete';

import Loading from 'components/Loading';

import Form from './component';

export default () => (
  <WithNav>
    {({ activeProjectId, activeDiffId, modal, writeNav }) =>
      modal === 'diffDelete' && (
        <WithDiff id={activeDiffId}>
          {({ diff, diffLoading }) => (
            <Loading loading={diffLoading && !diff}>
              {() => (
                <SubmitDiffDelete projectId={activeProjectId}>
                  {({ deleteDiffError, deleteDiff, deleteDiffView }) => (
                    <Form
                      diff={diff}
                      error={deleteDiffError}
                      onCancel={() => writeNav({ modal: null })}
                      onDelete={async () => {
                        diff.diffViews.map(async v =>
                          deleteDiffView({
                            variables: { input: { id: v.id } },
                          }),
                        );

                        await deleteDiff({
                          variables: { input: { id: activeDiffId } },
                        });

                        writeNav({ modal: null });
                      }}
                    />
                  )}
                </SubmitDiffDelete>
              )}
            </Loading>
          )}
        </WithDiff>
      )
    }
  </WithNav>
);
