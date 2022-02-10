/* eslint-disable */
const garden = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: true,
      activeAccountId: '5ba5601c015b610026e8ef04',
      activeProjectId: '5bb44069d4d7fc0026d54152',
      activeScanId: '5bb44184d4d7fc0026d5415b',
      activeModelId: '5bb44163d4d7fc0026d54159',
      activeDiffId: '5bb44184d4d7fc0026d5415d',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'diff',
      modal: null,
      fullScreen: false,
    },
  },
  files: {
    glb: '/test/garden.glb',
    heatmap: '/test/garden.otdiff.ds.bin',
    objdiff: '/test/garden.objdiff.json',
  },
};

const gardenAA_m = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: true,
      activeAccountId: '5b9013b541671f00240d7d5d',
      activeProjectId: '5b9061d4ddf84300243dbb4d',
      activeScanId: '5bd8bcc083b3c700269b68f7',
      activeModelId: '5bd89a5603c3e700260b6b16',
      activeDiffId: '5bd8bcc083b3c700269b68f9',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'align',
      modal: null,
      fullScreen: false,
    },
  },
  files: {
    glb: '/test/garden.glb',
    planes: '/test/garden_m.planes.json',
    heatmap: '/test/garden_m.points.bin',
  },
};

const gardenAA_experimental = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: true,
      activeAccountId: '5b9013b541671f00240d7d5d',
      activeProjectId: '5b9061d4ddf84300243dbb4d',
      activeScanId: '5bd8bcc083b3c700269b68f7',
      activeModelId: '5bd89a5603c3e700260b6b16',
      activeDiffId: '5bd8bcc083b3c700269b68f9',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'align',
      modal: null,
      fullScreen: false,
    },
  },
  files: {
    glb: '/test/garden.glb',
    planes: '/test/exp.planes.json',
    // planes: '/test/garden.original.planes.json',
    heatmap: '/test/garden_experimental.points.bin',
  },
};

const gardenAA_plane_in_question = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: true,
      activeAccountId: '5b9013b541671f00240d7d5d',
      activeProjectId: '5b9061d4ddf84300243dbb4d',
      activeScanId: '5bd8bcc083b3c700269b68f7',
      activeModelId: '5bd89a5603c3e700260b6b16',
      activeDiffId: '5bd8bcc083b3c700269b68f9',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'align',
      modal: null,
      fullScreen: false,
    },
  },
  files: {
    glb: '/test/garden.glb',
    planes: '/test/garden_m_plane-in-question.json',
    heatmap: '/test/garden_m.points.bin',
  },
};

const gardenAA_m_old = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: true,
      activeAccountId: '5b9013b541671f00240d7d5d',
      activeProjectId: '5b9061d4ddf84300243dbb4d',
      activeScanId: '5bd8bcc083b3c700269b68f7',
      activeModelId: '5bd89a5603c3e700260b6b16',
      activeDiffId: '5bd8bcc083b3c700269b68f9',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'align',
      modal: null,
      fullScreen: false,
    },
  },
  files: {
    glb: '/test/garden.glb',
    planes: '/test/garden_m.planes.json.old',
    heatmap: '/test/garden_m.points.bin.old',
  },
};

const vessel = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: true,
      activeAccountId: '5b903df541671f00240d7d6f',
      activeProjectId: '5ba3db2c5347c5002682db02',
      activeScanId: '5ba3dbaf5347c5002682db06',
      activeModelId: '5ba3db815347c5002682db04',
      activeDiffId: '5ba3dbaf5347c5002682db08',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'diff',
      modal: null,
      fullScreen: false,
    },
  },
  files: {
    glb: '/test/vessel.glb',
    planes: '/test/vessel.planes.json',
    heatmap: '/test/vessel.points.bin',
  },
};

