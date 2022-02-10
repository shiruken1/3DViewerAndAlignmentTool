/* NPM */
import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

/* App */
import uploadsQuery from 'graphql/queries/Uploads';

const WithUploads = ({ children }) => (
  <Query query={uploadsQuery}>
    {({ client, data: { uploads, uploading } }) => {
      function writeUploads(data) {
        client.writeData({
          data: {
            uploads: data,
          },
        });
      }
      return children({
        client,
        uploads,
        uploading,
        writeUploads,
      });
    }}
  </Query>
);
WithUploads.propTypes = {
  children: PropTypes.func.isRequired,
};

export default WithUploads;
