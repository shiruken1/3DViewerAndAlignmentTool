/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Icon, Label, Menu, Popup } from 'semantic-ui-react';

/* App */
import WithNav from 'graphql/withNav';
import WithSignOut from 'graphql/withSignOut';
import WithUploads from 'graphql/withUploads';
import CurrentUserContext from 'context/currentUser';

import Breadcrumb from 'components/Breadcrumb';
import Link from 'components/Link';

import css from './TopBar.module.scss';

const UploadsStatusIcon = () => (
  <WithNav>
    {({ writeNav }) => (
      <WithUploads>
        {({ uploading, uploads }) =>
          !!uploads.length && (
            <Menu.Item
              onClick={() => {
                writeNav({ modal: 'uploadsStatus' });
              }}>
              <Popup
                trigger={
                  <Icon.Group size="large">
                    <Icon name="cloud upload" />
                    {uploading && <Icon corner loading name="spinner" />}
                  </Icon.Group>
                }
                content="Upload Status"
              />
            </Menu.Item>
          )
        }
      </WithUploads>
    )}
  </WithNav>
);

const ProfileItem = () => (
  <WithNav>
    {({ writeNav }) => (
      <Dropdown.Item
        icon="user"
        text="Profile"
        onClick={() => {
          writeNav({ modal: 'profile' });
        }}
      />
    )}
  </WithNav>
);

const CreateAccount = () => (
  <WithNav>
    {({ writeNav }) => (
      <Dropdown.Item
        icon="plus square outline"
        text="Add Workspace"
        onClick={() => {
          writeNav({ modal: 'accountCreate' });
        }}
      />
    )}
  </WithNav>
);

const ChangePasswordItem = () => (
  <WithNav>
    {({ writeNav }) => (
      <Dropdown.Item
        icon="lock"
        text="Change Password"
        onClick={() => {
          writeNav({ modal: 'changePassword' });
        }}
      />
    )}
  </WithNav>
);

const SignOutItem = () => (
  <WithSignOut>
    {({ signOut }) => (
      <Dropdown.Item icon="sign out" text="Sign Out" onClick={signOut} />
    )}
  </WithSignOut>
);

const AdminItem = () => (
  <CurrentUserContext.Consumer>
    {currentUser =>
      currentUser.role === 'super' && (
        <WithNav>
          {({ adminMode, writeNav }) => (
            <Dropdown.Item
              icon={
                <Icon
                  name="spy"
                  size="large"
                  color={adminMode ? 'green' : 'yellow'}
                />
              }
              onClick={() => {
                // when leaving admin mode, active objects may no longer be
                // accessible, so just reset everything
                if (adminMode) {
                  writeNav({
                    adminMode: !adminMode,
                    activeAccountId: null,
                    activeProjectId: null,
                    activeModelId: null,
                    activeScanId: null,
                    activeDiffId: null,
                    activeDiffViewId: null,
                    associatedModelIds: [],
                    associatedScanIds: [],
                    associatedDiffIds: [],
                    diffIdInCart: null,
                    view: 'home',
                    modal: null,
                    fullScreen: false,
                  });
                } else {
                  writeNav({
                    adminMode: !adminMode,
                  });
                }
              }}
              text="Admin Mode"
            />
          )}
        </WithNav>
      )
    }
  </CurrentUserContext.Consumer>
);

const DebugItem = () =>
  process.env.NODE_ENV !== 'production' && (
    <WithNav>
      {({ debugMode, writeNav }) => (
        <Dropdown.Item
          icon={
            <Icon
              name="bug"
              size="large"
              color={debugMode ? 'green' : 'yellow'}
            />
          }
          onClick={() => {
            writeNav({ debugMode: !debugMode });
          }}
          text="Debug Mode"
        />
      )}
    </WithNav>
  );

const FeaturesItem = () => (
  <WithNav>
    {({ writeNav }) => (
      <Dropdown.Item
        icon={<Icon name="lab" size="large" />}
        onClick={() => {
          writeNav({ modal: 'features' });
        }}
        text="Experimental Features"
      />
    )}
  </WithNav>
);

const Invitations = ({ user }) => (
  <WithNav>
    {({ writeNav }) => (
      <Dropdown.Item
        onClick={() => {
          writeNav({ modal: 'invitations' });
        }}>
        <Icon name="envelope" />
        <span>Invitations</span>
        <Label
          color="red"
          size="small"
          style={{ position: 'absolute', right: 0 }}>
          {user.invitations.length}
        </Label>
      </Dropdown.Item>
    )}
  </WithNav>
);

Invitations.propTypes = {
  user: PropTypes.object.isRequired,
};

const SettingsMenu = () => (
  <CurrentUserContext.Consumer>
    {currentUser => {
      const pendingInvitations =
        currentUser && !!currentUser.invitations.length;
      return (
        <React.Fragment>
          <a
            href="https://skurinc.atlassian.net/wiki/spaces/SKUR/overview"
            target="_blank"
            className={css.help}
            rel="noopener noreferrer">
            <Icon size="large" name="help circle" />
          </a>
          <Dropdown
            className={css.settings}
            icon={null}
            trigger={
              <span>
                <Icon.Group>
                  <Icon className={css.icon} name="cog" />
                  {pendingInvitations && (
                    <Icon color="red" corner name="dot circle" size="huge" />
                  )}
                </Icon.Group>
                Settings
              </span>
            }>
            <Dropdown.Menu>
              <ProfileItem />
              {pendingInvitations && <Invitations user={currentUser} />}
              <CreateAccount />
              <ChangePasswordItem />
              <SignOutItem />
              <AdminItem />
              <DebugItem />
              <FeaturesItem />
            </Dropdown.Menu>
          </Dropdown>
        </React.Fragment>
      );
    }}
  </CurrentUserContext.Consumer>
);

const LinkIcon = ({ fields }) => <Link fields={fields} />;

LinkIcon.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

const TopBar = ({ viewLinkFields, viewMenu }) => (
  <WithNav>
    {({ fullScreen }) =>
      !fullScreen && (
        <div className={css.main}>
          <div className={css.header}>
            <img src="/skur_logo.png" alt="" />
            <div className={css.skur}>
              SKUR
              <div>3.02 (Beta)</div>
            </div>
          </div>
          <div className={css.breadcrumb}>
            <Breadcrumb />
          </div>
          <div className={css.menu}>
            <Menu
              attached
              borderless
              compact
              size="small"
              className={css.noborder}>
              {viewMenu}
              <Menu.Menu position="right">
                <UploadsStatusIcon />
                {viewLinkFields && <LinkIcon fields={viewLinkFields} />}
                <SettingsMenu />
              </Menu.Menu>
            </Menu>
          </div>
        </div>
      )
    }
  </WithNav>
);

TopBar.propTypes = {
  viewLinkFields: PropTypes.arrayOf(PropTypes.string.isRequired),
  viewMenu: PropTypes.node,
};

TopBar.defaultProps = {
  viewLinkFields: null,
  viewMenu: null,
};

export default TopBar;
