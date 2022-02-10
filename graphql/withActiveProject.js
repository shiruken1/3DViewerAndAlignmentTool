/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import Loading from 'components/Loading';
import WithProjectView from './withProjectView';
import WithNav from './withNav';

const WithActiveProject = ({ children }) => (
  <WithNav>
    {({ activeProjectId, adminMode, view, writeNav }) => {
      if (!activeProjectId) return null;
      return (
        <WithProjectView projectId={activeProjectId}>
          {({ project, loading }) => (
            <Loading loading={loading && !project}>
              {() => children({ adminMode, project, view, writeNav })}
            </Loading>
          )}
        </WithProjectView>
      );
    }}
  </WithNav>
);

WithActiveProject.propTypes = {
  children: PropTypes.func.isRequired,
};

export default WithActiveProject;
