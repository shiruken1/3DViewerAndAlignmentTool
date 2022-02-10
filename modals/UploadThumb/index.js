/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';
// import PropTypes from 'prop-types';

/* App */
import diffUpdateMutation from 'graphql/mutations/DiffUpdate';
import WithNav from 'graphql/withNav';

import Component from './component';

export default () => (
  <WithNav>
    {({ activeDiffId, modal, writeNav }) =>
      modal === 'uploadThumb' && (
        <Mutation mutation={diffUpdateMutation} onError={() => {}}>
          {(update, { error: updateError }) => (
            <Component
              onCancel={() => writeNav({ modal: null })}
              onSetThumb={thumb => {
                update({
                  variables: {
                    input: { id: activeDiffId, updates: { thumb } },
                  },
                });
                writeNav({ modal: null });
              }}
              updateError={updateError}
            />
          )}
        </Mutation>
      )
    }
  </WithNav>
);
