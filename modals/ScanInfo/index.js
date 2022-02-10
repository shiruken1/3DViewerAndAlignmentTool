/* NPM */
import React from 'react';

/* App */
import WithNav from 'graphql/withNav';
import Loading from 'components/Loading';
import WithScan from 'graphql/withScan';

import ScanInfo from './component';

export default () => (
  <WithNav>
    {({ activeScanId, modal, writeNav }) =>
      modal === 'scanInfo' && (
        <WithScan id={activeScanId}>
          {({ scan, scanLoading }) => (
            <Loading loading={scanLoading && !scan}>
              {() => (
                <ScanInfo
                  scan={scan}
                  onCancel={() => writeNav({ modal: null })}
                />
              )}
            </Loading>
          )}
        </WithScan>
      )
    }
  </WithNav>
);
