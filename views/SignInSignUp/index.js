/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import userCreateMutation from 'graphql/mutations/UserCreate';
import currentUserQuery from 'graphql/queries/CurrentUser';
import signInMutation from 'graphql/mutations/SignIn';
import sendResetPasswordMutation from 'graphql/mutations/SendResetPassword';

import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';

export const mapErrors = defaultError => error => {
  const firstError =
    error &&
    error.graphQLErrors &&
    error.graphQLErrors.length &&
    error.graphQLErrors[0];
  if (!firstError) {
    return [];
  }
  if (firstError.message === 'Unauthorized') {
    return [
      {
        field: '_',
        message: 'Incorrect email or password.',
      },
    ];
  }
  if (firstError.message === 'Validation Error') {
    return Object.keys(firstError.state).map(k => {
      let message = firstError.state[k][0];
      if (message === 'Duplicate key not allowed for field.') {
        message = `${k}: ${message}`;
      }
      return {
        field: k,
        message,
      };
    });
  }
  // some random error
  return [{ field: '_', message: defaultError }];
};

const updateCurrentUser = field => (
  proxy,
  {
    data: {
      [field]: { user },
    },
  },
) => {
  const data = proxy.readQuery({
    query: currentUserQuery,
  });
  data.currentUser = user;
  proxy.writeQuery({ query: currentUserQuery, data });
};

export default class SignInSignUp extends React.Component {
  state = {
    mode: 'signIn',
  };
  gotoForgotPassword = () => this.setState(() => ({ mode: 'forgotPassword' }));
  gotoSignIn = () => this.setState(() => ({ mode: 'signIn' }));
  gotoSignUp = () => this.setState(() => ({ mode: 'signUp' }));

  renderForm({
    forgotPasswordLoading,
    forgotPassword,
    forgotPasswordError,
    signIn,
    signInError,
    signInLoading,
    signUp,
    signUpError,
    signUpLoading,
  }) {
    switch (this.state.mode) {
      case 'forgotPassword':
        return (
          <ForgotPassword
            onForgotPassword={v => forgotPassword({ variables: { input: v } })}
            onGotoSignIn={this.gotoSignIn}
            error={mapErrors('Could not send email to reset password.')(
              forgotPasswordError,
            )}
            loading={forgotPasswordLoading}
          />
        );
      case 'signIn':
        return (
          <SignIn
            onSignIn={v => signIn({ variables: { input: v } })}
            onGotoSignUp={this.gotoSignUp}
            onForgot={this.gotoForgotPassword}
            error={mapErrors('Sign in failed.')(signInError)}
            loading={signInLoading}
          />
        );
      case 'signUp':
      default:
        return (
          <SignUp
            onSignUp={v => signUp({ variables: { input: v } })}
            onGotoSignIn={this.gotoSignIn}
            error={mapErrors('Sign up failed.')(signUpError)}
            loading={signUpLoading}
          />
        );
    }
  }

  render() {
    return (
      <Mutation
        displayName="SendResetPasswordMutation"
        mutation={sendResetPasswordMutation}
        onError={() => {}}
        update={updateCurrentUser('sendResetPassword')}>
        {(
          forgotPassword,
          { loading: forgotPasswordLoading, error: forgotPasswordError },
        ) => (
          <Mutation
            displayName="SignInMutation"
            mutation={signInMutation}
            onError={() => {}}
            update={updateCurrentUser('signIn')}>
            {(signIn, { error: signInError, loading: signInLoading }) => (
              <Mutation
                displayName="SignUpMutation"
                mutation={userCreateMutation}
                onError={() => {}}
                update={updateCurrentUser('userCreate')}>
                {(signUp, { error: signUpError, loading: signUpLoading }) =>
                  this.renderForm({
                    forgotPassword,
                    forgotPasswordError,
                    forgotPasswordLoading,
                    signIn,
                    signInError,
                    signInLoading,
                    signUp,
                    signUpError,
                    signUpLoading,
                  })
                }
              </Mutation>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}
