/* NPM */
import React from 'react';
import { Mutation } from 'react-apollo';

/* App */
import Loading from 'components/Loading';

import { formatAlignment } from 'modals/UploadScan';

import diffPurchaseMutation from 'graphql/mutations/DiffPurchase';
import diffCreateMutation from 'graphql/mutations/DiffCreate';
import WithDiffSettings from 'graphql/withDiffSettings';
import WithProjectView from 'graphql/withProjectView';
import WithNav from 'graphql/withNav';

import DiffSettings from 'util/DiffSettings';

import ProjectView from './component';

function undeleted(items) {
  return items.filter(item => !item.deleted);
}

// build list of augmented scans used by ScanList
// by adding associated diffs and models
function mergeScansAndDiffs({ diffs, scans, models }) {
  if (!diffs || !scans || !models) {
    return [];
  }
  return scans.map(s => ({
    id: s.id,
    scan: s,
    diffs: diffs.filter(d => d.scanId === s.id),
    models: diffs
      .filter(d => d.scanId === s.id)
      .map(d => models.find(m => m.id === d.modelId)),
  }));
}

// populate object with diff, model and scan for diff that
// is in the process of being purchased
function getDiffInCart({ diffIdInCart, project: { diffs, models, scans } }) {
  if (!diffIdInCart) {
    return null;
  }
  const diff = diffs.find(d => d.id === diffIdInCart);
  let scan;
  let model;
  if (diff) {
    scan = scans.find(s => s.id === diff.scanId);
    model = models.find(m => m.id === diff.modelId);
  } else {
    scan = scans.find(s => s.id === diffIdInCart);
  }
  return { diff, model, scan };
}

export const mapPurchaseErrors = error => {
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
    return Object.keys(firstError.state).map(k => ({
      field: k,
      message: firstError.state[k][0],
    }));
  }
  if (firstError.message === 'Insufficient Diffs Available') {
    return [
      {
        field: '_',
        message: 'There are insufficient available diffs in this Workspace.',
      },
    ];
  }
  // some random error
  return [{ field: '_', message: 'Diff purchase failed.' }];
};

export default class extends React.PureComponent {
  static LinkFields = ['activeAccountId', 'activeProjectId', 'view'];

  selectDiff = ({ diffs, id, writeNav }) => {
    if (!diffs) return;
    const modelIds = [];
    const scanIds = [];
    const diff = id && diffs.find(d => d.id === id);
    if (diff) {
      modelIds.push(diff.modelId);
      scanIds.push(diff.scanId);
    }
    writeNav({
      activeDiffId: id,
      activeModelId: null,
      activeScanId: null,
      associatedDiffIds: [id],
      associatedModelIds: modelIds,
      associatedScanIds: scanIds,
    });
  };

  selectModel = ({ diffs, id, writeNav }) => {
    // TODO: bought diffs contribute to diffIds
    //       unbought diffs contribute to scanIds
    const diffIds = diffs.filter(d => d.modelId === id).map(d => d.id);
    const scanIds = diffs.filter(d => d.modelId === id).map(d => d.scanId);
    const nav = {
      activeDiffId: null,
      activeModelId: id,
      activeScanId: null,
      associatedDiffIds: diffIds,
      associatedModelIds: [id],
      associatedScanIds: scanIds,
    };
    writeNav(nav);
  };

  selectScan = ({ diffs, id, writeNav }) => {
    const diffIds = diffs.filter(d => d.scanId === id).map(d => d.id);
    const modelIds = diffs
      .filter(d => d.scanId === id && d.modelId)
      .map(d => d.modelId);
    const nav = {
      activeDiffId: null,
      activeModelId: null,
      activeScanId: id,
      associatedDiffIds: diffIds,
      associatedModelIds: modelIds,
      associatedScanIds: [id],
    };
    writeNav(nav);
  };

  purchaseDiff = async ({ diffs, purchase, updateInput, writeNav, create }) => {
    const diff = diffs.find(d => d.id === updateInput.id);
    const purchaseInput = {
      id: updateInput.id,
    };

    // if diff was prev deleted, create a new one and purchase that one
    if (diff.deleted) {
      const { alignment } = diff;
      delete alignment.__typename; // eslint-disable-line no-underscore-dangle

      const input = {
        name: updateInput.updates.name,
        description: updateInput.updates.description,
        modelId: diff.modelId,
        scanId: diff.scanId,
        alignment: formatAlignment(
          alignment.method,
          alignment.x,
          alignment.y,
          alignment.z,
          alignment.rotation,
        ),
      };

      const { data } = await create({ variables: { input } });
      if (!data) {
        return;
      }

      purchaseInput.id = data.diffCreate.diff.id;
    } else {
      purchaseInput.updates = updateInput.updates;
    }

    const { data } = await purchase({
      variables: {
        input: purchaseInput,
      },
    });

    if (!data) {
      return;
    }

    writeNav({
      diffIdInCart: null,
    });
    this.selectDiff({ diffs, id: purchaseInput.id, writeNav });
  };

