/* NPM */
import React from 'react';

/* App */
import WithFeatures from 'graphql/withFeatures';
import WithNav from 'graphql/withNav';
import Form from './component';

export default () => (
  <WithNav>
    {({ modal, writeNav }) =>
      modal === 'features' && (
        <WithFeatures>
          {({ writeFeatures, ...features }) => (
            <Form
              features={features}
              writeFeatures={writeFeatures}
              onClose={() => writeNav({ modal: null })}
            />
          )}
        </WithFeatures>
      )
    }
  </WithNav>
);
