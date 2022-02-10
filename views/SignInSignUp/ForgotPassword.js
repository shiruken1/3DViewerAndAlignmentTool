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
import css from './ForgotPassword.module.scss';

export default class ForgotPassword extends React.PureComponent {
  static propTypes = {
    onForgotPassword: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      form: {
        email: '',
      },
      submitSuccess: false,
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState(prevState => ({
      form: { ...prevState.form, [name]: value },
    }));
  };

  handleSubmit = async () => {
    this.setState({ submitSuccess: false });
    const form = { ...this.state.form };
    await this.props.onForgotPassword(form);
    this.setState({ submitSuccess: true });
  };

  render() {
    // Do we have any errors to display?  Find out by checking the length
    // of the errors array
    const {
      form: { email },
    } = this.state;
    const hideMessage = this.state.submitSuccess;
    return (
      <div className={css.outer}>
        <div className={css.main}>
          <Segment className={css.content} padded>
            <Image src="/skur_logo.png" size="tiny" />
            <Header className={css.header}>SKUR</Header>
            <div className={css.forgotPassword}>
              Enter your email and we will send you a password reset link.
            </div>
            <Form>
              <Form.Input
                name="email"
                placeholder="Email"
                value={email}
                onChange={this.handleChange}
              />
              <Message
                hidden={!hideMessage}
                positive
                content={<ul>Your request has been submitted.</ul>}
              />
              <Button type="submit" fluid primary onClick={this.handleSubmit}>
                Send Request
              </Button>
            </Form>
          </Segment>
        </div>
      </div>
    );
  }
}
