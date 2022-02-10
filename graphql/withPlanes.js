/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import WithScan from 'graphql/withScan';
import Loading from 'components/Loading';
import { withExtractedPlanesFile } from 'gl/WithAAFiles';

const EnoughPlanes = withExtractedPlanesFile(({ planesData, children }) => {
  if (planesData === null) {
    return children({ planesLoading: true, enoughPlanes: null });
  }

  // you shall not pass!
  if (planesData.children.length < 3) {
    return children({ planesLoading: false, enoughPlanes: false });
  }

  return children({ planesLoading: false, enoughPlanes: true });
});

EnoughPlanes.propTypes = {
  children: PropTypes.func.isRequired,
  scan: PropTypes.shape({
    files: PropTypes.shape({
      extractedPlanes: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const WithPlanes = ({ scanId, children }) => (
  <WithScan id={scanId}>
    {({ scan, scanLoading }) => (
      <Loading loading={scanLoading && !scan}>
        {() => (
          <EnoughPlanes scan={scan}>
            {({ planesLoading, enoughPlanes }) =>
              children({ planesLoading, enoughPlanes })
            }
          </EnoughPlanes>
        )}
      </Loading>
    )}
  </WithScan>
);

WithPlanes.propTypes = {
  children: PropTypes.func.isRequired,
  scanId: PropTypes.string.isRequired,
};

export default WithPlanes;