const vueFileDownload = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: false,
      activeAccountId: '5b9013b541671f00240d7d5d',
      activeProjectId: '5b9061c8ddf84300243dbb47',
      activeScanId: '5bd3abe39ea44200266397a9',
      activeModelId: '5bd25069815ae200275b7e6c',
      activeDiffId: '5bd3abe39ea44200266397ab',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'project',
      modal: null,
      fullScreen: false,
    },
  },
  files: {
    glb: '/test/simple_shape.glb',
    objdiff: '/test/simple_shape.objdiff.json',
    planes: '/test/LAMP_shape.planes.json',
    // planes: '/test/simple_shape.planes.json',
    heatmap: '/test/simple_shape.otdiff.ds.bin',
    pointsWithFeatures: '/test/LAMP_CSV.bin',
  },
};

const simpleshapeUnscaled = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: true,
      activeAccountId: '5b9013b541671f00240d7d5d',
      activeProjectId: '5b906240ddf84300243dbb53',
      activeScanId: '5bd3abe39ea44200266397a9',
      activeModelId: '5bd25069815ae200275b7e6c',
      activeDiffId: '5bd3abe39ea44200266397ab',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'diff',
      modal: null,
      fullScreen: false,
    },
  },
  files: {
    glb: '/test/simple_shape.glb',
    objdiff: '/test/simple_shape.objdiff.json',
    planes: '/test/LAMP_shape.planes.json',
    // planes: '/test/simple_shape.planes.json',
    heatmap: '/test/simple_shape.otdiff.ds.bin',
    pointsWithFeatures: '/test/LAMP_CSV.bin',
  },
};

const simpleshapeUnscaledAA = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: false,
      activeAccountId: '5b9013b541671f00240d7d5d',
      activeProjectId: '5b90624fddf84300243dbb59',
      activeScanId: '5b92db53ede16500269941b0',
      activeModelId: '5b92db46ede16500269941ae',
      activeDiffId: '5b92db53ede16500269941b2',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'align',
      modal: null,
      fullScreen: false,
    },
  },
  files: {
    glb: '/test/simple_shape.glb',
    objdiff: '/test/simple_shape.objdiff.json',
    planes: '/test/LAMP_shape.planes.json',
  },
};
//
// const ui = {
//   state: {
//     nav: {
//       __typename: 'Nav',
//       adminMode: true,
//       activeAccountId: '5b903df541671f00240d7d6f',
//       activeProjectId: '5bc52b86ae110100267614b3',
//       activeScanId: null,
//       activeModelId: null,
//       activeDiffId: null,
//       activeDiffViewId: null,
//       associatedModelIds: [],
//       associatedScanIds: [], // beware: may be scans or diffs
//       associatedDiffIds: [],
//       diffIdInCart: null, // beware: may be scan or diff
//       debugMode: false,
//       view: 'home',
//       modal: null,
//       fullScreen: false,
//     },
//     project: [],
//   },
// };

const scanStatuses = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: false,
      activeAccountId: '5b9013b541671f00240d7d5d',
      activeProjectId: '5b90624fddf84300243dbb59',
      activeScanId: null,
      activeModelId: null,
      activeDiffId: null,
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'project',
      modal: null,
      fullScreen: false,
    },
    project: [],
  },
};

const GEJ = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: false,
      activeAccountId: '5bb7b3d4c6f1ef00266a65c1',
      activeProjectId: '5bb7b7dcc6f1ef00266a65c5',
      activeScanId: '5bb7f84edc8e2f0026f4d1b2',
      activeModelId: '5bb7b831c6f1ef00266a65c7',
      activeDiffId: '5bb7f84edc8e2f0026f4d1b4',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'diff',
      modal: null,
      fullScreen: false,
    },
    project: [],
  },
  files: {
    glb: '/test/gej.glb',
    // heatmap: '/test/gej.otdiff.ds.bin',
    heatmap: '/test/simple_shape.otdiff.ds.bin',
    objdiff: '/test/gej.objdiff.json',
  },
};

