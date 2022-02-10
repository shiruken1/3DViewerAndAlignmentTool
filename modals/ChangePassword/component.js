/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Header, Icon, Message, Modal } from 'semantic-ui-react';

/* App */

export default class ChangePassword extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    userid: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onResetPassword: PropTypes.func.isRequired,
  };
  static defaultProps = {
    error: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      passwordMatchError: [],
      mergedError: [],
      password: '',
      oldPassword: '',
      confirmPassword: '',
    };
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async () => {
    this.setState({ passwordMatchError: [], mergedError: [] });
    if (this.state.password !== this.state.confirmPassword) {
      await this.setState({
        passwordMatchError: [
          {
            field: '_',
            message: 'Passwords do not match',
          },
        ],
      });
      await this.setState(prevState => ({
        mergedError: prevState.passwordMatchError,
      }));
      return;
    }

    await this.props.onResetPassword({
      id: this.props.userid,
      password: this.state.password,
      oldPassword: this.state.oldPassword,
    });

    if (this.props.error.length) {
      await this.setState((prevState, prevProps) => ({
        mergedError: [...prevProps.error, ...prevState.passwordMatchError],
      }));
    }
  };

  render() {
    const { onCancel } = this.props;
    const { oldPassword, password, confirmPassword, mergedError } = this.state;
    return (
      <Modal open>
        <Header icon="user" content="Change Password" />
        <Modal.Content>
          <Form error={!!mergedError.length}>
            <Form.Input
              label="Current Password"
              type="password"
              placeholder="Current Password"
              name="oldPassword"
              value={oldPassword}
              onChange={this.handleChange}
            />
            <Form.Input
              label="Password"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
            <Form.Input
              label="Confirm password"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={this.handleChange}
            />
            <Message
              error
              header="Password change failed"
              content={
                <ul>
                  {mergedError.map(e => (
                    <li key={e.field}>{e.message}</li>
                  ))}
                </ul>
              }
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleSubmit} type="submit" primary>
            <Icon name="checkmark" /> Ok
          </Button>
          <Button onClick={onCancel}>
            <Icon name="cancel" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
