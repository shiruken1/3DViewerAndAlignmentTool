/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Card, Image, Segment, Dropdown } from 'semantic-ui-react';

/* App */
import ActivityList from 'components/ActivityList';
import SortableList from 'components/SortableList';
import ProjectList from 'components/ProjectList';
import AccountName from 'components/AccountName';
import InfoTable from 'components/InfoTable';
import Button from 'components/Button';
import ObjId from 'components/ObjId';
import format from 'lib/format';

import css from './AccountCard.module.scss';

const AccountCard = ({
  account,
  adminMode,
  currentUser,
  hasProjects,
  onProjectNew,
  onProjectView,
  onProjectEdit,
  onProjectSelect,
  onProjectDelete,
  onProjectPermissions,
  onAccountEdit,
  onAccountBuyDiffs,
  onAccountAddDiffs,
  onAccountPermissions,
  onAccountSetThumbnail,
  onAccountChangeOwner,
}) => (
  <Segment.Group horizontal className={css.AccountCard}>
    <Segment className={css.AccountHalf}>
      <Card fluid>
        <Card.Header>
          <span className={css.sideLabel}>
            <AccountName account={account} />
          </span>
          <ObjId id={account.id} label="account" />
          <div>
            <Dropdown
              basic
              icon={null}
              trigger={<Icon bordered={false} name="setting" />}>
              <Dropdown.Menu direction="left">
                <Dropdown.Item content="Edit" onClick={onAccountEdit} />
                <Dropdown.Item
                  disabled={
                    (!account.name || account.owner.id !== currentUser.id) &&
                    !adminMode
                  }
                  content="Change Owner"
                  onClick={onAccountChangeOwner}
                />
                {adminMode && (
                  <Dropdown.Item
                    className={css.AddDiffsButton}
                    content="Alter # diffs"
                    onClick={onAccountAddDiffs}
                  />
                )}
              </Dropdown.Menu>
            </Dropdown>
            <Button
              disabled={!account.name}
              onClick={evt => {
                evt.stopPropagation();
                onAccountPermissions();
              }}
              style={{
                background: 'none',
                color: account.name ? '#464646' : '#b9b9b9',
                padding: 0,
                height: '19px',
                marginRight: '10px',
              }}>
              <Icon bordered={false} name="users" />
            </Button>
          </div>
        </Card.Header>

        <Card.Content>
          <Segment.Group horizontal>
            <Segment basic className={css.Thumb}>
              <Image
                size="small"
                src="AccountThumb.png"
                onClick={onAccountSetThumbnail}
              />
            </Segment>
            <Segment basic className={css.AccountDescription}>
              {account.description}
            </Segment>
            <Segment basic className={css.AccountInfo}>
              <div>
                <InfoTable
                  rows={[
                    {
                      label: 'Owner',
                      value: `${format.name({
                        firstName: account.owner.firstName,
                        lastName: account.owner.lastName,
                      })}`,
                    },
                    {
                      label: 'Diffs Avail.',
                      value: <b>{account.diffsRemaining}</b>,
                    },
                    {
                      label: 'Status',
                      value: <span style={{ color: 'red' }}>Trial</span>,
                    },
                    account.effectivePermissions.owner && {
                      label: '',
                      value: (
                        <Button
                          primary
                          onClick={onAccountBuyDiffs}
                          style={{ marginTop: '10px' }}>
                          Purchase Diffs
                        </Button>
                      ),
                    },
                  ].filter(r => !!r)}
                />
              </div>
            </Segment>
          </Segment.Group>

          <span className={css.Header}>Activity</span>
          <div className={css.AccountActivities}>
            <ActivityList
              activities={account.activities}
              displayProject
              maxLength={5}
            />
          </div>
        </Card.Content>
      </Card>
    </Segment>

    <div className={css.divider} />

    <Segment className={css.ProjectHalf}>
      <Card fluid>
        <Card.Content className={css.ProjectList}>
          <SortableList
            className={css.ProjectList}
            perms={account.effectivePermissions}
            title="Projects"
            component={ProjectList}
            items={account.projects}
            itemsProp="projects"
            adminMode={adminMode}
            hasProjects={hasProjects}
            projects={account.projects}
            onProjectNew={onProjectNew}
            onProjectView={onProjectView}
            onProjectEdit={onProjectEdit}
            onProjectDelete={onProjectDelete}
            onProjectPermissions={account.name ? onProjectPermissions : null}
            onProjectSelect={onProjectSelect}
            options={[
              {
                text: 'Name',
                sortFunc: (a, b) => {
                  const nameA = a.name.toUpperCase();
                  const nameB = b.name.toUpperCase();
                  if (nameA === nameB) return 0;
                  return nameA < nameB ? -1 : 1;
                },
              },
              {
                text: 'Created By',
                sortFunc: (a, b) => {
                  const aName = `${a.createdBy.lastName}${
                    a.createdBy.firstName
                  }`;
                  const bName = `${b.createdBy.lastName}${
                    b.createdBy.firstName
                  }`;

                  return aName < bName ? -1 : 1;
                },
              },
              {
                text: 'Date',
                sortFunc: (a, b) => {
                  const aLast = a.activities.length ? a.activities[0] : null;
                  const bLast = b.activities.length ? b.activities[0] : null;

                  return aLast < bLast ? -1 : 1;
                },
              },
            ]}
          />
        </Card.Content>
      </Card>
    </Segment>
  </Segment.Group>
);

AccountCard.propTypes = {
  account: PropTypes.object.isRequired,
  adminMode: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  hasProjects: PropTypes.bool.isRequired,
  onAccountEdit: PropTypes.func.isRequired,
  onAccountAddDiffs: PropTypes.func.isRequired,
  onAccountBuyDiffs: PropTypes.func.isRequired,
  onAccountPermissions: PropTypes.func.isRequired,
  onAccountSetThumbnail: PropTypes.func.isRequired,
  onAccountChangeOwner: PropTypes.func.isRequired,

  onProjectNew: PropTypes.func.isRequired,
  onProjectView: PropTypes.func.isRequired,
  onProjectEdit: PropTypes.func.isRequired,
  onProjectDelete: PropTypes.func.isRequired,
  onProjectSelect: PropTypes.func.isRequired,
  onProjectPermissions: PropTypes.func.isRequired,
};

export default AccountCard;
