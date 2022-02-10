import { withClientState } from 'apollo-link-state';
import _ from 'lodash';

import currentUserQuery from 'graphql/queries/CurrentUser';
import uploadsQuery from 'graphql/queries/Uploads';

import featureDefs from 'lib/featureDefs';

import DiffSettings from 'util/DiffSettings';
import Nav from 'util/Nav';

let testState = {};
if (process.env.NODE_ENV === 'development') {
  try {
    testState = require('test/config.js').state || {}; // eslint-disable-line import/no-unresolved
    console.log('loaded state from test/config.js'); // eslint-disable-line no-console
  } catch (e) {
    // no test config found
  }
}

const defaults = {
  nav: Nav.defaultValue,
  uploads: [],
  uploading: false,
  diffSettings: DiffSettings.defaultValue,
  features: {
    __typename: 'Features',
    ..._.mapValues(featureDefs, f => f.value),
  },
  ...testState,
};

const resolvers = {
  Mutation: {},
  Account: {
    currentUserIsOwner: (obj, args, { cache }) => {
      const user = cache.readQuery({
        query: currentUserQuery,
      });
      const userId = user && user.currentUser && user.currentUser.id;
      return obj.owner.id === userId;
    },
  },
  Model: {
    uploadProgress: (obj, args, { cache }) => {
      const uploads = cache.readQuery({
        query: uploadsQuery,
      });
      const upload = uploads.uploads.find(u => u.artifactId === obj.id);
      if (!upload) {
        return null;
      }
      const progress = upload.files.reduce((p, f) => {
        if (f.done) {
          return p;
        }
        return p + f.progress / f.fileSize;
      }, 0);
      return progress;
    },
  },
  Scan: {
    uploadProgress: (obj, args, { cache }) => {
      const uploads = cache.readQuery({
        query: uploadsQuery,
      });
      const upload = uploads.uploads.find(u => u.artifactId === obj.id);
      if (!upload) {
        return null;
      }
      const progress = upload.files.reduce((p, f) => {
        if (f.done) {
          return p;
        }
        return p + f.progress / f.fileSize;
      }, 0);
      return progress;
    },
  },
};

export default cache =>
  withClientState({
    cache,
    defaults,
    resolvers,
  });
