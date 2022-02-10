/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Query } from 'react-apollo';
import queryString from 'query-string';

import { Loader } from 'semantic-ui-react';
import { ThemeProvider } from 'emotion-theming';

/* App */
import currentUserQuery from 'graphql/queries/CurrentUser';

import ErrorBoundary from 'components/ErrorBoundary';
import { Navigate } from 'components/Link';
import CurrentUserContext from 'context/currentUser';

import CompleteSignUp from 'views/CompleteSignUp';
import Main from 'views/Main';
import SignInSignUp from 'views/SignInSignUp';
import ResetPassword from 'views/ResetPassword';
import Unverified from 'views/Unverified';

import './App.scss';
import theme from './theme';

const Inner = ({ currentUser, loading, params }) => {
  // link and signed in?
  if (params.q && currentUser) {
    return <Navigate params={params} />;
  }
  if (params.u && params.t) {
    return <CompleteSignUp userId={params.u} token={params.t} />;
  }
  if (currentUser) {
    if (currentUser.emailVerified) {
      return <Main currentUser={currentUser} />;
    }
    return <Unverified currentUser={currentUser} />;
  }
  if (loading) {
    return <Loader active />;
  }
  return <SignInSignUp />;
};
Inner.propTypes = {
  currentUser: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
};
Inner.defaultProps = {
  currentUser: null,
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <Switch>
        <Route path="/reset" component={ResetPassword} />
        <Route
          path="/"
          render={({ location }) => (
            <Query query={currentUserQuery} pollInterval={15000}>
              {({ loading, data }) => {
                const currentUser = data && data.currentUser;
                const params = queryString.parse(location.search);
                return (
                  <CurrentUserContext.Provider value={currentUser}>
                    <Inner
                      currentUser={currentUser}
                      loading={loading}
                      params={params}
                    />
                  </CurrentUserContext.Provider>
                );
              }}
            </Query>
          )}
        />
      </Switch>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
