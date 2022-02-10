/* NPM */
import React from 'react';
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

import css from './Unverified.module.scss';

export default class Unverified extends React.PureComponent {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    onResendVerifyEmail: PropTypes.func.isRequired,
    error: PropTypes.array,
  };
  static defaultProps = {
    error: [],
  };
  state = {
    submitSuccess: false,
  };

  handleSubmit = async () => {
    await this.props.onResendVerifyEmail({
      email: this.props.currentUser.email,
    });
    if (this.props.error.length) {
      this.setState({
        submitSuccess: false,
      });
      return;
    }
    this.setState({ submitSuccess: true });
  };

  render() {
    // Do we have any errors to display?  Find out by checking the length
    // of the errors array
    // const { error } = this.props;
    const {
      currentUser: { email },
      error,
    } = this.props;

    const showMessage = this.state.submitSuccess;
    return (
      <div className={css.outer}>
        <div className={css.main}>
          <Segment className={css.content} padded>
            <Image src="/skur_logo.png" size="tiny" />
            <Header className={css.header}>SKUR</Header>
            <div className={css.title}>
              <p>Confirm Your Email Address</p>
            </div>
            <p>
              An email has been sent to <b>{email}</b>. Click on the sign up
              link to activate your account.
            </p>
            <Form onSubmit={this.handleSubmit} error={!!error.length}>
              <Message
                error
                header="Couldn't send email"
                content={
                  <ul>
                    {error.map(e => (
                      <li key={e.field}>{e.message}</li>
                    ))}
                  </ul>
                }
              />
              <Message
                hidden={!showMessage}
                positive
                content={<ul>Email has been sent.</ul>}
              />
              <Button onClick={this.handleSubmit} type="submit" fluid primary>
                Resend Link
              </Button>
            </Form>
          </Segment>
        </div>
      </div>
    );
  }
}
