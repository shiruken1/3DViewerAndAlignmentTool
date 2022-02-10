/* NPM */
import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

/* App */
import { query } from 'lib/featureDefs';

const WithFeatures = ({ children }) => (
  <Query query={query}>
    {({ client, data: { features } }) => {
      function writeFeatures(data) {
        client.writeData({
          data: {
            features: {
              ...data,
              __typename: 'Features',
            },
          },
        });
      }
      return children({
        ...features,
        writeFeatures,
      });
    }}
  </Query>
);
WithFeatures.propTypes = {
  children: PropTypes.func.isRequired,
};

export default WithFeatures;
