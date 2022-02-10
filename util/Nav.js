const defaultValue = {
  __typename: 'Nav',
  adminMode: false,
  activeAccountId: null,
  activeProjectId: null,
  activeModelId: null,
  activeScanId: null, // beware: may be scan or diff
  activeDiffId: null,
  activeDiffViewId: null,
  associatedModelIds: [],
  associatedScanIds: [], // beware: may be scans or diffs
  associatedDiffIds: [],
  diffIdInCart: null, // beware: may be scan or diff
  debugMode: false,
  view: 'home',
  modal: null,
  fullScreen: false,
};

export default {
  defaultValue,
};
