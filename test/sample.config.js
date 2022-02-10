/* eslint-disable no-unused-vars */
const manycubes = {
  state: {
    nav: {
      __typename: 'Nav',
      activeAccountId: '5ae0b66f94e8b500246a0c42',
      activeProjectId: '5b170a07036cae0024731c6a',
      activeModelId: '5b22adafe9af660024cbd42d',
      activeScanId: '5b22adf0e9af660024cbd42f',
      activeDiffId: '5b280d38e9af660024cbd45f',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      adminMode: true,
      debugMode: false,
      fullScreen: false,
      modal: null,
      view: 'diff',
    },
  },
  files: {
    glb: '/test/manycubes.glb',
    objdiff: '/test/manycubes.objdiff.json',
    heatmap: '/test/manycubes.otdiff.ds.bin',
  },
};

const refinery = {
  state: {
    nav: {
      __typename: 'Nav',
      activeAccountId: '5b0ef3661299960024934af1',
      activeProjectId: '5b364d6ac0348e0024d35a2a',
      activeModelId: '5b364d9ec0348e0024d35a2c',
      activeScanId: '5b3e6c19691c930024bb575c',
      activeDiffId: '5b3e6de9691c930024bb575e',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      adminMode: true,
      debugMode: false,
      fullScreen: false,
      modal: null,
      view: 'diff',
    },
    diffSettings: {
      __typename: 'DiffSettings',
      modelFilters: {
        __typename: 'ModelFilters',
        red: true,
        yellow: true,
        green: false,
        insufficient: false,
        missing: true,
      },
      scanFilters: {
        __typename: 'ScanFilters',
        red: true,
        yellow: true,
        green: false,
        cropped: true,
      },
      heatmapLimits: {
        __typename: 'HeatmapLimits',
        max: 0.25,
        crop: 0.25,
        red: 0.0303,
        yellow: 0.0127,
        green: 0,
      },
      units: 'millimeters',
      focusObjectId: null,
      camera: {
        __typename: 'Camera',
        viewType: null,
        viewDirection: 'side',
      },
    },
  },
  files: {
    glb: '/test/refinery.glb',
    objdiff: '/test/refinery.objdiff.json',
    heatmap: '/test/refinery.otdiff.ds.bin',
  },
};

const models = {
  state: {
    nav: {
      __typename: 'Nav',
      activeAccountId: '5ab0094d59ffa800240725b9',
      activeProjectId: '5b11d21c71b41500245ab888',
      activeModelId: null,
      activeScanId: null,
      activeDiffId: null,
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      adminMode: true,
      debugMode: false,
      fullScreen: false,
      modal: null,
      view: 'project',
    },
  },
};

// module.exports = models;
// module.exports = refinery;
module.exports = manycubes;
