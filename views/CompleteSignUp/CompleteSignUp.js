/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dimmer,
  Dropdown,
  Form,
  Header,
  Image,
  Loader,
  Message,
  Segment,
} from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

/* App */

import countries from 'util/countries';

import css from './CompleteSignUp.module.scss';

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

export default class CompleteSignUp extends React.PureComponent {
  static propTypes = {
    loadingUser: PropTypes.bool.isRequired,
    user: PropTypes.object,
    userError: PropTypes.array,
    loadingUpdate: PropTypes.bool.isRequired,
    updatedUser: PropTypes.object,
    updateError: PropTypes.array,
    onUpdate: PropTypes.func.isRequired,
    token: PropTypes.string,
  };
  static defaultProps = {
    user: null,
    userError: [],
    updatedUser: null,
    updateError: [],
    token: null,
  };
  constructor(props) {
    super(props);
    const { user, token } = props;
    this.state = {
      form: CompleteSignUp.formFromUser(user, token),
      passwordError: [],
      submitting: false,
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.user && !prevProps.user) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        form: CompleteSignUp.formFromUser(this.props.user, this.props.token),
      });
    }
    if (this.props.updateError !== prevProps.updateError) {
      this.setState({ submitting: false }); // eslint-disable-line react/no-did-update-set-state
    }
  }
  static formFromUser(user, token) {
    return {
      firstName: (user && user.firstName) || '',
      lastName: (user && user.lastName) || '',
      phone: (user && user.phone) || '',
      country: (user && user.country) || '',
      company: (user && user.company) || '',
      password: '',
      confirmPassword: '',
      token,
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState(prevState => ({
      form: { ...prevState.form, [name]: value },
    }));
  };

  handleSubmit = () => {
    this.setState({ submitting: true, passwordError: [] });
    // copy state to form object
    const form = { ...this.state.form };

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
    delete form.confirmPassword;

    this.props.onUpdate(form);
  };

  render() {
    const {
      loadingUser,
      userError,
      loadingUpdate,
      updatedUser,
      updateError,
    } = this.props;
    if (userError.length) {
      // if trouble fetching the user, just skip this
      return <Redirect to="/" />;
    }

    const {
      form: {
        firstName,
        lastName,
        phone,
        country,
        password,
        confirmPassword,
        company,
      },
      submitting,
      passwordError,
    } = this.state;
    if (loadingUser) {
      return <Loader />;
    }
    if (updatedUser) {
      return <Redirect to="/" />;
    }
    const mergedError = [...updateError, ...passwordError];

    return (
      <div className={css.outer}>
        <div className={css.main}>
          <Dimmer.Dimmable as={Segment} className={css.content} padded>
            <Dimmer active={submitting || loadingUpdate} inverted>
              <Loader>Configuring account</Loader>
            </Dimmer>
            <Image src="/skur_logo.png" size="tiny" />
            <Header className={css.header}>SKUR</Header>
            <Form error={!!mergedError.length}>
              <Form.Input
                autoComplete="given-name"
                name="firstName"
                placeholder="Your First Name"
                value={firstName}
                onChange={this.handleChange}
              />
              <Form.Input
                autoComplete="family-name"
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
                autoComplete="country"
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
                autoComplete="tel"
                name="phone"
                placeholder="Your Phone Number"
                value={phone}
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
                header="Account configuration failed"
                content={
                  <ul>
                    {mergedError.map(e => (
                      <li key={e.field}>{e.message}</li>
                    ))}
                  </ul>
                }
              />
              <Button onClick={this.handleSubmit} type="submit" fluid primary>
                Complete Setup
              </Button>
            </Form>
          </Dimmer.Dimmable>
        </div>
      </div>
    );
  }
}
