/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Message } from 'semantic-ui-react';
import styled from 'react-emotion/macro';

/* App */
import Modal from 'modals/Modal';

const Content = styled.div`
  align-items: center;
  display: flex;
  padding: 20.5px;
`;

const ChangeOwnerButton = styled(Button)`
  margin: 15px 15px !important;
  width: 100px;
  float: right;
`;

export default class ChangeOwner extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onChangeOwner: PropTypes.func.isRequired,
    account: PropTypes.object.isRequired,
  };

  static defaultProps = {
    error: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      ownerId: null,
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  render() {
    const { error, onCancel, onChangeOwner, account } = this.props;
    const isError = error.length > 0;
    const ownerOptions = account.users
      .filter(u => u.user.emailVerified)
      .map(u => ({
        key: u.user.id,
        value: u.user.id,
        text: `${u.user.firstName} ${u.user.lastName}`,
      }));

    return (
      <Modal
        title="Change Owner"
        onClose={onCancel}
        closeLabel="Cancel"
        width="300px">
        <Content>
          <Form error={isError}>
            <Form.Select
              required
              label="Users"
              name="ownerId"
              placeholder="Select Owner"
              options={ownerOptions}
              selection
              onChange={this.handleChange}
            />
            <Message
              error
              header="Change owner failed"
              content={
                <ul>
                  {error.map(e => (
                    <li key={e.field}>{e.message}</li>
                  ))}
                </ul>
              }
            />
          </Form>
        </Content>
        <ChangeOwnerButton
          color="orange"
          disabled={!this.state.ownerId}
          onClick={() => onChangeOwner(this.state)}>
          Change Owner
        </ChangeOwnerButton>
      </Modal>
    );
  }
}
