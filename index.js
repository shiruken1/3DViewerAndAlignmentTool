import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import { BrowserRouter } from 'react-router-dom';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import App from './App';
import * as serviceWorker from './serviceWorker';

import localState from './localState';

const isDev = process.env.NODE_ENV === 'development';

const endpoint =
  process.env.REACT_APP_API_URI || 'https://dev.skur.com/api/graphql';

const uri = isDev ? endpoint : '/api/graphql';

const cache = new InMemoryCache();

const stateLink = localState(cache);

const httpLink = createHttpLink({
  uri,
  credentials: 'include',
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, httpLink]),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.Fragment>
      <Helmet>
        <title>SKUR Application</title>
        <meta name="description" content="SKUR Application" />
        <script src="https://www.google.com/recaptcha/api.js" async defer />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic"
          rel="stylesheet"
        />
      </Helmet>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.Fragment>
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
