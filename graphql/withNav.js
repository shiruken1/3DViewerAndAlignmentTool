/* NPM */
import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

/* App */
import navQuery from 'graphql/queries/Nav';

const WithNav = ({ children }) => (
  <Query query={navQuery}>
    {({ client, data: { nav } }) => {
      function writeNav(data) {
        client.writeData({
          data: {
            nav: {
              ...data,
              __typename: 'Nav',
            },
          },
        });
      }
      return children({
        ...nav,
        writeNav,
      });
    }}
  </Query>
);
WithNav.propTypes = {
  children: PropTypes.func.isRequired,
};

export default WithNav;
