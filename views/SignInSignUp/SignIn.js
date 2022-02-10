/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dimmer,
  Form,
  Header,
  Image,
  Loader,
  Message,
  Segment,
} from 'semantic-ui-react';
import styled from 'react-emotion/macro';

/* App */
import LinkButton from 'components/LinkButton';

import css from './SignInSignUp.module.scss';

const ForgotButton = styled(LinkButton)`
  float: right;
  margin-bottom: 1em;
`;

export default class SignIn extends React.PureComponent {
  static propTypes = {
    onForgot: PropTypes.func.isRequired,
    onGotoSignUp: PropTypes.func.isRequired,
    onSignIn: PropTypes.func.isRequired,
    error: PropTypes.array,
    loading: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    error: [],
  };
  state = {
    email: '',
    password: '',
    signingIn: false,
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });
  handleSubmit = async () => {
    this.setState({ signingIn: true });
    this.props.onSignIn({
      email: this.state.email,
      password: this.state.password,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error) {
      this.setState({ signingIn: false }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  render() {
    // Do we have any errors to display?  Find out by checking the length
    // of the errors array
    const { error, loading } = this.props;
    const { email, password, signingIn } = this.state;
    return (
      <div className={css.outer}>
        <div className={css.main}>
          <Dimmer.Dimmable as={Segment} className={css.content} padded>
            <Dimmer active={signingIn || loading} inverted>
              <Loader>Signing In</Loader>
            </Dimmer>
            <Image src="/skur_logo.png" size="tiny" />
            <Header className={css.header}>SKUR</Header>
            <Form onSubmit={this.handleSubmit} error={!!error.length}>
              <Form.Input
                autoComplete="username"
                name="email"
                placeholder="Email"
                value={email}
                onChange={this.handleChange}
              />
              <Form.Input
                autoComplete="current-password"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
              />
              <Message
                error
                header="Couldn't log you in"
                content={
                  <ul>
                    {error.map(e => (
                      <li key={e.field}>{e.message}</li>
                    ))}
                  </ul>
                }
              />
              <ForgotButton onClick={this.props.onForgot}>
                Forgot your password?
              </ForgotButton>
              <Button type="submit" fluid primary>
                Sign In
              </Button>
              <div className={css.signInSignUp}>
                Don&#39;t have an account yet?{' '}
                <LinkButton onClick={this.props.onGotoSignUp}>
                  Sign Up
                </LinkButton>
              </div>
            </Form>
          </Dimmer.Dimmable>
        </div>
      </div>
    );
  }
}
