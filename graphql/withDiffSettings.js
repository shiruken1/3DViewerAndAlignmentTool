/* NPM */
import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

/* App */
import diffSettingsQuery from 'graphql/queries/DiffSettings';

const WithDiffSettings = ({ children }) => (
  <Query query={diffSettingsQuery}>
    {({ client, data: { diffSettings } }) => {
      function writeDiffSettings(data) {
        client.writeData({
          data: {
            diffSettings: {
              ...data,
              __typename: 'DiffSettings',
            },
          },
        });
      }
      return children({ ...diffSettings, writeDiffSettings });
    }}
  </Query>
);
WithDiffSettings.propTypes = {
  children: PropTypes.func.isRequired,
};

export default WithDiffSettings;
