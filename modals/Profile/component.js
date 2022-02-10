/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Form, Message } from 'semantic-ui-react';
import styled from 'react-emotion/macro';

/* App */
import Modal from 'modals/Modal';
import Button from 'components/Button';
import format from 'lib/format';

const Content = styled.div`
  align-items: left;
  display: flex;
  flex-direction: column;
  padding: 20.5px;
`;

const SaveButton = styled(Button)`
  float: right;
  padding: 3px 27px;
  margin-bottom: 20px;
  margin-right: 21px;
`;

export default class Profile extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    user: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };
  static defaultProps = {
    error: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      firstName: props.user.firstName || '',
      lastName: props.user.lastName || '',
      email: props.user.email || '',
      company: props.user.company || '',
    };
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  render() {
    const { error, onCancel, onSave } = this.props;
    const { firstName, lastName, email, company } = this.state;
    const isError = error.length > 0;

    return (
      <Modal title="User Profile" onClose={onCancel} closeLabel="Cancel">
        <Content>
          <Form error={isError}>
            <Form.Input
              label="First Name"
              placeholder="First Name"
              name="firstName"
              value={firstName}
              onChange={this.handleChange}
            />
            <Form.Input
              label="Last Name"
              placeholder="Last Name"
              name="lastName"
              value={lastName}
              onChange={this.handleChange}
            />
            <Form.Input
              label="Email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
            <Form.Input
              label="Company"
              placeholder="Company"
              name="company"
              value={company}
              onChange={this.handleChange}
            />
            <Form.Input
              readOnly
              label="Created On"
              placeholder="Created On"
              name="createdOn"
              value={format.date(this.props.user.createdOn)}
            />
            <Message
              error
              header="User update failed"
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
        <SaveButton primary onClick={() => onSave(this.state)}>
          Save
        </SaveButton>
      </Modal>
    );
  }
}
