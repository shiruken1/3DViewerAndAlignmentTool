/* NPM */
import React from 'react';
import { Query } from 'react-apollo';

/* App */
import Loading from 'components/Loading';
import WithDiff from 'graphql/withDiff';
import WithDiffSettings from 'graphql/withDiffSettings';
import WithNav from 'graphql/withNav';
import diffQuery from 'graphql/queries/Diff';

import Form from './component';

export default () => (
  <WithDiffSettings>
    {diffSettings => (
      <WithNav>
        {({ activeDiffId, modal, writeNav }) =>
          modal === 'shareDiffView' && (
            <WithDiff id={activeDiffId}>
              {({ diff, diffLoading }) => (
                <Loading loading={diffLoading && !diff}>
                  {() => (
                    <Query query={diffQuery} variables={{ id: activeDiffId }}>
                      {() => (
                        <Form
                          diffSettings={diffSettings}
                          onCancel={() => writeNav({ modal: null })}
                        />
                      )}
                    </Query>
                  )}
                </Loading>
              )}
            </WithDiff>
          )
        }
      </WithNav>
    )}
  </WithDiffSettings>
);
