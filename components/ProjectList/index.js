/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Dropdown, Accordion } from 'semantic-ui-react';

/* App */
import ActivityList from 'components/ActivityList';
import Button from 'components/Button';
import ObjId from 'components/ObjId';
import css from './ProjectList.module.scss';

/* eslint-disable prefer-template */
const ProjectHeader = (p, projectCreator, oPV, oPE, oPD, oPP) => (
  <React.Fragment>
    <span>{p.name}</span>
    <ObjId id={p.id} label="project" />
    <Button
      onClick={() => oPV(p.id)}
      primary
      style={{
        float: 'right',
        left: '5em',
        position: 'relative',
      }}>
      View
    </Button>
    {projectCreator && (
      <Dropdown
        basic
        icon={null}
        className={css.SettingsDropdown}
        trigger={<Icon bordered={false} name="setting" />}>
        <Dropdown.Menu direction="left">
          <Dropdown.Item content="Edit" onClick={() => oPE(p.id)} />
          <Dropdown.Item content="Delete" onClick={() => oPD(p.id)} />
        </Dropdown.Menu>
      </Dropdown>
    )}
    <Button
      disabled={!oPP}
      onClick={evt => {
        evt.stopPropagation();
        oPP(p.id);
      }}
      style={{
        float: 'right',
        left: '3em',
        bottom: '4px',
        background: 'none',
        position: 'relative',
        color: oPP ? '#464646' : '#b9b9b9',
      }}>
      <Icon bordered={false} name="users" />
    </Button>
  </React.Fragment>
);

const ProjectBody = p => [
  <div key={p.id + '-4'} className={css.ProjectBody}>
    <p className={css.ProjectDescription}>{p.description}</p>
    <span className={css.Header}>Activity</span>
    <ActivityList
      activities={p.activities}
      displayProject={false}
      maxLength={5}
    />
  </div>,
];
/* eslint-enable prefer-template */

const panels = (projects, projectCreator, oPV, oPE, oPD, oPP, oPSel) =>
  projects.filter(p => !p.deleted).map(p => ({
    key: p.id,
    title: {
      as: 'h4',
      content: ProjectHeader(p, projectCreator, oPV, oPE, oPD, oPP),
      onClick: () => oPSel(p.id),
    },
    content: ProjectBody(p),
  }));

const ProjectList = ({
  perms,
  projects,
  hasProjects,
  onProjectNew,
  onProjectView,
  onProjectEdit,
  onProjectDelete,
  onProjectPermissions,
  onProjectSelect,
}) => (
  <React.Fragment>
    {perms.projectCreator && (
      <Button
        hollow
        tertiary={hasProjects}
        primary={!hasProjects}
        onClick={onProjectNew}
        className={css.AddProject}>
        Add Project
      </Button>
    )}
    <Accordion
      fluid
      // SD-2589: all projects should be collapsed by default
      // defaultActiveIndex={projects.length - 1}
      className={css.Accordion}
      panels={panels(
        projects,
        perms.projectCreator,
        onProjectView,
        onProjectEdit,
        onProjectDelete,
        onProjectPermissions,
        onProjectSelect,
      )}
    />
  </React.Fragment>
);

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      activities: PropTypes.array,
    }),
  ).isRequired,
  perms: PropTypes.shape({
    projectCreator: PropTypes.bool, // isRequired throws errors during data update
  }).isRequired,
  hasProjects: PropTypes.bool.isRequired,
  onProjectNew: PropTypes.func.isRequired,
  onProjectView: PropTypes.func.isRequired,
  onProjectEdit: PropTypes.func.isRequired,
  onProjectDelete: PropTypes.func.isRequired,
  onProjectSelect: PropTypes.func.isRequired,
  onProjectPermissions: PropTypes.func,
};

ProjectList.defaultProps = {
  onProjectPermissions: null,
};

export default ProjectList;
