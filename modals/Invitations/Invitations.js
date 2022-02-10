/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion/macro';

/* App */
import Modal from 'modals/Modal';

import InviteTable from './InviteTable';

const Content = styled.div`
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: 170px auto;
  padding: 20px;
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

export default class Invitations extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    onClose: PropTypes.func.isRequired,
    onRespond: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  static defaultProps = {
    error: [],
  };

  render() {
    const { error, onClose, onRespond, user } = this.props;
    return (
      <Modal onClose={onClose} title="Invitations">
        <Content>
          <Users>
            <InviteTable items={user.invitations} onRespond={onRespond} />
          </Users>
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