const SS_insufficient = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: false,
      activeAccountId: '5b903df541671f00240d7d6f',
      activeProjectId: '5ba3e8b777b16b002676f9d3',
      activeScanId: '5ba3ea5c77b16b002676f9d7',
      activeModelId: '5ba3ea3b77b16b002676f9d5',
      activeDiffId: '5ba3ea5c77b16b002676f9d9',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'diff',
      modal: null,
      fullScreen: false,
    },
    project: [],
  },
};

const platform = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: false,
      activeAccountId: '5bca0df543926a00268c9b53',
      activeProjectId: '5c1acbd4f98de6002701919a',
      activeScanId: '5c1c706219081200272612f7',
      activeModelId: '5c1c6fa93c41db0027f2dce1',
      activeDiffId: '5c1c706219081200272612f9',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'diff',
      modal: null,
      fullScreen: false,
    },
    project: [],
  },
  files: {
    glb: '/test/platform.glb',
    // heatmap: '/test/platform.otdiff.ds.bin',
    heatmap: '/test/simple_shape.otdiff.ds.bin',
    // objdiff: '/test/platform.objdiff.json'
  },
};

const reAssoc = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: true,
      activeAccountId: '5b9013b541671f00240d7d5d',
      activeProjectId: '5b9061bfddf84300243dbb43',
      activeScanId: null,
      activeModelId: null,
      activeDiffId: null,
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'project',
      modal: null,
      fullScreen: false,
    },
    project: [],
  },
};

/* Scan: feet, model: inches */
const simpleshapeScalesAA = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: true,
      activeAccountId: '5b9013b541671f00240d7d5d',
      activeProjectId: '5b906240ddf84300243dbb53',
      activeScanId: '5bd8cb7b3c079500266c4bcc',
      activeModelId: '5bd25069815ae200275b7e6c',
      activeDiffId: '5bd8cb7b3c079500266c4bce',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'align',
      modal: null,
      fullScreen: false,
    },
    project: [],
  },
};

const ssSingleAA = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: true,
      activeAccountId: '5b9013b541671f00240d7d5d',
      activeProjectId: '5b906240ddf84300243dbb53',
      activeScanId: '5bd8cb7b3c079500266c4bcc',
      activeModelId: '5bd25069815ae200275b7e6c',
      activeDiffId: '5bd8cb7b3c079500266c4bce',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'align',
      modal: null,
      fullScreen: false,
    },
    project: [],
  },
  files: {
    glb: '/test/simple_shape.glb',
    planes: '/test/ss-single.planes.json',
    heatmap: '/test/simple_shape.otdiff.ds.bin',
  },
};

/* Scan: feet, model: feet */
const manycubesAA = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: true,
      activeAccountId: '5b9013b541671f00240d7d5d',
      activeProjectId: '5b90624fddf84300243dbb59',
      activeScanId: '5bb5342acb283b00269d30f8',
      activeModelId: '5bb7d9b2bb5a8d0026bfaedb',
      activeDiffId: '5be2ffc4d394cf002655131e',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'align',
      modal: null,
      fullScreen: false,
    },
  },
  files: {
    glb: '/test/manycubes_ft.glb',
    planes: '/test/manycubes_ft.planes.json',
    heatmap: '/test/manycubes_ft.points.bin',
  },
};

const experimental = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: true,
      activeAccountId: '5b9013b541671f00240d7d5d',
      activeProjectId: '5b906240ddf84300243dbb53',
      activeScanId: '5bd8cb7b3c079500266c4bcc',
      activeModelId: '5bd25069815ae200275b7e6c',
      activeDiffId: '5bd8cb7b3c079500266c4bce',
      activeDiffViewId: null,
      associatedModelIds: [],
      associatedScanIds: [], // beware: may be scans or diffs
      associatedDiffIds: [],
      diffIdInCart: null, // beware: may be scan or diff
      debugMode: false,
      view: 'align',
      modal: null,
      fullScreen: false,
    },
    project: [],
  },
  files: {
    glb: '/test/simple_shape.glb',
    planes: '/test/exp.planes.json',
    heatmap: '/test/simple_shape.otdiff.ds.bin',
  },
};

module.exports = SS_insufficient;
