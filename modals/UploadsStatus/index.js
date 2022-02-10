/* NPM */
import React from 'react';

/* App */
import WithNav from 'graphql/withNav';
import WithUploads from 'graphql/withUploads';

import Upload from 'util/upload';

import UploadsStatus from './component';

export default () => (
  <WithNav>
    {({ modal, writeNav }) =>
      modal === 'uploadsStatus' && (
        <WithUploads>
          {({ client, uploads }) =>
            !!uploads.length && (
              <UploadsStatus
                onClose={() => writeNav({ modal: null })}
                onDelete={id => {
                  Upload.remove({ client, id });
                }}
                uploads={uploads}
              />
            )
          }
        </WithUploads>
      )
    }
  </WithNav>
);