  render() {
    return (
      <WithNav>
        {({
          activeDiffId,
          activeModelId,
          activeProjectId,
          activeScanId,
          associatedDiffIds,
          associatedModelIds,
          associatedScanIds,
          adminMode,
          diffIdInCart,
          writeNav,
        }) => {
          if (!activeProjectId) return null;
          return (
            <WithDiffSettings>
              {({ writeDiffSettings }) => (
                <WithProjectView projectId={activeProjectId}>
                  {({ error, loading, project }) => (
                    <Loading loading={loading && !project}>
                      {() => {
                        if (
                          error &&
                          !/GraphQL error: Unauthorized/.test(error.message)
                        ) {
                          throw error;
                        }
                        return (
                          <Mutation
                            mutation={diffPurchaseMutation}
                            onError={() => {}}>
                            {(purchase, { error: purchaseError }) => (
                              <Mutation
                                mutation={diffCreateMutation}
                                onError={() => {}}>
                                {create => {
                                  const {
                                    activities,
                                    diffs,
                                    models,
                                    scans,
                                    effectivePermissions,
                                  } = project;
                                  // filter out deleted objects, and also unpurchased diffs
                                  const umodels = models && undeleted(models);
                                  const uscans = scans && undeleted(scans);
                                  const udiffs =
                                    diffs &&
                                    diffs.filter(
                                      d =>
                                        // !d.deleted && // so we can show the proper status of a scan if its diff has been deleted
                                        (!d.scanId ||
                                          uscans.find(
                                            s => s.id === d.scanId,
                                          )) &&
                                        (!d.modelId ||
                                          umodels.find(
                                            m => m.id === d.modelId,
                                          )),
                                    );
                                  const pdiffs = udiffs.filter(
                                    d => d.purchased,
                                  );
                                  const mergedScans = mergeScansAndDiffs({
                                    diffs: udiffs,
                                    models: umodels,
                                    scans: uscans,
                                  });
                                  return (
                                    <ProjectView
                                      projectPermissions={effectivePermissions}
                                      activeDiffId={activeDiffId}
                                      activeModelId={activeModelId}
                                      activeScanId={activeScanId}
                                      activities={activities}
                                      adminMode={adminMode}
                                      associatedDiffIds={associatedDiffIds}
                                      associatedModelIds={associatedModelIds}
                                      associatedScanIds={associatedScanIds}
                                      diffInCart={getDiffInCart({
                                        diffIdInCart,
                                        project,
                                      })}
                                      diffs={pdiffs}
                                      loading={loading}
                                      models={umodels}
                                      onPurchaseDiff={updateInput => {
                                        this.purchaseDiff({
                                          diffs,
                                          purchase,
                                          updateInput,
                                          writeNav,
                                          create,
                                        });
                                      }}
                                      onAddToCart={id => {
                                        writeNav({
                                          diffIdInCart: id,
                                        });
                                      }}
                                      onSelectDiff={id => {
                                        this.selectDiff({
                                          diffs,
                                          id,
                                          writeNav,
                                        });
                                      }}
                                      onEditDiff={id => {
                                        writeNav({
                                          activeDiffId: id,
                                          modal: 'diffEdit',
                                        });
                                      }}
                                      onDeleteDiff={id => {
                                        writeNav({
                                          activeDiffId: id,
                                          modal: 'diffDelete',
                                        });
                                      }}
                                      onSetDiffThumb={id => {
                                        this.selectDiff({
                                          diffs,
                                          id,
                                          writeNav,
                                        });
                                        writeNav({ modal: 'uploadThumb' });
                                      }}
                                      onSelectModel={id => {
                                        this.selectModel({
                                          diffs,
                                          id,
                                          writeNav,
                                        });
                                      }}
                                      onEditModel={id => {
                                        writeNav({
                                          activeModelId: id,
                                          modal: 'modelEdit',
                                        });
                                      }}
                                      onDeleteModel={id => {
                                        writeNav({
                                          activeModelId: id,
                                          modal: 'modelDelete',
                                        });
                                      }}
                                      onModelInfo={id => {
                                        writeNav({
                                          activeModelId: id,
                                          modal: 'modelInfo',
                                        });
                                      }}
                                      onLaunchAA={id => {
                                        writeNav({
                                          activeDiffId: id,
                                          view: 'align',
                                        });
                                      }}
                                      onSelectScan={id => {
                                        this.selectScan({
                                          diffs,
                                          id,
                                          writeNav,
                                        });
                                      }}
                                      onEditScan={id => {
                                        writeNav({
                                          activeScanId: id,
                                          modal: 'scanEdit',
                                        });
                                      }}
                                      onDeleteScan={id => {
                                        writeNav({
                                          activeScanId: id,
                                          modal: 'scanDelete',
                                        });
                                      }}
                                      onScanInfo={id => {
                                        writeNav({
                                          activeScanId: id,
                                          modal: 'scanInfo',
                                        });
                                      }}
                                      onShowAssociate={id => {
                                        writeNav({
                                          activeScanId: id,
                                          modal: 'associateScan',
                                        });
                                      }}
                                      onDiffInfo={id => {
                                        writeNav({
                                          activeDiffId: id,
                                          modal: 'diffInfo',
                                        });
                                      }}
                                      onViewDiff={id => {
                                        const activeDiff = diffs.find(
                                          d => d.id === id,
                                        );
                                        const view = activeDiff.diffViews.length
                                          ? activeDiff.diffViews.slice(-1)[0]
                                          : null;
                                        if (view) {
                                          writeDiffSettings(
                                            DiffSettings.fromDiffView(view),
                                          );
                                        } else {
                                          writeDiffSettings({
                                            autoCamera: true,
                                          });
                                        }
                                        writeNav({
                                          activeDiffId: id,
                                          activeDiffViewId: view && view.id,
                                          view: 'diff',
                                        });
                                      }}
                                      purchaseErrors={mapPurchaseErrors(
                                        purchaseError,
                                      )}
                                      scans={mergedScans}
                                    />
                                  );
                                }}
                              </Mutation>
                            )}
                          </Mutation>
                        );
                      }}
                    </Loading>
                  )}
                </WithProjectView>
              )}
            </WithDiffSettings>
          );
        }}
      </WithNav>
    );
  }
}
