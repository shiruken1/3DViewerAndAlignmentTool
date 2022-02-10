/* NPM */
import React from 'react';

/* App */
import WithNav from 'graphql/withNav';
import Loading from 'components/Loading';
import WithDiff from 'graphql/withDiff';

import DiffInfo from './component';

export default () => (
  <WithNav>
    {({ activeDiffId, adminMode, modal, writeNav }) =>
      modal === 'diffInfo' && (
        <WithDiff id={activeDiffId}>
          {({ diff, diffLoading }) => (
            <Loading loading={diffLoading && !diff}>
              {() => (
                <DiffInfo
                  adminMode={adminMode}
                  diff={diff}
                  onCancel={() => writeNav({ modal: null })}
                />
              )}
            </Loading>
          )}
        </WithDiff>
      )
    }
  </WithNav>
);
