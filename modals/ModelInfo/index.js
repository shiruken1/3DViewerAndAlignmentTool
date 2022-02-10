/* NPM */
import React from 'react';

/* App */
import WithNav from 'graphql/withNav';
import Loading from 'components/Loading';
import WithModel from 'graphql/withModel';

import ModelInfo from './component';

export default () => (
  <WithNav>
    {({ activeModelId, modal, writeNav }) =>
      modal === 'modelInfo' && (
        <WithModel id={activeModelId}>
          {({ model, modelLoading }) => (
            <Loading loading={modelLoading && !model}>
              {() => (
                <ModelInfo
                  model={model}
                  onCancel={() => writeNav({ modal: null })}
                />
              )}
            </Loading>
          )}
        </WithModel>
      )
    }
  </WithNav>
);
