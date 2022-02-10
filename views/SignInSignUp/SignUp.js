/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimmer,
  Dropdown,
  Header,
  Image,
  Loader,
  Segment,
  Button,
  Form,
  Message,
} from 'semantic-ui-react';
import Recaptcha from 'react-recaptcha';

/* App */
import countries from 'util/countries';
import LinkButton from 'components/LinkButton';

import css from './SignInSignUp.module.scss';

// semantic-ui is missing flags for some countries
const missingFlags = [
  'AQ',
  'BQ',
  'CW',
  'GG',
  'IM',
  'JE',
  'BL',
  'MF',
  'SX',
  'SS',
];

const countryOptions = countries.map(c => ({
  key: c.Code,
  value: c.Code,
  flag: missingFlags.includes(c.Code) ? undefined : c.Code.toLowerCase(),
  text: c.Name,
}));

const recaptchaSiteKey = '6Le0yEsUAAAAANTct_BlbJg34v40T2H5h5ixJw_8';

export default class SignUp extends React.PureComponent {
  static propTypes = {
    onSignUp: PropTypes.func.isRequired,
    onGotoSignIn: PropTypes.func.isRequired,
    error: PropTypes.array,
    loading: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    error: [],
  };
  state = {
    form: {
      firstName: '',
      lastName: '',
      phone: '',
      country: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
      type: '',
    },
    passwordError: [],
    submitting: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error) {
      this.setState({ submitting: false }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  executeCaptcha = () => this.recaptchaInstance.execute();
  verifyCallback = response => {
    this.setState({ recaptcha: response });
    this.handleSubmit();
  };

  handleChange = (e, { name, value }) => {
    this.setState(prevState => ({
      form: { ...prevState.form, [name]: value },
    }));
  };

  handleSubmit = async () => {
    this.setState({ submitting: true, passwordError: [] });
    // copy state to form object
    const form = { ...this.state.form };
    form.recaptcha = this.state.recaptcha;

    if (form.password !== form.confirmPassword) {
      this.setState({
        passwordError: [
          {
            field: '_',
            message: 'Password does not match the confirm password.',
          },
        ],
        submitting: false,
      });
      return;
    }
    const params = window.location.search;
    const type = params.substring(6);
    if (type !== null) {
      form.type = type;
    }
    delete form.confirmPassword;
    this.props.onSignUp(form);
  };

  render() {
    // Do we have any errors to display?  Find out by checking the length
    // of the errors array
    const { error, loading } = this.props;
    const {
      form: {
        firstName,
        lastName,
        phone,
        country,
        email,
        password,
        confirmPassword,
        company,
      },
      submitting,
      passwordError,
    } = this.state;
    const mergedError = [...error, ...passwordError];
    return (
      <div className={css.outer}>
        <div className={css.main}>
          <Dimmer.Dimmable as={Segment} className={css.content} padded>
            <Dimmer active={submitting || loading} inverted>
              <Loader>Creating account</Loader>
            </Dimmer>
            <Image src="/skur_logo.png" size="tiny" />
            <Header id="header" className={css.header}>
              SKUR
            </Header>
            <Form error={!!mergedError.length}>
              <Form.Input
                name="firstName"
                placeholder="Your First Name"
                value={firstName}
                onChange={this.handleChange}
              />
              <Form.Input
                name="lastName"
                placeholder="Your Last Name"
                value={lastName}
                onChange={this.handleChange}
              />
              <Form.Input
                name="company"
                placeholder="Company"
                value={company}
                onChange={this.handleChange}
              />
              <Form.Field
                name="country"
                control={Dropdown}
                placeholder="Country"
                value={country}
                options={countryOptions}
                search
                selection
                onChange={this.handleChange}
              />
              <Form.Input
                name="phone"
                placeholder="Your Phone Number"
                value={phone}
                onChange={this.handleChange}
              />
              <Form.Input
                autoComplete="username"
                name="email"
                placeholder="Your Email"
                value={email}
                onChange={this.handleChange}
              />
              <Form.Input
                autoComplete="new-password"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
              />
              <Form.Input
                autoComplete="new-password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={this.handleChange}
              />
              <Message
                error
                header="Account creation failed"
                content={
                  <ul>
                    {mergedError.map(e => (
                      <li key={e.field}>{e.message}</li>
                    ))}
                  </ul>
                }
              />
              <Recaptcha
                ref={e => {
                  this.recaptchaInstance = e;
                }}
                sitekey={recaptchaSiteKey}
                size="invisible"
                verifyCallback={this.verifyCallback}
              />
              <Button
                onClick={
                  this.state.recaptcha ? this.handleSubmit : this.executeCaptcha
                }
                fluid
                primary>
                Sign Up
              </Button>
              <div className={css.signInSignUp}>
                Already have a SKUR account?{' '}
                <LinkButton onClick={this.props.onGotoSignIn} type="button">
                  Sign in
                </LinkButton>
              </div>
            </Form>
          </Dimmer.Dimmable>
        </div>
      </div>
    );
  }
}
