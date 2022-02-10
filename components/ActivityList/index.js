/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

/* App */
import format from 'lib/format';
import cFL from 'util/capitalize';

const Grid = styled.div`
  color: #464646;
  display: grid;
  font-size: 14px;
  font-weight: 300;
  grid-template-areas: 'date user actiontarget';
  grid-template-columns: 5ch minmax(12ch, 1fr) 20fr;
  grid-template-rows: auto;
  grid-gap: 5px;
`;

const GridWithProject = styled(Grid)`
  grid-template-areas: 'date project user actiontarget';
  grid-template-columns: 5ch minmax(12ch, 1fr) minmax(12ch, 1fr) 20fr;
`;

const GridStacked = styled(Grid)`
  grid-template-areas:
    'date action user'
    '. target target';
  grid-template-columns: 5ch minmax(16ch, 1fr) minmax(12ch, 10fr);
  margin-bottom: 20px;
`;

const Gold = '#d29b33';
const Gray = '#464646';

const Span = styled.span`
  color: ${props => (props.color ? props.color : Gray)};
  grid-area: ${props => props.gridArea};
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 300)};
`;

const UnstackedEntry = ({
  action,
  target,
  GridComponent,
  date,
  projectName,
  userName,
}) => (
  <GridComponent>
    <Span gridArea="date">{date}</Span>
    <Span gridArea="user">{userName}</Span>
    <div>
      <Span color={Gold} fontWeight={500} gridArea="actiontarget">
        {`${action}: `}
      </Span>
      <Span gridArea="actiontarget">{target}</Span>
    </div>
    {projectName !== null && (
      <Span fontWeight={400} gridArea="project">
        {projectName}
      </Span>
    )}
  </GridComponent>
);
UnstackedEntry.propTypes = {
  action: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  GridComponent: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  projectName: PropTypes.string,
  userName: PropTypes.string.isRequired,
};
UnstackedEntry.defaultProps = {
  projectName: null,
};

const StackedEntry = ({
  action,
  target,
  description,
  GridComponent,
  date,
  userName,
}) => (
  <GridComponent>
    <Span fontWeight={500} gridArea="date">
      {date}
    </Span>
    <Span color={Gold} fontWeight={500} gridArea="action">
      {action}
    </Span>
    <Span gridArea="user">{userName}</Span>
    <Span gridArea="target">
      <Span fontWeight={500}>{target}:</Span> {description}
    </Span>
  </GridComponent>
);
StackedEntry.propTypes = {
  action: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  GridComponent: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

const makeAction = ({ verb, type }) => {
  const preterite = {
    create: 'Created',
    delete: 'Deleted',
    update: 'Updated',
    upload: 'Uploaded',
  }[verb];
  return `${preterite} ${cFL(type)}`;
};

const ActivityList = ({ activities, displayProject, maxLength, stacked }) => {
  const EntryComponent = stacked ? StackedEntry : UnstackedEntry;
  let GridComponent = Grid;
  if (stacked) {
    GridComponent = GridStacked;
  } else if (displayProject) {
    GridComponent = GridWithProject;
  }

  const list = [...activities].slice(0, maxLength).map(a => {
    const {
      createdOn,
      creatorFirstName,
      creatorLastName,
      description,
      id,
      name,
      projectName,
    } = a;
    const userName = format.name({
      firstName: creatorFirstName,
      lastName: creatorLastName,
    });

    return (
      <EntryComponent
        key={id}
        action={makeAction(a)}
        GridComponent={GridComponent}
        target={name || 'My Workspace'}
        description={description}
        date={format.dateDDMM(createdOn)}
        projectName={displayProject ? projectName || '' : null}
        userName={userName}
      />
    );
  });

  return <div>{list}</div>;
};

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      verb: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      createdOn: PropTypes.string.isRequired,
      projectName: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
      creatorFirstName: PropTypes.string.isRequired,
      creatorLastName: PropTypes.string.isRequired,
    }),
  ).isRequired,
  displayProject: PropTypes.bool,
  maxLength: PropTypes.number,
  stacked: PropTypes.bool,
};

ActivityList.defaultProps = {
  displayProject: false,
  maxLength: undefined,
  stacked: false,
};

export default ActivityList;
