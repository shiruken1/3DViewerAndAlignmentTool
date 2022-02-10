/* NPM */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withProps from 'recompose/withProps';

import styled from 'react-emotion/macro';

/* App */
import Button from 'components/Button';

import Icon from './Icon';

function mapPerm(perm) {
  switch (perm) {
    case 0b101:
      return 'inherited';
    case 0b111:
    case 0b011:
    case 0b001:
      return 'explicit';
    default:
      return 'none';
  }
}

const ListGrid = styled.div`
  color: ${props => props.theme.subHeaderColor};
  display: grid;
  grid-template-rows: 30px;
  grid-auto-rows: 24px;
  grid-gap: 2px;
  margin-top: -5px;
`;

const RowGrid = styled.div`
  align-items: end;
  display: grid;
  grid-template-columns: minmax(190px, 1fr) repeat(4, 50px);
  grid-gap: 2px;
  padding-right: 8px;

  background: ${props => props.background};
  color: ${props => props.color};
`;

const HeaderText = styled.div`
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.1px;
  line-height: 1;
`;

const ItemRow = styled(RowGrid)``;

const Item = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-top: -1px;
  text-align: ${props => (props.right ? 'right' : 'left')};
  &:first-child {
    margin-left: 1px;
  }
`;

const Input = styled.input`
  font-size: 16px;
  line-height: 1.25;
`;

const InviteButton = withProps({ hollow: true, tertiary: true })(styled(Button)`
  grid-column-end: 5;
  grid-column-start: 2;
`);

const InviteRow = styled(ItemRow)`
  margin-top: 10px;
`;

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/;
  return re.test(String(email).toLowerCase());
}

export default class AccountPermTable extends PureComponent {
  static propTypes = {
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ).isRequired,
    effectivePermissions: PropTypes.shape({
      contentCreator: PropTypes.bool,
      projectCreator: PropTypes.bool,
    }).isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        read: PropTypes.number.isRequired,
        content: PropTypes.number.isRequired,
        project: PropTypes.number.isRequired,
        invite: PropTypes.number.isRequired,
      }),
    ).isRequired,
    onInvite: PropTypes.func.isRequired,
    onTogglePerm: PropTypes.func.isRequired,
  };

  state = { email: '' };

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  render() {
    const {
      columns,
      effectivePermissions: { contentCreator, projectCreator },
      items,
      onInvite,
      onTogglePerm,
    } = this.props;
    return (
      <ListGrid>
        <RowGrid>
          {columns.map(c => (
            <HeaderText key={c.name}>{c.label}</HeaderText>
          ))}
        </RowGrid>
        {items.map(i => {
          // can't get to this modal if no invite perm, so can always grant/revoke invite
          // can grant/revoke projectCreator, contentCreator if user has that perm
          // can only revoke read if that doesn't mean revoking a perm the user dosn't have
          const canChangeRead =
            !i.read ||
            ((contentCreator || !i.content) && (projectCreator || !i.project));
          return (
            <ItemRow key={i.id}>
              <Item>{i.name}</Item>
              <Item>
                <Icon
                  disabled={!canChangeRead}
                  type="read"
                  value={mapPerm(i.read)}
                  onClick={() => onTogglePerm(i.id, 'read')}
                />
              </Item>
              <Item>
                <Icon
                  disabled={!contentCreator}
                  type="content"
                  value={mapPerm(i.content)}
                  onClick={() => onTogglePerm(i.id, 'content')}
                />
              </Item>
              <Item>
                <Icon
                  disabled={!projectCreator}
                  type="project"
                  value={mapPerm(i.project)}
                  onClick={() => onTogglePerm(i.id, 'project')}
                />
              </Item>
              <Item>
                <Icon
                  type="invite"
                  value={mapPerm(i.invite)}
                  onClick={() => onTogglePerm(i.id, 'invite')}
                />
              </Item>
            </ItemRow>
          );
        })}
        <InviteRow>
          <Input
            placeholder="Enter email address(es)"
            onChange={this.handleEmailChange}
            value={this.state.email}
          />
          <InviteButton
            disabled={!validateEmail(this.state.email)}
            onClick={() => {
              onInvite(this.state.email);
              this.setState({ email: '' });
            }}>
            Invite New
          </InviteButton>
        </InviteRow>
      </ListGrid>
    );
  }
}
