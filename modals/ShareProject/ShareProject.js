/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion/macro';

/* App */
import Button from 'components/Button';
import format from 'lib/format';
import Modal from 'modals/Modal';

import LegendItem from './LegendItem';
import ProjectPermTable from './ProjectPermTable';

const Content = styled.div`
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: 170px auto;
  padding: 20px;
`;

const Label = styled.span`
  color: ${props => props.theme.textColor};
  font-size: 16px;
  font-weight: 300;
  line-height: 1.25;
  text-align: right;
`;

const Value = styled(Label)`
  font-weight: 400;
  text-align: left;
`;

const Divider = styled.div`
  border-top: solid 3px #e4e4e4;
  grid-column-end: 3;
  grid-column-start: 1;
  height: 0;
  margin: 20px 0;
  width: 100%;
`;

const Bottom = styled.div`
  align-items: baseline;
  display: flex;
  grid-column-end: 3;
  grid-column-start: 1;
  margin-top: 20px;
`;

const Users = styled.div`
  grid-column-end: 3;
  grid-column-start: 1;
  margin-top: 20px;
`;

const Error = styled.div`
  background-color: #fff6f6;
  border-radius: 5px;
  border: 1px solid;
  color: #9f3a38;
  grid-column-end: 3;
  grid-column-start: 1;
  margin-top: 20px;
  padding: 20px;
`;

export default class ShareProject extends React.PureComponent {
  static propTypes = {
    account: PropTypes.object.isRequired,
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
  };

  static defaultProps = {
    error: [],
  };

  constructor(props) {
    super(props);
    // TODO: also include pending invitations by current user for account or project
    this.state = {
      users: ShareProject.fromProps(props),
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.account !== prevProps.account ||
      this.props.project !== prevProps.project
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        users: ShareProject.fromProps(this.props),
      });
    }
  }

  static fromProps(props) {
    const { account, project } = props;
    const users = {};
    account.users.forEach(u => {
      users[u.user.id] = {
        id: u.user.id,
        name: format.name(u.user),
        read: 0b101,
        content: u.contentCreator ? 0b101 : 0,
        invite: u.inviter ? 0b101 : 0,
      };
    });
    project.users.forEach(u => {
      if (users[u.user.id]) {
        users[u.user.id].read = 0b111;
        if (u.contentCreator) {
          users[u.user.id].content = 0b111;
        }
        if (u.inviter) {
          users[u.user.id].invite = 0b111;
        }
      } else {
        users[u.user.id] = {
          id: u.user.id,
          name: format.name(u.user),
          read: 0b011,
          content: u.contentCreator ? 0b011 : 0,
          invite: u.inviter ? 0b011 : 0,
        };
      }
    });
    return users;
  }

  onInviteUser = email => {
    const lcEmail = email.toLowerCase();
    if (this.state.users[lcEmail]) {
      return;
    }
    this.setState(prevState => ({
      users: {
        ...prevState.users,
        [lcEmail]: {
          id: lcEmail,
          name: `<${email}>`,
          read: 0b001,
          content: 0b000,
          invite: 0b000,
        },
      },
    }));
  };

  onTogglePerm = (id, perm) => {
    this.setState(prevState => {
      let { read, content, invite } = prevState.users[id];
      /* eslint-disable no-bitwise */
      switch (perm) {
        case 'read':
          if (read & 1) {
            read &= 0b110;
            content &= 0b110;
            invite &= 0b110;
          } else {
            read |= 0b001;
          }
          break;
        case 'content':
          if (content & 1) {
            content &= 0b110;
          } else {
            content |= 0b001;
            read |= 0b001;
          }
          break;
        case 'invite':
          if (invite & 1) {
            invite &= 0b110;
          } else {
            invite |= 0b001;
            read |= 0b001;
          }
          break;
        default:
      }
      /* eslint-enable no-bitwise */
      return {
        users: {
          ...prevState.users,
          [id]: {
            ...prevState.users[id],
            read,
            content,
            invite,
          },
        },
      };
    });
  };

  onUpdate = () => {
    /* eslint-disable no-bitwise */
    this.props.onUpdate(
      Object.values(this.state.users).map(u => ({
        user: u.id,
        read: u.read & 1,
        contentCreator: u.content & 1,
        inviter: u.invite & 1,
      })),
    );
    /* eslint-enable no-bitwise */
  };

  render() {
    const { account, error, onCancel, project } = this.props;
    const owner = `${format.name({
      firstName: account.owner.firstName,
      lastName: account.owner.lastName,
    })}`;
    return (
      <Modal onClose={onCancel} title="Share Project">
        <Content>
          <Label>Current Project:</Label>
          <Value>{project.name}</Value>
          <Label>Owner:</Label>
          <Value>{owner}</Value>
          <Divider />
          <Users>
            <ProjectPermTable
              columns={[
                { label: 'User', name: 'user' },
                { label: 'Read', name: 'read' },
                { label: 'Add Content', name: 'content' },
                { label: 'Invite User', name: 'invite' },
              ]}
              effectivePermissions={project.effectivePermissions}
              items={Object.values(this.state.users)}
              onInvite={this.onInviteUser}
              onTogglePerm={this.onTogglePerm}
            />
          </Users>
          <Bottom>
            <LegendItem value="explicit" />
            <LegendItem value="inherited" />
            <LegendItem value="none" />
            <div style={{ flex: '1 1 auto' }} />
            <Button
              primary
              onClick={() => {
                this.onUpdate();
              }}>
              Update
            </Button>
          </Bottom>
          {error.length ? (
            <Error>
              <ul>
                {error.map(e => (
                  <li key={e.field}>{e.message}</li>
                ))}
              </ul>
            </Error>
          ) : null}
        </Content>
      </Modal>
    );
  }
}
