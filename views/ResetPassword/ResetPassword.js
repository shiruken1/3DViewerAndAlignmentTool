/* NPM */
import React from 'react';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Header,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';

/* App */

import css from './ResetPassword.module.scss';

export default class ResetPassword extends React.PureComponent {
  static propTypes = {
    onResetPassword: PropTypes.func.isRequired,
    error: PropTypes.array,
  };
  static defaultProps = {
    error: [],
  };
  state = {
    password: '',
    confirmPassword: '',
    passwordChangeError: [],
    submitSuccess: false,
    mergedError: [],
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async () => {
    this.setState({ passwordChangeError: [], mergedError: [] });
    const parsed = queryString.parse(window.location.search);
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        passwordChangeError: [
          {
            field: '_',
            message: 'Passwords do not match',
          },
        ],
      });
      await this.setState(prevState => ({
        mergedError: prevState.passwordChangeError,
      }));
      return;
    }
    if (!parsed.u || !parsed.t) {
      this.setState({
        passwordChangeError: [
          {
            field: '_',
            message: 'Password update failed. Please check link in email.',
          },
        ],
      });
      await this.setState(prevState => ({
        mergedError: prevState.passwordChangeError,
      }));
      return;
    }

    await this.props.onResetPassword({
      id: parsed.u,
      password: this.state.password,
      token: parsed.t,
    });

    if (this.props.error.length) {
      this.setState({
        submitSuccess: false,
        mergedError: [...this.props.error],
      });
      return;
    }
    this.setState({ submitSuccess: true });
  };

  render() {
    // Do we have any errors to display?  Find out by checking the length
    // of the errors array
    // const { error } = this.props;
    const { password, confirmPassword, mergedError } = this.state;

    const showMessage = this.state.submitSuccess;
    return (
      <div className={css.outer}>
        <div className={css.main}>
          <Segment className={css.content} padded>
            <Image src="/skur_logo.png" size="tiny" />
            <Header className={css.header}>SKUR</Header>
            <div className={css.changePasswordLabel}>
              <p>Please enter a new password twice:</p>
            </div>
            <Form onSubmit={this.handleSubmit} error={!!mergedError.length}>
              <Form.Input
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
              />
              <Form.Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={this.handleChange}
              />
              <Message
                error
                header="Couldn't change password"
                content={
                  <ul>
                    {mergedError.map(e => (
                      <li key={e.field}>{e.message}</li>
                    ))}
                  </ul>
                }
              />
              <Message
                hidden={!showMessage}
                positive
                content={<ul>Password has been changed.</ul>}
              />
              <Button onClick={this.handleSubmit} type="submit" fluid primary>
                Update Password
              </Button>
            </Form>
          </Segment>
        </div>
      </div>
    );
  }
}
