/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import unitDefs from 'util/units';

import Loading from 'components/Loading';

import WithDiff from 'graphql/withDiff';
import WithNav from 'graphql/withNav';
import DiffRequestAugmentMutation from 'graphql/mutations/DiffRequestAugment';

import Form from './component';

export const mapErrors = error => {
  const firstError =
    error &&
    error.graphQLErrors &&
    error.graphQLErrors.length &&
    error.graphQLErrors[0];
  if (!firstError) {
    return [];
  }
  if (firstError.message === 'Forbidden') {
    return [
      {
        field: '_',
        message: 'You do not have permission for the operation.',
      },
    ];
  }
  if (firstError.message === 'Validation Error') {
    if (firstError.state.name[0] === 'Duplicate key not allowed for field.') {
      return [
        {
          field: 'name',
          message:
            'Duplicate names are not allowed. Please try a different name.',
        },
      ];
    }
    return Object.keys(firstError.state).map(k => ({
      field: k,
      message: firstError.state[k][0],
    }));
  }
  // some random error
  return [{ field: '_', message: 'Create failed.' }];
};

// copied from API
function augmentKey({ fileType, limits: { crop, red, yellow }, units }) {
  return `${fileType}-${units}-${crop}-${red}-${yellow}`;
}

function formatLimitLegibility(value, scale) {
  return parseFloat((value * scale).toFixed(4));
}

export default () => (
  <WithNav>
    {({ activeDiffId, activeDiffViewId, modal, writeNav }) =>
      modal === 'augmentedFiles' &&
      activeDiffViewId && (
        <Mutation mutation={DiffRequestAugmentMutation} onError={() => {}}>
          {(requestAugment, { error }) => (
            <WithDiff id={activeDiffId}>
              {({ diff, diffLoading }) => (
                <Loading loading={diffLoading && !diff}>
                  {() => {
                    const diffView = diff.diffViews.find(
                      dv => dv.id === activeDiffViewId,
                    );
                    const modelUnits = diff.model.units;
                    const modelScale = unitDefs[diffView.units].to[modelUnits];
                    const modelLimits = {
                      crop: formatLimitLegibility(
                        diffView.limits.crop,
                        modelScale,
                      ),
                      yellow: formatLimitLegibility(
                        diffView.limits.yellow,
                        modelScale,
                      ),
                      red: formatLimitLegibility(
                        diffView.limits.red,
                        modelScale,
                      ),
                    };

                    const scanUnits = diff.scan.units;
                    const scanScale = unitDefs[diffView.units].to[scanUnits];
                    const scanLimits = {
                      crop: formatLimitLegibility(
                        diffView.limits.crop,
                        scanScale,
                      ),
                      yellow: formatLimitLegibility(
                        diffView.limits.yellow,
                        scanScale,
                      ),
                      red: formatLimitLegibility(
                        diffView.limits.red,
                        scanScale,
                      ),
                    };
                    const dwgKey = augmentKey({
                      fileType: 'dwg',
                      limits: modelLimits,
                      units: diff.model.units,
                    });
                    const e57Key = augmentKey({
                      fileType: 'e57',
                      limits: scanLimits,
                      units: diff.scan.units,
                    });
                    const rcpKey = augmentKey({
                      fileType: 'rcp',
                      limits: scanLimits,
                      units: diff.scan.units,
                    });
                    const augmentedFiles = diff.augmentedFiles.filter(af =>
                      [dwgKey, e57Key, rcpKey].includes(augmentKey(af)),
                    );

                    return (
                      <Form
                        augmentedFiles={augmentedFiles}
                        error={mapErrors(error)}
                        onCancel={() => writeNav({ modal: null })}
                        onRequestAugment={async fileType => {
                          const isModel = fileType === 'dwg';
                          const input = {
                            id: activeDiffId,
                            units: isModel ? modelUnits : scanUnits,
                            fileType,
                            limits: isModel ? modelLimits : scanLimits,
                          };
                          await requestAugment({
                            variables: { input },
                          });
                        }}
                      />
                    );
                  }}
                </Loading>
              )}
            </WithDiff>
          )}
        </Mutation>
      )
    }
  </WithNav>
);
